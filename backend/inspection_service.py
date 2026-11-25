"""
GearMesh Return Inspection Service
Combines:
1. Moh-27SL/Image-alignment--PYTHON-EDITION (enhanced with SIFT feature detection & Homography)
2. kostasthanos/Spot-The-Differences (structural differencing, morphological dilation, and contour bounding box detection)
3. Damage evaluation and fee calculation against original item cost.
"""

import os
import io
import base64
import json
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

def decode_image(data_str_or_file):
    """
    Decodes an image from base64 data uri or file object.
    Returns RGB numpy array or None.
    """
    if data_str_or_file is None:
        return None
        
    try:
        if isinstance(data_str_or_file, str) and data_str_or_file.startswith('data:image'):
            header, encoded = data_str_or_file.split(',', 1)
            data = base64.b64decode(encoded)
            image = Image.open(io.BytesIO(data)).convert('RGB')
            return np.array(image)
        elif isinstance(data_str_or_file, str) and len(data_str_or_file) > 100:
            data = base64.b64decode(data_str_or_file)
            image = Image.open(io.BytesIO(data)).convert('RGB')
            return np.array(image)
        else:
            image = Image.open(data_str_or_file).convert('RGB')
            return np.array(image)
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def encode_image_base64(img_rgb):
    """Encodes an RGB numpy array to a PNG base64 string"""
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    _, buffer = cv2.imencode('.png', img_bgr)
    b64_str = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/png;base64,{b64_str}"

def align_images(original_img, returned_img, method='SIFT'):
    """
    Alignment step based on Moh-27SL/Image-alignment--PYTHON-EDITION:
    Detects keypoints & descriptors, matches them, computes homography,
    and warps the returned image to line up with the original image.
    """
    h_orig, w_orig = original_img.shape[:2]
    
    gray_orig = cv2.cvtColor(original_img, cv2.COLOR_RGB2GRAY)
    gray_ret = cv2.cvtColor(returned_img, cv2.COLOR_RGB2GRAY)
    
    if method.upper() == 'SIFT' and hasattr(cv2, 'SIFT_create'):
        detector = cv2.SIFT_create(nfeatures=3000)
        norm_type = cv2.NORM_L2
    else:
        detector = cv2.ORB_create(nfeatures=3000)
        norm_type = cv2.NORM_HAMMING

    kp_orig, des_orig = detector.detectAndCompute(gray_orig, None)
    kp_ret, des_ret = detector.detectAndCompute(gray_ret, None)

    if des_orig is None or des_ret is None or len(kp_orig) < 4 or len(kp_ret) < 4:
        aligned = cv2.resize(returned_img, (w_orig, h_orig))
        return aligned, False, 0

    matcher = cv2.BFMatcher(norm_type, crossCheck=False)
    matches = matcher.knnMatch(des_ret, des_orig, k=2)

    # Lowe's ratio test to extract high-confidence feature matches
    good_matches = []
    for m_tuple in matches:
        if len(m_tuple) == 2:
            m, n = m_tuple
            if m.distance < 0.75 * n.distance:
                good_matches.append(m)

    if len(good_matches) < 6:
        aligned = cv2.resize(returned_img, (w_orig, h_orig))
        return aligned, False, len(good_matches)

    pts_ret = np.float32([kp_ret[m.queryIdx].pt for m in good_matches]).reshape(-1, 1, 2)
    pts_orig = np.float32([kp_orig[m.trainIdx].pt for m in good_matches]).reshape(-1, 1, 2)

    H, mask = cv2.findHomography(pts_ret, pts_orig, cv2.RANSAC, 5.0)

    if H is None:
        aligned = cv2.resize(returned_img, (w_orig, h_orig))
        return aligned, False, len(good_matches)

    aligned = cv2.warpPerspective(returned_img, H, (w_orig, h_orig), borderMode=cv2.BORDER_REPLICATE)
    return aligned, True, len(good_matches)

def spot_differences(original_img, aligned_img, min_contour_area=200, diff_threshold=35):
    """
    Difference & contour step based on kostasthanos/Spot-The-Differences:
    Computes absolute pixel difference, masks sub-pixel edge alignment jitter,
    filters noise via Gaussian blur, thresholds, morphologically dilates,
    and contours differences into bounding boxes.
    """
    h, w = original_img.shape[:2]
    total_area = h * w
    
    gray_orig = cv2.cvtColor(original_img, cv2.COLOR_RGB2GRAY)
    gray_aligned = cv2.cvtColor(aligned_img, cv2.COLOR_RGB2GRAY)

    # Absolute difference
    abs_diff = cv2.absdiff(gray_orig, gray_aligned)

    # Filter out sub-pixel edge alignment jitter using Canny edge dilation on original
    edges_orig = cv2.Canny(gray_orig, 50, 150)
    edge_jitter_mask = cv2.dilate(edges_orig, cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5)), iterations=1)
    diff_filtered = cv2.bitwise_and(abs_diff, abs_diff, mask=cv2.bitwise_not(edge_jitter_mask))

    # Ignore peripheral boundary pixels to eliminate perspective interpolation seam false alarms
    border_margin_x = max(12, int(w * 0.04))
    border_margin_y = max(12, int(h * 0.04))
    border_mask = np.zeros_like(abs_diff)
    cv2.rectangle(
        border_mask,
        (border_margin_x, border_margin_y),
        (w - border_margin_x, h - border_margin_y),
        255,
        -1
    )
    diff_filtered = cv2.bitwise_and(diff_filtered, diff_filtered, mask=border_mask)

    # Gaussian blur to filter camera sensor grain and slight micro-lighting shifts
    blurred = cv2.GaussianBlur(diff_filtered, (7, 7), 0)

    # Binary thresholding
    _, thresh = cv2.threshold(blurred, diff_threshold, 255, cv2.THRESH_BINARY)

    # Dilate regions to group clustered pixels into coherent defect boundaries
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
    dilated = cv2.dilate(thresh, kernel, iterations=2)

    # Find external contours
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    annotated = aligned_img.copy()
    diff_mask_rgb = cv2.cvtColor(thresh, cv2.COLOR_GRAY2RGB)

    detected_boxes = []
    total_damage_area = 0

    for idx, c in enumerate(contours):
        area = cv2.contourArea(c)
        if area >= min_contour_area:
            # Exclude abnormal full-frame edge fills (> 75% frame)
            if area > total_area * 0.75:
                continue

            x, y, bw, bh = cv2.boundingRect(c)
            detected_boxes.append({
                "box_id": idx + 1,
                "x": int(x),
                "y": int(y),
                "width": int(bw),
                "height": int(bh),
                "area": float(area)
            })
            total_damage_area += area

            # Draw visual highlight boxes in Coral Red
            cv2.rectangle(annotated, (x, y), (x + bw, y + bh), (235, 45, 30), 2)
            cv2.rectangle(diff_mask_rgb, (x, y), (x + bw, y + bh), (235, 45, 30), 2)
            cv2.putText(
                annotated,
                f"DAMAGE #{len(detected_boxes)}",
                (x, max(18, y - 6)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.52,
                (235, 45, 30),
                2
            )

    damage_ratio = (total_damage_area / float(total_area)) if total_area > 0 else 0.0
    return annotated, diff_mask_rgb, detected_boxes, damage_ratio

def calculate_damage_penalty(item_cost, damage_ratio, box_count):
    """
    Calculates the penalty/repair cost based on item cost,
    percentage of damaged surface, and count of distinct defect areas.
    """
    item_cost = max(0.0, float(item_cost))
    if box_count == 0 or damage_ratio < 0.003:
        return {
            "has_damage": False,
            "severity": "None",
            "damage_percentage": 0.0,
            "repair_fee": 0,
            "security_deposit_action": "Full 100% Refund (No Extra Charges)",
            "message": "Equipment returned in clean, verified condition. No scratches, tears, or altered marks detected."
        }

    damage_pct = round(damage_ratio * 100, 2)
    
    if damage_pct < 2.5 and box_count <= 2:
        severity = "Minor Surface Wear / Minor Scratches"
        penalty_rate = 0.15
        min_fee = 250
    elif damage_pct < 7.0 and box_count <= 4:
        severity = "Moderate Damage / Visible Scratches or Stains"
        penalty_rate = 0.35
        min_fee = 600
    else:
        severity = "Severe Defect / Deep Structural Damage"
        penalty_rate = 0.70
        min_fee = 1200

    calculated_fee = round(max(item_cost * penalty_rate, min_fee))
    if item_cost > 0:
        calculated_fee = min(int(item_cost), calculated_fee)

    return {
        "has_damage": True,
        "severity": severity,
        "damage_percentage": damage_pct,
        "affected_spots_count": box_count,
        "item_cost": item_cost,
        "repair_fee": calculated_fee,
        "security_deposit_action": f"Extra Fee Required: Pay ₹{calculated_fee}",
        "message": f"Defect detected ({box_count} damaged spots, ~{damage_pct}% altered area). Extra compensation of ₹{calculated_fee} is required to cover repair/restoration costs."
    }

@app.route('/api/inspection/health', methods=['GET'])
def health():
    return jsonify({
        "status": "UP",
        "service": "GearMesh Damage Inspection Engine",
        "modules": [
            "Moh-27SL/Image-alignment--PYTHON-EDITION (SIFT + Homography)",
            "kostasthanos/Spot-The-Differences (Morphological differencing)"
        ]
    })

@app.route('/api/inspection/inspect', methods=['POST'])
def inspect_return():
    """
    API endpoint:
    Accepts original and returned images (as base64 or multipart form data),
    executes alignment followed by spot-the-difference contouring,
    and returns detected bounding boxes + extra fee computation.
    """
    try:
        req_data = request.json if request.is_json else {}
        
        orig_data = None
        ret_data = None

        if 'original_image' in request.files:
            orig_data = request.files['original_image']
        elif 'original_image' in req_data:
            orig_data = req_data['original_image']

        if 'returned_image' in request.files:
            ret_data = request.files['returned_image']
        elif 'returned_image' in req_data:
            ret_data = req_data['returned_image']

        if orig_data is None or ret_data is None:
            return jsonify({
                "error": "Both 'original_image' and 'returned_image' must be provided."
            }), 400

        item_cost = float(request.form.get('item_cost', req_data.get('item_cost', 3500)))
        item_title = request.form.get('item_title', req_data.get('item_title', 'GearMesh Equipment'))
        min_contour_size = int(request.form.get('min_contour_size', req_data.get('min_contour_size', 200)))
        diff_threshold = int(request.form.get('diff_threshold', req_data.get('diff_threshold', 35)))

        orig_img = decode_image(orig_data)
        ret_img = decode_image(ret_data)

        if orig_img is None or ret_img is None:
            return jsonify({"error": "Failed to decode input images."}), 400

        max_dim = 800
        for img in [orig_img, ret_img]:
            h, w = img.shape[:2]
            if max(h, w) > max_dim:
                scale = max_dim / float(max(h, w))
                new_w, new_h = int(w * scale), int(h * scale)
                if img is orig_img:
                    orig_img = cv2.resize(orig_img, (new_w, new_h))
                else:
                    ret_img = cv2.resize(ret_img, (new_w, new_h))

        # STEP 1: Alignment using SIFT + RANSAC Homography (Moh-27SL)
        aligned_img, is_aligned, num_matches = align_images(orig_img, ret_img, method='SIFT')

        # STEP 2: Spot the differences with contour bounding boxes (kostasthanos)
        annotated_img, diff_mask, detected_boxes, damage_ratio = spot_differences(
            orig_img,
            aligned_img,
            min_contour_area=min_contour_size,
            diff_threshold=diff_threshold
        )

        # STEP 3: Calculate product repair penalty & extra charge
        penalty_info = calculate_damage_penalty(item_cost, damage_ratio, len(detected_boxes))

        return jsonify({
            "success": True,
            "item_title": item_title,
            "item_cost": item_cost,
            "alignment": {
                "success": is_aligned,
                "feature_matches_count": num_matches,
                "method": "SIFT + RANSAC Homography (Moh-27SL)"
            },
            "inspection": {
                "detected_spots_count": len(detected_boxes),
                "boxes": detected_boxes,
                "damage_percentage": penalty_info["damage_percentage"],
                "has_damage": penalty_info["has_damage"],
                "severity": penalty_info["severity"],
                "repair_fee": penalty_info["repair_fee"],
                "message": penalty_info["message"],
                "action": penalty_info["security_deposit_action"]
            },
            "images": {
                "annotated_diff_url": encode_image_base64(annotated_img),
                "aligned_return_url": encode_image_base64(aligned_img),
                "diff_mask_url": encode_image_base64(diff_mask)
            }
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('INSPECTION_PORT', 5001))
    print(f"🚀 GearMesh Inspection Engine running on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
