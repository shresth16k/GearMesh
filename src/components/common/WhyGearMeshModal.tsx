import React from 'react';
import { DollarSign, Users, RefreshCw, Sparkles, X } from 'lucide-react';
import './WhyGearMeshModal.css';

interface WhyGearMeshModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyGearMeshModal: React.FC<WhyGearMeshModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="gearmesh-why-modal-overlay" onClick={onClose}>
      <div className="gearmesh-why-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gearmesh-why-modal__header">
          <div className="gearmesh-why-modal__brand">
            <img src="/leaf.svg" alt="Leaf" className="gearmesh-why-modal__leaf" />
            <h2 className="gearmesh-why-modal__title">Why GearMesh?</h2>
          </div>
          <button className="gearmesh-why-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="gearmesh-why-modal__body">
          <div className="gearmesh-why-item">
            <div className="gearmesh-why-item__icon">
              <DollarSign size={18} />
            </div>
            <div className="gearmesh-why-item__content">
              <h4>Save Money</h4>
              <p>Access what you need, when you need it.</p>
            </div>
          </div>

          <div className="gearmesh-why-item">
            <div className="gearmesh-why-item__icon">
              <Users size={18} />
            </div>
            <div className="gearmesh-why-item__content">
              <h4>Build Community</h4>
              <p>Meet people around you.</p>
            </div>
          </div>

          <div className="gearmesh-why-item">
            <div className="gearmesh-why-item__icon">
              <RefreshCw size={18} />
            </div>
            <div className="gearmesh-why-item__content">
              <h4>Reduce Waste</h4>
              <p>Give physical things a longer life.</p>
            </div>
          </div>

          <div className="gearmesh-why-item">
            <div className="gearmesh-why-item__icon">
              <Sparkles size={18} />
            </div>
            <div className="gearmesh-why-item__content">
              <h4>Live Fuller</h4>
              <p>More experiences, less ownership and clutter.</p>
            </div>
          </div>
        </div>

        <div className="gearmesh-why-modal__quote">
          <span>“A community that shares is a community that thrives.”</span>
        </div>
      </div>
    </div>
  );
};

