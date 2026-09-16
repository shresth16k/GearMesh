import React, { useState } from 'react';
import { mockLifeKits } from '../../data/mockData';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Sparkles, MapPin, Check, Plus, RefreshCw } from 'lucide-react';
import { LifeKit } from '../../types';
import './LifeKitScreen.css';

interface LifeKitScreenProps {
  onBack: () => void;
  onKitBooked: (kit: LifeKit) => void;
}

export const LifeKitScreen: React.FC<LifeKitScreenProps> = ({ onBack, onKitBooked }) => {
  const [prompt, setPrompt] = useState('I’m going on a 3-day camping trip with 4 friends to Rishikesh.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeKit, setActiveKit] = useState<LifeKit>(mockLifeKits[0]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
    mockLifeKits[0].items.map((i) => i.id)
  );

  const toggleItem = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((item) => item !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      if (prompt.toLowerCase().includes('film') || prompt.toLowerCase().includes('video') || prompt.toLowerCase().includes('shoot')) {
        setActiveKit(mockLifeKits[1]);
        setSelectedItemIds(mockLifeKits[1].items.map((i) => i.id));
      } else {
        setActiveKit(mockLifeKits[0]);
        setSelectedItemIds(mockLifeKits[0].items.map((i) => i.id));
      }
      setIsGenerating(false);
    }, 600);
  };

  const activeItems = activeKit.items.filter((it) => selectedItemIds.includes(it.id));
  const currentTotalPerDay = activeItems.reduce((acc, it) => acc + it.pricePerDay, 0);

  return (
    <div className="rewrap-life-kit">
      {/* Header */}
      <div className="rewrap-life-kit__header">
        <button className="rewrap-life-kit__back-btn" onClick={onBack} aria-label="Back">
          <ArrowLeft size={20} />
        </button>
        <div className="rewrap-life-kit__header-badge">
          <Sparkles size={14} />
          <span>AI Concierge</span>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div className="rewrap-life-kit__body">
        <div className="rewrap-life-kit__intro">
          <h1 className="rewrap-life-kit__title">Smart Life Kit</h1>
          <p className="rewrap-life-kit__subtitle">
            Describe your upcoming plan or adventure. We bundle nearby community gear intelligently.
          </p>
        </div>

        {/* Input prompt box */}
        <form className="rewrap-life-kit__input-card" onSubmit={handleGenerate}>
          <div className="rewrap-life-kit__prompt-label">
            <span>What are you planning?</span>
          </div>
          <textarea
            className="rewrap-life-kit__textarea"
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 3-day camping trip with 4 friends..."
          />
          <div className="rewrap-life-kit__input-footer">
            <div className="rewrap-life-kit__suggestions">
              <span onClick={() => setPrompt('Weekend camping trip with 4 friends')}>🏕️ Camping</span>
              <span onClick={() => setPrompt('Short documentary video shoot with full camera setup')}>🎥 Video Shoot</span>
            </div>
            <button type="submit" className="rewrap-life-kit__generate-btn" disabled={isGenerating}>
              {isGenerating ? <RefreshCw size={14} className="rewrap-spin" /> : <Sparkles size={14} />}
              <span>{isGenerating ? 'Curating...' : 'Update Kit'}</span>
            </button>
          </div>
        </form>

        {/* Generated Kit Results */}
        <div className="rewrap-life-kit__results">
          <div className="rewrap-life-kit__results-header">
            <div>
              <span className="rewrap-life-kit__results-tag">HERE'S YOUR PERSONALIZED KIT</span>
              <h3 className="rewrap-life-kit__kit-name">{activeKit.title}</h3>
              <p className="rewrap-life-kit__kit-desc">{activeKit.description}</p>
            </div>
          </div>

          {/* Bundle Items List */}
          <div className="rewrap-life-kit__items-list">
            {activeKit.items.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`rewrap-kit-item-row ${isSelected ? 'rewrap-kit-item-row--selected' : ''}`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="rewrap-kit-item-row__check">
                    {isSelected ? <Check size={14} color="#FFFFFF" /> : <Plus size={14} />}
                  </div>

                  <img src={item.imageUrl} alt={item.name} className="rewrap-kit-item-row__img" />

                  <div className="rewrap-kit-item-row__details">
                    <span className="rewrap-kit-item-row__name">{item.name}</span>
                    <div className="rewrap-kit-item-row__meta">
                      <MapPin size={12} />
                      <span>{item.distanceKm} km away</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>

                  <div className="rewrap-kit-item-row__price">
                    <span className="rewrap-kit-item-row__amount">₹{item.pricePerDay}</span>
                    <span className="rewrap-kit-item-row__unit">/day</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Box */}
          <div className="rewrap-life-kit__total-card">
            <div className="rewrap-life-kit__total-info">
              <span className="rewrap-life-kit__total-label">
                Kit Total ({selectedItemIds.length} items selected)
              </span>
              <div className="rewrap-life-kit__total-price">
                <span className="rewrap-life-kit__total-currency">₹</span>
                <span className="rewrap-life-kit__total-number">{currentTotalPerDay}</span>
                <span className="rewrap-life-kit__total-period">/ day</span>
              </div>
            </div>
            <Button
              variant="capsule"
              withArrow
              disabled={selectedItemIds.length === 0}
              onClick={() => onKitBooked(activeKit)}
            >
              Add All to Kit ({selectedItemIds.length})
            </Button>
          </div>
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
};
