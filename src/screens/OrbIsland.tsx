import { ArrowLeft, Map, Sparkles, Heart, Sun, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const PET_TYPES = {
  playful: { name: 'Pippin', emoji: '🐶', color: 'text-orange-500', bg: 'bg-orange-50', trait: 'Playful', pos: { top: '30%', left: '15%' } },
  calm: { name: 'Luna', emoji: '🐨', color: 'text-blue-500', bg: 'bg-blue-50', trait: 'Calm', pos: { top: '45%', left: '40%' } },
  brave: { name: 'Leo', emoji: '🦁', color: 'text-red-500', bg: 'bg-red-50', trait: 'Brave', pos: { top: '20%', left: '70%' } },
  studious: { name: 'Sage', emoji: '🐢', color: 'text-green-500', bg: 'bg-green-50', trait: 'Studious', pos: { top: '65%', left: '25%' } },
  energetic: { name: 'Volt', emoji: '🦆', color: 'text-yellow-500', bg: 'bg-yellow-50', trait: 'Energetic', pos: { top: '75%', left: '60%' } },
  creative: { name: 'Sketch', emoji: '🐙', color: 'text-purple-500', bg: 'bg-purple-50', trait: 'Creative', pos: { top: '40%', left: '80%' } },
  social: { name: 'Bubbles', emoji: '🐬', color: 'text-cyan-500', bg: 'bg-cyan-50', trait: 'Friendly', pos: { top: '85%', left: '10%' } },
  focused: { name: 'Atlas', emoji: '🦉', color: 'text-indigo-500', bg: 'bg-indigo-50', trait: 'Bright', pos: { top: '10%', left: '35%' } }
};

function cx(...args: (string | undefined | null | false)[]) {
  return args.filter(Boolean).join(' ');
}

export default function OrbIsland() {
  const navigate = useNavigate();
  const [userPet, setUserPet] = useState<any>(null);
  const [showBottleComposer, setShowBottleComposer] = useState(false);
  const [bottleMessage, setBottleMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [bottles, setBottles] = useState<{ id: string, message: string, x: number, y: number }[]>([]);
  const [pings, setPings] = useState<{ id: string, text: string, x: string, y: string }[]>([]);
  
  const [activeResidents, setActiveResidents] = useState(8);

  useEffect(() => {
    const saved = localStorage.getItem('userPet');
    if (saved) setUserPet(JSON.parse(saved));
    
    // Simulate resident count fluctuation
    const interval = setInterval(() => {
      setActiveResidents(prev => Math.max(3, Math.min(12, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const pingPet = (pet: any) => {
    const id = Math.random().toString();
    const texts = ["Hello! 👋", "Studying? 📚", "Keep going! ✨", "Nice hat! 🎩", "Vibing... 🌊"];
    setPings(prev => [...prev, { 
      id, 
      text: texts[Math.floor(Math.random() * texts.length)], 
      x: pet.pos.left, 
      y: pet.pos.top 
    }]);
    setTimeout(() => setPings(prev => prev.filter(p => p.id !== id)), 3000);
  };

  const pingUser = () => {
    const id = Math.random().toString();
    setPings(prev => [...prev, { id, text: "I'm here! 🌟", x: '45%', y: '50%' }]);
    setTimeout(() => setPings(prev => prev.filter(p => p.id !== id)), 3000);
  };

  const renderAvatar = (pet: any, isUser: boolean = false) => {
    if (pet.avatar && pet.avatar.type === 'human') {
      const { skinTone, hairColor, hairStyle, outfitColor, expression, accessory } = pet.avatar;
      const expressionEmoji = expression === 'Happy' ? '😊' : expression === 'Cool' ? '😎' : expression === 'Thinking' ? '🤔' : expression === 'Wink' ? '😉' : '😌';
      
      return (
        <div className="flex flex-col items-center">
          <div 
            className="w-16 h-16 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-3xl relative"
            style={{ backgroundColor: skinTone }}
          >
            <span className="relative z-10">{expressionEmoji}</span>
            <div className="absolute -top-1 -inset-x-0.5 flex justify-center">
               {hairStyle === 'Short' && <div className="w-full h-1/2 rounded-t-full" style={{ backgroundColor: hairColor }} />}
               {hairStyle === 'Long' && <div className="w-full h-full rounded-b-lg -mt-1" style={{ backgroundColor: hairColor }} />}
            </div>
            {isUser && <div className="absolute -top-3 -right-3 text-2xl">✨</div>}
          </div>
          <div 
            className="w-20 h-10 rounded-t-full mt-[-10px] shadow-lg"
            style={{ backgroundColor: outfitColor }}
          />
        </div>
      );
    }
    
    return (
      <div className={cx("filter drop-shadow-xl transform transition-transform group-hover:scale-110", isUser ? "text-8xl" : "text-7xl")}>
        {pet.emoji}
      </div>
    );
  };

  const throwBottle = () => {
    if (!bottleMessage.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setShowBottleComposer(false);
      setBottleMessage('');
      alert("Splash! 🌊 Your message has been sent into the galactic ocean. It will travel to a random pet soon.");
    }, 2000);
  };

  useEffect(() => {
    // Simulate finding a bottle once in a while
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && bottles.length < 3) {
        setBottles(prev => [...prev, {
          id: Math.random().toString(),
          message: "You're doing great! Keep going! ✨",
          x: 20 + Math.random() * 60,
          y: 60 + Math.random() * 30
        }]);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [bottles]);

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] overflow-hidden relative font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -ml-20 -mb-20"></div>

      {/* Message in a Bottle Modal */}
      <AnimatePresence>
        {showBottleComposer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border-2 border-orange-100 flex flex-col gap-6"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-3xl">
                  🍾
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-none">Message in a Bottle</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center">Write something sweet for another pet and throw it into the ocean.</p>
              </div>

              <textarea 
                value={bottleMessage}
                onChange={(e) => setBottleMessage(e.target.value)}
                placeholder="Ex: Hope you're having a magical day! You're stronger than you think. ✨"
                className="w-full h-32 bg-slate-50 rounded-2xl p-4 text-sm font-bold text-slate-800 placeholder-slate-300 outline-none border border-slate-100 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowBottleComposer(false)}
                  className="flex-1 bg-slate-50 text-slate-400 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                >
                  Keep it
                </button>
                <button 
                  onClick={throwBottle}
                  disabled={!bottleMessage.trim() || isSending}
                  className="flex-1 bg-slate-900 text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                      🌀
                    </motion.div>
                  ) : "Throw it!"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <div className="flex justify-between items-center px-6 py-8 z-20 relative">
        <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-900 leading-none">Orb Island</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Multiplayer Social Space</p>
        </div>
        
        <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{activeResidents} Active</span>
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
        </div>
        
        {/* Bottle Action */}
        <button 
          onClick={() => setShowBottleComposer(true)}
          className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 hover:bg-indigo-100 shadow-sm transition-all cursor-pointer active:scale-90"
        >
          <Sparkles size={20} />
        </button>
      </div>

      {/* The Island Map */}
      <div className="flex-1 relative mt-10">
        
        {/* Bottles in the water */}
        <AnimatePresence>
          {bottles.map(bottle => (
            <motion.div
              key={bottle.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{ left: `${bottle.x}%`, top: `${bottle.y}%` }}
              className="absolute z-0 cursor-pointer"
              onClick={() => {
                alert(`Someone left a message: "${bottle.message}"`);
                setBottles(prev => prev.filter(b => b.id !== bottle.id));
              }}
            >
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [-5, 5, -5]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="text-4xl filter drop-shadow-md brightness-110"
              >
                🍾
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Pings */}
        <AnimatePresence>
          {pings.map(ping => (
            <motion.div
              key={ping.id}
              initial={{ opacity: 0, scale: 0, y: 0 }}
              animate={{ opacity: 1, scale: 1, y: -40 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{ left: ping.x, top: ping.y }}
              className="absolute z-50 bg-white px-3 py-1.5 rounded-2xl shadow-xl border border-orange-100"
            >
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest whitespace-nowrap">
                {ping.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Decorative elements */}
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 120, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,249,242,0.5)_0,transparent_100%)] opacity-40"
        />
        
        <div className="absolute top-10 left-10 text-orange-200 opacity-50">
          <Sun size={64} />
        </div>
        <div className="absolute top-40 right-20 text-slate-200 opacity-40">
          <Cloud size={48} />
        </div>

        {/* Pets */}
        {Object.entries(PET_TYPES).map(([key, pet], i) => (
          <motion.div
            key={key}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            style={{ top: pet.pos.top, left: pet.pos.left }}
            className="absolute z-10"
          >
            <motion.div
              onClick={() => pingPet(pet)}
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              {renderAvatar(pet)}
              <motion.div 
                className="mt-2 bg-white px-3 py-1 rounded-xl shadow-lg border border-orange-100 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest whitespace-nowrap">
                  {pet.name}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}

        {/* User Pet/Avatar */}
        {userPet && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            style={{ top: '55%', left: '45%' }}
            className="absolute z-20"
          >
            <motion.div
              onClick={pingUser}
              animate={{ 
                y: [0, -15, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative">
                {renderAvatar(userPet, true)}
                <div className="absolute -top-4 -right-4 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">YOU</div>
              </div>
              <motion.div 
                className="mt-4 bg-slate-900 px-4 py-2 rounded-xl shadow-xl border border-white opacity-100"
              >
                <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">
                  {userPet.name} (TAP TO WAVE)
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Stats/Footer Card */}
      <div className="px-6 pb-12 z-10">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#FFF9F2] rounded-[2.5rem] p-8 shadow-sm border-2 border-orange-100 flex flex-col gap-6"
        >
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                        <Sparkles className="text-orange-400" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 leading-none">Island Vibes</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Connecting pet souls</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Population</div>
                    <div className="flex justify-end gap-1">
                        {[...Array(5)].map((_, i) => (
                           <motion.div 
                             key={i}
                             animate={{ scale: i < (activeResidents/2) ? [1, 1.2, 1] : 1 }}
                             transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                             className={cx("w-2 h-2 rounded-full", i < (activeResidents/2) ? "bg-orange-400" : "bg-slate-200")}
                           />
                        ))}
                    </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-[2rem] border border-orange-50 shadow-sm">
                <p className="text-sm text-slate-500 leading-relaxed font-bold italic">
                  "Orb Island is a shared meta-space where pets from all over the galaxy hang out. Find messages in bottles or wave at other residents!"
                </p>
             </div>
             
             <button 
               onClick={() => navigate('/home')}
               className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 shadow-xl"
             >
               Return Home
             </button>
        </motion.div>
      </div>
    </div>
  );
}
