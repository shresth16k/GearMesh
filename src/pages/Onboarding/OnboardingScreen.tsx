import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import './OnboardingScreen.css';

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    tag: 'LOCAL DISCOVERY',
    title: 'Borrow Experiences, Not Clutter.',
    description: 'Find camping gear, premium cameras, and power tools from people in your neighborhood without buying what you only need once.'
  },
  {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    tag: 'VERIFIED & SAFE',
    title: 'Seamless Access with Smart Lockers.',
    description: 'Pick up items anytime from secured contactless neighborhood lockers using one-time PIN codes, or meet verified community members.'
  },
  {
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    tag: 'SUSTAINABILITY',
    title: 'Same Things. New Stories.',
    description: 'Every shared tent, projector, and bicycle cuts material waste and nurtures a more connected, sustainable tomorrow.'
  },
  {
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    tag: 'AI LIFE KITS',
    title: 'Instant Adventure Gear Bundles.',
    description: 'Ask our smart AI concierge for weekend camping, photography shoots, or trekking setups and get all verified gear bundled in seconds.'
  }
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="gearmesh-onboarding">
      <div className="gearmesh-onboarding__top-bar">
        <div className="gearmesh-onboarding__brand">
          <img src="/leaf.svg" alt="GearMesh" className="gearmesh-onboarding__logo" />
          <span className="gearmesh-onboarding__brand-text">GearMesh</span>
        </div>
        {currentSlide < slides.length - 1 && (
          <button className="gearmesh-onboarding__skip-btn" onClick={onSkip}>
            Skip
          </button>
        )}
      </div>

      <div className="gearmesh-onboarding__image-wrap">
        <img
          src={slide.image}
          alt={slide.title}
          className="gearmesh-onboarding__image"
          key={slide.image}
        />
        <div className="gearmesh-onboarding__gradient" />
      </div>

      <div className="gearmesh-onboarding__content">
        <span className="gearmesh-onboarding__tag">{slide.tag}</span>
        <h2 className="gearmesh-onboarding__title">{slide.title}</h2>
        <p className="gearmesh-onboarding__desc">{slide.description}</p>

        <div className="gearmesh-onboarding__dots">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`gearmesh-onboarding__dot ${idx === currentSlide ? 'gearmesh-onboarding__dot--active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>

        <div className="gearmesh-onboarding__actions">
          <Button
            variant="capsule"
            fullWidth
            withArrow
            onClick={handleNext}
          >
            {currentSlide === slides.length - 1 ? 'Enter GearMesh' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};
