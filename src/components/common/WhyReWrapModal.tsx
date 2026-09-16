import React from 'react';
import { DollarSign, Users, RefreshCw, Sparkles, X } from 'lucide-react';
import './WhyReWrapModal.css';

interface WhyReWrapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyReWrapModal: React.FC<WhyReWrapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="rewrap-why-modal-overlay" onClick={onClose}>
      <div className="rewrap-why-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rewrap-why-modal__header">
          <div className="rewrap-why-modal__brand">
            <img src="/leaf.svg" alt="Leaf" className="rewrap-why-modal__leaf" />
            <h2 className="rewrap-why-modal__title">Why ReWrap?</h2>
          </div>
          <button className="rewrap-why-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="rewrap-why-modal__body">
          <div className="rewrap-why-item">
            <div className="rewrap-why-item__icon">
              <DollarSign size={18} />
            </div>
            <div className="rewrap-why-item__content">
              <h4>Save Money</h4>
              <p>Access what you need, when you need it.</p>
            </div>
          </div>

          <div className="rewrap-why-item">
            <div className="rewrap-why-item__icon">
              <Users size={18} />
            </div>
            <div className="rewrap-why-item__content">
              <h4>Build Community</h4>
              <p>Meet people around you.</p>
            </div>
          </div>

          <div className="rewrap-why-item">
            <div className="rewrap-why-item__icon">
              <RefreshCw size={18} />
            </div>
            <div className="rewrap-why-item__content">
              <h4>Reduce Waste</h4>
              <p>Give things a longer life.</p>
            </div>
          </div>

          <div className="rewrap-why-item">
            <div className="rewrap-why-item__icon">
              <Sparkles size={18} />
            </div>
            <div className="rewrap-why-item__content">
              <h4>Live Fuller</h4>
              <p>More experiences, less ownership.</p>
            </div>
          </div>
        </div>

        <div className="rewrap-why-modal__quote">
          <span>“A city that shares is a city that cares.”</span>
        </div>
      </div>
    </div>
  );
};
