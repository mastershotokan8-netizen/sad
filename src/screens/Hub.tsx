import { Search, Bell, PenLine, HeartPulse, Bookmark, MessageSquare, MoreHorizontal, Heart, Zap, BookOpen, Map, Sparkles, ArrowRight, AlertCircle, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AnimatePresence, motion } from 'framer-motion';

function cx(...args: (string | undefined | null | false)[]) {
  return twMerge(clsx(...args));
}

export default function Hub() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showPing, setShowPing] = useState(false);
  const [pet, setPet] = useState({ name: 'Orb', emoji: '🥚' });
  const filters = ['All', 'Resources', 'Headspace', 'Vibes'];

  const resourcesData = [
    { id: 'r1', title: 'Calculus II PYQs (2020-2023)', type: 'PDF', size: '2.4MB', downloads: 124 },
    { id: 'r2', title: 'Genetics Lecture Notes - Unit 4', type: 'DOCX', size: '1.8MB', downloads: 89 },
    { id: 'r3', title: 'Macroeconomics Cheat Sheet', type: 'Image', size: '0.5MB', downloads: 342 },
    { id: 'r4', title: 'Organic Chemistry Lab Manual', type: 'PDF', size: '5.2MB', downloads: 56 },
  ];

  const headspaceData = [
    { id: 'h1', title: '3 AM Thoughts', posts: 12, latest: 'Do trees feel lonely at night?' },
    { id: 'h2', title: 'Deep Breaths', posts: 5, latest: 'Taking 5 mins before the exam.' },
    { id: 'h3', title: 'Late Night Focus', posts: 8, latest: 'Library ceiling is mesmerizing.' },
  ];

  const [vibes, setVibes] = useState([
    { id: 1, emoji: '👻', text: "Found some amazing lecture notes for the biology module. Link in bio! 📚", category: 'Resources', likes: 24, isThought: false },
    { id: 2, emoji: '🧘', text: "Does anyone else find the white noise in the lounge super focusing? ✨", category: 'Headspace', likes: 112, isThought: false },
    { id: 3, emoji: '✨', text: "Just saw the sunset from the library roof. Campus is beautiful sometimes.", category: 'Vibes', likes: 88, isThought: false },
    { id: 4, emoji: '📚', text: "New open-source textbook list for CS students just dropped. Check the resources tab!", category: 'Resources', likes: 42, isThought: false },
    { id: 5, emoji: '🌙', text: "If we all sleep at the same time, does the world stop rendering?", category: 'Headspace', likes: 210, isThought: true },
  ]);

  const [comments, setComments] = useState<Record<number, string[]>>({
    1: ["Thanks for sharing!", "Life saver!"],
    2: ["Absolutely, it's like magic.", "I prefer coffee shop sounds personally."],
    3: ["Stunning!", "Fav spot on campus."],
    4: ["Is there a link?"],
  });

  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = (id: number) => {
    if (!commentText.trim()) return;
    setComments(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), commentText]
    }));
    setCommentText('');
  };

  const [vibeNote, setVibeNote] = useState('');
  const [assistant, setAssistant] = useState<any>(null);

  const handleShareVibe = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!vibeNote.trim()) return;
    
    const newVibe = {
      id: Date.now(),
      emoji: ['🎭', '🎨', '🚀', '🌈', '🍦', '🎮'][Math.floor(Math.random() * 6)],
      text: vibeNote,
      category: 'Vibes',
      likes: 0
    };
    
    setVibes(prev => [newVibe, ...prev]);
    setVibeNote('');
    alert("Vibe shared! 🚀 It's now visible to others in your area.");
  };

  const handleLike = (id: number) => {
    setVibes(prev => prev.map(v => v.id === id ? { ...v, likes: v.likes + 1 } : v));
  };

  const filteredVibes = activeFilter === 'All' ? vibes : vibes.filter(v => v.category === activeFilter);

  useEffect(() => {
    const savedPet = JSON.parse(localStorage.getItem('userPet') || '{}');
    if (savedPet.name) setPet(savedPet);

    const savedAssistant = JSON.parse(localStorage.getItem('userAssistant') || '{}');
    if (savedAssistant.name) setAssistant(savedAssistant);

    const subs = JSON.parse(localStorage.getItem('studySubmissions') || '[]');
    const hasActiveSub = subs.some((s: any) => !s.completed);
    if (hasActiveSub) {
      setTimeout(() => setShowPing(true), 2000);
    }
  }, []);

  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Mission', text: 'Math homework due tomorrow!', time: '2m ago' },
    { id: 2, title: 'Quest Alert', text: 'Your Orb reached Lv. 0!', time: '1h ago' },
    { id: 3, title: 'Community', text: 'Someone liked your vibe! 🔥', time: '3h ago' }
  ]);

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] overflow-hidden relative font-sans text-slate-900">
      {/* Notification Drawer */}
      <AnimatePresence>
        {showNotificationDrawer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotificationDrawer(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[70] p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900">Notifications</h2>
                <button onClick={() => setShowNotificationDrawer(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {notifications.map(n => (
                  <div key={n.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{n.time}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700">{n.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex flex-col p-6"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-4 flex items-center gap-3">
                <Search size={20} className="text-slate-400" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search vibes..." 
                  className="bg-transparent border-none outline-none flex-1 text-slate-800 font-bold placeholder-slate-300"
                />
              </div>
              <button onClick={() => setShowSearch(false)} className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Top Header */}
      <div className="px-6 pt-8 pb-4 bg-transparent sticky top-0 z-40 flex justify-between items-center group">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Hub</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 ml-1">Connect with the campus community</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowSearch(true)} className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all active:scale-95">
            <Search size={20} />
          </button>
          <button 
            onClick={() => {
              setShowNotificationDrawer(true);
              setHasUnread(false);
            }}
            className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 relative hover:text-slate-600 transition-all active:scale-95"
          >
            <Bell size={20} className={showNotificationDrawer ? "fill-slate-900 text-slate-900" : ""} />
            {hasUnread && <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-white"></div>}
          </button>
        </div>

        {/* Floating Bubble Alert */}
        <AnimatePresence>
          {showPing && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="absolute top-24 left-6 right-6 z-50"
            >
              <div className="bg-white rounded-[2rem] p-4 shadow-xl border border-slate-100 flex items-center gap-4 relative">
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Sparkles size={10} className="text-white fill-white" />
                </div>
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shrink-0 rotate-[-8deg] shadow-inner border border-white">
                  {pet.emoji}
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Reminder</span>
                  <p className="text-[13px] text-slate-700 font-bold leading-tight mt-0.5">
                    {pet.name} says: "Let's tackle your upcoming study missions!"
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/submissions')}
                  className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-2 pb-32">
        {/* Horizontal Navigation */}
        <div className="px-6 py-4 flex gap-4 overflow-x-auto no-scrollbar sticky top-0 bg-transparent z-30">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cx(
                "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeFilter === filter 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "bg-white border border-slate-100 text-slate-400 hover:text-slate-600"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="px-6 space-y-6">
          {activeFilter === 'All' && (
            <>
              {/* AI Assistant Setup Banner - Only if not set */}
              {!assistant && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate('/assistant-setup')}
                  className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden cursor-pointer group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">Action Required</span>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Meet Your Guide</h2>
                    <p className="text-indigo-100 text-[14px] font-bold leading-snug max-w-[200px]">
                      Personalize your study assistant's look and personality traits.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest bg-white/10 w-fit px-4 py-2 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                      Setup Assistant <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Orb Island Banner */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/island')}
                className="bg-[#FFF9F2] rounded-[2.5rem] p-8 shadow-sm border-2 border-orange-100 relative overflow-hidden cursor-pointer group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-50/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-orange-600 uppercase tracking-widest border border-orange-200">Social Meta-Space</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Orb Island</h2>
                  <p className="text-slate-500 text-[14px] font-bold leading-snug max-w-[200px]">
                    Hang out with other pet residents in our floating meta-space.
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                    <div className="flex -space-x-3">
                      {['🐶', '🐨', '🦁', '🐢'].map((e, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-xl shadow-sm">{e}</div>
                      ))}
                    </div>
                    <span className="text-[11px] font-black text-slate-300">24+ others online</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Quick Note Input - Only for Vibes/All */}
          {(activeFilter === 'All' || activeFilter === 'Vibes') && (
            <form 
              onSubmit={handleShareVibe}
              className="bg-white rounded-[2rem] p-2 flex items-center gap-3 shadow-sm border border-slate-100 group focus-within:ring-2 focus-within:ring-indigo-100 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                <PenLine className="text-slate-400" size={20} />
              </div>
              <input 
                id="vibe-input"
                type="text" 
                value={vibeNote}
                onChange={(e) => setVibeNote(e.target.value)}
                placeholder="What's the vibe today?" 
                className="bg-transparent border-none outline-none flex-1 font-bold text-slate-800 placeholder-slate-300 px-2 text-sm"
              />
            </form>
          )}

          <div className="pt-4 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeFilter === 'All' ? 'Community Radar' : activeFilter}
            </h2>
            
            {activeFilter === 'Resources' && (
              <div className="grid grid-cols-1 gap-4 mb-8">
                {resourcesData.map(file => (
                  <div key={file.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-500 hover:shadow-xl transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800">{file.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{file.type} • {file.size} • {file.downloads} DLs</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeFilter === 'Headspace' && (
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                  {headspaceData.map(item => (
                    <div key={item.id} className="bg-linear-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-200 group transition-all hover:scale-[1.05] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                      <div className="flex items-center justify-between mb-4 text-indigo-100 relative z-10">
                        <Sparkles size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.posts} Active</span>
                      </div>
                      <h4 className="text-lg font-black mb-1 relative z-10">{item.title}</h4>
                      <p className="text-[11px] text-indigo-100 font-medium line-clamp-3 italic relative z-10 opacity-80 leading-relaxed">"{item.latest}"</p>
                      <button className="mt-4 text-[9px] font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/30 transition-colors">Enter Space</button>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white rounded-[3rem] p-8 border-2 border-indigo-50 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 to-purple-500"></div>
                   <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]">Live Stream: 3 AM Thoughts</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LIVE</span>
                      </div>
                   </div>
                   <div className="space-y-4">
                    {vibes.filter(v => v.isThought || v.category === 'Headspace').map(thought => (
                      <div key={thought.id} className="bg-slate-50/50 rounded-2xl p-5 border border-white flex flex-col gap-3">
                        <p className="text-[13px] font-bold text-slate-700 leading-relaxed italic">"{thought.text}"</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Heart size={12} className="fill-pink-500 text-pink-500" /> {thought.likes} resonated
                          </div>
                          <button className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Reply</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(activeFilter === 'All' || activeFilter === 'Vibes') && filteredVibes.map((post) => (
              <div key={post.id} className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-slate-50 flex flex-col gap-4 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
                <div className="flex items-center justify-between">
                  {/* ... remains same ... */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shadow-inner border border-white">
                      {post.emoji}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-sm">Anonymous</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">{post.category}</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-300 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                <p className="text-[16px] text-slate-700 leading-relaxed font-medium">
                  {post.text}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <div className="flex gap-6">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors group"
                    >
                      <div className={cx(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-xs",
                        post.likes > 0 ? "bg-pink-50 text-pink-500" : "bg-slate-50 text-slate-400"
                      )}>
                        <Heart size={18} className={post.likes > 0 ? "fill-pink-500" : ""} />
                      </div>
                      <span className="text-sm font-black tracking-tight">{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-slate-400 hover:text-indigo-500 transition-colors group"
                    >
                      <div className={cx(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-xs",
                        activeCommentId === post.id ? "bg-indigo-50 text-indigo-500" : "bg-slate-50 text-slate-400"
                      )}>
                        <MessageSquare size={18} />
                      </div>
                      <span className="text-sm font-black tracking-tight">{(comments[post.id] || []).length}</span>
                    </button>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-indigo-500 transition-colors shadow-xs">
                    <Bookmark size={20} />
                  </button>
                </div>

                {activeCommentId === post.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-slate-50 pt-4 mt-2 overflow-hidden"
                  >
                    <div className="space-y-3 mb-4">
                      {(comments[post.id] || []).map((c, i) => (
                        <div key={i} className="flex gap-2">
                          <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center text-[10px] shrink-0">👤</div>
                          <div className="bg-slate-50 rounded-xl p-2 flex-1">
                            <p className="text-[11px] text-slate-600 font-medium">{c}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-slate-50 border-none outline-none rounded-xl px-4 py-2 text-[11px] font-bold text-slate-800"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      />
                      <button 
                        onClick={() => handleAddComment(post.id)}
                        className="bg-indigo-500 text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                      >
                        Post
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
