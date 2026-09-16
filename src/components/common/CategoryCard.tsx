import React from 'react';
import { Tent, Wrench, Camera, Bike, Coffee, Music, BookOpen, Compass } from 'lucide-react';
import { Category } from '../../types';
import './CategoryCard.css';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Tent,
  Wrench,
  Camera,
  Bike,
  Coffee,
  Music,
  BookOpen
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onSelect
}) => {
  const IconComponent = iconMap[category.iconName] || Compass;

  return (
    <button
      className={`rewrap-category-pill ${isSelected ? 'rewrap-category-pill--selected' : ''}`}
      onClick={() => onSelect && onSelect(category.id)}
    >
      <div className="rewrap-category-pill__icon-wrap">
        <IconComponent size={16} strokeWidth={isSelected ? 2.2 : 1.8} />
      </div>
      <span className="rewrap-category-pill__label">{category.name}</span>
    </button>
  );
};
