import React from 'react';
import { Item } from '../../types';
import { Rating } from './Rating';
import { MapPin } from 'lucide-react';
import './ItemCard.css';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
  variant?: 'standard' | 'horizontal' | 'compact';
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, variant = 'standard' }) => {
  return (
    <div className={`rewrap-item-card rewrap-item-card--${variant}`} onClick={onClick}>
      <div className="rewrap-item-card__image-wrap">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="rewrap-item-card__image"
          loading="lazy"
        />
        {item.isAvailable ? (
          <span className="rewrap-item-card__badge rewrap-item-card__badge--avail">Available</span>
        ) : (
          <span className="rewrap-item-card__badge rewrap-item-card__badge--busy">Borrowed</span>
        )}
      </div>

      <div className="rewrap-item-card__content">
        <div className="rewrap-item-card__header">
          <h3 className="rewrap-item-card__title">{item.title}</h3>
          <Rating rating={item.rating} reviewCount={item.reviewCount} size={13} />
        </div>

        <div className="rewrap-item-card__meta">
          <span className="rewrap-item-card__distance">
            <MapPin size={13} />
            {item.distanceKm} km away
          </span>
          <span className="rewrap-item-card__dot">•</span>
          <span className="rewrap-item-card__category">{item.category}</span>
        </div>

        <div className="rewrap-item-card__footer">
          <div className="rewrap-item-card__price">
            <span className="rewrap-item-card__currency">₹</span>
            <span className="rewrap-item-card__amount">{item.pricePerDay}</span>
            <span className="rewrap-item-card__period">/ day</span>
          </div>
          <span className="rewrap-item-card__action">Borrow →</span>
        </div>
      </div>
    </div>
  );
};
