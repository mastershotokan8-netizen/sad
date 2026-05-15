import { Sparkles, Trophy, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hatch() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'missions' | 'cracking' | 'hatched'>('missions');
  const [currentMission, setCurrentMission] = useState(0);
  const [missionProgress, setMissionProgress] = useState(0);
  const [pet, setPet] = useState({ name: 'Orb', emoji: '🦊', color: 'text-orange-500', trait: 'Playful' });
  const [particles, setParticles] = useState<{ x: number, y: number, emoji: string }[]>([]);
  const [isHolding, setIsHolding] = useState(false);

  const missions = [
    { title: "Warm the shell", description: "Tap repeatedly to generate heat", icon: "🔥", goal: 10, type: 'tap' },
    { title: "Sing a lullaby", description: "Hold to synchronize frequencies", icon: "🎵", goal: 100, type: 'hold' }
  ];

  useEffect(() => {
    const savedPet = JSON.parse(localStorage.getItem('userPet') || '{}');
    if (savedPet.name) setPet(savedPet);
  }, []);

  const handleAction = () => {
    if (stage !== 'missions') return;
    
    if (missions[currentMission].type === 'tap') {
      const nextProgress = missionProgress + 1;
      setMissionProgress(nextProgress);
      if (nextProgress >= missions[currentMission].goal) {
        completeMission();
      }
    }
  };

  const completeMission = () => {
    if (currentMission < missions.length - 1) {
      setMissionProgress(0);
      setCurrentMission(prev => prev + 1);
    } else {
      setStage('cracking');
    }
  };

  // For the hold mission
  useEffect(() => {
    let interval: any;
    if (stage === 'missions' && missions[currentMission].type === 'hold' && missionProgress < 100 && isHolding) {
      interval = setInterval(() => {
        setMissionProgress(prev => {
          const next = prev + 2;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(completeMission, 500);
            return 100;
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [stage, currentMission, missionProgress, isHolding]);

  const handleHatch = () => {
    if (stage !== 'cracking') return;
    
    const newParticles = [...Array(40)].map(() => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      emoji: ['✨', '💎', '🎨', '🌟', '🍭', '🌈'][Math.floor(Math.random() * 6)]
    }));
    setParticles(newParticles);
    setStage('hatched');
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <motion.div 
        animate={stage === 'hatched' ? {
          backgroundColor: ['#FFFBF5', '#F5F7FF', '#FFF5F5', '#FFFBF5'],
        } : {}}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
      />

      <AnimatePresence>
        {stage === 'hatched' && particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: p.y,
              x: p.x,
              scale: [0, 1.5, 0],
              rotate: 360
            }}
            transition={{ duration: 2.5, ease: "easeOut", delay: Math.random() * 0.8 }}
            className="absolute text-2xl z-50 pointer-events-none"
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full text-center">
        {/* The Egg / Pet Container */}
        <motion.div
          animate={stage === 'missions' ? {
            y: [0, -10, 0],
            scale: [1, 1.02, 1],
          } : stage === 'cracking' ? {
            rotateZ: [-2, 2, -2],
            scale: [1, 1.1, 1],
          } : {
             scale: [0, 1.2, 1],
          }}
          transition={stage === 'missions' ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : stage === 'cracking' ? { duration: 0.1, repeat: Infinity } : { duration: 0.8, ease: "easeOut" }}
          className="relative mb-12"
          onClick={stage === 'missions' && missions[currentMission].type === 'tap' ? handleAction : stage === 'cracking' ? handleHatch : undefined}
        >
          {/* Internal Glow Effects */}
          <motion.div 
            animate={{ 
              scale: stage === 'hatched' ? [1, 1.5, 1] : [1, 1.2, 1], 
              opacity: stage === 'hatched' ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-orange-400 blur-[80px] rounded-full"
          />

          <div className="relative">
            <AnimatePresence mode="wait">
              {stage !== 'hatched' ? (
                <motion.div 
                  key="egg"
                  exit={{ 
                    scale: [1, 2], 
                    opacity: 0,
                    filter: "blur(20px)" 
                  }}
                  transition={{ duration: 0.6 }}
                  className="text-[10rem] drop-shadow-2xl relative z-10"
                >
                  <span className="block">🥚</span>
                  {/* Cracks Overlay */}
                  {stage === 'cracking' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="text-9xl text-white/40 font-black">⚡</div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  key="pet-reveal"
                  initial={{ scale: 0, rotateY: -180, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1], 
                    rotateY: [0, 360, 720],
                    opacity: 1 
                  }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="relative z-20 flex items-center justify-center"
                >
                  <div className="relative">
                    <span 
                      className="block text-[12rem] drop-shadow-2xl relative z-30"
                    >
                      {pet.emoji || '🐣'}
                    </span>
                    
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-10 border-4 border-dashed border-orange-200 rounded-full -z-10"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Mission / Context Text */}
        <div className="max-w-sm w-full px-8">
          <AnimatePresence mode="wait">
            {stage === 'missions' && (
              <motion.div 
                key={`mission-${currentMission}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                  <Sparkles size={12} />
                  Mission {currentMission + 1}: {missions[currentMission].title}
                </div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">{missions[currentMission].description}</h1>
                
                <div className="w-full h-3 bg-white border border-orange-100 rounded-full overflow-hidden shadow-inner mt-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(missionProgress / missions[currentMission].goal) * 100}%` }}
                    className="h-full bg-linear-to-r from-orange-400 to-red-400"
                  />
                </div>

                {missions[currentMission].type === 'hold' && (
                  <button
                    onMouseDown={() => setIsHolding(true)}
                    onMouseUp={() => setIsHolding(false)}
                    onMouseLeave={() => setIsHolding(false)}
                    onTouchStart={() => setIsHolding(true)}
                    onTouchEnd={() => setIsHolding(false)}
                    className="mt-6 w-full bg-slate-900 text-white font-black py-5 rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                  >
                    <div className={cx(
                      "w-3 h-3 rounded-full bg-white transition-all",
                      isHolding ? "scale-150 animate-pulse bg-orange-400" : "scale-100"
                    )} />
                    {isHolding ? "Synchronizing..." : "Hold to Sing"}
                  </button>
                )}

                {missions[currentMission].type === 'tap' && (
                  <div className="mt-4 text-[10px] text-slate-400 font-black uppercase tracking-widest animate-pulse">
                    Tap the egg to warm it up
                  </div>
                )}
              </motion.div>
            )}

            {stage === 'cracking' && (
              <motion.div 
                key="cracking"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2"
              >
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">IT'S HATCHING!</h1>
                <p className="text-orange-500 font-black text-xs uppercase tracking-widest">Tap one more time!</p>
              </motion.div>
            )}

            {stage === 'hatched' && (
              <motion.div 
                key="hatched-info"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="space-y-1">
                  <p className="text-orange-500 font-black text-xs uppercase tracking-widest">Cosmic Link Established</p>
                  <h1 className="text-6xl font-black text-slate-900 tracking-tight capitalize leading-none">{pet.name}!</h1>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <span className="bg-orange-100 text-orange-600 font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest shadow-sm">Lv. 0 Origin</span>
                  <span className="bg-indigo-100 text-indigo-600 font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest shadow-sm">{pet.trait} Soul</span>
                </div>

                <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-orange-50 max-w-sm mx-auto">
                  <p className="text-slate-600 font-bold leading-relaxed italic text-sm">
                    "{pet.name} has crossed the threshold! They've absorbed your {pet.trait} energy and are ready to guide you through the cosmic void."
                  </p>
                </div>

                <button
                  onClick={() => navigate('/home')}
                  className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] active:scale-95 transition-all text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800"
                >
                  Enter Home Sanctuary
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {stage === 'hatched' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            className="absolute inset-0 pointer-events-none z-0"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.5)_0,transparent_70%)] animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cx(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
