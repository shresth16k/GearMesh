import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { INSPECTION_API_URL } from '../../config/api';
import './InspectionScreen.css';

interface InspectionResult {
  detected_spots_count: number;
  damage_percentage: number;
  has_damage: boolean;
  severity: string;
  repair_fee: number;
  message: string;
  action: string;
  boxes: Array<{
    box_id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    area: number;
  }>;
}

interface InspectionResponse {
  success: boolean;
  item_title: string;
  item_cost: number;
  alignment: {
    success: boolean;
    feature_matches_count: number;
    method: string;
  };
  inspection: InspectionResult;
  images: {
    annotated_diff_url: string;
    aligned_return_url: string;
    diff_mask_url: string;
  };
}

// Sample presets for quick testing (Clean return vs Damaged return)
const SAMPLE_ORIGINAL = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80';
const SAMPLE_RETURN_CLEAN = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80';
const SAMPLE_RETURN_DAMAGED = 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80';

export const InspectionScreen: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [returnedImage, setReturnedImage] = useState<string>('');
  const [itemTitle, setItemTitle] = useState<string>('Sony A7 III Mirrorless Camera');
  const [itemCost, setItemCost] = useState<number>(45000);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<InspectionResponse | null>(null);

  const origInputRef = useRef<HTMLInputElement>(null);
  const retInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setImage(evt.target.result as string);
        setResult(null);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadSample = (type: 'clean' | 'damaged') => {
    // Generate synthetic patterned base image
    const canvas1 = document.createElement('canvas');
    canvas1.width = 400;
    canvas1.height = 400;
    const ctx1 = canvas1.getContext('2d')!;

    // Background texture
    ctx1.fillStyle = '#E8ECE9';
    ctx1.fillRect(0, 0, 400, 400);

    // Camera body / gadget
    ctx1.fillStyle = '#1D2721';
    ctx1.beginPath();
    ctx1.roundRect ? ctx1.roundRect(60, 60, 280, 280, 20) : ctx1.rect(60, 60, 280, 280);
    ctx1.fill();

    // Lens circle
    ctx1.fillStyle = '#394B40';
    ctx1.beginPath();
    ctx1.arc(200, 200, 75, 0, Math.PI * 2);
    ctx1.fill();

    ctx1.fillStyle = '#527A5B';
    ctx1.beginPath();
    ctx1.arc(200, 200, 45, 0, Math.PI * 2);
    ctx1.fill();

    ctx1.fillStyle = '#FFFFFF';
    ctx1.font = 'bold 16px sans-serif';
    ctx1.fillText('GEARMESH PRO', 140, 310);

    const origData = canvas1.toDataURL('image/png');
    setOriginalImage(origData);

    // Return image with slight tilt (alignment test)
    const canvas2 = document.createElement('canvas');
    canvas2.width = 400;
    canvas2.height = 400;
    const ctx2 = canvas2.getContext('2d')!;

    ctx2.save();
    // Rotate 4 degrees to simulate angle shift from borrower return
    ctx2.translate(200, 200);
    ctx2.rotate((4 * Math.PI) / 180);
    ctx2.drawImage(canvas1, -200, -200);
    ctx2.restore();

    if (type === 'damaged') {
      // Draw visible deep scratch & crack on returned product
      ctx2.strokeStyle = '#D32F2F';
      ctx2.lineWidth = 6;
      ctx2.beginPath();
      ctx2.moveTo(120, 150);
      ctx2.lineTo(260, 240);
      ctx2.stroke();

      ctx2.fillStyle = '#C62828';
      ctx2.beginPath();
      ctx2.arc(170, 180, 14, 0, Math.PI * 2);
      ctx2.fill();
    }

    const retData = canvas2.toDataURL('image/png');
    setReturnedImage(retData);
    setResult(null);
    setErrorMsg(null);
  };

  const handleRunInspection = async () => {
    if (!originalImage || !returnedImage) {
      setErrorMsg('Please upload both the original product photo and returned product photo.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${INSPECTION_API_URL}/inspect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_image: originalImage,
          returned_image: returnedImage,
          item_cost: itemCost,
          item_title: itemTitle,
          min_contour_size: 150
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${res.status}`);
      }

      const data: InspectionResponse = await res.json();
      setResult(data);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          'Failed to connect to inspection engine. Please ensure python backend inspection_service is running on port 5001.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gearmesh-inspection">
      <div className="gearmesh-inspection__container">
        {/* Header */}
        <div className="gearmesh-inspection__header">
          <div className="gearmesh-inspection__badge">
            <Layers size={14} />
            <span>AI Automated Return Verifier</span>
          </div>
          <h1 className="gearmesh-inspection__title">Product Return & Damage Inspection</h1>
          <p className="gearmesh-inspection__subtitle">
            Combines <strong>Moh-27SL SIFT Alignment</strong> (to compensate for angle/position
            shifts) with <strong>kostasthanos Differencing Contours</strong> to isolate real
            defects and automatically calculate extra repair costs for the borrower.
          </p>
        </div>

        {/* Pipeline Info */}
        <div className="gearmesh-inspection__pipeline-bar">
          <div className="gearmesh-inspection__pipeline-step">
            <div className="gearmesh-inspection__step-num">1</div>
            <div className="gearmesh-inspection__step-text">
              <h4>SIFT Alignment</h4>
              <p>Keypoints & Homography warp the return photo so angle shifts don't cause false alerts.</p>
            </div>
          </div>
          <div className="gearmesh-inspection__pipeline-step">
            <div className="gearmesh-inspection__step-num">2</div>
            <div className="gearmesh-inspection__step-text">
              <h4>Spot The Differences</h4>
              <p>Morphological filters & contours highlight scratches, tears, or structural marks.</p>
            </div>
          </div>
          <div className="gearmesh-inspection__pipeline-step">
            <div className="gearmesh-inspection__step-num">3</div>
            <div className="gearmesh-inspection__step-text">
              <h4>Extra Cost Assessment</h4>
              <p>Calculates damaged area % against product value and bills the borrower extra fee.</p>
            </div>
          </div>
        </div>

        {/* Upload Columns */}
        <div className="gearmesh-inspection__upload-grid">
          {/* Card 1: Original Image */}
          <div className="gearmesh-inspection__upload-card">
            <h3 className="gearmesh-inspection__card-title">
              <Camera size={18} color="#1B3B2B" />
              <span>1. Original Product Photo (Pre-Borrow)</span>
            </h3>
            <p className="gearmesh-inspection__card-desc">
              Owner's original photo showing the clean, undamaged baseline.
            </p>

            <div className="gearmesh-inspection__preview-box">
              {originalImage ? (
                <img
                  src={originalImage}
                  alt="Original Item"
                  className="gearmesh-inspection__preview-img"
                />
              ) : (
                <div className="gearmesh-inspection__placeholder">
                  <Upload size={32} />
                  <span>No original photo uploaded</span>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={origInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, setOriginalImage)}
            />

            <button
              className="gearmesh-inspection__upload-btn"
              onClick={() => origInputRef.current?.click()}
            >
              <Upload size={16} />
              <span>{originalImage ? 'Change Original Photo' : 'Upload Original Photo'}</span>
            </button>

            <div className="gearmesh-inspection__sample-links">
              <span>Quick Test:</span>
              <button className="gearmesh-inspection__sample-btn" onClick={() => loadSample('clean')}>
                Load Clean Sample
              </button>
            </div>
          </div>

          {/* Card 2: Returned Image */}
          <div className="gearmesh-inspection__upload-card">
            <h3 className="gearmesh-inspection__card-title">
              <RefreshCw size={18} color="#1B3B2B" />
              <span>2. Returned Product Photo (Post-Return)</span>
            </h3>
            <p className="gearmesh-inspection__card-desc">
              Photo taken by locker or owner upon item handover/return.
            </p>

            <div className="gearmesh-inspection__preview-box">
              {returnedImage ? (
                <img
                  src={returnedImage}
                  alt="Returned Item"
                  className="gearmesh-inspection__preview-img"
                />
              ) : (
                <div className="gearmesh-inspection__placeholder">
                  <Upload size={32} />
                  <span>No return photo uploaded</span>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={retInputRef}
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, setReturnedImage)}
            />

            <button
              className="gearmesh-inspection__upload-btn"
              onClick={() => retInputRef.current?.click()}
            >
              <Upload size={16} />
              <span>{returnedImage ? 'Change Returned Photo' : 'Upload Returned Photo'}</span>
            </button>

            <div className="gearmesh-inspection__sample-links">
              <span>Quick Test:</span>
              <button
                className="gearmesh-inspection__sample-btn"
                style={{ color: '#D32F2F' }}
                onClick={() => loadSample('damaged')}
              >
                Load Damaged Sample
              </button>
            </div>
          </div>
        </div>

        {/* Product Parameters & Execute Button */}
        <div className="gearmesh-inspection__controls">
          <div className="gearmesh-inspection__meta-inputs">
            <div className="gearmesh-inspection__input-group">
              <label>Equipment Title</label>
              <input
                type="text"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                placeholder="e.g. Sony A7 III"
              />
            </div>
            <div className="gearmesh-inspection__input-group">
              <label>Product Replacement Cost (₹)</label>
              <input
                type="number"
                value={itemCost}
                onChange={(e) => setItemCost(Number(e.target.value))}
                placeholder="45000"
              />
            </div>
          </div>

          <button
            className="gearmesh-inspection__run-btn"
            disabled={isLoading || !originalImage || !returnedImage}
            onClick={handleRunInspection}
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Aligning & Inspecting...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Run Inspection & Calculate Fee</span>
              </>
            )}
          </button>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div
            style={{
              background: '#FFEBEE',
              color: '#C62828',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Results Presentation */}
        {result && (
          <div className="gearmesh-inspection__results">
            {/* Condition Banner */}
            {result.inspection.has_damage ? (
              <div className="gearmesh-inspection__alert gearmesh-inspection__alert--damage">
                <ShieldAlert size={28} />
                <div>
                  <h3 className="gearmesh-inspection__alert-title">
                    ⚠️ Damage Detected on Returned Item
                  </h3>
                  <p className="gearmesh-inspection__alert-msg">{result.inspection.message}</p>
                  <div className="gearmesh-inspection__cost-callout">
                    <span>Borrower Extra Fee Due:</span>
                    <strong>₹{result.inspection.repair_fee.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="gearmesh-inspection__alert gearmesh-inspection__alert--clean">
                <CheckCircle size={28} />
                <div>
                  <h3 className="gearmesh-inspection__alert-title">
                    ✅ Return Verified in Pristine Condition
                  </h3>
                  <p className="gearmesh-inspection__alert-msg">{result.inspection.message}</p>
                  <span style={{ fontWeight: 600 }}>Action: Full Security Deposit Refunded</span>
                </div>
              </div>
            )}

            {/* Visuals Tri-Split: Annotated Defects, Perspective Aligned, Difference Mask */}
            <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#1B3B2B' }}>
              Computer Vision Inspection Visuals
            </h4>
            <div className="gearmesh-inspection__visuals-grid">
              <div className="gearmesh-inspection__visual-item">
                <h5 className="gearmesh-inspection__visual-title">Detected Defect Contours</h5>
                <img
                  src={result.images.annotated_diff_url}
                  alt="Detected Defect Contours"
                />
              </div>

              <div className="gearmesh-inspection__visual-item">
                <h5 className="gearmesh-inspection__visual-title">
                  SIFT Homography-Aligned Photo
                </h5>
                <img
                  src={result.images.aligned_return_url}
                  alt="SIFT Aligned Return"
                />
              </div>

              <div className="gearmesh-inspection__visual-item">
                <h5 className="gearmesh-inspection__visual-title">Morphological Diff Mask</h5>
                <img
                  src={result.images.diff_mask_url}
                  alt="Morphological Difference Mask"
                />
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="gearmesh-inspection__stats-row">
              <div className="gearmesh-inspection__stat-box">
                <span className="gearmesh-inspection__stat-label">Alignment Method</span>
                <span className="gearmesh-inspection__stat-val" style={{ fontSize: '1rem' }}>
                  {result.alignment.success ? 'SIFT + Homography' : 'Direct Scale'}
                </span>
              </div>

              <div className="gearmesh-inspection__stat-box">
                <span className="gearmesh-inspection__stat-label">Features Matched</span>
                <span className="gearmesh-inspection__stat-val">
                  {result.alignment.feature_matches_count}
                </span>
              </div>

              <div className="gearmesh-inspection__stat-box">
                <span className="gearmesh-inspection__stat-label">Defect Spots Count</span>
                <span className="gearmesh-inspection__stat-val">
                  {result.inspection.detected_spots_count}
                </span>
              </div>

              <div className="gearmesh-inspection__stat-box">
                <span className="gearmesh-inspection__stat-label">Damaged Surface Area</span>
                <span className="gearmesh-inspection__stat-val">
                  {result.inspection.damage_percentage}%
                </span>
              </div>

              <div className="gearmesh-inspection__stat-box">
                <span className="gearmesh-inspection__stat-label">Severity Tier</span>
                <span
                  className="gearmesh-inspection__stat-val"
                  style={{
                    fontSize: '0.95rem',
                    color: result.inspection.has_damage ? '#D32F2F' : '#2E7D32'
                  }}
                >
                  {result.inspection.severity}
                </span>
              </div>

              <div className="gearmesh-inspection__stat-box">
                <span className="gearmesh-inspection__stat-label">Extra Charge Amount</span>
                <span
                  className="gearmesh-inspection__stat-val"
                  style={{
                    color: result.inspection.has_damage ? '#D32F2F' : '#2E7D32'
                  }}
                >
                  ₹{result.inspection.repair_fee}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
