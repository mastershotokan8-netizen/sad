import { Sparkles, ArrowLeft, User, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AvatarTypeSelection() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-[#FFF9F2] p-8 relative overflow-hidden font-sans">
      <div className="flex justify-between items-center mb-12">
        <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-orange-500 shadow-md active:scale-90 transition-transform">
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === 3 ? 'w-8 bg-orange-500' : 'w-2 bg-orange-200'}`}></div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-black text-slate-800 mb-2">Choose Your Form</h1>
          <p className="text-slate-500 font-bold max-w-xs">How do you want to be represented in Nova Island?</p>
        </motion.div>

        <div className="space-y-4 w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/avatar')}
            className="w-full bg-white border-4 border-orange-100 rounded-[2.5rem] p-6 text-left flex items-center gap-6 group hover:border-orange-300 transition-all shadow-sm"
          >
            <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-5xl group-hover:bg-orange-100 transition-colors">
              🥚
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-800">Orb Companion</h3>
              <p className="text-sm font-bold text-slate-400">Adopt a digital soul that evolves with you.</p>
            </div>
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full bg-slate-900 border-4 border-slate-800 rounded-[2.5rem] p-6 text-left flex items-center gap-6 group cursor-pointer relative overflow-hidden shadow-xl"
            onClick={() => navigate('/human-avatar')}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
               <Sparkles size={120} />
            </div>
            <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-5xl group-hover:bg-slate-700 transition-colors">
              👤
            </div>
            <div className="relative z-10">
              <h3 className="font-black text-xl text-white">Human Avatar</h3>
              <p className="text-sm font-bold text-slate-400">Craft a unique visual identity with detailed customization.</p>
            </div>
            <div className="absolute top-4 right-4 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest animate-pulse">
              New
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
           <Heart size={12} className="fill-slate-300" />
           Both forms support AI interaction
        </p>
      </div>
    </div>
  );
}
