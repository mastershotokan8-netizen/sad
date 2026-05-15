import { Sparkles, Loader2, Heart, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PET_TYPES = {
  playful: { name: 'Pippin', emoji: '🐶', color: 'text-orange-500', bg: 'bg-orange-50', trait: 'Playful', description: 'A bouncy pup who\'s always ready for a game!' },
  calm: { name: 'Luna', emoji: '🐨', color: 'text-blue-500', bg: 'bg-blue-50', trait: 'Calm', description: 'Wise, peaceful, and a great listener.' },
  brave: { name: 'Leo', emoji: '🦁', color: 'text-red-500', bg: 'bg-red-50', trait: 'Brave', description: 'A tiny lion with a big heart to help you tackle any challenge!' },
  studious: { name: 'Sage', emoji: '🐢', color: 'text-green-500', bg: 'bg-green-50', trait: 'Studious', description: 'Focused and loves helping you hit those deadlines.' },
  energetic: { name: 'Volt', emoji: '🦆', color: 'text-yellow-500', bg: 'bg-yellow-50', trait: 'Energetic', description: 'A super-charged duck! Fast, loud, and full of zing! Let\'s waddle into action.' },
  creative: { name: 'Sketch', emoji: '🐙', color: 'text-purple-500', bg: 'bg-purple-50', trait: 'Creative', description: 'Thinks outside the shell. Adventure awaits!' },
  social: { name: 'Bubbles', emoji: '🐬', color: 'text-cyan-500', bg: 'bg-cyan-50', trait: 'Friendly', description: 'Loves people and making new friends!' },
  focused: { name: 'Atlas', emoji: '🦉', color: 'text-indigo-500', bg: 'bg-indigo-50', trait: 'Bright', description: 'Knowledgeable and focused on your goals.' },
  default: { name: 'Orb', emoji: '🐣', color: 'text-slate-500', bg: 'bg-slate-50', trait: 'Special', description: 'A unique companion just for you.' }
};

export default function OrbAllocation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState(PET_TYPES.default);

  useEffect(() => {
    const traits = JSON.parse(localStorage.getItem('userTraits') || '[]');
    const primaryTrait = traits[0] || 'default';
    
    // Simulate allotment logic
    const timer = setTimeout(() => {
      const selectedPet = PET_TYPES[primaryTrait as keyof typeof PET_TYPES] || PET_TYPES.default;
      setPet(selectedPet);
      setLoading(false);
      localStorage.setItem('userPet', JSON.stringify(selectedPet));
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -ml-20 -mb-20"></div>
      
      {/* Header */}
      <div className="px-8 pt-8 pb-4 flex justify-between items-center z-20">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm transition-transform active:scale-95">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center z-10 p-6"
            >
              <div className="relative mb-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 border-4 border-orange-200 border-dashed rounded-full"
                ></motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center"
                  >
                    <Sparkles size={40} className="text-orange-400" />
                  </motion.div>
                </div>
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">Finding your companion...</h1>
              <p className="text-slate-400 font-bold max-w-[250px]">Matching your unique vibe with a digital soul</p>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full h-full flex flex-col items-center justify-center text-center z-10 p-6"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="bg-white rounded-[3rem] p-4 shadow-xl border-2 border-orange-100 mb-8 relative"
              >
                <div className="w-56 h-56 bg-[#FFF9F2] rounded-[2.5rem] flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="text-9xl"
                  >
                    🥚
                  </motion.div>
                </div>
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white p-3 rounded-2xl shadow-lg border-4 border-white z-20">
                  <Sparkles size={20} className="fill-white" />
                </div>
              </motion.div>
  
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-6 w-full max-w-xs"
              >
                <div className="space-y-1">
                  <p className="text-orange-500 font-black text-xs uppercase tracking-widest leading-none">Adopt an Orb</p>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Prism Egg</h2>
                </div>
  
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center gap-4">
                  <div className="bg-orange-50 p-2 rounded-xl">
                    <Heart className="text-orange-500 fill-orange-500" size={24} />
                  </div>
                  <p className="text-slate-600 font-bold leading-snug">
                    This egg has been selected based on your {pet.trait} personality. It holds a unique companion waiting to meet you.
                  </p>
                </div>
  
                <button
                  onClick={() => navigate('/hatch')}
                  className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800"
                >
                  Hatch your Egg
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
