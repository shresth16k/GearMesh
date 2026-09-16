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
    <div className="rewrap-activity">
      {/* Header */}
      <div className="rewrap-activity__header">
        <h1 className="rewrap-activity__title">My Activity</h1>

        {/* Segmented Tabs */}
        <div className="rewrap-activity__tabs">
          <button
            className={`rewrap-activity__tab ${activeTab === 'borrowing' ? 'rewrap-activity__tab--active' : ''}`}
            onClick={() => setActiveTab('borrowing')}
          >
            Borrowing
          </button>
          <button
            className={`rewrap-activity__tab ${activeTab === 'lending' ? 'rewrap-activity__tab--active' : ''}`}
            onClick={() => setActiveTab('lending')}
          >
            Lending
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="rewrap-activity__list">
        {transactions.length === 0 ? (
          <div className="rewrap-activity__empty">
            <h3 className="rewrap-activity__empty-title">Nothing here yet.</h3>
            <p className="rewrap-activity__empty-desc">
              {activeTab === 'borrowing'
                ? 'Your next useful item might already be nearby in your community.'
                : 'Turn your unused equipment into new neighborhood adventures.'}
            </p>
            <button className="rewrap-activity__empty-cta" onClick={onExploreClick}>
              Explore Items
            </button>
          </div>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="rewrap-activity-card"
              onClick={() => {
                if (tx.status === 'approved' && tx.pickupMethod === 'locker') {
                  onOpenLocker(tx);
                }
              }}
            >
              <img src={tx.item.imageUrl} alt={tx.item.title} className="rewrap-activity-card__img" />
              <div className="rewrap-activity-card__info">
                <h3 className="rewrap-activity-card__item-title">{tx.item.title}</h3>
                <div className="rewrap-activity-card__badge-row">
                  <StatusBadge status={tx.status} />
                </div>
                <div className="rewrap-activity-card__date-subtitle">
                  {tx.status === 'approved' && `Return by ${tx.endDate}`}
                  {tx.status === 'pending' && `Requested on ${tx.createdAt}`}
                  {tx.status === 'completed' && `Returned on ${tx.endDate}`}
                </div>
              </div>
              <ChevronRight size={18} className="rewrap-activity-card__chevron" />
            </div>
          ))
        )}

        {/* Bottom Sustainability Plant Card (matching Screen 9) */}
        <div className="rewrap-activity__savings-card">
          <div className="rewrap-activity__savings-text">
            <span className="rewrap-activity__savings-sub">You've saved</span>
            <span className="rewrap-activity__savings-amount">₹1,200</span>
            <span className="rewrap-activity__savings-co2">and reduced ~12 kg CO₂</span>
          </div>
          <div className="rewrap-activity__savings-plant">
            <Sprout size={36} color="#527A5B" strokeWidth={1.8} />
          </div>
        </div>

        <div style={{ height: 90 }} />
      </div>
    </div>
  );
};
