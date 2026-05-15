import { CheckCircle2, AlertCircle, ArrowLeft, Target, Sparkles, Trophy, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Missions() {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [pet, setPet] = useState({ name: 'Orb', emoji: '🥚' });

  useEffect(() => {
    const savedPet = JSON.parse(localStorage.getItem('userPet') || '{}');
    if (savedPet.name) setPet(savedPet);
  }, []);

  const handleComplete = () => {
    setIsCompleted(true);
    setTimeout(() => {
      navigate('/hatch');
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] relative overflow-hidden font-sans">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -ml-20 -mb-20"></div>

        {/* Top Header */}
        <div className="px-6 py-8 z-20 relative flex justify-between items-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Missions</h1>
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-orange-500">
                <Target size={20} />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24 z-10 space-y-8 custom-scrollbar">
            {/* Active Missions */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Active Objectives</h2>
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black">1 CURRENT</span>
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      {!isCompleted ? (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 group hover:border-orange-200 transition-all cursor-pointer"
                            onClick={handleComplete}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 leading-none">Study Pulse</h3>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">500 XP Payload</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-black text-slate-900">75%</div>
                                </div>
                            </div>
                            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }} 
                                    animate={{ width: `75%` }} 
                                    className="h-full bg-orange-400"
                                />
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-[#FF6B6B]">
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Tap to sync final progress</span>
                            </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-green-50 rounded-[2rem] p-8 border-2 border-green-100 text-center flex flex-col items-center"
                        >
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-green-500 mb-4 shadow-sm">
                              <CheckCircle2 size={32} />
                           </div>
                           <h3 className="text-xl font-black text-slate-900">Sync Complete!</h3>
                           <p className="text-xs font-bold text-slate-500 mt-2">Initializing Cosmic Event...</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Daily Streak */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-white/10 transition-all"></div>
                 <h2 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Consistency</h2>
                 <div className="flex items-end gap-3 mb-6">
                    <span className="text-6xl font-black italic tracking-tighter">14</span>
                    <span className="text-xl font-bold mb-2">DAYS</span>
                 </div>
                 <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                     <p className="text-[10px] font-black uppercase tracking-widest">Next Goal: 15 Days</p>
                     <Trophy size={16} className="text-yellow-400" />
                 </div>
            </div>

            {/* Future Challenges */}
            <section className="space-y-4">
                <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Future Quests</h2>
                <div className="grid grid-cols-2 gap-4">
                     {[1, 2].map(i => (
                         <div key={i} className="bg-white rounded-[2rem] p-6 border-2 border-dashed border-orange-100 flex flex-col items-center text-center">
                             <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-200 mb-3">
                                 <Plus size={20} />
                             </div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Locked</p>
                         </div>
                     ))}
                </div>
            </section>
        </div>
    </div>
  );
}
