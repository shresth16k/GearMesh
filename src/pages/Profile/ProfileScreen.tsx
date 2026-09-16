import React from 'react';
import { currentUser } from '../../data/mockData';
import {
  Package,
  Heart,
  Clock,
  TrendingUp,
  CreditCard,
  HelpCircle,
  Settings,
  ChevronRight,
  LogOut
} from 'lucide-react';
import './ProfileScreen.css';

interface ProfileScreenProps {
  onLogout: () => void;
  onNavigateActivity: () => void;
  onNavigateList: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onLogout,
  onNavigateActivity,
  onNavigateList
}) => {
  return (
    <div className="rewrap-profile">
      {/* Top Header */}
      <div className="rewrap-profile__header">
        <h1 className="rewrap-profile__page-title">Profile</h1>

        <div className="rewrap-profile__user-card">
          <div className="rewrap-profile__avatar-container">
            <img src={currentUser.avatar} alt="Alex Kumar" className="rewrap-profile__avatar" />
          </div>

          <h2 className="rewrap-profile__name">Alex Kumar</h2>
          <span className="rewrap-profile__username">@alex.sharestories</span>

          <div className="rewrap-profile__metrics-row">
            <div className="rewrap-profile__metric">
              <span className="rewrap-profile__metric-val">12</span>
              <span className="rewrap-profile__metric-lbl">Borrowed</span>
            </div>
            <div className="rewrap-profile__metric-divider" />
            <div className="rewrap-profile__metric">
              <span className="rewrap-profile__metric-val">8</span>
              <span className="rewrap-profile__metric-lbl">Lent</span>
            </div>
            <div className="rewrap-profile__metric-divider" />
            <div className="rewrap-profile__metric">
              <span className="rewrap-profile__metric-val">4.8</span>
              <span className="rewrap-profile__metric-lbl">Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rewrap-profile__body">
        {/* Menu Items matching Screen 10 */}
        <section className="rewrap-profile__menu-group">
          <div className="rewrap-profile__menu-item" onClick={onNavigateList}>
            <div className="rewrap-profile__menu-left">
              <Package size={17} className="rewrap-profile__icon" />
              <span className="rewrap-profile__menu-title">My Listings</span>
            </div>
            <div className="rewrap-profile__menu-right">
              <span className="rewrap-profile__count-badge">(3)</span>
              <ChevronRight size={16} className="rewrap-profile__chevron" />
            </div>
          </div>

          <div className="rewrap-profile__menu-item">
            <div className="rewrap-profile__menu-left">
              <Heart size={17} className="rewrap-profile__icon" />
              <span className="rewrap-profile__menu-title">Saved Items</span>
            </div>
            <div className="rewrap-profile__menu-right">
              <span className="rewrap-profile__count-badge">(11)</span>
              <ChevronRight size={16} className="rewrap-profile__chevron" />
            </div>
          </div>

          <div className="rewrap-profile__menu-item" onClick={onNavigateActivity}>
            <div className="rewrap-profile__menu-left">
              <Clock size={17} className="rewrap-profile__icon" />
              <span className="rewrap-profile__menu-title">My Activity</span>
            </div>
            <div className="rewrap-profile__menu-right">
              <ChevronRight size={16} className="rewrap-profile__chevron" />
            </div>
          </div>

          <div className="rewrap-profile__menu-item">
            <div className="rewrap-profile__menu-left">
              <TrendingUp size={17} className="rewrap-profile__icon" />
              <span className="rewrap-profile__menu-title">Impact Stats</span>
            </div>
            <div className="rewrap-profile__menu-right">
              <span className="rewrap-profile__new-badge">New</span>
              <ChevronRight size={16} className="rewrap-profile__chevron" />
            </div>
          </div>
        </section>

        <section className="rewrap-profile__menu-group">
          <div className="rewrap-profile__menu-item">
            <div className="rewrap-profile__menu-left">
              <CreditCard size={17} className="rewrap-profile__icon" />
              <span className="rewrap-profile__menu-title">Payment & Payouts</span>
            </div>
            <div className="rewrap-profile__menu-right">
              <ChevronRight size={16} className="rewrap-profile__chevron" />
            </div>
          </div>

          <div className="rewrap-profile__menu-item">
            <div className="rewrap-profile__menu-left">
              <HelpCircle size={17} className="rewrap-profile__icon" />
              <span className="rewrap-profile__menu-title">Help & Support</span>
            </div>
            <div className="rewrap-profile__menu-right">
              <ChevronRight size={16} className="rewrap-profile__chevron" />
            </div>
          </div>

          <div className="rewrap-profile__menu-item">
            <div className="rewrap-profile__menu-left">
              <Settings size={17} className="rewrap-profile__icon" />
              <span className="rewrap-profile__menu-title">Settings</span>
            </div>
            <div className="rewrap-profile__menu-right">
              <ChevronRight size={16} className="rewrap-profile__chevron" />
            </div>
          </div>
        </section>

        <section className="rewrap-profile__menu-group">
          <div className="rewrap-profile__menu-item rewrap-profile__menu-item--danger" onClick={onLogout}>
            <div className="rewrap-profile__menu-left">
              <LogOut size={17} />
              <span className="rewrap-profile__menu-title">Sign Out</span>
            </div>
          </div>
        </section>

        <div style={{ height: 90 }} />
      </div>
    </div>
  );
};
