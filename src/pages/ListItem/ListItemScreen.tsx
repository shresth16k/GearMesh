import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Plus, CheckCircle, ArrowLeft, MapPin } from 'lucide-react';
import { Item } from '../../types';
import './ListItemScreen.css';

interface ListItemScreenProps {
  onPublishSuccess: (newItem: Partial<Item>) => void;
  onCancel: () => void;
}

const samplePhotos = [
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506535772317-9fca71c959c8?auto=format&fit=crop&w=300&q=80'
];

export const ListItemScreen: React.FC<ListItemScreenProps> = ({ onPublishSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Use Current Location');
  const [photos, setPhotos] = useState<string[]>(samplePhotos);
  const [isPublished, setIsPublished] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublished(true);
    setTimeout(() => {
      onPublishSuccess({
        title: title || 'Quechua Camping Tent',
        category: category || 'camping',
        pricePerDay: Number(pricePerDay) || 100,
        description: description || 'High quality equipment ready for community sharing.',
        location: 'Rajpur Road, Dehradun',
        imageUrl: photos[0],
        isAvailable: true
      });
    }, 1200);
  };

  if (isPublished) {
    return (
      <div className="gearmesh-list-item-success">
        <div className="gearmesh-list-item-success__icon">
          <CheckCircle size={48} color="var(--color-primary-forest)" />
        </div>
        <h2 className="gearmesh-list-item-success__title">Item Published to GearMesh!</h2>
        <p className="gearmesh-list-item-success__desc">
          Your gear is now visible to people across Dehradun. You will receive an instant notification when someone sends a borrow request.
        </p>
      </div>
    );
  }

  return (
    <div className="gearmesh-list-item">
      <div className="gearmesh-list-item__header">
        <button className="gearmesh-list-item__back-btn" onClick={onCancel} aria-label="Cancel">
          <ArrowLeft size={20} />
        </button>
        <span className="gearmesh-list-item__tag">Community Share</span>
        <div style={{ width: 36 }} />
      </div>

      <form className="gearmesh-list-item__form" onSubmit={handleSubmit}>
        <div className="gearmesh-list-item__intro">
          <h1 className="gearmesh-list-item__title">List an Item</h1>
          <p className="gearmesh-list-item__subtitle">
            Turn your unused items into new adventures.
          </p>
        </div>

        {/* Photos grid with 4 thumbnails + Add Photos box (matching Screen 6) */}
        <div className="gearmesh-list-photos-row">
          {photos.map((url, idx) => (
            <div key={idx} className="gearmesh-list-photo-thumb">
              <img src={url} alt={`Thumb ${idx}`} />
            </div>
          ))}
          <button
            type="button"
            className="gearmesh-list-photo-add-box"
            onClick={() => setPhotos([...photos])}
          >
            <Plus size={18} color="var(--color-muted-gray)" />
            <span>Add Photos</span>
          </button>
        </div>

        {/* Item Name */}
        <div className="gearmesh-form-group">
          <label>Item Name</label>
          <input
            type="text"
            placeholder="e.g. Camping Tent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="gearmesh-form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="camping">Camping</option>
            <option value="tools">Tools</option>
            <option value="electronics">Electronics</option>
            <option value="sports">Sports</option>
            <option value="kitchen">Kitchen</option>
            <option value="books">Books</option>
          </select>
        </div>

        {/* Price per Day */}
        <div className="gearmesh-form-group">
          <label>Price per Day</label>
          <div className="gearmesh-price-input-wrap">
            <span>₹</span>
            <input
              type="number"
              placeholder="0"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="gearmesh-form-group">
          <label>Description</label>
          <textarea
            rows={3}
            placeholder="Tell people about your item..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Location */}
        <div className="gearmesh-form-group">
          <label>Location</label>
          <div className="gearmesh-location-input-wrap">
            <MapPin size={16} color="var(--color-primary-forest)" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="gearmesh-list-submit-wrap">
          <Button variant="primary" fullWidth size="lg" type="submit">
            Publish Item
          </Button>
        </div>

        <div style={{ height: 40 }} />
      </form>
    </div>
  );
};
