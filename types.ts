export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  credits: number;
  role: 'user' | 'admin';
  tier: 'free' | 'paid';
  createdAt: number;
}

export interface GeneratedImage {
  id: string;
  userId: string;
  prompt: string;
  style?: string;
  imageUrl: string; // Base64 or URL
  createdAt: number;
  isPublic: boolean;
  likes: number;
  userEmail?: string; // For admin view
}

export interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  features: string[];
  popular?: boolean;
}

export enum AppMode {
  EXPLORE = 'explore',
  CREATE = 'create'
}

export interface PaymentRecord {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  creditsAdded: number;
  status: 'success' | 'pending' | 'failed';
  createdAt: number;
}
