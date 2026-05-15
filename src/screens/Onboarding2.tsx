import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TRAITS = [
  { id: 'energetic', label: 'Energetic ⚡', color: 'bg-yellow-400' },
  { id: 'calm', label: 'Calm 🧘', color: 'bg-blue-400' },
  { id: 'studious', label: 'Studious 📚', color: 'bg-green-400' },
  { id: 'brave', label: 'Brave 🦁', color: 'bg-red-400' },
  { id: 'playful', label: 'Playful 🎈', color: 'bg-pink-400' },
  { id: 'creative', label: 'Creative 🎨', color: 'bg-purple-400' },
];

export default function Onboarding2() {
  const navigate = useNavigate();
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  const toggleTrait = (id: string) => {
    setSelectedTraits(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleFinish = () => {
    if (selectedTraits.length > 0) {
      localStorage.setItem('userTraits', JSON.stringify(selectedTraits));
      navigate('/pet-setup');
    }
  };

  return (
    <div className="min-h-full flex flex-col p-8 bg-[#FFF9F2] pb-12 overflow-hidden relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-md active:scale-90 transition-transform">
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === 2 ? 'w-8 bg-orange-500' : 'w-2 bg-orange-200'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center">
        {/* Egg Display */}
        <div className="relative mb-8">
          <motion.div
            animate={isShaking ? {
              x: [-2, 2, -2, 2, 0],
              rotate: [-2, 2, -2, 2, 0],
              scale: [1, 1.05, 1]
            } : {}}
            transition={{ duration: 0.4 }}
            className="text-9xl filter drop-shadow-2xl active:scale-110 transition-transform cursor-pointer"
            onClick={() => setIsShaking(true)}
          >
            🥚
          </motion.div>
          <AnimatePresence>
            {selectedTraits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-lg"
              >
                <Heart className="text-red-500 fill-red-500 w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Area */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 mb-2">Who are you?</h1>
          <p className="text-slate-500 font-bold">Pick the traits that define you.<br/>The egg is watching...</p>
        </div>

        {/* Traits Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {TRAITS.map(trait => {
            const isSelected = selectedTraits.includes(trait.id);
            return (
              <motion.button
                key={trait.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTrait(trait.id)}
                className={`p-4 rounded-3xl font-black text-sm transition-all border-4 flex items-center justify-center gap-2 ${
                  isSelected 
                    ? `${trait.color} border-white text-white shadow-lg` 
                    : 'bg-white border-orange-50 text-slate-600 hover:border-orange-100'
                }`}
              >
                {trait.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-8"
      >
        <button
          onClick={handleFinish}
          disabled={selectedTraits.length === 0}
          className={`w-full font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-[0.95] text-lg ${
            selectedTraits.length > 0 
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_8px_0_rgb(194,65,12)]' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-[0_8px_0_rgba(0,0,0,0.05)]'
          }`}
        >
          <span>CHOOSE YOUR IDENTITY</span>
          <Sparkles size={22} />
        </button>
      </motion.div>
    </div>
  );
}
