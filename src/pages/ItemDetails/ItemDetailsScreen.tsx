import React from 'react';
import { Item } from '../../types';
import { Rating } from '../../components/common/Rating';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Share2, Heart, ShieldCheck, MapPin, MessageSquare, Leaf, Sparkles } from 'lucide-react';
import './ItemDetailsScreen.css';

interface ItemDetailsScreenProps {
  item: Item;
  onBack: () => void;
  onRequestBorrow: (item: Item) => void;
}

export const ItemDetailsScreen: React.FC<ItemDetailsScreenProps> = ({
  item,
  onBack,
  onRequestBorrow
}) => {
  return (
    <div className="rewrap-item-details">
      {/* Top Floating Bar */}
      <div className="rewrap-item-details__top-bar">
        <button className="rewrap-item-details__icon-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className="rewrap-item-details__top-actions">
          <button className="rewrap-item-details__icon-btn" aria-label="Share">
            <Share2 size={18} />
          </button>
          <button className="rewrap-item-details__icon-btn" aria-label="Save">
            <Heart size={18} />
          </button>
        </div>
      </div>

      <div className="rewrap-item-details__scroll-body">
        {/* Edge to Edge Photography */}
        <div className="rewrap-item-details__hero-image-wrap">
          <img src={item.imageUrl} alt={item.title} className="rewrap-item-details__hero-image" />
          <div className="rewrap-item-details__status-pill">
            {item.isAvailable ? '• Available Now' : '• Currently In Use'}
          </div>
        </div>

        {/* Content Container */}
        <div className="rewrap-item-details__content">
          <div className="rewrap-item-details__title-row">
            <div>
              <span className="rewrap-item-details__cat-tag">{item.category}</span>
              <h1 className="rewrap-item-details__title">{item.title}</h1>
            </div>
          </div>

          <div className="rewrap-item-details__sub-row">
            <div className="rewrap-item-details__price-display">
              <span className="rewrap-item-details__currency">₹</span>
              <span className="rewrap-item-details__amount">{item.pricePerDay}</span>
              <span className="rewrap-item-details__period">/ day</span>
            </div>
            <Rating rating={item.rating} reviewCount={item.reviewCount} size={15} />
          </div>

          <div className="rewrap-item-details__location-tag">
            <MapPin size={14} color="var(--color-primary-forest)" />
            <span>{item.location} ({item.distanceKm} km away)</span>
          </div>

          {/* Environmental Impact avoided */}
          <div className="rewrap-item-details__eco-banner">
            <Leaf size={16} color="var(--color-primary-forest)" />
            <span>
              Borrowing this item avoids ~<strong>{item.carbonSavingsKg} kg</strong> carbon emissions vs buying new.
            </span>
          </div>

          <hr className="rewrap-item-details__divider" />

          {/* Owner Profile Card */}
          <div className="rewrap-item-details__owner-card">
            <div className="rewrap-item-details__owner-avatar-wrap">
              <img src={item.owner.avatar} alt={item.owner.name} className="rewrap-item-details__owner-avatar" />
              {item.owner.isVerified && <span className="rewrap-item-details__owner-vmark"><ShieldCheck size={12} color="#FFFFFF" /></span>}
            </div>
            <div className="rewrap-item-details__owner-info">
              <div className="rewrap-item-details__owner-name-row">
                <span className="rewrap-item-details__owner-name">{item.owner.name}</span>
                <span className="rewrap-item-details__owner-badge">Verified Member</span>
              </div>
              <div className="rewrap-item-details__owner-stats">
                <span>★ {item.owner.rating} ({item.owner.reviewsCount})</span>
                <span>•</span>
                <span>{item.owner.itemsLent} shared items</span>
              </div>
            </div>
          </div>

          <hr className="rewrap-item-details__divider" />

          {/* Description */}
          <div className="rewrap-item-details__section">
            <h3 className="rewrap-item-details__section-title">About this item</h3>
            <p className="rewrap-item-details__description">{item.description}</p>
          </div>

          {/* Features / Highlights */}
          <div className="rewrap-item-details__section">
            <h3 className="rewrap-item-details__section-title">Key Highlights</h3>
            <div className="rewrap-item-details__features-grid">
              {item.features.map((feat, idx) => (
                <div key={idx} className="rewrap-item-details__feature-pill">
                  <Sparkles size={12} color="var(--color-primary-forest)" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 100 }} />
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="rewrap-item-details__sticky-footer">
        <button className="rewrap-item-details__chat-btn" aria-label="Message owner">
          <MessageSquare size={20} />
          <span>Chat</span>
        </button>
        <Button
          variant="capsule"
          withArrow
          fullWidth
          disabled={!item.isAvailable}
          onClick={() => onRequestBorrow(item)}
        >
          {item.isAvailable ? 'Request to Borrow' : 'Currently Unavailable'}
        </Button>
      </div>
    </div>
  );
};
