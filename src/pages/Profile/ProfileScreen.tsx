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
    <div className="rewrap-profile">
      <div className="rewrap-profile__scroll-container">
        {/* Top Header */}
        <div className="rewrap-profile__header">
          <div className="rewrap-profile__header-top">
            <h1 className="rewrap-profile__page-title">Member Profile</h1>
            <span className="rewrap-profile__member-since">Member since March 2024</span>
          </div>

          <div className="rewrap-profile__user-card">
            <div className="rewrap-profile__user-card-main">
              <div className="rewrap-profile__avatar-container">
                <img src={user.avatar} alt={user.name} className="rewrap-profile__avatar" />
                <span className="rewrap-profile__verified-badge">
                  <ShieldCheck size={12} color="#FFFFFF" />
                </span>
              </div>

              <div className="rewrap-profile__identity">
                <div className="rewrap-profile__name-row">
                  <h2 className="rewrap-profile__name">{user.name}</h2>
                  <span className="rewrap-profile__verified-pill">Verified Neighbor</span>
                </div>
                <span className="rewrap-profile__username">
                  {user.email ? `@${user.email.split('@')[0]}` : '@rewrap-member'} • {user.location}
                </span>
              </div>
            </div>

            <div className="rewrap-profile__metrics-row">
              <div className="rewrap-profile__metric">
                <span className="rewrap-profile__metric-val">{user.itemsBorrowed}</span>
                <span className="rewrap-profile__metric-lbl">Items Borrowed</span>
              </div>
              <div className="rewrap-profile__metric-divider" />
              <div className="rewrap-profile__metric">
                <span className="rewrap-profile__metric-val">{user.itemsLent}</span>
                <span className="rewrap-profile__metric-lbl">Items Lent</span>
              </div>
              <div className="rewrap-profile__metric-divider" />
              <div className="rewrap-profile__metric">
                <span className="rewrap-profile__metric-val">★ {user.rating}</span>
                <span className="rewrap-profile__metric-lbl">Community Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Dashboard Grid / Mobile Body Flow */}
        <div className="rewrap-profile__dashboard-grid">
          {/* Column 1: Impact Stats */}
          <div className="rewrap-profile__grid-col">
            <div className="rewrap-profile__section-heading">
              <Leaf size={16} color="var(--color-primary-forest)" />
              <span>Sustainability Impact</span>
            </div>

            <div className="rewrap-profile__impact-card">
              <div className="rewrap-profile__impact-header">
                <div>
                  <h3 className="rewrap-profile__impact-title">Environmental Score</h3>
                  <p className="rewrap-profile__impact-subtitle">Real physical resources preserved</p>
                </div>
                <div className="rewrap-profile__impact-badge">
                  <Award size={14} />
                  <span>Tier 2 Contributor</span>
                </div>
              </div>

              <div className="rewrap-profile__impact-stats">
                <div className="rewrap-profile__impact-stat-item">
                  <div className="rewrap-profile__impact-icon rewrap-profile__impact-icon--green">
                    <Leaf size={18} />
                  </div>
                  <div>
                    <span className="rewrap-profile__impact-stat-num">{user.impactKgKept || 18.5} kg</span>
                    <span className="rewrap-profile__impact-stat-label">Landfill waste avoided</span>
                  </div>
                </div>

                <div className="rewrap-profile__impact-stat-item">
                  <div className="rewrap-profile__impact-icon rewrap-profile__impact-icon--gold">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <span className="rewrap-profile__impact-stat-num">₹{user.impactSavedAmount ? user.impactSavedAmount.toLocaleString() : '12,400'}</span>
                    <span className="rewrap-profile__impact-stat-label">Estimated money saved</span>
                  </div>
                </div>

                <div className="rewrap-profile__impact-stat-item">
                  <div className="rewrap-profile__impact-icon rewrap-profile__impact-icon--sage">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <span className="rewrap-profile__impact-stat-num">48.2 kg</span>
                    <span className="rewrap-profile__impact-stat-label">CO₂ footprint prevented</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Community Gear & Actions */}
          <div className="rewrap-profile__grid-col">
            <div className="rewrap-profile__section-heading">
              <Package size={16} color="var(--color-primary-forest)" />
              <span>Gear & Activity</span>
            </div>

            <section className="rewrap-profile__menu-group">
              <div className="rewrap-profile__menu-item" onClick={onNavigateList}>
                <div className="rewrap-profile__menu-left">
                  <Package size={17} className="rewrap-profile__icon" />
                  <span className="rewrap-profile__menu-title">My Equipment Listings</span>
                </div>
                <div className="rewrap-profile__menu-right">
                  <span className="rewrap-profile__count-badge">(3 active)</span>
                  <ChevronRight size={16} className="rewrap-profile__chevron" />
                </div>
              </div>

              <div className="rewrap-profile__menu-item">
                <div className="rewrap-profile__menu-left">
                  <Heart size={17} className="rewrap-profile__icon" />
                  <span className="rewrap-profile__menu-title">Saved Items</span>
                </div>
                <div className="rewrap-profile__menu-right">
                  <span className="rewrap-profile__count-badge">(11 saved)</span>
                  <ChevronRight size={16} className="rewrap-profile__chevron" />
                </div>
              </div>

              <div className="rewrap-profile__menu-item" onClick={onNavigateActivity}>
                <div className="rewrap-profile__menu-left">
                  <Clock size={17} className="rewrap-profile__icon" />
                  <span className="rewrap-profile__menu-title">Borrowing & Locker History</span>
                </div>
                <div className="rewrap-profile__menu-right">
                  <ChevronRight size={16} className="rewrap-profile__chevron" />
                </div>
              </div>

              <div className="rewrap-profile__menu-item">
                <div className="rewrap-profile__menu-left">
                  <TrendingUp size={17} className="rewrap-profile__icon" />
                  <span className="rewrap-profile__menu-title">Community Trust Score</span>
                </div>
                <div className="rewrap-profile__menu-right">
                  <span className="rewrap-profile__new-badge">98% High</span>
                  <ChevronRight size={16} className="rewrap-profile__chevron" />
                </div>
              </div>
            </section>
          </div>

          {/* Column 3: Preferences & Account */}
          <div className="rewrap-profile__grid-col">
            <div className="rewrap-profile__section-heading">
              <Settings size={16} color="var(--color-primary-forest)" />
              <span>Preferences & Account</span>
            </div>

            <section className="rewrap-profile__menu-group">
              <div className="rewrap-profile__menu-item">
                <div className="rewrap-profile__menu-left">
                  <CreditCard size={17} className="rewrap-profile__icon" />
                  <span className="rewrap-profile__menu-title">Payment & Payout Methods</span>
                </div>
                <div className="rewrap-profile__menu-right">
                  <ChevronRight size={16} className="rewrap-profile__chevron" />
                </div>
              </div>

              <div className="rewrap-profile__menu-item">
                <div className="rewrap-profile__menu-left">
                  <HelpCircle size={17} className="rewrap-profile__icon" />
                  <span className="rewrap-profile__menu-title">Help & Community Support</span>
                </div>
                <div className="rewrap-profile__menu-right">
                  <ChevronRight size={16} className="rewrap-profile__chevron" />
                </div>
              </div>

              <div className="rewrap-profile__menu-item">
                <div className="rewrap-profile__menu-left">
                  <Settings size={17} className="rewrap-profile__icon" />
                  <span className="rewrap-profile__menu-title">Notification & Locker Settings</span>
                </div>
                <div className="rewrap-profile__menu-right">
                  <ChevronRight size={16} className="rewrap-profile__chevron" />
                </div>
              </div>

              <div className="rewrap-profile__menu-item rewrap-profile__menu-item--danger" onClick={onLogout}>
                <div className="rewrap-profile__menu-left">
                  <LogOut size={17} />
                  <span className="rewrap-profile__menu-title">Sign Out</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="rewrap-profile__bottom-clearance" />
      </div>
    </div>
  );
};
