import { Zap, Heart, Sun, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

function cx(...args: (string | undefined | null | false)[]) {
  return args.filter(Boolean).join(' ');
}

export default function Home() {
  const navigate = useNavigate();
  const [userPet, setUserPet] = useState<any>(null);
  const [evolution, setEvolution] = useState(() => {
    const saved = localStorage.getItem('petEvolution');
    return saved ? parseInt(saved) : 0;
  });
  const [mood, setMood] = useState(70);
  const [energy, setEnergy] = useState(70);
  const [affection, setAffection] = useState(0);
  const [pings, setPings] = useState<{ id: string, text: string }[]>([]);
  const [hasNewMissions, setHasNewMissions] = useState(false);
  const [showMissionsList, setShowMissionsList] = useState(false);
  const [missions, setMissions] = useState<any[]>([]);
  const [reflectionStats, setReflectionStats] = useState({
    engagement: 0,
    submission: 0,
    streak: 12
  });

  useEffect(() => {
    const savedPet = JSON.parse(localStorage.getItem('userPet') || '{}');
    if (savedPet.name) setUserPet(savedPet);
    
    // Energy analysis from Chat Patterns (Sync with chat/missions)
    const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const userMessages = chatMessages.filter((m: any) => m.sender === 'You').map((m: any) => m.text.toLowerCase());
    
    const posWords = ['happy', 'good', 'great', 'excited', 'done', 'achieved', 'focus', 'proud', 'love', 'thanks', 'wonderful'];
    const negWords = ['sad', 'stressed', 'tired', 'stuck', 'bad', 'fail', 'hard', 'impossible', 'anxious', 'hate', 'terrible', 'upset'];
    
    let score = 70;
    userMessages.forEach((msg: string) => {
      posWords.forEach(word => { if (msg.includes(word)) score += 2; });
      negWords.forEach(word => { if (msg.includes(word)) score -= 3; });
    });
    
    const studySubmissions = JSON.parse(localStorage.getItem('studySubmissions') || '[]');
    setMissions(studySubmissions);
    const completedCount = studySubmissions.filter((s:any) => s.completed).length;
    const activeTasksCount = studySubmissions.filter((s:any) => !s.completed).length;
    
    setHasNewMissions(activeTasksCount > 0);
    
    score += completedCount * 5;
    score -= activeTasksCount * 2;
    
    const finalScore = Math.min(100, Math.max(0, score));
    setEnergy(finalScore);
    setMood(finalScore);

    // Set reflection stats
    setReflectionStats({
        engagement: Math.min(100, 40 + (chatMessages.length * 2)),
        submission: studySubmissions.length > 0 ? Math.round((completedCount / studySubmissions.length) * 100) : 0,
        streak: 12
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('petEvolution', evolution.toString());
  }, [evolution]);

  const handlePetting = () => {
    setAffection(prev => {
      const next = prev + 5;
      if (next >= 100) {
        setEvolution(e => e + 1);
        return 0;
      }
      return next;
    });
    setMood(m => Math.min(100, m + 2));
    
    const id = Math.random().toString();
    const texts = ["Happy! ✨", "Love you! ❤️", "Purr... 🐾", "Mlem! 👅", "Yay! 🌟"];
    setPings(prev => [...prev, { id, text: texts[Math.floor(Math.random() * texts.length)] }]);
    setTimeout(() => setPings(prev => prev.filter(p => p.id !== id)), 2000);
  };

  const renderAvatar = () => {
    if (!userPet) return null;
    if (userPet.avatar && userPet.avatar.type === 'human') {
      const { skinTone, hairColor, hairStyle, outfitColor, expression, accessory } = userPet.avatar;
      
      return (
        <div className="flex flex-col items-center">
          <div 
            className="w-32 h-32 rounded-full border-4 border-white shadow-2xl relative overflow-hidden"
            style={{ backgroundColor: skinTone }}
          >
            {/* Simple face features */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pt-4">
              <div className="flex gap-6">
                <div className="w-3 h-3 rounded-full bg-slate-800 opacity-80" />
                <div className="w-3 h-3 rounded-full bg-slate-800 opacity-80" />
              </div>
              {expression === 'Smile' && <div className="w-10 h-5 border-b-4 border-slate-800 rounded-full" />}
              {expression === 'Think' && <div className="w-8 h-1.5 bg-slate-800 rounded-full" />}
              {expression === 'Focus' && <div className="w-6 h-6 border-4 border-slate-800 rounded-full" />}
              {expression === 'Neutral' && <div className="w-8 h-1 bg-slate-800 rounded-full opacity-50" />}
            </div>

            <div className="absolute top-0 inset-x-0 flex justify-center">
               {hairStyle === 'Short' && <div className="w-full h-10 rounded-t-full" style={{ backgroundColor: hairColor }} />}
               {hairStyle === 'Long' && <div className="w-full h-full -mt-2 rounded-b-lg" style={{ backgroundColor: hairColor }} />}
               {hairStyle === 'Curly' && <div className="w-[120%] h-12 -ml-[10%] rounded-full opacity-90" style={{ backgroundColor: hairColor }} />}
               {hairStyle === 'Ponytail' && <div className="w-full h-10 rounded-t-full relative" style={{ backgroundColor: hairColor }}><div className="absolute top-4 right-0 w-8 h-12 rounded-full" style={{ backgroundColor: hairColor }} /></div>}
            </div>
            {accessory === 'Glasses' && <div className="absolute top-12 inset-x-4 h-8 border-y-4 border-slate-800/20" />}
          </div>
          <div 
            className="w-40 h-20 rounded-t-[3rem] border-4 border-white shadow-xl mt-[-20px] relative z-0"
            style={{ backgroundColor: outfitColor }}
          />
        </div>
      );
    }
    
    return (
      <div className="text-9xl filter drop-shadow-2xl">
        {userPet.emoji || '🐣'}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#F8FAFC] overflow-hidden relative font-sans">
      {/* Missions Overlay */}
      <AnimatePresence>
        {showMissionsList && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMissionsList(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed inset-x-0 bottom-0 max-h-[80vh] bg-white rounded-t-[3rem] shadow-2xl z-[110] p-8 flex flex-col"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">Missions</h2>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Reflections required</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <Sparkles size={24} />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-8">
                {missions.length > 0 ? (
                  missions.filter(m => !m.completed).map((m: any) => (
                    <div key={m.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-orange-500">
                          <Zap size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{m.title || 'Untitled Mission'}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Due {m.deadline ? new Date(m.deadline).toLocaleDateString() : 'Soon'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/submissions')}
                        className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-400 font-bold italic">No active missions. You're synchronized. ✨</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-linear-to-b from-orange-50/50 to-indigo-50/30 -z-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[60%] bg-[radial-gradient(circle,rgba(255,165,0,0.05)_0,transparent_70%)] rounded-full blur-[100px]" />
      
      {/* Top Header */}
      <div className="px-8 pt-10 pb-6 flex justify-between items-end z-20">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            {userPet?.name || 'Sanctuary'}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evolution LV.{evolution}</span>
            </div>
            {energy > 70 && (
                <div className="px-3 py-1 bg-orange-500 rounded-full shadow-lg shadow-orange-200">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Glowing ✨</span>
                </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {hasNewMissions && (
            <div className="relative group">
              <button 
                onClick={() => setShowMissionsList(true)}
                className="w-14 h-14 rounded-2xl bg-[#FF6B6B] text-white flex items-center justify-center shadow-xl shadow-red-100 active:scale-90 transition-all animate-pulse"
              >
                <Sparkles size={24} />
              </button>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-[#F8FAFC]">
                 <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
            </div>
          )}
          <button 
            onClick={() => setShowMissionsList(true)}
            className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all active:scale-95 relative"
          >
            <Zap size={20} className={hasNewMissions ? "animate-bounce" : ""} />
            {hasNewMissions && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full" />
            )}
          </button>
          <button 
            onClick={() => navigate('/nova')}
            className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200 active:scale-90 transition-all relative"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      </div>

      {/* Main Pet Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-8">
        {/* Floating platform effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-slate-900/5 blur-[40px] rounded-[100%] mt-24" />
        
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          onClick={handlePetting}
          className="relative z-10 cursor-pointer group"
        >
          {renderAvatar()}
          
          {/* Instruction Tooltip */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-2xl shadow-xl border border-slate-100 whitespace-nowrap"
          >
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tap to pet 💖</span>
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-slate-100" />
          </motion.div>

          {/* User Ping Popups */}
          <AnimatePresence>
            {pings.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: -60 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-2xl z-50 whitespace-nowrap"
              >
                <span className="text-xs font-black uppercase tracking-widest">{p.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Affection Particle */}
          <AnimatePresence>
            {affection > 0 && (
              <motion.div
                key={affection}
                initial={{ opacity: 1, y: 0, scale: 0 }}
                animate={{ opacity: 0, y: -80, scale: 2 }}
                className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none"
              >
                <Heart className="text-pink-500 fill-pink-500" size={32} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stats Bottom Card */}
      <div className="px-6 pb-24">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1.2rem] bg-orange-50 flex items-center justify-center">
                <Sparkles className="text-orange-400" size={20} />
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Energy Stats</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Affection</p>
                <div className="w-20 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${affection}%` }}
                        className="h-full bg-pink-400"
                    />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
               <div className="flex items-center gap-2 mb-2">
                 <Heart className="text-pink-500 fill-pink-50" size={14} />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Mood</span>
               </div>
               <div className="flex items-end gap-2">
                 <span className="text-2xl font-black text-slate-900">{mood}%</span>
                 <span className="text-[10px] font-bold text-slate-400 mb-0.5">{mood > 70 ? 'Peaceful' : 'Mellow'}</span>
               </div>
            </div>
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
               <div className="flex items-center gap-2 mb-2">
                 <Zap className="text-orange-500" size={14} />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Sync</span>
               </div>
               <div className="flex items-end gap-2">
                 <span className="text-2xl font-black text-slate-900">{reflectionStats.engagement}%</span>
                 <span className="text-[10px] font-bold text-slate-400 mb-0.5">Focus</span>
               </div>
            </div>
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
               <div className="flex items-center gap-2 mb-2">
                 <Sun className="text-amber-500" size={14} />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Energy</span>
               </div>
               <div className="flex items-end gap-2">
                 <span className="text-2xl font-black text-slate-900">{energy}%</span>
                 <span className="text-[10px] font-bold text-slate-400 mb-0.5">Health</span>
               </div>
            </div>
            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
               <div className="flex items-center gap-2 mb-2">
                 <Sparkles className="text-indigo-500" size={14} />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Missions</span>
               </div>
               <div className="flex items-end gap-2">
                 <span className="text-2xl font-black text-slate-900">{reflectionStats.submission}%</span>
                 <span className="text-[10px] font-bold text-slate-400 mb-0.5">Rate</span>
               </div>
            </div>
          </div>

          <p className="text-[13px] text-slate-500 font-medium leading-relaxed italic text-center">
            "{userPet?.name}'s state is a reflection of your mental harmony. Keep striving for balance."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
