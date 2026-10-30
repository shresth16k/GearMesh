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
    <div className="gearmesh-home">
      {/* Header */}
      <header className="gearmesh-home__header">
        <div className="gearmesh-home__user-info">
          <span className="gearmesh-home__greeting">Good Morning, Alex</span>
          <div className="gearmesh-home__location">
            <MapPin size={13} color="var(--color-primary-forest)" />
            <span>{currentUser.location}</span>
          </div>
        </div>
        <div className="gearmesh-home__avatar-wrap" onClick={onProfileClick}>
          <img src={currentUser.avatar} alt={currentUser.name} className="gearmesh-home__avatar" />
          <span className="gearmesh-home__verified-dot" />
        </div>
      </header>

      <div className="gearmesh-home__body">
        {/* Search Bar */}
        <section className="gearmesh-home__search-section">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFilterClick={onExploreClick}
          />
        </section>

        {/* Categories Horizontal Scrolling */}
        <section className="gearmesh-home__categories-section">
          <div className="gearmesh-home__categories-scroll">
            <button
              className={`gearmesh-category-pill ${!selectedCategory ? 'gearmesh-category-pill--selected' : ''}`}
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
        <section className="gearmesh-home__hero-card" onClick={onExploreClick}>
          <div className="gearmesh-home__hero-content">
            <span className="gearmesh-home__hero-tag">FEATURED DISCOVERY</span>
            <h2 className="gearmesh-home__hero-title">Borrow Experiences, Not Clutter.</h2>
            <p className="gearmesh-home__hero-subtitle">
              Find what you need from verified neighbors around you.
            </p>
            <div className="gearmesh-home__hero-cta">
              <span>Explore Catalog</span>
              <ArrowRight size={16} />
            </div>
          </div>
          <div className="gearmesh-home__hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
              alt="Outdoor gear"
              className="gearmesh-home__hero-image"
            />
          </div>
        </section>

        {/* Trending Near You / Community Gear Grid */}
        <section className="gearmesh-home__section">
          <div className="gearmesh-home__section-header">
            <div>
              <h3 className="gearmesh-home__section-title">
                {selectedCategory ? `${selectedCategory.toUpperCase()} Items` : 'Trending In Your Neighborhood'}
              </h3>
              <p className="gearmesh-home__section-subtitle">
                {filteredItems.length} items readily available near Rajpur Road
              </p>
            </div>
            <button className="gearmesh-home__see-all-btn" onClick={onExploreClick}>
              Explore Map →
            </button>
          </div>

          {/* Mobile Horizontal Carousel */}
          <div className="gearmesh-home__horizontal-list gearmesh-home__mobile-only">
            {filteredItems.slice(0, 8).map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                variant="horizontal"
                onClick={() => onSelectItem(item)}
              />
            ))}
          </div>

          {/* Desktop Multi-Column Responsive Grid */}
          <div className="gearmesh-home__desktop-grid">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => onSelectItem(item)}
              />
            ))}
          </div>
        </section>

        {/* Life Kit Section */}
        <section className="gearmesh-home__life-kit-card">
          <div className="gearmesh-home__life-kit-badge">
            <Sparkles size={14} />
            <span>SMART LIFE KIT</span>
          </div>

          <div className="gearmesh-home__life-kit-header">
            <div>
              <h3 className="gearmesh-home__life-kit-title">Planning an adventure?</h3>
              <p className="gearmesh-home__life-kit-scenario">"{featuredLifeKit.title}"</p>
            </div>
            <div className="gearmesh-home__life-kit-price">
              <span className="gearmesh-home__life-kit-amount">₹{featuredLifeKit.totalPricePerDay}</span>
              <span className="gearmesh-home__life-kit-unit">/ day bundle</span>
            </div>
          </div>

          <p className="gearmesh-home__life-kit-desc">
            Intelligently grouped gear: Tent + Cooler + Camp Stove + Lantern + Chairs
          </p>

          <div className="gearmesh-home__life-kit-thumbnails">
            {featuredLifeKit.items.slice(0, 5).map((ki) => (
              <div key={ki.id} className="gearmesh-home__kit-thumb-item">
                <img src={ki.imageUrl} alt={ki.name} />
                <span>{ki.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          <button className="gearmesh-home__kit-cta-btn" onClick={onOpenLifeKit}>
            <span>Build My Kit with AI Concierge</span>
            <ArrowRight size={16} />
          </button>
        </section>

        <div className="gearmesh-home__bottom-clearance" />
      </div>
    </div>
  );
};
