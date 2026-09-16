import React, { useState } from 'react';
import { Transaction } from '../../types';
import { Button } from '../../components/common/Button';
import { CheckCircle2, MapPin, KeyRound, Clock, ShieldCheck, Copy, Check, ArrowLeft } from 'lucide-react';
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
      <div className="rewrap-locker-approval__header">
        <button className="rewrap-locker-approval__back-btn" onClick={onDone} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <span className="rewrap-locker-approval__brand-pill">ReWrap Hub</span>
        <div style={{ width: 36 }} />
      </div>

      <div className="rewrap-locker-approval__body">
        {/* Success badge */}
        <div className="rewrap-locker-approval__badge-area">
          <div className="rewrap-locker-approval__check-circle">
            <CheckCircle2 size={32} color="var(--color-primary-forest)" />
          </div>
          <h1 className="rewrap-locker-approval__title">Request Approved!</h1>
          <p className="rewrap-locker-approval__subtitle">
            Your item is safely secured and ready for pickup.
          </p>
        </div>

        {/* Physical Smart Locker Visual representation */}
        <div className="rewrap-smart-locker">
          <div className="rewrap-smart-locker__unit">
            <div className="rewrap-smart-locker__header-bar">
              <div className="rewrap-smart-locker__led-group">
                <span className="rewrap-smart-locker__led rewrap-smart-locker__led--active" />
                <span className="rewrap-smart-locker__led-label">COMPARTMENT UNLOCKED FOR YOU</span>
              </div>
              <span className="rewrap-smart-locker__id-tag">{transaction.lockerNumber || 'Locker A-12'}</span>
            </div>

            <div className="rewrap-smart-locker__door">
              <div className="rewrap-smart-locker__door-handle" />
              <div className="rewrap-smart-locker__screen">
                <span className="rewrap-smart-locker__screen-title">ENTER 4-DIGIT PIN</span>
                <div className="rewrap-smart-locker__pin-boxes">
                  {pinDigits.map((digit, idx) => (
                    <div key={idx} className="rewrap-smart-locker__pin-box">
                      {digit}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rewrap-smart-locker__metal-mesh" />
          </div>

          {/* Copy PIN action */}
          <button className="rewrap-locker-copy-btn" onClick={handleCopy}>
            {copied ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
            <span>{copied ? 'PIN Copied to Clipboard' : 'Copy Access PIN (4827)'}</span>
          </button>
        </div>

        {/* Details Card */}
        <div className="rewrap-locker-info-card">
          <div className="rewrap-locker-info-row">
            <div className="rewrap-locker-info-icon">
              <MapPin size={16} />
            </div>
            <div className="rewrap-locker-info-text">
              <span className="rewrap-locker-info-label">Pickup Location</span>
              <span className="rewrap-locker-info-value">Rajpur Community Locker Hub (Station 2)</span>
              <span className="rewrap-locker-info-sub">0.4 km from your registered address</span>
            </div>
          </div>

          <div className="rewrap-locker-info-row">
            <div className="rewrap-locker-info-icon">
              <Clock size={16} />
            </div>
            <div className="rewrap-locker-info-text">
              <span className="rewrap-locker-info-label">Access Window</span>
              <span className="rewrap-locker-info-value">{transaction.lockerValidUntil || '18 Sept, 8:00 PM'}</span>
              <span className="rewrap-locker-info-sub">Contactless unlock available 24/7</span>
            </div>
          </div>

          <div className="rewrap-locker-info-row">
            <div className="rewrap-locker-info-icon">
              <ShieldCheck size={16} />
            </div>
            <div className="rewrap-locker-info-text">
              <span className="rewrap-locker-info-label">Security & Condition Check</span>
              <span className="rewrap-locker-info-sub">
                Take a quick verification snapshot in the app when opening the locker door.
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="rewrap-locker-actions">
          <Button variant="capsule" fullWidth onClick={onViewActivity}>
            View in My Activity
          </Button>
          <Button variant="secondary" fullWidth onClick={onDone}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
