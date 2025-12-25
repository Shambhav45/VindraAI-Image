import React, { useState } from 'react';
import { UserProfile, AppMode } from '../types';
import ImageGenerator from '../components/ImageGenerator';
import CommunityFeed from '../components/CommunityFeed';
import { RefreshCw, Zap, Gift } from 'lucide-react';

interface HomeProps {
  user: UserProfile | null;
  mode: AppMode;
  onOpenAuth: () => void;
}

const Home: React.FC<HomeProps> = ({ user, mode, onOpenAuth }) => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handleGenerateSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    // Smooth scroll to top if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-32 lg:pt-24 lg:pb-40">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 dark:bg-indigo-900/10 blur-3xl"></div>
            <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-sky-200/20 dark:bg-sky-900/10 blur-3xl"></div>
         </div>

         <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full px-4 py-1.5 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4">
               <Gift size={14} className="text-amber-600 dark:text-amber-400" />
               <span className="text-xs font-bold text-amber-800 dark:text-amber-300 tracking-wide uppercase">New: Sign up & Get 25 Free Credits</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight max-w-4xl mx-auto">
              Turn Words into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 dark:from-indigo-400 dark:via-violet-400 dark:to-sky-400">
                Masterpieces
              </span>
            </h1>
            
            <p className="text-xl text-slate-700 dark:text-slate-300 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              Create stunning visuals in seconds with our advanced AI engine. 
              {mode === AppMode.EXPLORE && <span className="text-indigo-600 dark:text-indigo-400 font-bold block mt-2">Switch to Create Mode to start generating.</span>}
            </p>
            
            <ImageGenerator 
              user={user} 
              mode={mode} 
              onOpenAuth={onOpenAuth}
              onGenerateSuccess={handleGenerateSuccess}
              externalPrompt={selectedPrompt}
            />
         </div>
      </div>

      {/* Community Feed Section */}
      <section className="bg-white dark:bg-slate-900 py-24 border-t border-slate-200 dark:border-slate-800 relative z-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CommunityFeed 
              key={refreshKey} 
              onSelectPrompt={handleSelectPrompt}
            />
        </div>
      </section>
    </div>
  );
};

export default Home;