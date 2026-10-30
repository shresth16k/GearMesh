import React, { useState } from 'react';
import { mockTransactions } from '../../data/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Transaction } from '../../types';
import { ChevronRight, ArrowRight, Sprout } from 'lucide-react';
import './ActivityScreen.css';

interface ActivityScreenProps {
  onOpenLocker: (tx: Transaction) => void;
  onExploreClick: () => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({
  onOpenLocker,
  onExploreClick
}) => {
  const [activeTab, setActiveTab] = useState<'borrowing' | 'lending'>('borrowing');

  const transactions = mockTransactions.filter((t) => t.type === activeTab);

  return (
    <div className="gearmesh-activity">
      {/* Header */}
      <div className="gearmesh-activity__header">
        <h1 className="gearmesh-activity__title">My Activity</h1>

        {/* Segmented Tabs */}
        <div className="gearmesh-activity__tabs">
          <button
            className={`gearmesh-activity__tab ${activeTab === 'borrowing' ? 'gearmesh-activity__tab--active' : ''}`}
            onClick={() => setActiveTab('borrowing')}
          >
            Borrowing
          </button>
          <button
            className={`gearmesh-activity__tab ${activeTab === 'lending' ? 'gearmesh-activity__tab--active' : ''}`}
            onClick={() => setActiveTab('lending')}
          >
            Lending
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="gearmesh-activity__list">
        {transactions.length === 0 ? (
          <div className="gearmesh-activity__empty">
            <h3 className="gearmesh-activity__empty-title">Nothing here yet.</h3>
            <p className="gearmesh-activity__empty-desc">
              {activeTab === 'borrowing'
                ? 'Your next useful item might already be nearby in your community.'
                : 'Turn your unused equipment into new neighborhood adventures.'}
            </p>
            <button className="gearmesh-activity__empty-cta" onClick={onExploreClick}>
              Explore Items
            </button>
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="gearmesh-activity-card"
              onClick={() => {
                if (tx.status === 'approved' && tx.pickupMethod === 'locker') {
                  onOpenLocker(tx);
                }
              }}
            >
              <img src={tx.item.imageUrl} alt={tx.item.title} className="gearmesh-activity-card__img" />
              <div className="gearmesh-activity-card__info">
                <h3 className="gearmesh-activity-card__item-title">{tx.item.title}</h3>
                <div className="gearmesh-activity-card__badge-row">
                  <StatusBadge status={tx.status} />
                </div>
                <div className="gearmesh-activity-card__date-subtitle">
                  {tx.status === 'approved' && `Return by ${tx.endDate}`}
                  {tx.status === 'pending' && `Requested on ${tx.createdAt}`}
                  {tx.status === 'completed' && `Returned on ${tx.endDate}`}
                </div>
              </div>
              <ChevronRight size={18} className="gearmesh-activity-card__chevron" />
            </div>
          ))
        )}

        {/* Bottom Sustainability Plant Card (matching Screen 9) */}
        <div className="gearmesh-activity__savings-card">
          <div className="gearmesh-activity__savings-text">
            <span className="gearmesh-activity__savings-sub">You've saved</span>
            <span className="gearmesh-activity__savings-amount">₹1,200</span>
            <span className="gearmesh-activity__savings-co2">and reduced ~12 kg CO₂</span>
          </div>
          <div className="gearmesh-activity__savings-plant">
            <Sprout size={36} color="#527A5B" strokeWidth={1.8} />
          </div>
        </div>

        <div style={{ height: 90 }} />
      </div>
    </div>
  );
};
