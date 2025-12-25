import { CreditPlan } from './types';

export const ADMIN_EMAIL = 'shambhavjha3@gmail.com';

export const CREDIT_COST_PER_IMAGE = 5;
export const INITIAL_FREE_CREDITS = 25;
export const ADMIN_INITIAL_CREDITS = 9999;

export const PLANS: CreditPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 50,
    price: 49,
    features: ['50 Credits', 'Standard Speed', 'No Ads on Generate', 'Email Support']
  },
  {
    id: 'growth',
    name: 'Growth',
    credits: 150,
    price: 129,
    features: ['150 Credits', 'Fast Generation', 'Priority Support', 'Public Profile'],
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 400,
    price: 299,
    features: ['400 Credits', 'Max Speed', 'Commercial License', 'Dedicated Support']
  }
];

export const IMAGE_STYLES = [
  { id: 'none', label: 'No Style' },
  { id: 'realistic', label: 'Realistic' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'anime', label: 'Anime' },
  { id: 'illustration', label: 'Illustration' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'oil_painting', label: 'Oil Painting' }
];
