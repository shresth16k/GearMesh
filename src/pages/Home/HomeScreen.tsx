import React, { useState } from 'react';
import { currentUser, mockCategories, mockItems, mockLifeKits } from '../../data/mockData';
import { SearchBar } from '../../components/common/SearchBar';
import { CategoryCard } from '../../components/common/CategoryCard';
import { ItemCard } from '../../components/common/ItemCard';
import { MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Item } from '../../types';
import './HomeScreen.css';

interface HomeScreenProps {
  onSelectItem: (item: Item) => void;
  onExploreClick: () => void;
  onOpenLifeKit: () => void;
  onProfileClick: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectItem,
  onExploreClick,
  onOpenLifeKit,
  onProfileClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = mockItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const featuredLifeKit = mockLifeKits[0];

  return (
    <div className="rewrap-home">
      {/* Header */}
      <header className="rewrap-home__header">
        <div className="rewrap-home__user-info">
          <span className="rewrap-home__greeting">Good Morning, Alex</span>
          <div className="rewrap-home__location">
            <MapPin size={13} color="var(--color-primary-forest)" />
            <span>{currentUser.location}</span>
          </div>
        </div>
        <div className="rewrap-home__avatar-wrap" onClick={onProfileClick}>
          <img src={currentUser.avatar} alt={currentUser.name} className="rewrap-home__avatar" />
          <span className="rewrap-home__verified-dot" />
        </div>
      </header>

      <div className="rewrap-home__body">
        {/* Search Bar */}
        <section className="rewrap-home__search-section">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFilterClick={onExploreClick}
          />
        </section>

        {/* Categories Horizontal Scrolling */}
        <section className="rewrap-home__categories-section">
          <div className="rewrap-home__categories-scroll">
            <button
              className={`rewrap-category-pill ${!selectedCategory ? 'rewrap-category-pill--selected' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All Items
            </button>
            {mockCategories.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                isSelected={selectedCategory === cat.id}
                onSelect={(id) => setSelectedCategory(selectedCategory === id ? null : id)}
              />
            ))}
          </div>
        </section>

        {/* Hero Editorial Feature */}
        <section className="rewrap-home__hero-card" onClick={onExploreClick}>
          <div className="rewrap-home__hero-content">
            <span className="rewrap-home__hero-tag">FEATURED DISCOVERY</span>
            <h2 className="rewrap-home__hero-title">Borrow Experiences, Not Clutter.</h2>
            <p className="rewrap-home__hero-subtitle">
              Find what you need from verified neighbors around you.
            </p>
            <div className="rewrap-home__hero-cta">
              <span>Explore Catalog</span>
              <ArrowRight size={16} />
            </div>
          </div>
          <div className="rewrap-home__hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
              alt="Outdoor gear"
              className="rewrap-home__hero-image"
            />
          </div>
        </section>

        {/* Trending Near You */}
        <section className="rewrap-home__section">
          <div className="rewrap-home__section-header">
            <div>
              <h3 className="rewrap-home__section-title">Trending Near You</h3>
              <p className="rewrap-home__section-subtitle">Readily available in your neighborhood</p>
            </div>
            <button className="rewrap-home__see-all-btn" onClick={onExploreClick}>
              See All
            </button>
          </div>

          <div className="rewrap-home__horizontal-list">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                variant="horizontal"
                onClick={() => onSelectItem(item)}
              />
            ))}
          </div>
        </section>

        {/* Life Kit Section */}
        <section className="rewrap-home__life-kit-card">
          <div className="rewrap-home__life-kit-badge">
            <Sparkles size={14} />
            <span>SMART LIFE KIT</span>
          </div>

          <div className="rewrap-home__life-kit-header">
            <div>
              <h3 className="rewrap-home__life-kit-title">Planning something?</h3>
              <p className="rewrap-home__life-kit-scenario">"{featuredLifeKit.title}"</p>
            </div>
            <div className="rewrap-home__life-kit-price">
              <span className="rewrap-home__life-kit-amount">₹{featuredLifeKit.totalPricePerDay}</span>
              <span className="rewrap-home__life-kit-unit">/ day bundle</span>
            </div>
          </div>

          <p className="rewrap-home__life-kit-desc">
            Intelligently grouped gear: Tent + Cooler + Camp Stove + Lantern + Chairs
          </p>

          <div className="rewrap-home__life-kit-thumbnails">
            {featuredLifeKit.items.slice(0, 4).map((ki) => (
              <div key={ki.id} className="rewrap-home__kit-thumb-item">
                <img src={ki.imageUrl} alt={ki.name} />
                <span>{ki.name.split(' ')[0]}</span>
              </div>
            ))}
            <div className="rewrap-home__kit-thumb-more">+1 more</div>
          </div>

          <button className="rewrap-home__kit-cta-btn" onClick={onOpenLifeKit}>
            <span>Build My Kit with AI Concierge</span>
            <ArrowRight size={16} />
          </button>
        </section>

        <div style={{ height: 90 }} />
      </div>
    </div>
  );
};
