import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
               <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white">
                 <Sparkles size={14} fill="currentColor" />
               </div>
               <span className="font-bold text-lg text-slate-900">Lumina AI</span>
            </Link>
            <p className="text-sm text-slate-500">
              Transforming imagination into reality with next-gen AI technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
              <li><Link to="/history" className="hover:text-indigo-600">My Gallery</Link></li>
              <li><Link to="/" className="hover:text-indigo-600">Showcase</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/contact" className="hover:text-indigo-600">Contact Us</Link></li>
              <li><a href="#" className="hover:text-indigo-600">About</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/legal" className="hover:text-indigo-600">Privacy Policy</Link></li>
              <li><Link to="/legal" className="hover:text-indigo-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-xs text-slate-400">© 2024 Lumina AI. All rights reserved.</p>
           <p className="text-xs text-slate-400">Powered by Gemini AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
