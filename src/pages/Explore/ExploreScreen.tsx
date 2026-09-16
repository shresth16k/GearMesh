import React, { useState } from 'react';
import { mockItems, mockCategories } from '../../data/mockData';
import { ItemCard } from '../../components/common/ItemCard';
import { SearchBar } from '../../components/common/SearchBar';
import { Map, List, MapPin } from 'lucide-react';
import { Item } from '../../types';
import './ExploreScreen.css';

interface ExploreScreenProps {
  onSelectItem: (item: Item) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onSelectItem }) => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [activeMapItem, setActiveMapItem] = useState<Item | null>(mockItems[0]);

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat ? item.category === selectedCat : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="rewrap-explore">
      {/* Header */}
      <div className="rewrap-explore__header">
        <div>
          <h1 className="rewrap-explore__title">Find Around You</h1>
          <p className="rewrap-explore__subtitle">Real people. Real things. Real impact.</p>
        </div>

        {/* Map / List View Toggle */}
        <div className="rewrap-explore__toggle-wrap">
          <button
            className={`rewrap-explore__toggle-btn ${viewMode === 'list' ? 'rewrap-explore__toggle-btn--active' : ''}`}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <List size={16} />
            <span>List</span>
          </button>
          <button
            className={`rewrap-explore__toggle-btn ${viewMode === 'map' ? 'rewrap-explore__toggle-btn--active' : ''}`}
            onClick={() => setViewMode('map')}
            aria-label="Map view"
          >
            <Map size={16} />
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rewrap-explore__search-area">
        <SearchBar value={search} onChange={setSearch} placeholder="Search cameras, tents, bikes..." />
      </div>

      {/* Category Pills */}
      <div className="rewrap-explore__filters-row">
        <button
          className={`rewrap-explore__filter-chip ${!selectedCat ? 'rewrap-explore__filter-chip--active' : ''}`}
          onClick={() => setSelectedCat(null)}
        >
          All
        </button>
        {mockCategories.map((c) => (
          <button
            key={c.id}
            className={`rewrap-explore__filter-chip ${selectedCat === c.id ? 'rewrap-explore__filter-chip--active' : ''}`}
            onClick={() => setSelectedCat(selectedCat === c.id ? null : c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Main Content: Map or List */}
      {viewMode === 'map' ? (
        <div className="rewrap-explore__map-container">
          <div className="rewrap-minimal-map">
            {/* Minimalist stylized local grid map */}
            <div className="rewrap-map-grid" />
            <div className="rewrap-map-river" />
            <div className="rewrap-map-road rewrap-map-road--1" />
            <div className="rewrap-map-road rewrap-map-road--2" />
            
            {/* Subtle Interactive Map Markers */}
            {filteredItems.map((it, idx) => {
              const offsets = [
                { top: '35%', left: '42%' },
                { top: '55%', left: '30%' },
                { top: '25%', left: '68%' },
                { top: '68%', left: '60%' },
                { top: '45%', left: '78%' },
                { top: '60%', left: '15%' }
              ];
              const pos = offsets[idx % offsets.length];
              const isSelected = activeMapItem?.id === it.id;

              return (
                <div
                  key={it.id}
                  className={`rewrap-map-pin ${isSelected ? 'rewrap-map-pin--selected' : ''}`}
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => setActiveMapItem(it)}
                >
                  <div className="rewrap-map-pin__bubble">
                    <span>₹{it.pricePerDay}</span>
                  </div>
                  <div className="rewrap-map-pin__dot" />
                </div>
              );
            })}
          </div>

          {/* Active Item Preview Card in Map View */}
          {activeMapItem && (
            <div className="rewrap-explore__map-preview">
              <ItemCard item={activeMapItem} onClick={() => onSelectItem(activeMapItem)} />
            </div>
          )}
        </div>
      ) : (
        <div className="rewrap-explore__list-scroll">
          <div className="rewrap-explore__results-count">
            <span>{filteredItems.length} items available nearby</span>
          </div>
          <div className="rewrap-explore__grid">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onClick={() => onSelectItem(item)} />
            ))}
          </div>
          <div style={{ height: 90 }} />
        </div>
      )}
    </div>
  );
};
