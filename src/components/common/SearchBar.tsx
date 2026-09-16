import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search for anything...',
  onFilterClick
}) => {
  return (
    <div className="rewrap-search-bar">
      <div className="rewrap-search-bar__input-wrap">
        <Search size={18} className="rewrap-search-bar__icon" />
        <input
          type="text"
          className="rewrap-search-bar__input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {onFilterClick && (
        <button
          type="button"
          className="rewrap-search-bar__filter-btn"
          onClick={onFilterClick}
          aria-label="Filter"
        >
          <SlidersHorizontal size={18} />
        </button>
      )}
    </div>
  );
};
