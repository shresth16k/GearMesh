import React, { useState } from 'react';
import { mockTransactions } from '../../data/mockData';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Transaction } from '../../types';
import { Box, User, Calendar, ArrowRight } from 'lucide-react';
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
        <h1 className="rewrap-activity__title">Activity</h1>
        <p className="rewrap-activity__subtitle">Track your shared and borrowed items</p>

        {/* Segmented Control */}
        <div className="rewrap-activity__tabs">
          <button
            className={`rewrap-activity__tab ${activeTab === 'borrowing' ? 'rewrap-activity__tab--active' : ''}`}
            onClick={() => setActiveTab('borrowing')}
          >
            Borrowing ({mockTransactions.filter((t) => t.type === 'borrowing').length})
          </button>
          <button
            className={`rewrap-activity__tab ${activeTab === 'lending' ? 'rewrap-activity__tab--active' : ''}`}
            onClick={() => setActiveTab('lending')}
          >
            Lending ({mockTransactions.filter((t) => t.type === 'lending').length})
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
            <div key={tx.id} className="rewrap-activity-card">
              <div className="rewrap-activity-card__top">
                <img src={tx.item.imageUrl} alt={tx.item.title} className="rewrap-activity-card__img" />
                <div className="rewrap-activity-card__info">
                  <div className="rewrap-activity-card__status-row">
                    <StatusBadge status={tx.status} />
                    <span className="rewrap-activity-card__cost">₹{tx.totalCost}</span>
                  </div>
                  <h3 className="rewrap-activity-card__item-title">{tx.item.title}</h3>
                  <div className="rewrap-activity-card__dates">
                    <Calendar size={13} />
                    <span>{tx.startDate} — {tx.endDate}</span>
                  </div>
                </div>
              </div>

              <div className="rewrap-activity-card__bottom">
                <div className="rewrap-activity-card__pickup-method">
                  {tx.pickupMethod === 'locker' ? (
                    <>
                      <Box size={14} color="var(--color-primary-forest)" />
                      <span>{tx.lockerNumber || 'Smart Locker'}</span>
                    </>
                  ) : (
                    <>
                      <User size={14} color="var(--color-primary-forest)" />
                      <span>Meet in Person ({tx.item.owner.name.split(' ')[0]})</span>
                    </>
                  )}
                </div>

                {tx.status === 'approved' && tx.pickupMethod === 'locker' && (
                  <button
                    className="rewrap-activity-card__action-btn"
                    onClick={() => onOpenLocker(tx)}
                  >
                    <span>View Locker PIN</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div style={{ height: 90 }} />
      </div>
    </div>
  );
};
