import React from 'react';
import { currentUser, mockItems } from '../../data/mockData';
import { ImpactCard } from '../../components/common/ImpactCard';
import {
  ShieldCheck,
  Package,
  Bookmark,
  Clock,
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
      {/* Top Header Card */}
      <div className="rewrap-profile__header">
        <div className="rewrap-profile__user-card">
          <div className="rewrap-profile__avatar-container">
            <img src={currentUser.avatar} alt={currentUser.name} className="rewrap-profile__avatar" />
            <span className="rewrap-profile__badge">
              <ShieldCheck size={14} color="#FFFFFF" />
            </span>
          </div>

          <h2 className="rewrap-profile__name">{currentUser.name}</h2>
          <span className="rewrap-profile__location">{currentUser.location}</span>

          <div className="rewrap-profile__metrics-row">
            <div className="rewrap-profile__metric">
              <span className="rewrap-profile__metric-val">{currentUser.itemsBorrowed}</span>
              <span className="rewrap-profile__metric-lbl">Borrowed</span>
            </div>
            <div className="rewrap-profile__metric-divider" />
            <div className="rewrap-profile__metric">
              <span className="rewrap-profile__metric-val">{currentUser.itemsLent}</span>
              <span className="rewrap-profile__metric-lbl">Lent Out</span>
            </div>
            <div className="rewrap-profile__metric-divider" />
            <div className="rewrap-profile__metric">
              <span className="rewrap-profile__metric-val">★ {currentUser.rating}</span>
              <span className="rewrap-profile__metric-lbl">Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rewrap-profile__body">
        {/* Environmental Impact Section */}
        <section className="rewrap-profile__section">
          <ImpactCard
            kgSaved={currentUser.impactKgKept}
            rupeesSaved={currentUser.impactSavedAmount}
            itemsShared={currentUser.itemsBorrowed + currentUser.itemsLent}
          />
        </section>

        {/* Menu Items */}
        <section className="rewrap-profile__menu-group">
          <div className="rewrap-profile__menu-item" onClick={onNavigateList}>
            <div className="rewrap-profile__menu-icon">
              <Package size={18} />
            </div>
            <div className="rewrap-profile__menu-info">
              <span className="rewrap-profile__menu-title">My Listings</span>
              <span className="rewrap-profile__menu-sub">2 active items shared</span>
            </div>
            <ChevronRight size={18} className="rewrap-profile__chevron" />
          </div>

          <div className="rewrap-profile__menu-item" onClick={onNavigateActivity}>
            <div className="rewrap-profile__menu-icon">
              <Clock size={18} />
            </div>
            <div className="rewrap-profile__menu-info">
              <span className="rewrap-profile__menu-title">My Activity</span>
              <span className="rewrap-profile__menu-sub">Current reservations and locker keys</span>
            </div>
            <ChevronRight size={18} className="rewrap-profile__chevron" />
          </div>

          <div className="rewrap-profile__menu-item">
            <div className="rewrap-profile__menu-icon">
              <Bookmark size={18} />
            </div>
            <div className="rewrap-profile__menu-info">
              <span className="rewrap-profile__menu-title">Saved Items</span>
              <span className="rewrap-profile__menu-sub">5 items in wishlist</span>
            </div>
            <ChevronRight size={18} className="rewrap-profile__chevron" />
          </div>

          <div className="rewrap-profile__menu-item">
            <div className="rewrap-profile__menu-icon">
              <CreditCard size={18} />
            </div>
            <div className="rewrap-profile__menu-info">
              <span className="rewrap-profile__menu-title">Payments & Payouts</span>
              <span className="rewrap-profile__menu-sub">UPI & bank transfer preferences</span>
            </div>
            <ChevronRight size={18} className="rewrap-profile__chevron" />
          </div>
        </section>

        <section className="rewrap-profile__menu-group">
          <div className="rewrap-profile__menu-item">
            <div className="rewrap-profile__menu-icon">
              <HelpCircle size={18} />
            </div>
            <div className="rewrap-profile__menu-info">
              <span className="rewrap-profile__menu-title">Help & Trust Guidelines</span>
            </div>
            <ChevronRight size={18} className="rewrap-profile__chevron" />
          </div>

          <div className="rewrap-profile__menu-item">
            <div className="rewrap-profile__menu-icon">
              <Settings size={18} />
            </div>
            <div className="rewrap-profile__menu-info">
              <span className="rewrap-profile__menu-title">Settings & Privacy</span>
            </div>
            <ChevronRight size={18} className="rewrap-profile__chevron" />
          </div>

          <div className="rewrap-profile__menu-item rewrap-profile__menu-item--danger" onClick={onLogout}>
            <div className="rewrap-profile__menu-icon">
              <LogOut size={18} />
            </div>
            <div className="rewrap-profile__menu-info">
              <span className="rewrap-profile__menu-title">Sign Out</span>
            </div>
          </div>
        </section>

        <div className="rewrap-profile__footer-tag">
          <span>ReWrap v1.0.0 • Same things. New stories.</span>
        </div>

        <div style={{ height: 90 }} />
      </div>
    </div>
  );
};
