import React from 'react';
import { Home, Compass, Plus, Clock, User, Sparkles, MapPin, ShieldCheck, Layers } from 'lucide-react';
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
    <header className="gearmesh-desktop-nav">
      <div className="gearmesh-desktop-nav__container">
        {/* Brand Logo & Mission */}
        <div className="gearmesh-desktop-nav__brand" onClick={() => onTabChange('home')} role="button" tabIndex={0}>
          <div className="gearmesh-desktop-nav__logo-icon">
            <Layers size={20} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div className="gearmesh-desktop-nav__brand-text">
            <span className="gearmesh-desktop-nav__title">GearMesh</span>
            <span className="gearmesh-desktop-nav__tagline">Borrow • Share • Belong</span>
          </div>
        </div>

        {/* Center Navigation Links - Guaranteed Single Row & Even Heights */}
        <nav className="gearmesh-desktop-nav__links">
          <button
            type="button"
            className={`gearmesh-desktop-nav__link ${activeTab === 'home' ? 'gearmesh-desktop-nav__link--active' : ''}`}
            onClick={() => onTabChange('home')}
          >
            <Home size={17} strokeWidth={activeTab === 'home' ? 2.3 : 1.8} />
            <span>Home</span>
          </button>

          <button
            type="button"
            className={`gearmesh-desktop-nav__link ${activeTab === 'explore' ? 'gearmesh-desktop-nav__link--active' : ''}`}
            onClick={() => onTabChange('explore')}
          >
            <Compass size={17} strokeWidth={activeTab === 'explore' ? 2.3 : 1.8} />
            <span>Explore Map</span>
          </button>

          <button
            type="button"
            className={`gearmesh-desktop-nav__link ${activeTab === 'lifeKit' ? 'gearmesh-desktop-nav__link--active' : ''}`}
            onClick={onOpenLifeKit}
          >
            <Sparkles size={17} strokeWidth={activeTab === 'lifeKit' ? 2.3 : 1.8} />
            <span>AI Life Kits</span>
            <span className="gearmesh-desktop-nav__pill-badge">AI</span>
          </button>

          <button
            type="button"
            className={`gearmesh-desktop-nav__link ${activeTab === 'activity' ? 'gearmesh-desktop-nav__link--active' : ''}`}
            onClick={() => onTabChange('activity')}
          >
            <Clock size={17} strokeWidth={activeTab === 'activity' ? 2.3 : 1.8} />
            <span>Activity & Lockers</span>
          </button>

          <button
            type="button"
            className={`gearmesh-desktop-nav__link ${activeTab === 'profile' ? 'gearmesh-desktop-nav__link--active' : ''}`}
            onClick={onProfileClick}
          >
            <User size={17} strokeWidth={activeTab === 'profile' ? 2.3 : 1.8} />
            <span>Profile</span>
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="gearmesh-desktop-nav__right">
          {/* Clean Location Badge */}
          <div className="gearmesh-desktop-nav__location" title="Current Community Hub">
            <MapPin size={14} color="var(--color-primary-forest)" />
            <span>{currentUser.location}</span>
          </div>

          {/* List an item button */}
          <button type="button" className="gearmesh-desktop-nav__list-btn" onClick={onListClick}>
            <Plus size={15} strokeWidth={2.4} />
            <span>List an Item</span>
          </button>

          {/* Profile Pill */}
          <div
            className={`gearmesh-desktop-nav__user-pill ${activeTab === 'profile' ? 'gearmesh-desktop-nav__user-pill--active' : ''}`}
            onClick={onProfileClick}
            title="Alex Rivera — View Member Profile"
            role="button"
            tabIndex={0}
          >
            <div className="gearmesh-desktop-nav__avatar-wrap">
              <img src={currentUser.avatar} alt={currentUser.name} className="gearmesh-desktop-nav__avatar" />
              <span className="gearmesh-desktop-nav__verified-dot">
                <ShieldCheck size={8} color="#FFFFFF" strokeWidth={2.5} />
              </span>
            </div>
            <div className="gearmesh-desktop-nav__user-meta">
              <span className="gearmesh-desktop-nav__user-name">{currentUser.name}</span>
              <span className="gearmesh-desktop-nav__user-rating">★ {currentUser.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
