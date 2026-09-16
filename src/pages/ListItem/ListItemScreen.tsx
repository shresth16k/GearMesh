import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Camera, ImagePlus, CheckCircle, ArrowLeft } from 'lucide-react';
import { Item } from '../../types';
import './ListItemScreen.css';

interface ListItemScreenProps {
  onPublishSuccess: (newItem: Partial<Item>) => void;
  onCancel: () => void;
}

export const ListItemScreen: React.FC<ListItemScreenProps> = ({ onPublishSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('camping');
  const [pricePerDay, setPricePerDay] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Rajpur Road, Dehradun');
  const [photoAdded, setPhotoAdded] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublished(true);
    setTimeout(() => {
      onPublishSuccess({
        title,
        category,
        pricePerDay: Number(pricePerDay) || 200,
        description,
        location,
        imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
        isAvailable: true
      });
    }, 1200);
  };

  if (isPublished) {
    return (
      <div className="rewrap-list-item-success">
        <div className="rewrap-list-item-success__icon">
          <CheckCircle size={48} color="var(--color-primary-forest)" />
        </div>
        <h2 className="rewrap-list-item-success__title">Item Published to ReWrap!</h2>
        <p className="rewrap-list-item-success__desc">
          Your gear is now visible to people across Dehradun. You will receive an instant notification when someone sends a borrow request.
        </p>
      </div>
    );
  }

  return (
    <div className="rewrap-list-item">
      <div className="rewrap-list-item__header">
        <button className="rewrap-list-item__back-btn" onClick={onCancel} aria-label="Cancel">
          <ArrowLeft size={20} />
        </button>
        <span className="rewrap-list-item__tag">Community Share</span>
        <div style={{ width: 36 }} />
      </div>

      <form className="rewrap-list-item__form" onSubmit={handleSubmit}>
        <div className="rewrap-list-item__intro">
          <h1 className="rewrap-list-item__title">List an Item</h1>
          <p className="rewrap-list-item__subtitle">
            Turn your unused things into new adventures.
          </p>
        </div>

        {/* Prominent Photo Upload Zone */}
        <div
          className={`rewrap-list-photo-zone ${photoAdded ? 'rewrap-list-photo-zone--active' : ''}`}
          onClick={() => setPhotoAdded(true)}
        >
          {photoAdded ? (
            <div className="rewrap-list-photo-preview">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                alt="Uploaded item"
              />
              <span className="rewrap-list-photo-change">Change Photo</span>
            </div>
          ) : (
            <div className="rewrap-list-photo-placeholder">
              <div className="rewrap-list-photo-icon-wrap">
                <ImagePlus size={26} />
              </div>
              <span className="rewrap-list-photo-text">Add clear photos of your item</span>
              <span className="rewrap-list-photo-hint">Natural lighting and clean backgrounds work best</span>
            </div>
          )}
        </div>

        {/* Item Title */}
        <div className="rewrap-form-group">
          <label>Item Name</label>
          <input
            type="text"
            placeholder="e.g. 2-Burner Camping Stove & Gas Kit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category & Price Row */}
        <div className="rewrap-form-row">
          <div className="rewrap-form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="camping">Camping</option>
              <option value="tools">Tools</option>
              <option value="electronics">Electronics</option>
              <option value="sports">Sports</option>
              <option value="kitchen">Kitchen</option>
              <option value="books">Books</option>
            </select>
          </div>

          <div className="rewrap-form-group">
            <label>Price / Day</label>
            <div className="rewrap-price-input-wrap">
              <span>₹</span>
              <input
                type="number"
                placeholder="200"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rewrap-form-group">
          <label>Description & Condition</label>
          <textarea
            rows={3}
            placeholder="Describe condition, accessories included, and helpful usage tips..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Location */}
        <div className="rewrap-form-group">
          <label>Pickup Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Submit */}
        <div className="rewrap-list-submit-wrap">
          <Button variant="capsule" fullWidth withArrow type="submit">
            Publish Item
          </Button>
        </div>

        <div style={{ height: 40 }} />
      </form>
    </div>
  );
};
