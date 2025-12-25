import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, syncUserToFirestore, getUserProfile } from './services/firebase';
import { UserProfile, AppMode } from './types';

// Components
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Pricing from './components/Pricing';
import History from './pages/History';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Legal from './pages/Legal';

// Global Ad Component
const AdBanner = () => (
  <div className="w-full bg-white border-t border-slate-200 py-4 flex justify-center items-center min-h-[100px] overflow-hidden">
    <div className="text-xs text-slate-400 border border-slate-200 border-dashed px-10 py-4 rounded">
      Google AdSense Space (100% compliant)
      {/* In production, the AdSense script from index.html injects here via <ins> tags */}
    </div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AppMode>(AppMode.EXPLORE);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync user ensures db doc exists and returns profile
        const profile = await syncUserToFirestore(firebaseUser);
        setUser(profile);
        // Listen for real-time credit updates in a real app, 
        // here we rely on page refreshes or action triggers to update local state lightly
        // For production, use onSnapshot on the user doc.
      } else {
        setUser(null);
        setMode(AppMode.EXPLORE); // Reset to explore on logout
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 font-inter">
        <Navbar 
          user={user} 
          mode={mode} 
          setMode={setMode} 
          onOpenAuth={() => setIsAuthOpen(true)} 
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <Home 
                user={user} 
                mode={mode} 
                onOpenAuth={() => setIsAuthOpen(true)} 
              />
            } />
            <Route path="/pricing" element={<Pricing user={user} onOpenAuth={() => setIsAuthOpen(true)} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/legal" element={<Legal />} />
            
            {/* Protected Routes */}
            <Route path="/history" element={
              user ? <History user={user} /> : <Navigate to="/" replace />
            } />
            <Route path="/admin" element={
              user?.role === 'admin' ? <Admin user={user} /> : <Navigate to="/" replace />
            } />
          </Routes>
        </main>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        
        {/* Ads do not show on login/signup (Modal is overlay), but stick to bottom of content pages */}
        <AdBanner />
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
