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
    <div className="gearmesh-search-bar">
      <div className="gearmesh-search-bar__input-wrap">
        <Search size={18} className="gearmesh-search-bar__icon" />
        <input
          type="text"
          className="gearmesh-search-bar__input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      {onFilterClick && (
        <button
          type="button"
          className="gearmesh-search-bar__filter-btn"
          onClick={onFilterClick}
          aria-label="Filter"
        >
          <SlidersHorizontal size={18} />
        </button>
      )}
    </div>
  );
};
