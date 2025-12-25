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

// Fixed Bottom Ad Component
const AdBanner = () => (
  <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-[100] h-[30px] md:h-[45px] flex justify-center items-center transition-colors duration-300">
    <div className="text-[10px] text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-800 px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 uppercase tracking-widest scale-90">
      Ad Space
      {/* In production, the AdSense script injects here */}
    </div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AppMode>(AppMode.EXPLORE);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Theme Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
    // Default is 'dark' via initial state
  }, []);

  // Theme Application
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await syncUserToFirestore(firebaseUser);
        setUser(profile);
      } else {
        setUser(null);
        setMode(AppMode.EXPLORE);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-inter transition-colors duration-300">
        <Navbar 
          user={user} 
          mode={mode} 
          setMode={setMode} 
          onOpenAuth={() => setIsAuthOpen(true)}
          theme={theme}
          toggleTheme={toggleTheme}
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
        
        {/* Fixed Ad Banner at bottom */}
        <div className="h-[30px] md:h-[45px]"></div> {/* Spacer */}
        <AdBanner />
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;