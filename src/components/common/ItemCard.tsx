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
    <div className={`gearmesh-item-card gearmesh-item-card--${variant}`} onClick={onClick}>
      <div className="gearmesh-item-card__image-wrap">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="gearmesh-item-card__image"
          loading="lazy"
        />
        {item.isAvailable ? (
          <span className="gearmesh-item-card__badge gearmesh-item-card__badge--avail">Available</span>
        ) : (
          <span className="gearmesh-item-card__badge gearmesh-item-card__badge--busy">Borrowed</span>
        )}
      </div>

      <div className="gearmesh-item-card__content">
        <div className="gearmesh-item-card__header">
          <h3 className="gearmesh-item-card__title">{item.title}</h3>
          <Rating rating={item.rating} reviewCount={item.reviewCount} size={13} />
        </div>

        <div className="gearmesh-item-card__meta">
          <span className="gearmesh-item-card__distance">
            <MapPin size={13} />
            {item.distanceKm} km away
          </span>
          <span className="gearmesh-item-card__dot">•</span>
          <span className="gearmesh-item-card__category">{item.category}</span>
        </div>

        <div className="gearmesh-item-card__footer">
          <div className="gearmesh-item-card__price">
            <span className="gearmesh-item-card__currency">₹</span>
            <span className="gearmesh-item-card__amount">{item.pricePerDay}</span>
            <span className="gearmesh-item-card__period">/ day</span>
          </div>
          <span className="gearmesh-item-card__action">Borrow →</span>
        </div>
      </div>
    </div>
  );
};
