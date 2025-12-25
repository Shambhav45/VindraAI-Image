import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Coins, LogOut, Image as ImageIcon, Menu, X, ToggleLeft, ToggleRight, Sun, Moon } from 'lucide-react';
import { UserProfile, AppMode } from '../types';
import { auth } from '../services/firebase';

interface NavbarProps {
  user: UserProfile | null;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onOpenAuth: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, mode, setMode, onOpenAuth, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleModeToggle = () => {
    if (mode === AppMode.EXPLORE) {
      if (!user) {
        onOpenAuth();
        return;
      }
      setMode(AppMode.CREATE);
      navigate('/');
    } else {
      setMode(AppMode.EXPLORE);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    setMode(AppMode.EXPLORE);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Increased height for better visibility */}
            <img src="/logo.png" alt="Vindra AI Logo" className="h-12 w-auto object-contain" />
            <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
              Vindra <span className="text-indigo-600 dark:text-indigo-400">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {/* Mode Toggle */}
            <div 
              onClick={handleModeToggle}
              className="flex items-center gap-3 cursor-pointer bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1.5 pr-4 rounded-full hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-700 transition-all select-none group shadow-sm"
            >
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${mode === AppMode.EXPLORE ? 'bg-white dark:bg-slate-600 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-500 dark:text-slate-400'}`}>
                Explore
              </div>
              <div className={`text-xs font-bold uppercase tracking-wide transition-all ${mode === AppMode.CREATE ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}>
                Create
              </div>
            </div>

            <Link to="/pricing" className={`text-sm font-semibold hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors ${isActive('/pricing') ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
              Pricing
            </Link>

            {user && (
              <Link to="/history" className={`text-sm font-semibold hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors ${isActive('/history') ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                History
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className={`text-sm font-semibold hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors ${isActive('/admin') ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                Admin
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Action */}
            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-slate-300 dark:border-slate-700">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{user.displayName || user.email?.split('@')[0]}</span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                    <Coins size={10} fill="currentColor" />
                    {user.credits}
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 dark:hover:bg-indigo-200 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-none transition-all active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
             {user && (
                <div className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-bold bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                    <Coins size={12} fill="currentColor" />
                    {user.credits}
                </div>
             )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-800 dark:text-white p-2">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 space-y-4 shadow-xl absolute w-full z-50 animate-in slide-in-from-top-2">
           <div 
              onClick={() => { handleModeToggle(); setIsMobileMenuOpen(false); }}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <span className="font-bold text-slate-800 dark:text-white">Mode</span>
              <div className="flex items-center gap-2">
                 <span className={`text-xs uppercase font-bold ${mode === AppMode.EXPLORE ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Explore</span>
                 {mode === AppMode.EXPLORE ? <ToggleLeft className="text-slate-300 dark:text-slate-600 w-8 h-8" /> : <ToggleRight className="text-indigo-600 dark:text-indigo-500 w-8 h-8" />}
                 <span className={`text-xs uppercase font-bold ${mode === AppMode.CREATE ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>Create</span>
              </div>
            </div>

            <Link to="/pricing" className="block px-2 py-2 text-slate-800 dark:text-slate-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            {user && <Link to="/history" className="block px-2 py-2 text-slate-800 dark:text-slate-200 font-semibold hover:text-indigo-600 dark:hover:text-indigo-400" onClick={() => setIsMobileMenuOpen(false)}>My History</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="block px-2 py-2 text-indigo-600 dark:text-indigo-400 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>}
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              {user ? (
                 <button onClick={handleLogout} className="w-full text-left px-2 py-2 text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                    <LogOut size={16} /> Sign Out
                 </button>
              ) : (
                <button onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none">
                  Sign In / Sign Up
                </button>
              )}
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;