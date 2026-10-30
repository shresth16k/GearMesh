import React, { useState } from 'react';
import { Item } from '../../types';
import { Rating } from '../../components/common/Rating';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Share2, Heart, ShieldCheck, MapPin, MessageSquare, Tag, Calendar, Sparkles } from 'lucide-react';
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
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="gearmesh-item-details">
      {/* Top Floating Bar */}
      <div className="gearmesh-item-details__top-bar">
        <button className="gearmesh-item-details__icon-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div className="gearmesh-item-details__top-actions">
          <button className="gearmesh-item-details__icon-btn" aria-label="Share">
            <Share2 size={18} />
          </button>
          <button
            className="gearmesh-item-details__icon-btn"
            onClick={() => setIsLiked(!isLiked)}
            aria-label="Save"
          >
            <Heart size={18} fill={isLiked ? '#B94A48' : 'none'} color={isLiked ? '#B94A48' : 'currentColor'} />
          </button>
        </div>
      </div>

      <div className="gearmesh-item-details__scroll-body">
        {/* Edge to Edge Photography with 1/5 counter */}
        <div className="gearmesh-item-details__hero-image-wrap">
          <img src={item.imageUrl} alt={item.title} className="gearmesh-item-details__hero-image" />
          <span className="gearmesh-item-details__img-counter">1/5</span>
        </div>

        {/* Content Container */}
        <div className="gearmesh-item-details__content">
          <div className="gearmesh-item-details__title-row">
            <h1 className="gearmesh-item-details__title">{item.title}</h1>
          </div>

          <div className="gearmesh-item-details__sub-row">
            <div className="gearmesh-item-details__price-display">
              <span className="gearmesh-item-details__currency">₹</span>
              <span className="gearmesh-item-details__amount">{item.pricePerDay}</span>
              <span className="gearmesh-item-details__period">/ day</span>
            </div>
            <Rating rating={item.rating} reviewCount={item.reviewCount} size={15} />
          </div>

          {/* Owner Profile Card matching Screen 4 */}
          <div className="gearmesh-item-details__owner-card">
            <div className="gearmesh-item-details__owner-avatar-wrap">
              <img src={item.owner.avatar} alt={item.owner.name} className="gearmesh-item-details__owner-avatar" />
              {item.owner.isVerified && (
                <span className="gearmesh-item-details__owner-vmark">
                  <ShieldCheck size={11} color="#FFFFFF" />
                </span>
              )}
            </div>
            <div className="gearmesh-item-details__owner-info">
              <span className="gearmesh-item-details__owner-name">{item.owner.name}</span>
              <span className="gearmesh-item-details__owner-sub">Level 2 • Verified</span>
            </div>
            <button type="button" className="gearmesh-item-details__view-profile-btn">
              View Profile
            </button>
          </div>

          {/* 3 Info Chips row */}
          <div className="gearmesh-item-details__chips-row">
            <div className="gearmesh-item-details__chip">
              <MapPin size={15} color="var(--color-primary-forest)" />
              <div className="gearmesh-item-details__chip-text">
                <span className="gearmesh-item-details__chip-lbl">Location</span>
                <span className="gearmesh-item-details__chip-val">{item.distanceKm} km away</span>
              </div>
            </div>

            <div className="gearmesh-item-details__chip">
              <Tag size={15} color="var(--color-primary-forest)" />
              <div className="gearmesh-item-details__chip-text">
                <span className="gearmesh-item-details__chip-lbl">Category</span>
                <span className="gearmesh-item-details__chip-val" style={{ textTransform: 'capitalize' }}>
                  {item.category}
                </span>
              </div>
            </div>

            <div className="gearmesh-item-details__chip">
              <Calendar size={15} color="var(--color-primary-forest)" />
              <div className="gearmesh-item-details__chip-text">
                <span className="gearmesh-item-details__chip-lbl">Available</span>
                <span className="gearmesh-item-details__chip-val">This week</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="gearmesh-item-details__section">
            <p className="gearmesh-item-details__description">{item.description}</p>
          </div>

          {/* Features */}
          <div className="gearmesh-item-details__section">
            <h3 className="gearmesh-item-details__section-title">Features & Accessories</h3>
            <div className="gearmesh-item-details__features-grid">
              {item.features.map((feat, idx) => (
                <div key={idx} className="gearmesh-item-details__feature-pill">
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
      <div className="gearmesh-item-details__sticky-footer">
        <button className="gearmesh-item-details__chat-btn" aria-label="Message owner">
          <MessageSquare size={18} />
          <span>Chat</span>
        </button>
        <Button
          variant="capsule"
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
