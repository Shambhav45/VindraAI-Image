import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-32 md:pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
               <img src="/logo.png" alt="Vindra AI" className="h-10 w-auto object-contain" />
               <span className="font-bold text-xl text-slate-900 dark:text-white">Vindra <span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              The next generation of AI image generation. 
              Turn your wildest imagination into professional-grade visual assets in seconds.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-lg">Product</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-semibold">
              <li><Link to="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Pricing Plans</Link></li>
              <li><Link to="/history" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">My Gallery</Link></li>
              <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Community Feed</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-lg">Company</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-semibold">
              <li><Link to="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Contact Support</Link></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">About Vindra</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-6 text-lg">Legal</h4>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400 font-semibold">
              <li><Link to="/legal" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Privacy Policy</Link></li>
              <li><Link to="/legal" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-xs text-slate-500 dark:text-slate-500 font-semibold">© 2024 Vindra AI. All rights reserved.</p>
           <p className="text-xs text-slate-500 dark:text-slate-500 font-semibold flex items-center gap-1">Powered by <span className="text-slate-800 dark:text-slate-200 font-bold">Google Gemini</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;