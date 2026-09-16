import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showText?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviewCount,
  size = 14,
  showText = true
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <Star size={size} fill="var(--color-sand)" stroke="var(--color-sand)" />
      {showText && (
        <span style={{ fontSize: `${size}px`, fontWeight: 600, color: 'var(--color-charcoal)' }}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span style={{ fontSize: `${size - 1}px`, color: 'var(--color-muted-gray)' }}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
