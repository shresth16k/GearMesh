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
    <div className="rewrap-onboarding">
      <div className="rewrap-onboarding__top-bar">
        <div className="rewrap-onboarding__brand">
          <img src="/leaf.svg" alt="ReWrap" className="rewrap-onboarding__logo" />
          <span className="rewrap-onboarding__brand-text">ReWrap</span>
        </div>
        {currentSlide < slides.length - 1 && (
          <button className="rewrap-onboarding__skip-btn" onClick={onSkip}>
            Skip
          </button>
        )}
      </div>

      <div className="rewrap-onboarding__image-wrap">
        <img
          src={slide.image}
          alt={slide.title}
          className="rewrap-onboarding__image"
          key={slide.image}
        />
        <div className="rewrap-onboarding__gradient" />
      </div>

      <div className="rewrap-onboarding__content">
        <span className="rewrap-onboarding__tag">{slide.tag}</span>
        <h2 className="rewrap-onboarding__title">{slide.title}</h2>
        <p className="rewrap-onboarding__desc">{slide.description}</p>

        <div className="rewrap-onboarding__dots">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`rewrap-onboarding__dot ${idx === currentSlide ? 'rewrap-onboarding__dot--active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>

        <div className="rewrap-onboarding__actions">
          <Button
            variant="capsule"
            fullWidth
            withArrow
            onClick={handleNext}
          >
            {currentSlide === slides.length - 1 ? 'Enter ReWrap' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};
