import React from 'react';
import { Home, Compass, Plus, Clock, User, Sparkles, MapPin, ShieldCheck, Layers } from 'lucide-react';
import { currentUser } from '../../data/mockData';
import { NavTab } from './BottomNav';
import './DesktopNav.css';

interface DesktopNavProps {
  user?: { name: string; email?: string; avatar?: string; location?: string; rating?: number };
  activeTab: NavTab | 'lifeKit' | 'admin';
  onTabChange: (tab: NavTab) => void;
  onOpenLifeKit: () => void;
  onProfileClick: () => void;
  onListClick: () => void;
  onAdminClick?: () => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  user,
  activeTab,
  onTabChange,
  onOpenLifeKit,
  onProfileClick,
  onListClick,
  onAdminClick
}) => {
  const displayName = user?.name || (user?.email ? user.email.split('@')[0] : 'Community Member');
  const displayAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1B3B2B&color=fff&bold=true`;
  const displayLocation = user?.location || 'Rajpur Road, Dehradun';
  const displayRating = user?.rating !== undefined ? user.rating : 5.0;
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
            <span>{displayLocation}</span>
          </div>

          {/* Admin Portal Button (Web only) */}
          <button
            type="button"
            className={`gearmesh-desktop-nav__admin-btn ${activeTab === 'admin' ? 'gearmesh-desktop-nav__admin-btn--active' : ''}`}
            onClick={onAdminClick}
            title="Open Admin Dashboard (Web)"
          >
            <ShieldCheck size={14} strokeWidth={2.4} />
            <span>Admin</span>
          </button>

          {/* List an item button */}
          <button type="button" className="gearmesh-desktop-nav__list-btn" onClick={onListClick}>
            <Plus size={15} strokeWidth={2.4} />
            <span>List an Item</span>
          </button>

          {/* Profile Pill */}
          <div
            className={`gearmesh-desktop-nav__user-pill ${activeTab === 'profile' ? 'gearmesh-desktop-nav__user-pill--active' : ''}`}
            onClick={onProfileClick}
            title={`${displayName} — View Member Profile`}
            role="button"
            tabIndex={0}
          >
            <div className="gearmesh-desktop-nav__avatar-wrap">
              <img src={displayAvatar} alt={displayName} className="gearmesh-desktop-nav__avatar" />
              <span className="gearmesh-desktop-nav__verified-dot">
                <ShieldCheck size={8} color="#FFFFFF" strokeWidth={2.5} />
              </span>
            </div>
            <div className="gearmesh-desktop-nav__user-meta">
              <span className="gearmesh-desktop-nav__user-name">{displayName}</span>
              <span className="gearmesh-desktop-nav__user-rating">★ {displayRating}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
