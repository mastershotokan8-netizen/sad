import { ArrowLeft, Plus, Calendar, Clock, CheckCircle2, Trash2, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Submission {
  id: string;
  title: string;
  dueDate: string;
  subject: string;
  completed: boolean;
}

export default function Submissions() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newSub, setNewSub] = useState({ title: '', dueDate: '', subject: '' });

  useEffect(() => {
    const saved = localStorage.getItem('studySubmissions');
    if (saved) setSubmissions(JSON.parse(saved));
  }, []);

  const saveSubmissions = (subs: Submission[]) => {
    setSubmissions(subs);
    localStorage.setItem('studySubmissions', JSON.stringify(subs));
  };

  const addSubmission = () => {
    if (!newSub.title || !newSub.dueDate) return;
    const sub: Submission = {
      id: Date.now().toString(),
      ...newSub,
      completed: false
    };
    saveSubmissions([sub, ...submissions]);
    setNewSub({ title: '', dueDate: '', subject: '' });
    setShowAdd(false);
  };

  const toggleComplete = (id: string) => {
    saveSubmissions(submissions.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const deleteSub = (id: string) => {
    saveSubmissions(submissions.filter(s => s.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-[#0A0A0C] font-sans text-white relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-8 backdrop-blur-3xl bg-black/40 border-b border-white/5 z-30 sticky top-0">
        <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black tracking-tighter uppercase">Radar</h1>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white cursor-pointer shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-20 flex flex-col gap-6 no-scrollbar relative z-10">
        {submissions.length === 0 && !showAdd && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
            <BookOpen size={80} className="text-white mb-6" strokeWidth={1} />
            <p className="font-black text-white text-xs uppercase tracking-[0.2em] max-w-[200px] leading-relaxed">No Cycles Detected. Initialize a new mission.</p>
          </div>
        )}

        <AnimatePresence>
          {showAdd && (
            <motion.div 
              initial={{ height: 0, opacity: 0, scale: 0.95 }}
              animate={{ height: 'auto', opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0, scale: 0.95 }}
              className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl overflow-hidden mb-8"
            >
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">New Cycle</h2>
              <div className="flex flex-col gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest ml-1">Assignment Title</span>
                  <input 
                    type="text" 
                    placeholder="e.g., Matrix Theory" 
                    value={newSub.title}
                    onChange={e => setNewSub({...newSub, title: e.target.value})}
                    className="w-full bg-white/5 p-5 rounded-2xl font-bold placeholder-slate-700 outline-none border border-white/5 focus:border-indigo-500 transition-all text-white"
                  />
                </div>
                <div className="space-y-1">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject domain</span>
                  <input 
                    type="text" 
                    placeholder="e.g., Physics" 
                    value={newSub.subject}
                    onChange={e => setNewSub({...newSub, subject: e.target.value})}
                    className="w-full bg-white/5 p-5 rounded-2xl font-bold placeholder-slate-700 outline-none border border-white/5 focus:border-indigo-500 transition-all text-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Deadline Sync</span>
                  <div className="flex items-center bg-white/5 rounded-2xl pr-4 border border-white/5 focus-within:border-indigo-500 transition-all overflow-hidden">
                      <div className="w-14 items-center justify-center flex text-slate-500 border-r border-white/5">
                        <Calendar size={18} />
                      </div>
                      <input 
                        type="date" 
                        value={newSub.dueDate}
                        onChange={e => setNewSub({...newSub, dueDate: e.target.value})}
                        className="bg-transparent p-5 w-full font-bold outline-none text-white invert grayscale"
                      />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowAdd(false)}
                    className="flex-1 py-5 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl border border-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addSubmission}
                    className="flex-[2] py-5 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all"
                  >
                    Sync Deadline
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {submissions.map((sub) => (
            <motion.div
              layout
              key={sub.id}
              className={`p-6 rounded-[2rem] border transition-all relative overflow-hidden group ${
                sub.completed 
                ? 'bg-indigo-500/5 border-indigo-500/20 opacity-60' 
                : 'bg-white/5 border-white/10 shadow-xl'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => toggleComplete(sub.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      sub.completed ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-600 border border-white/5'
                    }`}
                  >
                    <CheckCircle2 size={24} />
                  </button>
                  <div>
                    <h3 className={`font-black text-sm uppercase tracking-tight ${sub.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                      {sub.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">{sub.subject}</span>
                       <span className="text-[8px] font-black text-slate-600">•</span>
                       <div className="flex items-center gap-1 text-slate-500">
                          <Clock size={10} />
                          <span className="text-[8px] font-black uppercase tracking-widest">{sub.dueDate}</span>
                       </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteSub(sub.id)}
                  className="w-10 h-10 rounded-xl bg-white/5 text-slate-700 hover:text-red-400 transition-colors flex items-center justify-center active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
