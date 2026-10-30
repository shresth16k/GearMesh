import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { mockItems } from '../../data/mockData';
import { Item } from '../../types';
import { Search, Shield, Zap, RefreshCw, MapPin, Star, ArrowRight, Lock, Heart, CheckCircle2 } from 'lucide-react';
import './SplashScreen.css';

interface SplashScreenProps {
  onGetStarted: () => void;
  onExploreClick?: () => void;
  onSelectItem?: (item: Item) => void;
  onLoginClick?: () => void;
  onWhyGearMesh?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onGetStarted,
  onExploreClick,
  onSelectItem,
  onLoginClick,
  onWhyGearMesh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredItems = mockItems.slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onExploreClick) {
      onExploreClick();
    } else {
      onGetStarted();
    }
  };

  return (
    <div className="gearmesh-splash-screen">
      {/* ========================================================
          DESKTOP TOP NAVIGATION (>= 768px)
          ======================================================== */}
      <header className="gearmesh-splash__desktop-nav">
        <div className="gearmesh-splash__nav-inner">
          <div className="gearmesh-splash__nav-brand">
            <img src="/leaf.svg" alt="GearMesh" className="gearmesh-splash__nav-leaf" />
            <span className="gearmesh-splash__nav-title">GearMesh</span>
            <span className="gearmesh-splash__nav-badge">COMMUNITY SHARING</span>
          </div>

          <nav className="gearmesh-splash__nav-links">
            <a href="#featured-gear" className="gearmesh-splash__nav-link">Featured Gear</a>
            <a href="#how-it-works" className="gearmesh-splash__nav-link">How It Works</a>
            <a href="#smart-lockers" className="gearmesh-splash__nav-link">Smart Lockers</a>
            <a href="#sustainability" className="gearmesh-splash__nav-link">Impact</a>
          </nav>

          <div className="gearmesh-splash__nav-actions">
            {onWhyGearMesh && (
              <button
                type="button"
                className="gearmesh-splash__nav-why-btn"
                onClick={onWhyGearMesh}
              >
                Why GearMesh?
              </button>
            )}
            {onLoginClick && (
              <button
                type="button"
                className="gearmesh-splash__nav-login-btn"
                onClick={onLoginClick}
              >
                Sign In
              </button>
            )}
            <button
              type="button"
              className="gearmesh-splash__nav-cta-btn"
              onClick={onGetStarted}
            >
              Get Started <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MOBILE TOP HEADER (< 768px)
          ======================================================== */}
      <header className="gearmesh-splash__mobile-header">
        <div className="gearmesh-splash__top-logo-row">
          <img src="/leaf.svg" alt="GearMesh" className="gearmesh-splash__top-leaf" />
          <span className="gearmesh-splash__top-title">GearMesh</span>
        </div>
        <span className="gearmesh-splash__top-tagline">Borrow. Share. Belong.</span>
      </header>

      {/* ========================================================
          MOBILE PHOTOGRAPHY CONTAINER (< 768px only)
          ======================================================== */}
      <div className="gearmesh-splash__mobile-image-container">
        <img
          src="/firstscreenimage.png"
          alt="GearMesh - Things move. People connect. A greener tomorrow."
          className="gearmesh-splash__hero-img"
        />
      </div>

      {/* MOBILE DOTS (< 768px only) */}
      <div className="gearmesh-splash__mobile-dots">
        <span className="gearmesh-splash__dot gearmesh-splash__dot--active" />
        <span className="gearmesh-splash__dot" />
        <span className="gearmesh-splash__dot" />
        <span className="gearmesh-splash__dot" />
      </div>

      {/* ========================================================
          DESKTOP EXPANSIVE HERO SECTION (>= 768px)
          (No image on desktop as requested)
          ======================================================== */}
      <section className="gearmesh-splash__desktop-hero">
        <div className="gearmesh-splash__hero-container">
          <div className="gearmesh-splash__hero-badge">
            <span className="gearmesh-splash__hero-badge-pulse" />
            24/7 Smart Locker Gear Sharing Network
          </div>

          <h1 className="gearmesh-splash__hero-headline">
            Things move. People connect.<br />
            <span className="gearmesh-splash__hero-headline-highlight">A greener tomorrow.</span>
          </h1>

          <p className="gearmesh-splash__hero-description">
            Why buy high-end camping gear, power tools, cameras, and sporting equipment you only use twice a year?
            Borrow directly from verified neighbors and pick up 24/7 at automated smart lockers.
          </p>

          {/* Quick Search Bar */}
          <form className="gearmesh-splash__hero-search" onSubmit={handleSearchSubmit}>
            <div className="gearmesh-splash__search-input-wrap">
              <Search size={18} className="gearmesh-splash__search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tents, cameras, drills, projectors, bikes..."
                className="gearmesh-splash__search-input"
              />
            </div>
            <button type="submit" className="gearmesh-splash__search-btn">
              Explore Gear
            </button>
          </form>

          {/* Stats Bar */}
          <div className="gearmesh-splash__stats-strip">
            <div className="gearmesh-splash__stat-item">
              <span className="gearmesh-splash__stat-number">1,250+</span>
              <span className="gearmesh-splash__stat-label">Neighborhood Items</span>
            </div>
            <div className="gearmesh-splash__stat-divider" />
            <div className="gearmesh-splash__stat-item">
              <span className="gearmesh-splash__stat-number">45</span>
              <span className="gearmesh-splash__stat-label">Smart Lockers</span>
            </div>
            <div className="gearmesh-splash__stat-divider" />
            <div className="gearmesh-splash__stat-item">
              <span className="gearmesh-splash__stat-number">8.4 Tons</span>
              <span className="gearmesh-splash__stat-label">CO₂ Prevented</span>
            </div>
            <div className="gearmesh-splash__stat-divider" />
            <div className="gearmesh-splash__stat-item">
              <span className="gearmesh-splash__stat-number">4.9 ★</span>
              <span className="gearmesh-splash__stat-label">Community Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          DESKTOP FEATURED GEAR SECTION (>= 768px, SCROLLABLE)
          ======================================================== */}
      <section id="featured-gear" className="gearmesh-splash__desktop-section">
        <div className="gearmesh-splash__section-inner">
          <div className="gearmesh-splash__section-header">
            <div>
              <span className="gearmesh-splash__section-tag">POPULAR NEARBY</span>
              <h2 className="gearmesh-splash__section-title">Ready for pickup in smart lockers today</h2>
            </div>
            <button
              type="button"
              className="gearmesh-splash__view-all-btn"
              onClick={onExploreClick || onGetStarted}
            >
              Browse All 1,250+ Items <ArrowRight size={16} />
            </button>
          </div>

          <div className="gearmesh-splash__items-grid">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="gearmesh-splash__item-card"
                onClick={() => (onSelectItem ? onSelectItem(item) : onGetStarted())}
              >
                <div className="gearmesh-splash__item-img-wrap">
                  <img src={item.imageUrl} alt={item.title} className="gearmesh-splash__item-img" />
                  <span className="gearmesh-splash__item-cat">{item.category}</span>
                  <span className="gearmesh-splash__item-dist">
                    <MapPin size={11} /> {item.distanceKm} km
                  </span>
                </div>
                <div className="gearmesh-splash__item-body">
                  <div className="gearmesh-splash__item-row-top">
                    <span className="gearmesh-splash__item-rating">
                      <Star size={12} fill="#F59E0B" color="#F59E0B" /> {item.rating} ({item.reviewCount})
                    </span>
                    <span className="gearmesh-splash__item-carbon">🌿 -{item.carbonSavingsKg}kg CO₂</span>
                  </div>
                  <h3 className="gearmesh-splash__item-title">{item.title}</h3>
                  <div className="gearmesh-splash__item-footer">
                    <div className="gearmesh-splash__item-price">
                      <span className="gearmesh-splash__item-price-val">₹{item.pricePerDay}</span>
                      <span className="gearmesh-splash__item-price-unit">/day</span>
                    </div>
                    <button
                      type="button"
                      className="gearmesh-splash__item-borrow-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectItem) onSelectItem(item);
                        else onGetStarted();
                      }}
                    >
                      Borrow
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          DESKTOP HOW IT WORKS (>= 768px, SCROLLABLE)
          ======================================================== */}
      <section id="how-it-works" className="gearmesh-splash__desktop-section gearmesh-splash__section--accent">
        <div className="gearmesh-splash__section-inner">
          <div className="gearmesh-splash__section-center-header">
            <span className="gearmesh-splash__section-tag">EFFORTLESS & SECURE</span>
            <h2 className="gearmesh-splash__section-title">How GearMesh Works</h2>
            <p className="gearmesh-splash__section-subtitle">
              No awkward meetups or waiting on doorstep delivery. Everything flows through neighborhood smart lockers.
            </p>
          </div>

          <div className="gearmesh-splash__steps-grid">
            <div className="gearmesh-splash__step-card">
              <div className="gearmesh-splash__step-num">01</div>
              <div className="gearmesh-splash__step-icon-wrap">
                <Search size={24} />
              </div>
              <h3 className="gearmesh-splash__step-title">Find & Reserve</h3>
              <p className="gearmesh-splash__step-desc">
                Search verified gear in your neighborhood. Choose your rental dates and request instant booking.
              </p>
            </div>

            <div className="gearmesh-splash__step-card">
              <div className="gearmesh-splash__step-num">02</div>
              <div className="gearmesh-splash__step-icon-wrap">
                <Lock size={24} />
              </div>
              <h3 className="gearmesh-splash__step-title">24/7 Locker Pickup</h3>
              <p className="gearmesh-splash__step-desc">
                Receive an encrypted PIN code to unlock your neighborhood smart locker anytime day or night.
              </p>
            </div>

            <div className="gearmesh-splash__step-card">
              <div className="gearmesh-splash__step-num">03</div>
              <div className="gearmesh-splash__step-icon-wrap">
                <Zap size={24} />
              </div>
              <h3 className="gearmesh-splash__step-title">Create & Enjoy</h3>
              <p className="gearmesh-splash__step-desc">
                Go on your trek, film your project, or build your DIY dream. All gear is protected with deposit coverage.
              </p>
            </div>

            <div className="gearmesh-splash__step-card">
              <div className="gearmesh-splash__step-num">04</div>
              <div className="gearmesh-splash__step-icon-wrap">
                <RefreshCw size={24} />
              </div>
              <h3 className="gearmesh-splash__step-title">Simple Locker Return</h3>
              <p className="gearmesh-splash__step-desc">
                Drop it back into the locker, snap a quick check-out photo, and your deposit is instantly released.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          DESKTOP SMART LOCKER SECTION (>= 768px, SCROLLABLE)
          ======================================================== */}
      <section id="smart-lockers" className="gearmesh-splash__desktop-section">
        <div className="gearmesh-splash__section-inner">
          <div className="gearmesh-splash__locker-banner">
            <div className="gearmesh-splash__locker-content">
              <div className="gearmesh-splash__hero-badge">
                <Shield size={14} /> Zero Contact • 100% Insured
              </div>
              <h2 className="gearmesh-splash__locker-title">
                Automated Smart Locker Hubs In Every Major Neighborhood
              </h2>
              <p className="gearmesh-splash__locker-text">
                GearMesh lockers are strategically located inside residential towers, community centers, transit hubs,
                and local cafes. Each locker features UV sanitation, automated weight verification, and 24/7 security monitoring.
              </p>
              <div className="gearmesh-splash__locker-features">
                <div className="gearmesh-splash__locker-feat-item">
                  <CheckCircle2 size={18} color="#2B5E45" /> 24/7 Contactless Access
                </div>
                <div className="gearmesh-splash__locker-feat-item">
                  <CheckCircle2 size={18} color="#2B5E45" /> Built-in UV Sanitization
                </div>
                <div className="gearmesh-splash__locker-feat-item">
                  <CheckCircle2 size={18} color="#2B5E45" /> Automated Inspection Cameras
                </div>
                <div className="gearmesh-splash__locker-feat-item">
                  <CheckCircle2 size={18} color="#2B5E45" /> Instant PIN Unlocking
                </div>
              </div>
              <div className="gearmesh-splash__locker-cta-row">
                <button
                  type="button"
                  className="gearmesh-splash__primary-cta-btn"
                  onClick={onGetStarted}
                >
                  Find Lockers Near Me <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          DESKTOP SUSTAINABILITY & IMPACT SECTION (>= 768px)
          ======================================================== */}
      <section id="sustainability" className="gearmesh-splash__desktop-section gearmesh-splash__section--accent">
        <div className="gearmesh-splash__section-inner">
          <div className="gearmesh-splash__impact-card">
            <div className="gearmesh-splash__impact-left">
              <span className="gearmesh-splash__section-tag">CIRCULAR ECONOMY</span>
              <h2 className="gearmesh-splash__section-title">The LifeKit Impact System</h2>
              <p className="gearmesh-splash__section-subtitle">
                Every item borrowed on GearMesh is tracked on our LifeKit circular ledger. You can see exact kilograms
                of e-waste prevented, trees saved, and money kept in your local neighborhood economy.
              </p>
              <div className="gearmesh-splash__impact-stats">
                <div className="gearmesh-splash__impact-stat">
                  <strong>₹4.2 Lakhs+</strong>
                  <span>Saved by community members</span>
                </div>
                <div className="gearmesh-splash__impact-stat">
                  <strong>8,420 kg</strong>
                  <span>CO₂ emissions offset</span>
                </div>
                <div className="gearmesh-splash__impact-stat">
                  <strong>1,840 kg</strong>
                  <span>Raw materials kept in circulation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          DESKTOP FINAL CALL TO ACTION (>= 768px)
          ======================================================== */}
      <section className="gearmesh-splash__desktop-cta-section">
        <div className="gearmesh-splash__cta-card">
          <h2 className="gearmesh-splash__cta-title">Ready to unlock your neighborhood?</h2>
          <p className="gearmesh-splash__cta-desc">
            Join thousands of neighbors borrowing tools, cameras, and outdoor gear without the expense of ownership.
          </p>
          <div className="gearmesh-splash__cta-buttons">
            <button
              type="button"
              className="gearmesh-splash__cta-main-btn"
              onClick={onGetStarted}
            >
              Get Started Now <ArrowRight size={16} />
            </button>
            {onLoginClick && (
              <button
                type="button"
                className="gearmesh-splash__cta-secondary-btn"
                onClick={onLoginClick}
              >
                Sign In to Account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          DESKTOP FOOTER (>= 768px)
          ======================================================== */}
      <footer className="gearmesh-splash__desktop-footer">
        <div className="gearmesh-splash__footer-inner">
          <div className="gearmesh-splash__footer-brand">
            <div className="gearmesh-splash__top-logo-row">
              <img src="/leaf.svg" alt="GearMesh" className="gearmesh-splash__top-leaf" />
              <span className="gearmesh-splash__top-title">GearMesh</span>
            </div>
            <p className="gearmesh-splash__footer-tagline">
              Things move. People connect. A greener tomorrow.
            </p>
            <span className="gearmesh-splash__footer-copy">© 2026 GearMesh Technologies Inc. All rights reserved.</span>
          </div>

          <div className="gearmesh-splash__footer-col">
            <h4>Explore</h4>
            <a onClick={onGetStarted}>Camping & Hiking</a>
            <a onClick={onGetStarted}>Cameras & Drones</a>
            <a onClick={onGetStarted}>Tools & DIY</a>
            <a onClick={onGetStarted}>Sports & Cycles</a>
          </div>

          <div className="gearmesh-splash__footer-col">
            <h4>Lockers</h4>
            <a onClick={onGetStarted}>Locker Map</a>
            <a onClick={onGetStarted}>How Lockers Work</a>
            <a onClick={onGetStarted}>Host a Locker</a>
            <a onClick={onGetStarted}>Safety & Verification</a>
          </div>

          <div className="gearmesh-splash__footer-col">
            <h4>About</h4>
            <a onClick={onWhyGearMesh}>Why GearMesh?</a>
            <a onClick={onWhyGearMesh}>Sustainability Impact</a>
            <a onClick={onWhyGearMesh}>LifeKit Ledger</a>
            <a onClick={onWhyGearMesh}>Community Guidelines</a>
          </div>
        </div>
      </footer>

      {/* ========================================================
          MOBILE BOTTOM ACTION ZONE (< 768px only)
          ======================================================== */}
      <div className="gearmesh-splash__mobile-action-zone">
        <Button
          variant="capsule"
          fullWidth
          withArrow
          caption="Join a community that values access over ownership"
          onClick={onGetStarted}
        >
          Get Started
        </Button>

        {onLoginClick && (
          <div className="gearmesh-splash__login-prompt">
            <span>Already have an account?</span>
            <button type="button" className="gearmesh-splash__login-link" onClick={onLoginClick}>
              Sign In
            </button>
          </div>
        )}

        {onWhyGearMesh && (
          <button type="button" className="gearmesh-splash__why-link" onClick={onWhyGearMesh}>
            Why GearMesh?
          </button>
        )}
      </div>
    </div>
  );
};
