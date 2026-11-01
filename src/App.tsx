import React, { useState } from 'react';
import { WhyGearMeshModal } from './components/common/WhyGearMeshModal';
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
import { AdminScreen } from './pages/Admin/AdminScreen';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { DesktopNav } from './components/common/DesktopNav';
import { Item, Transaction, LifeKit } from './types';
import { currentUser as defaultUser, mockItems, mockTransactions } from './data/mockData';


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
  | 'lifeKit'
  | 'admin';

export const App: React.FC = () => {
  // Screen width detection for mobile vs laptop/desktop differentiation
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      const mob = window.innerWidth < 768;
      setIsMobile(mob);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enforce mandatory login: check if a valid user session exists
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('gearmesh-user');
      return !!(stored && JSON.parse(stored)?.email);
    } catch {
      return false;
    }
  });

  // Track if first-time mobile user has seen the 4 welcoming screens
  const [hasSeenWelcoming, setHasSeenWelcoming] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gearmesh-mobile-welcomed') === 'true';
    } catch {
      return false;
    }
  });

  const [signedInUser, setSignedInUser] = useState(() => {
    try {
      const stored = localStorage.getItem('gearmesh-user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          const initials = parsed.name ? encodeURIComponent(parsed.name) : 'User';
          const defaultAvatar = `https://ui-avatars.com/api/?name=${initials}&background=1B3B2B&color=fff&bold=true`;
          return {
            ...defaultUser,
            ...parsed,
            name: parsed.name || parsed.email.split('@')[0],
            avatar: parsed.avatar || defaultAvatar,
            rating: parsed.rating !== undefined ? parsed.rating : 5.0,
            location: parsed.location || 'Rajpur Road, Dehradun'
          };
        }
      }
    } catch {}
    return { ...defaultUser, email: '' };
  });

  // Screen initialization:
  // - Check URL hash (#admin) or sessionStorage ('gearmesh-screen')
  // - If saved screen is 'admin', stay on 'admin' across page refreshes
  // - If authenticated: restore saved screen (or 'home')
  // - If on mobile AND first-time user: 'onboarding'
  // - If on laptop view: 'auth'
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '';
    const savedScreen = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('gearmesh-screen') as ScreenId) : null;

    if (hash === 'admin' || savedScreen === 'admin') {
      return 'admin';
    }

    try {
      const stored = localStorage.getItem('gearmesh-user');
      const isAuth = !!(stored && JSON.parse(stored)?.email);
      if (isAuth) {
        if (savedScreen && ['home', 'explore', 'activity', 'listItem', 'profile', 'lifeKit', 'admin'].includes(savedScreen)) {
          return savedScreen;
        }
        return 'home';
      }
    } catch {}

    const isMob = typeof window !== 'undefined' && window.innerWidth < 768;
    const welcomed = typeof localStorage !== 'undefined' && localStorage.getItem('gearmesh-mobile-welcomed') === 'true';
    if (isMob && !welcomed) {
      return 'onboarding';
    }
    return 'auth';
  });

  // Persist currentScreen in sessionStorage and sync #admin hash
  React.useEffect(() => {
    try {
      sessionStorage.setItem('gearmesh-screen', currentScreen);
      if (currentScreen === 'admin') {
        if (window.location.hash !== '#admin') {
          window.location.hash = 'admin';
        }
      } else if (window.location.hash === '#admin') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch {}
  }, [currentScreen]);

  // Sync hash changes with currentScreen
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash === 'admin' && currentScreen !== 'admin') {
        setCurrentScreen('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentScreen]);

  // Laptop view safeguard: if window expands or opens on desktop, never show onboarding
  React.useEffect(() => {
    if (!isMobile && currentScreen === 'onboarding') {
      setCurrentScreen(isAuthenticated ? 'home' : 'auth');
    }
  }, [isMobile, currentScreen, isAuthenticated]);

  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    const savedTab = typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('gearmesh-tab') as NavTab) : null;
    return savedTab || 'home';
  });
  const [selectedItem, setSelectedItem] = useState<Item>(mockItems[0]);
  const [activeTransaction, setActiveTransaction] = useState<Transaction>(mockTransactions[0]);
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  // When mobile user completes or skips the 4 welcoming screens
  const handleOnboardingComplete = () => {
    localStorage.setItem('gearmesh-mobile-welcomed', 'true');
    setHasSeenWelcoming(true);
    setCurrentScreen('auth');
  };

  // Tab navigation with authentication guard
  const handleTabChange = (tab: NavTab) => {
    if (!isAuthenticated) {
      setCurrentScreen('auth');
      return;
    }
    setActiveTab(tab);
    sessionStorage.setItem('gearmesh-tab', tab);
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'explore') setCurrentScreen('explore');
    else if (tab === 'list') setCurrentScreen('listItem');
    else if (tab === 'activity') setCurrentScreen('activity');
    else if (tab === 'profile') setCurrentScreen('profile');
  };

  // Only show navbars when authenticated and not on auth/admin/onboarding
  const showBottomNav = isAuthenticated && ['home', 'explore', 'activity', 'profile'].includes(currentScreen);
  const showDesktopNav = isAuthenticated && !['auth', 'admin', 'onboarding'].includes(currentScreen);

  return (
    <div className="gearmesh-root">
      <div className="app-container">
        {showDesktopNav && (
          <DesktopNav
            user={signedInUser}
            activeTab={currentScreen === 'lifeKit' ? 'lifeKit' : activeTab}
            onTabChange={handleTabChange}
            onOpenLifeKit={() => setCurrentScreen('lifeKit')}
            onProfileClick={() => {
              setActiveTab('profile');
              setCurrentScreen('profile');
            }}
            onListClick={() => {
              setActiveTab('list');
              setCurrentScreen('listItem');
            }}
            onAdminClick={() => setCurrentScreen('admin')}
          />
        )}
        <div className="mobile-frame">
          {/* Admin Operations Screen (Web Only) */}
          {currentScreen === 'admin' && (
            <AdminScreen
              onBackToApp={() => {
                sessionStorage.setItem('gearmesh-screen', isAuthenticated ? 'home' : 'auth');
                if (window.location.hash === '#admin') {
                  history.replaceState(null, '', window.location.pathname + window.location.search);
                }
                if (isAuthenticated) {
                  setActiveTab('home');
                  setCurrentScreen('home');
                } else {
                  setCurrentScreen('auth');
                }
              }}
            />
          )}

          {/* 1. Mobile First-Time Welcoming Screens (4 Welcoming Slides - Mobile View Only) */}
          {isMobile && !hasSeenWelcoming && !isAuthenticated && currentScreen === 'onboarding' && (
            <OnboardingScreen
              onComplete={handleOnboardingComplete}
              onSkip={handleOnboardingComplete}
            />
          )}

          {/* 2. Mandatory Auth Screen (Laptop view opens directly, Mobile opens after welcoming screens) */}
          {(!isAuthenticated || currentScreen === 'auth') && currentScreen !== 'admin' && (
            !(isMobile && !hasSeenWelcoming && currentScreen === 'onboarding') && (
              <AuthScreen
                onSuccess={(user) => {
                  const displayName = user.name || user.email.split('@')[0];
                  const initials = encodeURIComponent(displayName);
                  const defaultAvatar = `https://ui-avatars.com/api/?name=${initials}&background=1B3B2B&color=fff&bold=true`;
                  const fullUser = {
                    ...defaultUser,
                    ...user,
                    name: displayName,
                    avatar: (user as any).avatar || defaultAvatar,
                    rating: (user as any).rating !== undefined ? (user as any).rating : 5.0,
                    location: (user as any).location || 'Rajpur Road, Dehradun',
                    itemsBorrowed: (user as any).itemsBorrowed ?? 0,
                    itemsLent: (user as any).itemsLent ?? 0,
                    impactSavedAmount: (user as any).impactSavedAmount ?? 0,
                    impactKgKept: (user as any).impactKgKept ?? 0
                  };
                  setSignedInUser(fullUser);
                  localStorage.setItem('gearmesh-user', JSON.stringify(fullUser));
                  setIsAuthenticated(true);
                  setCurrentScreen('home');
                }}
                onAdminClick={() => setCurrentScreen('admin')}
              />
            )
          )}

          {/* Home */}
          {isAuthenticated && currentScreen === 'home' && (
            <HomeScreen
              user={signedInUser}
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
          {isAuthenticated && currentScreen === 'explore' && (
            <ExploreScreen
              onSelectItem={(item) => {
                setSelectedItem(item);
                setCurrentScreen('itemDetails');
              }}
            />
          )}

          {/* Item Details */}
          {isAuthenticated && currentScreen === 'itemDetails' && (
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
          {isAuthenticated && currentScreen === 'borrowRequest' && (
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
          {isAuthenticated && currentScreen === 'lockerApproval' && (
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
          {isAuthenticated && currentScreen === 'activity' && (
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
          {isAuthenticated && currentScreen === 'listItem' && (
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
          {isAuthenticated && currentScreen === 'profile' && (
            <ProfileScreen
              user={signedInUser}
              onLogout={() => {
                localStorage.removeItem('gearmesh-user');
                setIsAuthenticated(false);
                setSignedInUser({ ...defaultUser, email: '' });
                setCurrentScreen('auth');
              }}
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
          {isAuthenticated && currentScreen === 'lifeKit' && (
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

          {/* Why GearMesh Modal */}
          <WhyGearMeshModal isOpen={showWhyModal} onClose={() => setShowWhyModal(false)} />
        </div>
      </div>
    </div>
  );
};

export default App;
