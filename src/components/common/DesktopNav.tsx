import React from 'react';
import { Home, Compass, Plus, Clock, User, Sparkles, MapPin, ShieldCheck, Sprout } from 'lucide-react';
import { currentUser } from '../../data/mockData';
import { NavTab } from './BottomNav';
import './DesktopNav.css';

interface DesktopNavProps {
  activeTab: NavTab | 'lifeKit';
  onTabChange: (tab: NavTab) => void;
  onOpenLifeKit: () => void;
  onProfileClick: () => void;
  onListClick: () => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  activeTab,
  onTabChange,
  onOpenLifeKit,
  onProfileClick,
  onListClick
}) => {
  return (
    <header className="rewrap-desktop-nav">
      <div className="rewrap-desktop-nav__container">
        {/* Brand Logo & Mission */}
        <div className="rewrap-desktop-nav__brand" onClick={() => onTabChange('home')}>
          <div className="rewrap-desktop-nav__logo-icon">
            <Sprout size={22} color="#FFFFFF" />
          </div>
          <div className="rewrap-desktop-nav__brand-text">
            <span className="rewrap-desktop-nav__title">ReWrap</span>
            <span className="rewrap-desktop-nav__tagline">Borrow • Share • Belong</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="rewrap-desktop-nav__links">
          <button
            className={`rewrap-desktop-nav__link ${activeTab === 'home' ? 'rewrap-desktop-nav__link--active' : ''}`}
            onClick={() => onTabChange('home')}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            className={`rewrap-desktop-nav__link ${activeTab === 'explore' ? 'rewrap-desktop-nav__link--active' : ''}`}
            onClick={() => onTabChange('explore')}
          >
            <Compass size={18} />
            <span>Explore Map</span>
          </button>

          <button
            className={`rewrap-desktop-nav__link ${activeTab === 'lifeKit' ? 'rewrap-desktop-nav__link--active' : ''}`}
            onClick={onOpenLifeKit}
          >
            <Sparkles size={18} />
            <span>AI Life Kits</span>
            <span className="rewrap-desktop-nav__pill-badge">AI</span>
          </button>

          <button
            className={`rewrap-desktop-nav__link ${activeTab === 'activity' ? 'rewrap-desktop-nav__link--active' : ''}`}
            onClick={() => onTabChange('activity')}
          >
            <Clock size={18} />
            <span>Activity & Lockers</span>
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="rewrap-desktop-nav__right">
          {/* Location Badge */}
          <div className="rewrap-desktop-nav__location">
            <MapPin size={15} color="var(--color-primary-forest)" />
            <span>{currentUser.location}</span>
          </div>

          {/* List an item button */}
          <button className="rewrap-desktop-nav__list-btn" onClick={onListClick}>
            <Plus size={16} strokeWidth={2.4} />
            <span>List an Item</span>
          </button>

          {/* Profile Pill */}
          <div
            className={`rewrap-desktop-nav__user-pill ${activeTab === 'profile' ? 'rewrap-desktop-nav__user-pill--active' : ''}`}
            onClick={onProfileClick}
            title="View Profile"
          >
            <div className="rewrap-desktop-nav__avatar-wrap">
              <img src={currentUser.avatar} alt={currentUser.name} className="rewrap-desktop-nav__avatar" />
              <span className="rewrap-desktop-nav__verified-dot">
                <ShieldCheck size={9} color="#FFFFFF" />
              </span>
            </div>
            <div className="rewrap-desktop-nav__user-meta">
              <span className="rewrap-desktop-nav__user-name">{currentUser.name}</span>
              <span className="rewrap-desktop-nav__user-rating">★ {currentUser.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
