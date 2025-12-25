import React, { useEffect, useState } from 'react';
import { UserProfile, GeneratedImage } from '../types';
import { getUserHistory } from '../services/firebase';
import { Download, Calendar, Loader2 } from 'lucide-react';

interface HistoryProps {
  user: UserProfile;
}

const History: React.FC<HistoryProps> = ({ user }) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    setLoading(true);
    const data = await getUserHistory(user.uid);
    setImages(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Creations</h1>
        <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-medium">
          {images.length} Images
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={32} />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't generated any images yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
              <div className="aspect-video relative overflow-hidden group">
                <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a 
                    href={img.imageUrl} 
                    download={`lumina-${img.createdAt}.png`}
                    className="bg-white/90 hover:bg-white text-slate-900 p-2 rounded-full transition"
                  >
                    <Download size={20} />
                  </a>
                </div>
              </div>
              <div className="p-4">
                <p className="text-slate-900 dark:text-white font-medium text-sm line-clamp-2 mb-2">{img.prompt}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(img.createdAt).toLocaleDateString()}
                  </span>
                  {img.style && <span className="uppercase tracking-wider">{img.style}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;