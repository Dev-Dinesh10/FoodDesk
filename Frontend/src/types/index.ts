/**
 * @file src/types/index.ts
 */

export type UserRole = 'counter_staff' | 'kitchen_manager' | 'vendor_owner';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  vendorId: string;
}

export type OrderStatus = 'incoming' | 'accepted' | 'preparing' | 'ready' | 'collected' | 'rejected';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  fulfilled: boolean;
}

export interface Order {
  id: string;
  tokenNumber: string;
  employeeName: string;
  items: OrderItem[];
  slotTime: string;
  status: OrderStatus;
  slaTimer: number;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  isSoldOut: boolean;
  quantity: number;
  imageUrl?: string;
  dietaryTags: string[];
  allergens: string[];
  mealWindows: string[];
}

export type VendorPlan = 'growth' | 'premium';

export interface Vendor {
  id: string;
  name: string;
  counterNumber: string;
  logoUrl?: string;
  plan: VendorPlan;
}

export interface DailyReport {
  date: string;
  totalOrders: number;
  collected: number;
  noShow: number;
  cancelled: number;
  netRevenue: number;
}
