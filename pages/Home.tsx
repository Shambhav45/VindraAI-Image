import React from 'react';
import { UserProfile, AppMode } from '../types';
import ImageGenerator from '../components/ImageGenerator';
import CommunityFeed from '../components/CommunityFeed';
import { RefreshCw } from 'lucide-react';

interface HomeProps {
  user: UserProfile | null;
  mode: AppMode;
  onOpenAuth: () => void;
}

const Home: React.FC<HomeProps> = ({ user, mode, onOpenAuth }) => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleGenerateSuccess = () => {
    // Refresh feed after new generation
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-16 md:py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
          Turn Words into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-500">Masterpieces</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Create stunning visuals in seconds with our advanced AI engine. 
          {mode === AppMode.EXPLORE && <span className="block mt-2 font-medium text-indigo-600">Switch to Create Mode to start generating.</span>}
        </p>
        
        <ImageGenerator 
          user={user} 
          mode={mode} 
          onOpenAuth={onOpenAuth}
          onGenerateSuccess={handleGenerateSuccess}
        />
      </section>

      {/* Community Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex justify-center mb-8">
           <button 
             onClick={() => setRefreshKey(p => p + 1)}
             className="text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-sm transition"
           >
             <RefreshCw size={14} /> Refresh Feed
           </button>
        </div>
        <CommunityFeed key={refreshKey} />
      </section>
    </div>
  );
};

export default Home;
