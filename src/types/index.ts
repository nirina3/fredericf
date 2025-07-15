export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  bio?: string;
  avatar?: string;
  stripeCustomerId?: string;
  role: 'admin' | 'editor' | 'user';
  subscription: Subscription;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'cancelled' | 'trial';
  startDate: Date;
  endDate: Date;
  nextPayment?: Date;
  amount: number;
  currency: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: 'USD';
  interval: 'month' | 'year';
  features: string[];
  maxProjects: number;
  support: string;
  popular?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  author: string;
  authorId: string;
  publishedAt?: Date;
  status: 'draft' | 'published' | 'archived';
  categories: string[];
  tags: string[];
  featuredImage?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  tags: string[];
  uploadedAt: Date;
  uploadedBy: string;
  requiredPlan: 'basic' | 'premium' | 'pro';
}

export interface DirectoryEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  contact: {
    email: string;
    phone: string;
    website?: string;
    address: string;
    city: string;
    postalCode: string;
    region: string;
  };
  logo?: string;
  images: string[];
  verified: boolean;
  premium: boolean;
  rating: number;
  reviewCount: number;
  openingHours: {
    [key: string]: string;
  };
  specialties: string[];
  features: string[];
  priceRange: string;
  createdAt: Date;
  lastUpdated: Date;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  socialMedia?: {
    facebook: string;
    instagram: string;
    other: string;
  };
  mapsUrl?: string;
}

export interface Analytics {
  visitors: number;
  pageViews: number;
  subscriptions: number;
  revenue: number;
  conversionRate: number;
  period: 'day' | 'week' | 'month' | 'year';
}

export interface Reservation {
  id: string;
  friteryId: string;
  friteryName: string;
  userId: string;
  userName: string;
  userEmail: string;
  date: Date;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt?: Date;
}