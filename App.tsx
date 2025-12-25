
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, syncUserToFirestore } from './services/firebase';
import { UserProfile, AppMode } from './types';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    </div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>(AppMode.EXPLORE);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Theme Application
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const activeTheme = savedTheme || 'dark';
    setTheme(activeTheme);
    
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const profile = await syncUserToFirestore(firebaseUser);
          setUser(profile);
        } else {
          setUser(null);
          setMode(AppMode.EXPLORE);
        }
        setLoading(false);
      }, (err) => {
        console.error("Auth Subscription Error:", err);
        setError("Failed to connect to authentication server.");
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err: any) {
      console.error("Initialization Error:", err);
      setError(err.message || "Something went wrong during startup.");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-2xl border border-slate-200 dark:border-slate-800">
           <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Startup Failed</h1>
           <p className="text-slate-600 dark:text-slate-400 mb-8">{error}</p>
           <button 
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none"
           >
              <RefreshCw size={18} /> Retry Connection
           </button>
        </div>
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
            
            <Route path="/history" element={
              user ? <History user={user} /> : <Navigate to="/" replace />
            } />
            <Route path="/admin" element={
              user?.role === 'admin' ? <Admin user={user} /> : <Navigate to="/" replace />
            } />
          </Routes>
        </main>

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        
        <div className="h-[30px] md:h-[45px]"></div>
        <AdBanner />
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
