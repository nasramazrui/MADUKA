export type UserRole = 'CUSTOMER' | 'VENDOR' | 'DRIVER' | 'ADMIN';

export interface User {
  id: string;
  firebaseUid: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  businessType?: string;
  profilePhoto?: string;
  referralCode: string;
  referredBy?: string;
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  fcmToken?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  vendor?: Vendor;
  wallet?: Wallet;
  loyaltyPoints?: LoyaltyPoints;
  driver?: Driver;
}

export interface Driver {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  nidaNumber?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehiclePlate: string;
  vehicleYear: number;
  vehicleColor: string;
  vehicleSeats: number;
  offersTaxi: boolean;
  offersRental: boolean;
  isApproved: boolean;
  rejectedReason?: string;
  avgRating: number;
  isOnline: boolean;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description?: string;
  address: string;
  lat?: number;
  lng?: number;
  deliveryRadiusKm: number;
  businessHours?: any;
  tinNumber?: string;
  logoUrl?: string;
  coverUrl?: string;
  isApproved: boolean;
  isVerified: boolean;
  isWholesaler: boolean;
  commissionRate: number;
  payoutAccount?: any;
  avgRating: number;
  totalOrders: number;
  createdAt: string;
}

export interface Product {
  id: string;
  vendorId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  stockQty: number;
  isAvailable: boolean;
  images: string[];
  variants: any;
  tieredPricing?: any;
  minOrderQty?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

export interface LoyaltyPoints {
  id: string;
  userId: string;
  pointsBalance: number;
  updatedAt: string;
}

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED' | 'DISPUTED';

export interface Order {
  id: string;
  customerId: string;
  vendorId: string;
  driverId?: string;
  moduleType: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  deliveryAddress: any;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
