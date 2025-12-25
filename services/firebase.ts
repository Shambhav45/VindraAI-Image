
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

const firebaseConfig = {
  // Use import.meta.env for Vite projects to ensure correct injection of build-time variables
  // Cast import.meta to any to resolve TS error: Property 'env' does not exist on type 'ImportMeta'
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID
};

// Defensive check: Firebase throws 'auth/invalid-api-key' if apiKey is undefined or "undefined"
if (!firebaseConfig.apiKey) {
  const errorMessage = "Vindra AI: Firebase API Key is missing. Check your VITE_FIREBASE_API_KEY environment variable.";
  console.error(errorMessage);
  // Cast import.meta to any to resolve TS error: Property 'env' does not exist on type 'ImportMeta'
  if ((import.meta as any).env.PROD) {
    throw new Error(errorMessage);
  }
}

// Singleton pattern for Firebase initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// User Management
export const syncUserToFirestore = async (user: User) => {
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
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

export const deductCredits = async (uid: string, amount: number) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    credits: increment(-amount)
  });
};

export const addCredits = async (uid: string, amount: number) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    credits: increment(amount),
    tier: 'paid'
  });
};

// Image Management
export const saveImageToHistory = async (image: Omit<GeneratedImage, 'id'>) => {
  const colRef = collection(db, 'images');
  await addDoc(colRef, image);
};

export const getPublicFeed = async () => {
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
  const imgRef = doc(db, 'images', imageId);
  await updateDoc(imgRef, {
    likes: increment(1)
  });
};

export const getUserHistory = async (uid: string) => {
  const q = query(
    collection(db, 'images'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Record<string, any>) } as GeneratedImage));
};

export const getAllImagesAdmin = async () => {
  const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Record<string, any>) } as GeneratedImage));
};

export const deleteImage = async (imageId: string) => {
    await updateDoc(doc(db, 'images', imageId), {
        isPublic: false
    });
};

// Payments
export const recordPayment = async (payment: Omit<PaymentRecord, 'id'>) => {
  await addDoc(collection(db, 'payments'), payment);
  await addCredits(payment.userId, payment.creditsAdded);
};

// Contact
export const sendContactMessage = async (name: string, email: string, message: string) => {
  await addDoc(collection(db, 'contactMessages'), {
    name, email, message, createdAt: Date.now()
  });
};