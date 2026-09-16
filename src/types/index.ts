export interface User {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  itemsBorrowed: number;
  itemsLent: number;
  impactSavedAmount: number; // in ₹
  impactKgKept: number; // in kg
}

export interface Item {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  location: string;
  imageUrl: string;
  isAvailable: boolean;
  description: string;
  features: string[];
  owner: User;
  carbonSavingsKg: number;
  materialSavingsKg: number;
  lat?: number;
  lng?: number;
}

export type TransactionStatus = 
  | 'pending'
  | 'approved'
  | 'active'
  | 'completed'
  | 'returned'
  | 'rejected';

export interface Transaction {
  id: string;
  itemId: string;
  item: Item;
  borrower: User;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalCost: number;
  status: TransactionStatus;
  type: 'borrowing' | 'lending';
  pickupMethod: 'locker' | 'person';
  lockerCode?: string;
  lockerNumber?: string;
  lockerValidUntil?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  count: number;
}

export interface LifeKitItem {
  id: string;
  name: string;
  pricePerDay: number;
  imageUrl: string;
  distanceKm: number;
  category: string;
}

export interface LifeKit {
  id: string;
  title: string;
  scenario: string;
  description: string;
  items: LifeKitItem[];
  totalPricePerDay: number;
}
