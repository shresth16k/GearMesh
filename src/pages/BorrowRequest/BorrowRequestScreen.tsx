import React, { useState } from 'react';
import { Item, Transaction } from '../../types';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Calendar, ShieldCheck, Box, Users, Clock } from 'lucide-react';
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
  const [startDate, setStartDate] = useState('2026-09-18');
  const [endDate, setEndDate] = useState('2026-09-20');
  const [pickupMethod, setPickupMethod] = useState<'locker' | 'person'>('locker');
  const [message, setMessage] = useState('Hi! Planning a short Himalayan getaway this weekend. Looking forward to borrowing your gear!');

  // Calculate days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(1, end.getTime() - start.getTime());
  const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const itemTotal = durationDays * item.pricePerDay;
  const platformFee = 40; // minimal trust & insurance fee
  const totalCost = itemTotal + platformFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRequest({
      itemId: item.id,
      item,
      startDate: '18 Sept 2026',
      endDate: '20 Sept 2026',
      durationDays,
      totalCost,
      status: 'approved', // for prototype flow, instant approval to demo smart locker
      pickupMethod,
      lockerNumber: 'Locker A-12',
      lockerCode: '4827',
      lockerValidUntil: '20 Sept, 8:00 PM'
    });
  };

  return (
    <div className="rewrap-borrow-request">
      <div className="rewrap-borrow-request__header">
        <button className="rewrap-borrow-request__back-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <h2 className="rewrap-borrow-request__header-title">Borrow Request</h2>
        <div style={{ width: 36 }} />
      </div>

      <form className="rewrap-borrow-request__body" onSubmit={handleSubmit}>
        {/* Item Preview Card */}
        <div className="rewrap-borrow-item-preview">
          <img src={item.imageUrl} alt={item.title} className="rewrap-borrow-item-preview__img" />
          <div className="rewrap-borrow-item-preview__info">
            <span className="rewrap-borrow-item-preview__cat">{item.category}</span>
            <h4 className="rewrap-borrow-item-preview__title">{item.title}</h4>
            <div className="rewrap-borrow-item-preview__rate">
              ₹{item.pricePerDay} <span className="rewrap-borrow-item-preview__unit">/ day</span>
            </div>
          </div>
        </div>

        {/* Dates Selection */}
        <div className="rewrap-borrow-section">
          <label className="rewrap-borrow-label">Select Rental Duration</label>
          <div className="rewrap-borrow-dates-row">
            <div className="rewrap-borrow-date-input">
              <span className="rewrap-borrow-date-sub">Borrow Date</span>
              <div className="rewrap-borrow-date-field">
                <Calendar size={16} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="rewrap-borrow-date-input">
              <span className="rewrap-borrow-date-sub">Return Date</span>
              <div className="rewrap-borrow-date-field">
                <Calendar size={16} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="rewrap-borrow-duration-pill">
            <Clock size={14} color="var(--color-primary-forest)" />
            <span>Total Duration: <strong>{durationDays} {durationDays === 1 ? 'day' : 'days'}</strong></span>
          </div>
        </div>

        {/* Pickup Method */}
        <div className="rewrap-borrow-section">
          <label className="rewrap-borrow-label">Choose Pickup Method</label>
          <div className="rewrap-borrow-pickup-grid">
            <div
              className={`rewrap-borrow-pickup-card ${pickupMethod === 'locker' ? 'rewrap-borrow-pickup-card--active' : ''}`}
              onClick={() => setPickupMethod('locker')}
            >
              <div className="rewrap-borrow-pickup-icon">
                <Box size={20} />
              </div>
              <div className="rewrap-borrow-pickup-title">Smart Locker</div>
              <div className="rewrap-borrow-pickup-desc">Contactless 24/7 PIN pickup at nearby Hub</div>
            </div>

            <div
              className={`rewrap-borrow-pickup-card ${pickupMethod === 'person' ? 'rewrap-borrow-pickup-card--active' : ''}`}
              onClick={() => setPickupMethod('person')}
            >
              <div className="rewrap-borrow-pickup-icon">
                <Users size={20} />
              </div>
              <div className="rewrap-borrow-pickup-title">Meet in Person</div>
              <div className="rewrap-borrow-pickup-desc">Meet owner locally in Dehradun</div>
            </div>
          </div>
        </div>

        {/* Message to Owner */}
        <div className="rewrap-borrow-section">
          <label className="rewrap-borrow-label">Note for {item.owner.name.split(' ')[0]}</label>
          <textarea
            className="rewrap-borrow-textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell the owner why you need the item and coordinate pickup details..."
          />
        </div>

        {/* Estimated Cost Breakdown */}
        <div className="rewrap-borrow-cost-card">
          <h4 className="rewrap-borrow-cost-title">Cost Estimation</h4>
          <div className="rewrap-borrow-cost-row">
            <span>₹{item.pricePerDay} × {durationDays} days</span>
            <span>₹{itemTotal}</span>
          </div>
          <div className="rewrap-borrow-cost-row">
            <span>ReWrap Community & Guarantee Care</span>
            <span>₹{platformFee}</span>
          </div>
          <hr className="rewrap-borrow-cost-hr" />
          <div className="rewrap-borrow-cost-row rewrap-borrow-cost-row--total">
            <span>Total Estimated</span>
            <span>₹{totalCost}</span>
          </div>
          <div className="rewrap-borrow-cost-note">
            <ShieldCheck size={14} color="var(--color-success)" />
            <span>Protected by ReWrap Community Replacement Guarantee</span>
          </div>
        </div>

        {/* Submit */}
        <div className="rewrap-borrow-submit-wrap">
          <Button variant="capsule" fullWidth withArrow type="submit">
            Send Borrow Request
          </Button>
        </div>
      </form>
    </div>
  );
};
