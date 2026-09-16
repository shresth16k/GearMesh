import React from 'react';
import { Button } from '../../components/common/Button';
import './SplashScreen.css';

interface SplashScreenProps {
  onGetStarted: () => void;
  onLoginClick?: () => void;
  onWhyReWrap?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted, onLoginClick, onWhyReWrap }) => {
  return (
    <div className="rewrap-splash-screen">
      {/* Top Brand Header */}
      <div className="rewrap-splash__top-header">
        <div className="rewrap-splash__top-logo-row">
          <img src="/leaf.svg" alt="ReWrap" className="rewrap-splash__top-leaf" />
          <span className="rewrap-splash__top-title">ReWrap</span>
        </div>
        <span className="rewrap-splash__top-tagline">Borrow. Share. Belong.</span>
      </div>

      {/* Visual Photography Container */}
      <div className="rewrap-splash__image-container">
        <img
          src="/firstscreenimage.png"
          alt="ReWrap - Things move. People connect. A greener tomorrow."
          className="rewrap-splash__hero-img"
        />
      </div>

      {/* Carousel Dots */}
      <div className="rewrap-splash__dots">
        <span className="rewrap-splash__dot rewrap-splash__dot--active" />
        <span className="rewrap-splash__dot" />
        <span className="rewrap-splash__dot" />
        <span className="rewrap-splash__dot" />
      </div>

      {/* Action Zone featuring the capsule button analyzed from user's image */}
      <div className="rewrap-splash__action-zone">
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
          <div className="rewrap-splash__login-prompt">
            <span>Already have an account?</span>
            <button type="button" className="rewrap-splash__login-link" onClick={onLoginClick}>
              Sign In
            </button>
          </div>
        )}

        {onWhyReWrap && (
          <button type="button" className="rewrap-splash__why-link" onClick={onWhyReWrap}>
            Why ReWrap?
          </button>
        )}
      </div>
    </div>
  );
};
