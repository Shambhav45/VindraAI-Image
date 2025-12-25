
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  User,
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { UserProfile, GeneratedImage, PaymentRecord } from '../types';
import { INITIAL_FREE_CREDITS, ADMIN_EMAIL, ADMIN_INITIAL_CREDITS } from '../constants';

// Safely access environment variables with optional chaining to prevent top-level crash
const env = (import.meta as any)?.env || {};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

// Only initialize if we have at least an API key to avoid Firebase internal error crashes
const isConfigValid = !!firebaseConfig.apiKey;

let app;
let auth: any;
let db: any;
const googleProvider = new GoogleAuthProvider();

if (isConfigValid) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db, googleProvider };

// User Management
export const syncUserToFirestore = async (user: User) => {
  if (!db) return null;
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const isAdmin = user.email === ADMIN_EMAIL;
    const initialCredits = isAdmin ? ADMIN_INITIAL_CREDITS : INITIAL_FREE_CREDITS;

    const newUser: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      credits: initialCredits,
      role: isAdmin ? 'admin' : 'user',
      tier: isAdmin ? 'paid' : 'free',
      createdAt: Date.now()
    };
    await setDoc(userRef, newUser);
    return newUser;
  } else {
    return userSnap.data() as UserProfile;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) return null;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const deductCredits = async (uid: string, amount: number) => {
  if (!db) return;
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    credits: increment(-amount)
  });
};

export const addCredits = async (uid: string, amount: number) => {
  if (!db) return;
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    credits: increment(amount),
    tier: 'paid'
  });
};

// Image Management
export const saveImageToHistory = async (image: Omit<GeneratedImage, 'id'>) => {
  if (!db) return;
  const colRef = collection(db, 'images');
  await addDoc(colRef, image);
};

export const getPublicFeed = async () => {
  if (!db) return [];
  try {
    const q = query(
      collection(db, 'images'),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc'),
      limit(12)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Record<string, any>) } as GeneratedImage));
  } catch (error) {
    console.error("Error fetching feed:", error);
    return [];
  }
};

export const toggleLikeImage = async (imageId: string, userId: string) => {
  if (!db) return;
  const imgRef = doc(db, 'images', imageId);
  await updateDoc(imgRef, {
    likes: increment(1)
  });
};

export const getUserHistory = async (uid: string) => {
  if (!db) return [];
  const q = query(
    collection(db, 'images'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Record<string, any>) } as GeneratedImage));
};

export const getAllImagesAdmin = async () => {
  if (!db) return [];
  const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Record<string, any>) } as GeneratedImage));
};

export const deleteImage = async (imageId: string) => {
  if (!db) return;
  await updateDoc(doc(db, 'images', imageId), {
    isPublic: false
  });
};

// Payments
export const recordPayment = async (payment: Omit<PaymentRecord, 'id'>) => {
  if (!db) return;
  await addDoc(collection(db, 'payments'), payment);
  await addCredits(payment.userId, payment.creditsAdded);
};

// Contact
export const sendContactMessage = async (name: string, email: string, message: string) => {
  if (!db) return;
  await addDoc(collection(db, 'contactMessages'), {
    name, email, message, createdAt: Date.now()
  });
};
