import React, { useState } from 'react';
import { setupIonicReact, IonApp } from '@ionic/react';
import { SplashScreen } from './pages/Splash/SplashScreen';
import { WhyReWrapModal } from './components/common/WhyReWrapModal';
import { OnboardingScreen } from './pages/Onboarding/OnboardingScreen';
import { AuthScreen } from './pages/Auth/AuthScreen';
import { HomeScreen } from './pages/Home/HomeScreen';
import { ExploreScreen } from './pages/Explore/ExploreScreen';
import { ItemDetailsScreen } from './pages/ItemDetails/ItemDetailsScreen';
import { BorrowRequestScreen } from './pages/BorrowRequest/BorrowRequestScreen';
import { LockerApprovalScreen } from './pages/LockerApproval/LockerApprovalScreen';
import { ActivityScreen } from './pages/Activity/ActivityScreen';
import { ListItemScreen } from './pages/ListItem/ListItemScreen';
import { ProfileScreen } from './pages/Profile/ProfileScreen';
import { LifeKitScreen } from './pages/LifeKit/LifeKitScreen';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { Item, Transaction, LifeKit } from './types';
import { mockItems, mockTransactions } from './data/mockData';

setupIonicReact({
  mode: 'ios'
});

export type ScreenId =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'explore'
  | 'itemDetails'
  | 'borrowRequest'
  | 'lockerApproval'
  | 'activity'
  | 'listItem'
  | 'profile'
  | 'lifeKit';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedItem, setSelectedItem] = useState<Item>(mockItems[0]);
  const [activeTransaction, setActiveTransaction] = useState<Transaction>(mockTransactions[0]);
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  // Tab navigation
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'explore') setCurrentScreen('explore');
    else if (tab === 'list') setCurrentScreen('listItem');
    else if (tab === 'activity') setCurrentScreen('activity');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

  const showBottomNav = ['home', 'explore', 'activity', 'profile'].includes(currentScreen);

  return (
    <IonApp>
      <div className="app-container">
        <div className="mobile-frame">
          {/* Splash Screen */}
          {currentScreen === 'splash' && (
            <SplashScreen
              onGetStarted={() => setCurrentScreen('onboarding')}
              onLoginClick={() => setCurrentScreen('auth')}
              onWhyReWrap={() => setShowWhyModal(true)}
            />
          )}

          {/* Onboarding */}
          {currentScreen === 'onboarding' && (
            <OnboardingScreen
              onComplete={() => setCurrentScreen('home')}
              onSkip={() => setCurrentScreen('home')}
            />
          )}

          {/* Auth */}
          {currentScreen === 'auth' && (
            <AuthScreen
              onSuccess={() => setCurrentScreen('home')}
              onBack={() => setCurrentScreen('splash')}
            />
          )}

          {/* Home */}
          {currentScreen === 'home' && (
            <HomeScreen
              onSelectItem={(item) => {
                setSelectedItem(item);
                setCurrentScreen('itemDetails');
              }}
              onExploreClick={() => {
                setActiveTab('explore');
                setCurrentScreen('explore');
              }}
              onOpenLifeKit={() => setCurrentScreen('lifeKit')}
              onProfileClick={() => {
                setActiveTab('profile');
                setCurrentScreen('profile');
              }}
            />
          )}

          {/* Explore */}
          {currentScreen === 'explore' && (
            <ExploreScreen
              onSelectItem={(item) => {
                setSelectedItem(item);
                setCurrentScreen('itemDetails');
              }}
            />
          )}

          {/* Item Details */}
          {currentScreen === 'itemDetails' && (
            <ItemDetailsScreen
              item={selectedItem}
              onBack={() => setCurrentScreen(activeTab === 'list' ? 'listItem' : (activeTab as ScreenId))}
              onRequestBorrow={(item) => {
                setSelectedItem(item);
                setCurrentScreen('borrowRequest');
              }}
            />
          )}

          {/* Borrow Request Form */}
          {currentScreen === 'borrowRequest' && (
            <BorrowRequestScreen
              item={selectedItem}
              onBack={() => setCurrentScreen('itemDetails')}
              onSubmitRequest={(req) => {
                const newTx: Transaction = {
                  id: `tx-${Date.now()}`,
                  itemId: selectedItem.id,
                  item: selectedItem,
                  borrower: mockTransactions[0].borrower,
                  startDate: req.startDate || '18 Sept 2026',
                  endDate: req.endDate || '20 Sept 2026',
                  durationDays: req.durationDays || 2,
                  totalCost: req.totalCost || selectedItem.pricePerDay * 2,
                  status: 'approved',
                  type: 'borrowing',
                  pickupMethod: req.pickupMethod || 'locker',
                  lockerNumber: 'Locker A-12',
                  lockerCode: '4827',
                  lockerValidUntil: '20 Sept, 8:00 PM',
                  createdAt: 'Today'
                };
                mockTransactions.unshift(newTx);
                setActiveTransaction(newTx);
                setCurrentScreen('lockerApproval');
              }}
            />
          )}

          {/* Locker Approval Confirmation */}
          {currentScreen === 'lockerApproval' && (
            <LockerApprovalScreen
              transaction={activeTransaction}
              onDone={() => {
                setActiveTab('home');
                setCurrentScreen('home');
              }}
              onViewActivity={() => {
                setActiveTab('activity');
                setCurrentScreen('activity');
              }}
            />
          )}

          {/* Activity */}
          {currentScreen === 'activity' && (
            <ActivityScreen
              onOpenLocker={(tx) => {
                setActiveTransaction(tx);
                setCurrentScreen('lockerApproval');
              }}
              onExploreClick={() => {
                setActiveTab('explore');
                setCurrentScreen('explore');
              }}
            />
          )}

          {/* List an Item */}
          {currentScreen === 'listItem' && (
            <ListItemScreen
              onPublishSuccess={(newItem) => {
                const fullItem: Item = {
                  id: `item-${Date.now()}`,
                  title: newItem.title || 'New Item',
                  category: newItem.category || 'camping',
                  pricePerDay: newItem.pricePerDay || 200,
                  rating: 5.0,
                  reviewCount: 1,
                  distanceKm: 0.1,
                  location: newItem.location || 'Rajpur Road',
                  imageUrl: newItem.imageUrl || 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
                  isAvailable: true,
                  description: newItem.description || '',
                  features: ['Community verified', 'Ready for pickup'],
                  carbonSavingsKg: 20,
                  materialSavingsKg: 5,
                  owner: mockTransactions[0].borrower
                };
                mockItems.unshift(fullItem);
                setSelectedItem(fullItem);
                setActiveTab('home');
                setCurrentScreen('home');
              }}
              onCancel={() => {
                setActiveTab('home');
                setCurrentScreen('home');
              }}
            />
          )}

          {/* Profile */}
          {currentScreen === 'profile' && (
            <ProfileScreen
              onLogout={() => setCurrentScreen('splash')}
              onNavigateActivity={() => {
                setActiveTab('activity');
                setCurrentScreen('activity');
              }}
              onNavigateList={() => {
                setActiveTab('list');
                setCurrentScreen('listItem');
              }}
            />
          )}

          {/* AI Life Kit */}
          {currentScreen === 'lifeKit' && (
            <LifeKitScreen
              onBack={() => setCurrentScreen('home')}
              onKitBooked={(kit: LifeKit) => {
                setSelectedItem(mockItems[1]);
                setCurrentScreen('borrowRequest');
              }}
            />
          )}

          {/* Persistent Bottom Navigation */}
          {showBottomNav && (
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
          )}

          {/* Why ReWrap Modal */}
          <WhyReWrapModal isOpen={showWhyModal} onClose={() => setShowWhyModal(false)} />
        </div>
      </div>
    </IonApp>
  );
};

export default App;
