import React, { useState } from 'react';
import { Item, Transaction } from '../../types';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Calendar, CheckCircle2, Circle } from 'lucide-react';
import './BorrowRequestScreen.css';

interface BorrowRequestScreenProps {
  item: Item;
  onBack: () => void;
  onSubmitRequest: (request: Partial<Transaction>) => void;
}

export const BorrowRequestScreen: React.FC<BorrowRequestScreenProps> = ({
  item,
  onBack,
  onSubmitRequest
}) => {
  const [startDate, setStartDate] = useState('16 Sept 2024');
  const [endDate, setEndDate] = useState('18 Sept 2024');
  const [pickupMethod, setPickupMethod] = useState<'person' | 'locker'>('person');
  const [message, setMessage] = useState(
    "Hi! I'd like to borrow this for a camping trip. Looking forward to your approval!"
  );

  const durationDays = 2;
  const estimatedCost = durationDays * item.pricePerDay;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRequest({
      itemId: item.id,
      item,
      startDate,
      endDate,
      durationDays,
      totalCost: estimatedCost,
      status: 'approved',
      pickupMethod: pickupMethod,
      lockerNumber: 'Locker A-12',
      lockerCode: '4827',
      lockerValidUntil: '18 Sept 2024, 8:00 PM'
    });
  };

  return (
    <div className="rewrap-borrow-request">
      {/* Top Bar */}
      <div className="rewrap-borrow-request__header">
        <button className="rewrap-borrow-request__back-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h2 className="rewrap-borrow-request__header-title">Borrow Request</h2>
        <div style={{ width: 36 }} />
      </div>

      <form className="rewrap-borrow-request__body" onSubmit={handleSubmit}>
        {/* Item Preview matching Screen 7 */}
        <div className="rewrap-borrow-item-preview">
          <img src={item.imageUrl} alt={item.title} className="rewrap-borrow-item-preview__img" />
          <div className="rewrap-borrow-item-preview__info">
            <h4 className="rewrap-borrow-item-preview__title">{item.title}</h4>
            <div className="rewrap-borrow-item-preview__rate">
              ₹{item.pricePerDay} <span className="rewrap-borrow-item-preview__unit">/ day</span>
            </div>
          </div>
        </div>

        {/* Date Boxes */}
        <div className="rewrap-borrow-dates-grid">
          <div className="rewrap-borrow-date-box">
            <span className="rewrap-borrow-date-lbl">From</span>
            <div className="rewrap-borrow-date-val">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Calendar size={15} color="var(--color-muted-gray)" />
            </div>
          </div>

          <div className="rewrap-borrow-date-box">
            <span className="rewrap-borrow-date-lbl">To</span>
            <div className="rewrap-borrow-date-val">
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Calendar size={15} color="var(--color-muted-gray)" />
            </div>
          </div>
        </div>

        {/* Duration & Estimated Cost Pills */}
        <div className="rewrap-borrow-summary-row">
          <div className="rewrap-borrow-summary-box">
            <span className="rewrap-borrow-summary-lbl">Duration</span>
            <span className="rewrap-borrow-summary-val">{durationDays} Days</span>
          </div>

          <div className="rewrap-borrow-summary-box">
            <span className="rewrap-borrow-summary-lbl">Estimated Cost</span>
            <span className="rewrap-borrow-summary-val">₹{estimatedCost}</span>
          </div>
        </div>

        {/* Message to Owner */}
        <div className="rewrap-borrow-section">
          <label className="rewrap-borrow-label">Message to Owner</label>
          <textarea
            className="rewrap-borrow-textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Pickup Method Radios matching Screen 7 */}
        <div className="rewrap-borrow-section">
          <label className="rewrap-borrow-label">Pickup Method</label>
          <div className="rewrap-borrow-pickup-radios">
            <div
              className={`rewrap-borrow-radio-row ${pickupMethod === 'person' ? 'rewrap-borrow-radio-row--active' : ''}`}
              onClick={() => setPickupMethod('person')}
            >
              {pickupMethod === 'person' ? (
                <CheckCircle2 size={18} color="var(--color-primary-forest)" />
              ) : (
                <Circle size={18} color="var(--color-muted-gray)" />
              )}
              <div className="rewrap-borrow-radio-text">
                <span className="rewrap-borrow-radio-title">Meet in Person</span>
                <span className="rewrap-borrow-radio-sub">Direct handover</span>
              </div>
            </div>

            <div
              className={`rewrap-borrow-radio-row ${pickupMethod === 'locker' ? 'rewrap-borrow-radio-row--active' : ''}`}
              onClick={() => setPickupMethod('locker')}
            >
              {pickupMethod === 'locker' ? (
                <CheckCircle2 size={18} color="var(--color-primary-forest)" />
              ) : (
                <Circle size={18} color="var(--color-muted-gray)" />
              )}
              <div className="rewrap-borrow-radio-text">
                <span className="rewrap-borrow-radio-title">Smart Locker</span>
                <span className="rewrap-borrow-radio-sub">24/7 access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="rewrap-borrow-submit-wrap">
          <Button variant="primary" fullWidth size="lg" type="submit">
            Send Request
          </Button>
        </div>
      </form>
    </div>
  );
};
