import React from 'react';
import { User } from '../../types';
import {
  Package,
  Heart,
  Clock,
  TrendingUp,
  CreditCard,
  HelpCircle,
  Settings,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Leaf,
  DollarSign,
  Award,
  Sparkles
} from 'lucide-react';
import './ProfileScreen.css';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
  onNavigateActivity: () => void;
  onNavigateList: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onLogout,
  onNavigateActivity,
  onNavigateList
}) => {
  return (
    <div className="gearmesh-profile">
      <div className="gearmesh-profile__scroll-container">
        {/* Top Header */}
        <div className="gearmesh-profile__header">
          <div className="gearmesh-profile__header-top">
            <h1 className="gearmesh-profile__page-title">Member Profile</h1>
            <span className="gearmesh-profile__member-since">Member since March 2024</span>
          </div>

          <div className="gearmesh-profile__user-card">
            <div className="gearmesh-profile__user-card-main">
              <div className="gearmesh-profile__avatar-container">
                <img src={user.avatar} alt={user.name} className="gearmesh-profile__avatar" />
                <span className="gearmesh-profile__verified-badge">
                  <ShieldCheck size={12} color="#FFFFFF" />
                </span>
              </div>

              <div className="gearmesh-profile__identity">
                <div className="gearmesh-profile__name-row">
                  <h2 className="gearmesh-profile__name">{user.name}</h2>
                  <span className="gearmesh-profile__verified-pill">Verified Neighbor</span>
                </div>
                <span className="gearmesh-profile__username">
                  {user.email ? `@${user.email.split('@')[0]}` : '@gearmesh-member'} • {user.location}
                </span>
              </div>
            </div>

            <div className="gearmesh-profile__metrics-row">
              <div className="gearmesh-profile__metric">
                <span className="gearmesh-profile__metric-val">{user.itemsBorrowed}</span>
                <span className="gearmesh-profile__metric-lbl">Items Borrowed</span>
              </div>
              <div className="gearmesh-profile__metric-divider" />
              <div className="gearmesh-profile__metric">
                <span className="gearmesh-profile__metric-val">{user.itemsLent}</span>
                <span className="gearmesh-profile__metric-lbl">Items Lent</span>
              </div>
              <div className="gearmesh-profile__metric-divider" />
              <div className="gearmesh-profile__metric">
                <span className="gearmesh-profile__metric-val">★ {user.rating}</span>
                <span className="gearmesh-profile__metric-lbl">Community Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Dashboard Grid / Mobile Body Flow */}
        <div className="gearmesh-profile__dashboard-grid">
          {/* Column 1: Impact Stats */}
          <div className="gearmesh-profile__grid-col">
            <div className="gearmesh-profile__section-heading">
              <Leaf size={16} color="var(--color-primary-forest)" />
              <span>Sustainability Impact</span>
            </div>

            <div className="gearmesh-profile__impact-card">
              <div className="gearmesh-profile__impact-header">
                <div>
                  <h3 className="gearmesh-profile__impact-title">Environmental Score</h3>
                  <p className="gearmesh-profile__impact-subtitle">Real physical resources preserved</p>
                </div>
                <div className="gearmesh-profile__impact-badge">
                  <Award size={14} />
                  <span>Tier 2 Contributor</span>
                </div>
              </div>

              <div className="gearmesh-profile__impact-stats">
                <div className="gearmesh-profile__impact-stat-item">
                  <div className="gearmesh-profile__impact-icon gearmesh-profile__impact-icon--green">
                    <Leaf size={18} />
                  </div>
                  <div>
                    <span className="gearmesh-profile__impact-stat-num">{user.impactKgKept || 18.5} kg</span>
                    <span className="gearmesh-profile__impact-stat-label">Landfill waste avoided</span>
                  </div>
                </div>

                <div className="gearmesh-profile__impact-stat-item">
                  <div className="gearmesh-profile__impact-icon gearmesh-profile__impact-icon--gold">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <span className="gearmesh-profile__impact-stat-num">₹{user.impactSavedAmount ? user.impactSavedAmount.toLocaleString() : '12,400'}</span>
                    <span className="gearmesh-profile__impact-stat-label">Estimated money saved</span>
                  </div>
                </div>

                <div className="gearmesh-profile__impact-stat-item">
                  <div className="gearmesh-profile__impact-icon gearmesh-profile__impact-icon--sage">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="gearmesh-profile__impact-stat-num">48.2 kg</span>
                    <span className="gearmesh-profile__impact-stat-label">CO₂ footprint prevented</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Community Gear & Actions */}
          <div className="gearmesh-profile__grid-col">
            <div className="gearmesh-profile__section-heading">
              <Package size={16} color="var(--color-primary-forest)" />
              <span>Gear & Activity</span>
            </div>

            <section className="gearmesh-profile__menu-group">
              <div className="gearmesh-profile__menu-item" onClick={onNavigateList}>
                <div className="gearmesh-profile__menu-left">
                  <Package size={17} className="gearmesh-profile__icon" />
                  <span className="gearmesh-profile__menu-title">My Equipment Listings</span>
                </div>
                <div className="gearmesh-profile__menu-right">
                  <span className="gearmesh-profile__count-badge">(3 active)</span>
                  <ChevronRight size={16} className="gearmesh-profile__chevron" />
                </div>
              </div>

              <div className="gearmesh-profile__menu-item">
                <div className="gearmesh-profile__menu-left">
                  <Heart size={17} className="gearmesh-profile__icon" />
                  <span className="gearmesh-profile__menu-title">Saved Items</span>
                </div>
                <div className="gearmesh-profile__menu-right">
                  <span className="gearmesh-profile__count-badge">(11 saved)</span>
                  <ChevronRight size={16} className="gearmesh-profile__chevron" />
                </div>
              </div>

              <div className="gearmesh-profile__menu-item" onClick={onNavigateActivity}>
                <div className="gearmesh-profile__menu-left">
                  <Clock size={17} className="gearmesh-profile__icon" />
                  <span className="gearmesh-profile__menu-title">Borrowing & Locker History</span>
                </div>
                <div className="gearmesh-profile__menu-right">
                  <ChevronRight size={16} className="gearmesh-profile__chevron" />
                </div>
              </div>

              <div className="gearmesh-profile__menu-item">
                <div className="gearmesh-profile__menu-left">
                  <TrendingUp size={17} className="gearmesh-profile__icon" />
                  <span className="gearmesh-profile__menu-title">Community Trust Score</span>
                </div>
                <div className="gearmesh-profile__menu-right">
                  <span className="gearmesh-profile__new-badge">98% High</span>
                  <ChevronRight size={16} className="gearmesh-profile__chevron" />
                </div>
              </div>
            </section>
          </div>

          {/* Column 3: Preferences & Account */}
          <div className="gearmesh-profile__grid-col">
            <div className="gearmesh-profile__section-heading">
              <Settings size={16} color="var(--color-primary-forest)" />
              <span>Preferences & Account</span>
            </div>

            <section className="gearmesh-profile__menu-group">
              <div className="gearmesh-profile__menu-item">
                <div className="gearmesh-profile__menu-left">
                  <CreditCard size={17} className="gearmesh-profile__icon" />
                  <span className="gearmesh-profile__menu-title">Payment & Payout Methods</span>
                </div>
                <div className="gearmesh-profile__menu-right">
                  <ChevronRight size={16} className="gearmesh-profile__chevron" />
                </div>
              </div>

              <div className="gearmesh-profile__menu-item">
                <div className="gearmesh-profile__menu-left">
                  <HelpCircle size={17} className="gearmesh-profile__icon" />
                  <span className="gearmesh-profile__menu-title">Help & Community Support</span>
                </div>
                <div className="gearmesh-profile__menu-right">
                  <ChevronRight size={16} className="gearmesh-profile__chevron" />
                </div>
              </div>

              <div className="gearmesh-profile__menu-item">
                <div className="gearmesh-profile__menu-left">
                  <Settings size={17} className="gearmesh-profile__icon" />
                  <span className="gearmesh-profile__menu-title">Notification & Locker Settings</span>
                </div>
                <div className="gearmesh-profile__menu-right">
                  <ChevronRight size={16} className="gearmesh-profile__chevron" />
                </div>
              </div>

              <div className="gearmesh-profile__menu-item gearmesh-profile__menu-item--danger" onClick={onLogout}>
                <div className="gearmesh-profile__menu-left">
                  <LogOut size={17} />
                  <span className="gearmesh-profile__menu-title">Sign Out</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="gearmesh-profile__bottom-clearance" />
      </div>
    </div>
  );
};
