import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Coins, LogOut, LayoutGrid, Image as ImageIcon, Menu, X, ToggleLeft, ToggleRight, User as UserIcon } from 'lucide-react';
import { UserProfile, AppMode } from '../types';
import { auth } from '../services/firebase';

interface NavbarProps {
  user: UserProfile | null;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onOpenAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, mode, setMode, onOpenAuth }) => {
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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-sky-400 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all">
              <Sparkles size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Lumina<span className="text-indigo-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Mode Toggle */}
            <div 
              onClick={handleModeToggle}
              className="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors select-none"
            >
              <span className={`text-sm font-medium ${mode === AppMode.EXPLORE ? 'text-indigo-600' : 'text-slate-500'}`}>Explore</span>
              {mode === AppMode.EXPLORE ? 
                <ToggleLeft className="w-8 h-8 text-slate-400" /> : 
                <ToggleRight className="w-8 h-8 text-indigo-600" />
              }
              <span className={`text-sm font-medium ${mode === AppMode.CREATE ? 'text-indigo-600' : 'text-slate-500'}`}>Create</span>
            </div>

            <Link to="/pricing" className={`text-sm font-medium hover:text-indigo-600 transition ${isActive('/pricing') ? 'text-indigo-600' : 'text-slate-600'}`}>
              Pricing
            </Link>

            {user && (
              <Link to="/history" className={`text-sm font-medium hover:text-indigo-600 transition ${isActive('/history') ? 'text-indigo-600' : 'text-slate-600'}`}>
                History
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin" className={`text-sm font-medium hover:text-indigo-600 transition ${isActive('/admin') ? 'text-indigo-600' : 'text-slate-600'}`}>
                Admin
              </Link>
            )}

            {/* User Action */}
            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-900">{user.displayName || user.email}</span>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                    <Coins size={12} fill="currentColor" />
                    {user.credits} Credits
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             {user && (
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded">
                    <Coins size={12} fill="currentColor" />
                    {user.credits}
                </div>
             )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-lg absolute w-full">
           <div 
              onClick={() => { handleModeToggle(); setIsMobileMenuOpen(false); }}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
            >
              <span className="font-medium text-slate-700">Switch Mode</span>
              <div className="flex items-center gap-2">
                 <span className={`text-xs uppercase ${mode === AppMode.EXPLORE ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>Exp</span>
                 {mode === AppMode.EXPLORE ? <ToggleLeft className="text-slate-400" /> : <ToggleRight className="text-indigo-600" />}
                 <span className={`text-xs uppercase ${mode === AppMode.CREATE ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>Cre</span>
              </div>
            </div>

            <Link to="/pricing" className="block px-2 py-2 text-slate-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            {user && <Link to="/history" className="block px-2 py-2 text-slate-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>My History</Link>}
            {user?.role === 'admin' && <Link to="/admin" className="block px-2 py-2 text-indigo-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>}
            
            <div className="pt-4 border-t border-slate-100">
              {user ? (
                 <button onClick={handleLogout} className="w-full text-left px-2 py-2 text-red-500 font-medium flex items-center gap-2">
                    <LogOut size={16} /> Sign Out
                 </button>
              ) : (
                <button onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium">
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
