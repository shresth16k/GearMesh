import React from 'react';
import { Leaf, TrendingUp, Sparkles } from 'lucide-react';
import './ImpactCard.css';

interface ImpactCardProps {
  kgSaved: number;
  rupeesSaved: number;
  itemsShared: number;
}

export const ImpactCard: React.FC<ImpactCardProps> = ({
  kgSaved,
  rupeesSaved,
  itemsShared
}) => {
  return (
    <div className="gearmesh-impact-card">
      <div className="gearmesh-impact-card__header">
        <div className="gearmesh-impact-card__title-row">
          <div className="gearmesh-impact-card__icon-badge">
            <Leaf size={16} strokeWidth={2} />
          </div>
          <div>
            <h4 className="gearmesh-impact-card__title">Your Community Footprint</h4>
            <p className="gearmesh-impact-card__subtitle">Real impact of choosing access over ownership</p>
          </div>
        </div>
      </div>

      <div className="gearmesh-impact-card__grid">
        <div className="gearmesh-impact-stat">
          <span className="gearmesh-impact-stat__value">{kgSaved} kg</span>
          <span className="gearmesh-impact-stat__label">Material impact avoided</span>
        </div>

        <div className="gearmesh-impact-stat">
          <span className="gearmesh-impact-stat__value">₹{rupeesSaved.toLocaleString()}</span>
          <span className="gearmesh-impact-stat__label">Saved vs buying new</span>
        </div>

        <div className="gearmesh-impact-stat">
          <span className="gearmesh-impact-stat__value">{itemsShared}</span>
          <span className="gearmesh-impact-stat__label">Circular items shared</span>
        </div>
      </div>

      <div className="gearmesh-impact-card__footer">
        <Sparkles size={14} color="var(--color-primary-forest)" />
        <span>Equal to planting 4 urban pine trees this month</span>
      </div>
    </div>
  );
};
