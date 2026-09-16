import React from 'react';
import { Button } from '../../components/common/Button';
import './SplashScreen.css';

interface SplashScreenProps {
  onGetStarted: () => void;
  onLoginClick?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted, onLoginClick }) => {
  return (
    <div className="rewrap-splash-screen">
      {/* Visual Photography Container */}
      <div className="rewrap-splash__image-container">
        <img
          src="/firstscreenimage.png"
          alt="ReWrap - Things move. People connect. A greener tomorrow."
          className="rewrap-splash__hero-img"
        />
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
      </div>
    </div>
  );
};
