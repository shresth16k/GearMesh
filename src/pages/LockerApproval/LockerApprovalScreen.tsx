import React, { useState } from 'react';
import { Transaction } from '../../types';
import { Button } from '../../components/common/Button';
import { Check, Copy, MapPin, Info, ChevronRight, CheckCircle } from 'lucide-react';
import './LockerApprovalScreen.css';

interface LockerApprovalScreenProps {
  transaction: Transaction;
  onDone: () => void;
  onViewActivity: () => void;
}

export const LockerApprovalScreen: React.FC<LockerApprovalScreenProps> = ({
  transaction,
  onDone,
  onViewActivity
}) => {
  const [copied, setCopied] = useState(false);

  const pinDigits = (transaction.lockerCode || '4827').split('');

  const handleCopy = () => {
    navigator.clipboard?.writeText(transaction.lockerCode || '4827');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rewrap-locker-approval">
      <div className="rewrap-locker-approval__body">
        {/* Checkmark and titles matching Screen 8 */}
        <div className="rewrap-locker-approval__badge-area">
          <div className="rewrap-locker-approval__check-circle">
            <Check size={28} color="#FFFFFF" strokeWidth={3} />
          </div>
          <h1 className="rewrap-locker-approval__title">Request Approved!</h1>
          <p className="rewrap-locker-approval__subtitle">
            Your item is ready for pickup.
          </p>
        </div>

        {/* Realistic Physical Locker Cabinet Graphic */}
        <div className="rewrap-locker-cabinet">
          <div className="rewrap-locker-cabinet__module">
            <div className="rewrap-locker-cabinet__door rewrap-locker-cabinet__door--top-left" />
            <div className="rewrap-locker-cabinet__door rewrap-locker-cabinet__door--top-right" />
            <div className="rewrap-locker-cabinet__door rewrap-locker-cabinet__door--active">
              <span className="rewrap-locker-cabinet__door-tag">A-12</span>
              <span className="rewrap-locker-cabinet__door-light" />
            </div>
            <div className="rewrap-locker-cabinet__door rewrap-locker-cabinet__door--bottom-right" />
          </div>
        </div>

        {/* Dark Smart Locker Access Container */}
        <div className="rewrap-locker-access-card">
          <div className="rewrap-locker-access-card__header">
            <span className="rewrap-locker-access-card__label">Smart Locker Access</span>
            <div className="rewrap-locker-access-card__id-pill">
              <span>A - 12</span>
              <small>Spot #12</small>
            </div>
          </div>

          <div className="rewrap-locker-access-card__pin-section">
            <div className="rewrap-locker-access-card__digits">
              {pinDigits.map((digit, idx) => (
                <div key={idx} className="rewrap-locker-access-card__digit-box">
                  {digit}
                </div>
              ))}
            </div>
            <button
              type="button"
              className="rewrap-locker-access-card__copy-btn"
              onClick={handleCopy}
              aria-label="Copy PIN"
            >
              {copied ? <Check size={18} color="#527A5B" /> : <Copy size={18} />}
            </button>
          </div>

          <div className="rewrap-locker-access-card__validity">
            Valid till {transaction.lockerValidUntil || '18 Sept 2024, 8:00 PM'}
          </div>

          <div className="rewrap-locker-access-card__links">
            <div className="rewrap-locker-access-link" onClick={onViewActivity}>
              <div className="rewrap-locker-access-link__left">
                <MapPin size={16} />
                <span>View on Map</span>
              </div>
              <ChevronRight size={16} />
            </div>

            <div className="rewrap-locker-access-link" onClick={onViewActivity}>
              <div className="rewrap-locker-access-link__left">
                <Info size={16} />
                <span>Instructions</span>
              </div>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>

        {/* Bottom "Got It" Button */}
        <div className="rewrap-locker-approval__actions">
          <Button variant="primary" fullWidth size="lg" onClick={onDone}>
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
};
