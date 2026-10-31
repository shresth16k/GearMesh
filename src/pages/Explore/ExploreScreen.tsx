import React, { useState } from 'react';
import { mockItems, mockCategories } from '../../data/mockData';
import { ItemCard } from '../../components/common/ItemCard';
import { SearchBar } from '../../components/common/SearchBar';
import { StaticMapView } from '../../components/common/StaticMapView';
import { Map, List, SlidersHorizontal } from 'lucide-react';
import { Item } from '../../types';
import './ExploreScreen.css';

interface ExploreScreenProps {
  onSelectItem: (item: Item) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onSelectItem }) => {
  const [viewMode, setViewMode]   = useState<'map' | 'list'>('map');
  const [search, setSearch]       = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [activeMapItem, setActiveMapItem] = useState<Item | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat ? item.category === selectedCat : true;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="gearmesh-explore">
      {/* ── Header ── */}
      <div className="gearmesh-explore__header">
        <div>
          <h1 className="gearmesh-explore__title">Find Around You</h1>
          <p className="gearmesh-explore__subtitle">Real people. Real things. Real impact.</p>
        </div>

        <div className="gearmesh-explore__header-right">
          {/* Filter button */}
          <button
            className={`gearmesh-explore__send-btn ${showFilters ? 'gearmesh-explore__send-btn--active' : ''}`}
            aria-label="Filter"
            onClick={() => setShowFilters(v => !v)}
          >
            <SlidersHorizontal
              size={15}
              color={showFilters ? '#FFFFFF' : 'var(--color-primary-forest)'}
            />
          </button>

          {/* Map / List toggle */}
          <div className="gearmesh-explore__toggle-wrap">
            <button
              className={`gearmesh-explore__toggle-btn ${viewMode === 'map' ? 'gearmesh-explore__toggle-btn--active' : ''}`}
              onClick={() => setViewMode('map')}
              aria-label="Map view"
            >
              <Map size={15} />
            </button>
            <button
              className={`gearmesh-explore__toggle-btn ${viewMode === 'list' ? 'gearmesh-explore__toggle-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="gearmesh-explore__search-area">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search in this area…"
        />
      </div>

      {/* ── Category filter chips ── */}
      {showFilters && (
        <div className="gearmesh-explore__cats">
          <button
            className={`gearmesh-explore__cat-chip ${selectedCat === null ? 'gearmesh-explore__cat-chip--active' : ''}`}
            onClick={() => setSelectedCat(null)}
          >
            All
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              className={`gearmesh-explore__cat-chip ${selectedCat === cat.id ? 'gearmesh-explore__cat-chip--active' : ''}`}
              onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Main content ── */}
      {viewMode === 'map' ? (
        <div className="gearmesh-explore__map-container">
          <StaticMapView
            items={filteredItems}
            activeItem={activeMapItem}
            onItemSelect={(item) => setActiveMapItem(item)}
            onItemOpen={(item) => onSelectItem(item)}
          />
        </div>
      ) : (
        <div className="gearmesh-explore__list-scroll">
          <div className="gearmesh-explore__results-count">
            <span>{filteredItems.length} items available nearby</span>
          </div>
          <div className="gearmesh-explore__grid">
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
