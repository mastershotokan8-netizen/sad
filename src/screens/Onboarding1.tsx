import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Onboarding1() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleNext = () => {
    if (email) navigate('/onboarding2');
  };

  return (
    <div className="min-h-full flex flex-col p-8 bg-[#FFF9F2] pb-12 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-200/50 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 -right-10 w-32 h-32 bg-orange-200/50 rounded-full blur-3xl"></div>

      <div className="flex-1 flex flex-col items-center justify-center pt-8">
        {/* Logo Area */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative mb-12"
        >
          <div className="w-48 h-48 bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(255,165,0,0.15)] flex items-center justify-center relative overflow-hidden border-4 border-orange-100">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-50/50"></div>
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, -5, 5, 0],
                y: [0, -2, 0] 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-8xl relative z-10"
            >
              🥚
            </motion.div>
            <div className="absolute -bottom-2 w-32 h-8 bg-orange-100/50 blur-lg rounded-full"></div>
          </div>
          
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4"
          >
            <Sparkles className="text-yellow-400 w-10 h-10" />
          </motion.div>
        </motion.div>

        {/* Text Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black text-orange-600 mb-2 tracking-tight">Orbit</h1>
          <p className="text-orange-900/60 font-bold text-lg mb-8">Your journey begins with an egg...</p>
        </motion.div>

        {/* Form Area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-4"
        >
          <div className="relative group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your student email"
              className="w-full bg-white border-4 border-orange-100 rounded-[2rem] px-8 py-5 font-bold text-slate-700 placeholder-orange-200 focus:border-orange-400 focus:ring-0 outline-none transition-all shadow-lg text-lg group-hover:scale-[1.02]"
            />
            {email && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-orange-500"
              >
                <Sparkles size={24} />
              </motion.div>
            )}
          </div>
          <p className="text-center text-orange-900/40 font-semibold text-sm px-4">
            We use your email to verify you're a student. No spam, pinky promise! 🤙
          </p>
        </motion.div>
      </div>

      {/* Buttons */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12"
      >
        <button
          onClick={handleNext}
          disabled={!email}
          className={`w-full font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-[0.95] text-xl ${
            email 
              ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_12px_0_rgb(194,65,12)] hover:shadow-[0_8px_0_rgb(194,65,12)] hover:translate-y-1' 
              : 'bg-orange-100 text-orange-200 cursor-not-allowed shadow-[0_12px_0_rgba(0,0,0,0.05)]'
          }`}
        >
          <span>LET'S GO!</span>
          <ArrowRight size={28} strokeWidth={3} />
        </button>
      </motion.div>
    </div>
  );
}
