import React, { useState, useEffect } from 'react';
import { Wand2, Download, AlertTriangle, Image as ImageIcon, Loader2, Sparkles, RefreshCcw, Lock, Gift } from 'lucide-react';
import { AppMode, UserProfile } from '../types';
import { IMAGE_STYLES, CREDIT_COST_PER_IMAGE, PROMPT_PRESETS } from '../constants';
import { generateImageWithGemini, enhancePromptWithAI } from '../services/geminiService';
import { deductCredits, saveImageToHistory } from '../services/firebase';

interface ImageGeneratorProps {
  user: UserProfile | null;
  mode: AppMode;
  onOpenAuth: () => void;
  onGenerateSuccess: () => void;
  externalPrompt?: string | null;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ user, mode, onOpenAuth, onGenerateSuccess, externalPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill prompt when selected from community feed
  useEffect(() => {
    if (externalPrompt) {
      setPrompt(externalPrompt);
    }
  }, [externalPrompt]);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setEnhancing(true);
    const newPrompt = await enhancePromptWithAI(prompt);
    setPrompt(newPrompt);
    setEnhancing(false);
  };

  const applyPreset = (suffix: string) => {
      setPrompt(prev => {
          const clean = prev.trim();
          if (clean.includes(suffix)) return clean;
          return clean ? `${clean}${suffix}` : suffix.replace(/^, /, '');
      });
  };

  const handleGenerate = async () => {
    if (mode === AppMode.EXPLORE) {
        onOpenAuth();
        return;
    }
    if (!user) {
      onOpenAuth();
      return;
    }

    if (user.credits < CREDIT_COST_PER_IMAGE) {
      setError(`Insufficient credits. You need ${CREDIT_COST_PER_IMAGE} credits.`);
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await generateImageWithGemini(prompt, selectedStyle);
      await deductCredits(user.uid, CREDIT_COST_PER_IMAGE);
      
      await saveImageToHistory({
        userId: user.uid,
        prompt: prompt,
        style: selectedStyle,
        imageUrl: base64Image,
        createdAt: Date.now(),
        isPublic: true,
        likes: 0,
        userEmail: user.email || undefined
      });

      setGeneratedImage(base64Image);
      onGenerateSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Watermark Logic for Free Users
  const isFreeUser = user?.tier !== 'paid' && user?.role !== 'admin';

  const downloadImage = () => {
      if (!generatedImage) return;
      
      const link = document.createElement('a');
      link.download = `vindra-ai-${Date.now()}.png`;

      if (isFreeUser) {
        // Draw to canvas to add watermark
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                
                // Add Watermark
                ctx.font = 'bold 48px Inter, sans-serif';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.textAlign = 'right';
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 10;
                ctx.fillText('Vindra AI', canvas.width - 40, canvas.height - 40);
                
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        };
        img.src = generatedImage;
      } else {
          link.href = generatedImage;
          link.click();
      }
  };

  const isDisabled = mode === AppMode.EXPLORE && !user;

  return (
    <div className="w-full max-w-5xl mx-auto relative z-10">
      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-100/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        
        {/* Header / Tabs */}
        <div className="bg-slate-50/80 dark:bg-slate-900/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center justify-between">
           <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {PROMPT_PRESETS.map(preset => (
                  <button 
                    key={preset.id}
                    onClick={() => applyPreset(preset.suffix)}
                    disabled={mode === AppMode.EXPLORE || loading}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition disabled:opacity-50 whitespace-nowrap"
                  >
                    + {preset.label}
                  </button>
              ))}
           </div>
           {mode === AppMode.CREATE && (
             <button 
                onClick={handleEnhancePrompt}
                disabled={loading || enhancing || !prompt}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
             >
                {enhancing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Improve Prompt
             </button>
           )}
        </div>

        <div className="p-6 md:p-8">
           {/* Prompt Input */}
           <div className="relative">
             <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={mode === AppMode.EXPLORE || loading}
                placeholder={mode === AppMode.EXPLORE ? "Locked in Explore Mode" : "Describe your imagination... (e.g., A cyberpunk samurai in neon rain, cinematic lighting, 8k)"}
                className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none transition-all disabled:cursor-not-allowed text-slate-900 dark:text-white text-lg placeholder:text-slate-500 dark:placeholder:text-slate-400 font-medium disabled:text-slate-500 dark:disabled:text-slate-500"
             />
             
             {/* Mode Overlay */}
             {mode === AppMode.EXPLORE && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/70 backdrop-blur-[2px] rounded-xl z-10">
                     <div className="text-center p-6 animate-in fade-in zoom-in duration-300 max-w-sm mx-auto">
                        <Gift className="w-10 h-10 mx-auto mb-3 text-amber-500 animate-bounce" />
                        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                            Unlock 25 Free Credits!
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 font-medium mb-6">
                           Log in to claim your welcome gift and switch to Create Mode to start imagining.
                        </p>
                        <button onClick={onOpenAuth} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition transform hover:bg-indigo-700 ring-4 ring-indigo-50 dark:ring-indigo-900/20">
                           Login to Create
                        </button>
                     </div>
                 </div>
             )}
           </div>

           {/* Controls */}
           <div className="mt-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Art Style</label>
                <div className="relative">
                    <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    disabled={mode === AppMode.EXPLORE || loading}
                    className="w-full appearance-none px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-800 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900"
                    >
                    {IMAGE_STYLES.map(style => (
                        <option key={style.id} value={style.id}>{style.label}</option>
                    ))}
                    </select>
                    <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
              </div>

              <div className="w-full md:w-2/3 flex flex-col md:flex-row items-center justify-end gap-4">
                 {user && (
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full font-bold border border-slate-200 dark:border-slate-700">
                         <span>Cost:</span>
                         <span className="text-indigo-600 dark:text-indigo-400">{CREDIT_COST_PER_IMAGE} Credits</span>
                    </div>
                 )}
                 <button
                    onClick={handleGenerate}
                    disabled={isDisabled || loading}
                    className={`
                        w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white text-lg shadow-xl shadow-indigo-200 dark:shadow-none
                        transition-all active:scale-[0.98] hover:-translate-y-0.5
                        ${isDisabled || loading ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none text-slate-500 dark:text-slate-400' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'}
                    `}
                    >
                    {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
                    {loading ? 'Dreaming...' : 'Generate Image'}
                </button>
              </div>
           </div>

           {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertTriangle size={18} />
                {error}
            </div>
           )}
        </div>
      </div>

      {/* Result Section */}
      {generatedImage && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ImageIcon className="text-indigo-600 dark:text-indigo-400" /> Your Masterpiece
                </h3>
                <button onClick={handleGenerate} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    <RefreshCcw size={14} /> Regenerate
                </button>
            </div>
            
            <div className="relative group rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
               <img src={generatedImage} alt="Generated" className="w-full h-auto object-cover" />
               
               {/* Watermark Overlay for display (non-intrusive) */}
               {isFreeUser && (
                   <div className="absolute bottom-4 right-4 pointer-events-none opacity-60">
                       <span className="text-white font-bold text-xl drop-shadow-md">Vindra AI</span>
                   </div>
               )}

               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <button 
                    onClick={downloadImage}
                    className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition transform hover:scale-105 flex items-center gap-2 shadow-lg"
                  >
                    <Download size={20} /> Download {isFreeUser ? '(Watermarked)' : 'High Res'}
                  </button>
               </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default ImageGenerator;