import React, { useEffect, useState } from 'react';
import { GeneratedImage } from '../types';
import { getPublicFeed, toggleLikeImage } from '../services/firebase';
import { Heart, Sparkles, Copy, Globe, Zap } from 'lucide-react';

interface CommunityFeedProps {
  onSelectPrompt: (prompt: string) => void;
}

// High-quality static examples for instant first-paint
const STATIC_EXAMPLES: GeneratedImage[] = [
  {
    id: 'static-1',
    userId: 'system',
    prompt: 'A futuristic cyberpunk samurai standing in neon rain, glowing katana, cinematic lighting, 8k resolution, detailed armor',
    imageUrl: 'https://images.unsplash.com/photo-1614726365723-49cfae50401b?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now(),
    isPublic: true,
    likes: 124
  },
  {
    id: 'static-2',
    userId: 'system',
    prompt: 'Serene landscape of a floating island in the sky, waterfalls, lush greenery, fantasy art style, soft sunlight',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now(),
    isPublic: true,
    likes: 89
  },
  {
    id: 'static-3',
    userId: 'system',
    prompt: 'Professional product photography of a luxury perfume bottle on black marble, gold accents, dramatic lighting',
    imageUrl: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now(),
    isPublic: true,
    likes: 56
  },
  {
    id: 'static-4',
    userId: 'system',
    prompt: 'Portrait of an astronaut reflecting a galaxy in the helmet visor, highly detailed, realistic texture, 4k',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now(),
    isPublic: true,
    likes: 210
  },
  {
    id: 'static-5',
    userId: 'system',
    prompt: 'Abstract oil painting of a city skyline at sunset, vibrant colors, thick brush strokes, impressionist style',
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now(),
    isPublic: true,
    likes: 78
  },
  {
    id: 'static-6',
    userId: 'system',
    prompt: 'Minimalist logo design for a tech company, geometric fox shape, orange and blue gradient, vector art style',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?auto=format&fit=crop&w=800&q=80',
    createdAt: Date.now(),
    isPublic: true,
    likes: 45
  }
];

const CommunityFeed: React.FC<CommunityFeedProps> = ({ onSelectPrompt }) => {
  // Start with static examples immediately
  const [images, setImages] = useState<GeneratedImage[]>(STATIC_EXAMPLES);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchLiveFeed();
  }, []);

  const fetchLiveFeed = async () => {
    try {
      const liveFeed = await getPublicFeed();
      if (liveFeed && liveFeed.length > 0) {
        // If we have live images, we prioritize them but fill with static if < 6
        const merged = liveFeed.length >= 6 
          ? liveFeed 
          : [...liveFeed, ...STATIC_EXAMPLES.slice(0, 6 - liveFeed.length)];
        
        setImages(merged);
        setIsLive(true);
      }
    } catch (error) {
      console.error("Failed to fetch live feed, staying with static examples", error);
    }
  };

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setImages(prev => prev.map(img => 
        img.id === id ? { ...img, likes: (img.likes || 0) + 1 } : img
    ));
    if (!id.startsWith('static-')) {
       await toggleLikeImage(id, 'anon');
    }
  };

  return (
    <div className="mt-24">
      <div className="text-center mb-12">
        <div className="flex flex-col items-center justify-center gap-4 mb-4">
             {isLive ? (
               <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full animate-in fade-in zoom-in duration-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Live Community Feed</span>
               </div>
             ) : (
               <Sparkles className="text-amber-500 w-6 h-6 animate-pulse" />
             )}
             <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {isLive ? "Community Creations" : "Example Generations"}
             </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          {isLive 
            ? "Explore what the Vindra AI community is dreaming up right now. Click any image to borrow their prompt." 
            : "Get inspired by what Vindra AI can create. Our community feed updates instantly as new art is born."}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img, index) => (
          <div 
            key={img.id || index} 
            onClick={() => onSelectPrompt(img.prompt)}
            className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 h-[400px] cursor-pointer animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <img 
              src={img.imageUrl} 
              alt={img.prompt} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 flex flex-col justify-end">
              <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-3 text-sky-400 font-bold text-xs uppercase tracking-widest">
                      <Zap size={14} className="fill-current" /> Use This Prompt
                  </div>
                  <p className="text-white text-base font-bold line-clamp-3 mb-6 leading-relaxed italic">
                    "{img.prompt}"
                  </p>
                  <div className="flex justify-between items-center border-t border-white/10 pt-5">
                    <div className="flex items-center gap-2">
                        {img.userId === 'system' ? (
                            <span className="text-[10px] font-black text-white/90 bg-slate-800/80 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/10">AI Masterpiece</span>
                        ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">V</div>
                              <span className="text-xs font-bold text-white/80 tracking-wide">Community Member</span>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={(e) => handleLike(e, img.id)}
                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-white text-xs font-black transition active:scale-90"
                    >
                        <Heart size={14} className={img.likes > 0 ? "fill-rose-500 text-rose-500" : "text-white"} />
                        {img.likes || 0}
                    </button>
                  </div>
              </div>
            </div>
            
            {/* Visible Prompt Preview (Glassmorphism) */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4 group-hover:opacity-0 transition-opacity duration-300">
               <p className="text-white text-xs font-medium line-clamp-1 opacity-90">
                 {img.prompt}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;