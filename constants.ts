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
    features: ['50 Credits', 'Remove Watermark', 'Standard Speed', 'Email Support']
  },
  {
    id: 'growth',
    name: 'Growth',
    credits: 150,
    price: 129,
    features: ['150 Credits', 'Remove Watermark', 'Fast Generation', 'Priority Support'],
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 400,
    price: 299,
    features: ['400 Credits', 'Remove Watermark', 'Max Speed', 'Commercial License']
  }
];

export const IMAGE_STYLES = [
  { id: 'none', label: 'No Style' },
  { id: 'realistic', label: 'Realistic' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'anime', label: 'Anime' },
  { id: 'illustration', label: 'Illustration' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'oil_painting', label: 'Oil Painting' },
  { id: '3d_render', label: '3D Render' }
];

export const PROMPT_PRESETS = [
  { id: 'social', label: 'Instagram', suffix: ', aesthetic, trendy, square ratio, high detail, social media style' },
  { id: 'youtube', label: 'Thumbnail', suffix: ', high contrast, catchy, vibrant colors, 4k, detailed, face focus' },
  { id: 'wallpaper', label: 'Wallpaper', suffix: ', wide angle, 8k resolution, atmospheric, cinematic lighting, masterpiece' },
  { id: 'logo', label: 'Logo', suffix: ', vector art, minimal, simple, flat design, icon, white background' }
];
