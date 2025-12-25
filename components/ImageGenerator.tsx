import React, { useState } from 'react';
import { Wand2, Download, AlertTriangle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AppMode, UserProfile } from '../types';
import { IMAGE_STYLES, CREDIT_COST_PER_IMAGE } from '../constants';
import { generateImageWithGemini } from '../services/geminiService';
import { deductCredits, saveImageToHistory } from '../services/firebase';

interface ImageGeneratorProps {
  user: UserProfile | null;
  mode: AppMode;
  onOpenAuth: () => void;
  onGenerateSuccess: () => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ user, mode, onOpenAuth, onGenerateSuccess }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (mode === AppMode.EXPLORE) return;
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
      // 1. Generate Image
      const base64Image = await generateImageWithGemini(prompt, selectedStyle);
      
      // 2. Deduct Credits
      await deductCredits(user.uid, CREDIT_COST_PER_IMAGE);
      
      // 3. Save to History
      await saveImageToHistory({
        userId: user.uid,
        prompt: prompt,
        style: selectedStyle,
        imageUrl: base64Image,
        createdAt: Date.now(),
        isPublic: true, // Default to public for community feed
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

  const isDisabled = mode === AppMode.EXPLORE || loading;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input Area */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
        <div className="mb-6">
           {mode === AppMode.EXPLORE && (
             <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 px-4 py-2 rounded-lg mb-4 text-sm flex items-center gap-2">
               <AlertTriangle size={16} />
               You are in Explore Mode. Switch to Create Mode to generate images.
             </div>
           )}
           <label className="block text-sm font-semibold text-slate-700 mb-2">Prompt</label>
           <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isDisabled}
              placeholder={mode === AppMode.EXPLORE ? "Sign in and switch to Create Mode to type..." : "Describe the image you want to see... e.g. A futuristic city floating in clouds, cyberpunk style"}
              className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition disabled:opacity-60 disabled:cursor-not-allowed text-slate-900"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Art Style</label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              disabled={isDisabled}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition disabled:opacity-60"
            >
              {IMAGE_STYLES.map(style => (
                <option key={style.id} value={style.id}>{style.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end justify-between md:justify-end">
             {user && (
               <div className="text-sm text-slate-500 mr-4 mb-3 md:mb-1">
                 Cost: <span className="font-semibold text-amber-600">{CREDIT_COST_PER_IMAGE} Credits</span>
               </div>
             )}
             <button
               onClick={handleGenerate}
               disabled={isDisabled}
               className={`
                 flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-indigo-200
                 transition-all active:scale-[0.98]
                 ${isDisabled ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600'}
               `}
             >
               {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
               {loading ? 'Generating...' : 'Generate Image'}
             </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-center gap-2 mb-4">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* Result Area */}
        {generatedImage && (
          <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ImageIcon className="text-indigo-600" size={20}/> Result
            </h3>
            <div className="relative group rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
               <img src={generatedImage} alt="Generated" className="w-full h-auto object-cover" />
               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a 
                    href={generatedImage} 
                    download={`lumina-ai-${Date.now()}.png`}
                    className="bg-white text-slate-900 px-6 py-2 rounded-full font-medium hover:bg-slate-100 transition flex items-center gap-2"
                  >
                    <Download size={18} /> Download
                  </a>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
