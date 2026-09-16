import React, { useState } from 'react';
import { mockItems, mockCategories } from '../../data/mockData';
import { ItemCard } from '../../components/common/ItemCard';
import { SearchBar } from '../../components/common/SearchBar';
import { Map, List, Send, Heart, Star, MapPin } from 'lucide-react';
import { Item } from '../../types';
import './ExploreScreen.css';

interface ExploreScreenProps {
  onSelectItem: (item: Item) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ onSelectItem }) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map'); // Default map as in showcase
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [activeMapItem, setActiveMapItem] = useState<Item | null>(mockItems[1]); // Camping Tent / Stove
  const [isLiked, setIsLiked] = useState(false);

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

        <div className="rewrap-explore__header-right">
          <button className="rewrap-explore__send-btn" aria-label="Share location">
            <Send size={16} color="var(--color-primary-forest)" />
          </button>
          <div className="rewrap-explore__toggle-wrap">
            <button
              className={`rewrap-explore__toggle-btn ${viewMode === 'map' ? 'rewrap-explore__toggle-btn--active' : ''}`}
              onClick={() => setViewMode('map')}
              aria-label="Map view"
            >
              <Map size={15} />
            </button>
            <button
              className={`rewrap-explore__toggle-btn ${viewMode === 'list' ? 'rewrap-explore__toggle-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rewrap-explore__search-area">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search in this area..."
        />
      </div>

      {/* Main Content: Map or List */}
      {viewMode === 'map' ? (
        <div className="rewrap-explore__map-container">
          <div className="rewrap-radar-map">
            {/* Concentric Soft Radar Distance Rings */}
            <div className="rewrap-radar-ring rewrap-radar-ring--3" />
            <div className="rewrap-radar-ring rewrap-radar-ring--2" />
            <div className="rewrap-radar-ring rewrap-radar-ring--1" />

            {/* Center "Your location" indicator */}
            <div className="rewrap-radar-center">
              <div className="rewrap-radar-center__dot" />
              <span className="rewrap-radar-center__label">Your location</span>
            </div>

            {/* Circular Item Pins placed around radar rings */}
            <div
              className={`rewrap-radar-item-pin ${activeMapItem?.id === mockItems[0].id ? 'rewrap-radar-item-pin--selected' : ''}`}
              style={{ top: '22%', left: '22%' }}
              onClick={() => setActiveMapItem(mockItems[0])}
            >
              <img src={mockItems[0].imageUrl} alt="Camera" />
            </div>

            <div
              className={`rewrap-radar-item-pin ${activeMapItem?.id === mockItems[1].id ? 'rewrap-radar-item-pin--selected' : ''}`}
              style={{ top: '20%', right: '22%' }}
              onClick={() => setActiveMapItem(mockItems[1])}
            >
              <img src={mockItems[1].imageUrl} alt="Tent" />
            </div>

            <div
              className={`rewrap-radar-item-pin ${activeMapItem?.id === mockItems[2].id ? 'rewrap-radar-item-pin--selected' : ''}`}
              style={{ bottom: '38%', right: '25%' }}
              onClick={() => setActiveMapItem(mockItems[2])}
            >
              <img src={mockItems[2].imageUrl} alt="Bicycle" />
            </div>

            <div
              className={`rewrap-radar-item-pin ${activeMapItem?.id === mockItems[3].id ? 'rewrap-radar-item-pin--selected' : ''}`}
              style={{ bottom: '42%', left: '20%' }}
              onClick={() => setActiveMapItem(mockItems[3])}
            >
              <img src={mockItems[3].imageUrl} alt="Drill" />
            </div>
          </div>

          {/* Bottom Floating Item Preview Card (matching Screen 5 in showcase) */}
          {activeMapItem && (
            <div className="rewrap-explore__floating-card" onClick={() => onSelectItem(activeMapItem)}>
              <div className="rewrap-explore__floating-img-wrap">
                <img src={activeMapItem.imageUrl} alt={activeMapItem.title} />
              </div>

              <div className="rewrap-explore__floating-info">
                <div className="rewrap-explore__floating-title-row">
                  <h4 className="rewrap-explore__floating-title">{activeMapItem.title}</h4>
                  <button
                    type="button"
                    className="rewrap-explore__floating-heart"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLiked(!isLiked);
                    }}
                  >
                    <Heart size={16} fill={isLiked ? '#B94A48' : 'none'} color={isLiked ? '#B94A48' : '#73776F'} />
                  </button>
                </div>

                <div className="rewrap-explore__floating-rate-row">
                  <span className="rewrap-explore__floating-price">₹{activeMapItem.pricePerDay}/day</span>
                  <div className="rewrap-explore__floating-rating">
                    <Star size={12} fill="var(--color-sand)" stroke="var(--color-sand)" />
                    <span>{activeMapItem.rating}</span>
                  </div>
                </div>

                <div className="rewrap-explore__floating-distance">
                  <MapPin size={12} />
                  <span>{activeMapItem.distanceKm * 1000} m away</span>
                </div>
              </div>
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
