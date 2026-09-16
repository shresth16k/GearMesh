import React from 'react';
import { Home, Compass, Plus, Clock, User } from 'lucide-react';
import './BottomNav.css';

export type NavTab = 'home' | 'explore' | 'list' | 'activity' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="rewrap-bottom-nav">
      <button
        className={`rewrap-bottom-nav__item ${activeTab === 'home' ? 'rewrap-bottom-nav__item--active' : ''}`}
        onClick={() => onTabChange('home')}
      >
        <Home size={22} strokeWidth={activeTab === 'home' ? 2.3 : 1.7} />
        <span>Home</span>
      </button>

      <button
        className={`rewrap-bottom-nav__item ${activeTab === 'explore' ? 'rewrap-bottom-nav__item--active' : ''}`}
        onClick={() => onTabChange('explore')}
      >
        <Compass size={22} strokeWidth={activeTab === 'explore' ? 2.3 : 1.7} />
        <span>Explore</span>
      </button>

      <button
        className="rewrap-bottom-nav__item rewrap-bottom-nav__item--add"
        onClick={() => onTabChange('list')}
        aria-label="List an item"
      >
        <div className="rewrap-bottom-nav__add-circle">
          <Plus size={22} strokeWidth={2.4} color="#FFFFFF" />
        </div>
        <span>List</span>
      </button>

      <button
        className={`rewrap-bottom-nav__item ${activeTab === 'activity' ? 'rewrap-bottom-nav__item--active' : ''}`}
        onClick={() => onTabChange('activity')}
      >
        <Clock size={22} strokeWidth={activeTab === 'activity' ? 2.3 : 1.7} />
        <span>Activity</span>
      </button>

      <button
        className={`rewrap-bottom-nav__item ${activeTab === 'profile' ? 'rewrap-bottom-nav__item--active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <User size={22} strokeWidth={activeTab === 'profile' ? 2.3 : 1.7} />
        <span>Profile</span>
      </button>
    </nav>
  );
};
