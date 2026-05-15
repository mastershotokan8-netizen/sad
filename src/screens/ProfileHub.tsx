import { Settings, Award, Zap, Clock, Shield, ArrowRight, UserX, KeyRound, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cx(...args: (string | undefined | null | false)[]) {
  return twMerge(clsx(...args));
}

export default function ProfileHub() {
  const navigate = useNavigate();
  const [pet, setPet] = useState<any>({ name: 'Orb', emoji: '🥚', trait: 'Special' });
  const [assistant, setAssistant] = useState<any>(null);
  const [stats, setStats] = useState({
    screenTime: '2.4h',
    attendance: '94%',
    submissionRate: '88%',
    streak: 12,
    engagement: 76
  });

  useEffect(() => {
    const savedPet = JSON.parse(localStorage.getItem('userPet') || '{}');
    if (savedPet.name) setPet(savedPet);
    
    const savedAssistant = JSON.parse(localStorage.getItem('userAssistant') || '{}');
    if (savedAssistant.name) setAssistant(savedAssistant);

    // Calculate real stats where possible
    const studySubmissions = JSON.parse(localStorage.getItem('studySubmissions') || '[]');
    if (studySubmissions.length > 0) {
      const completed = studySubmissions.filter((s:any) => s.completed).length;
      const rate = Math.round((completed / studySubmissions.length) * 100);
      setStats(prev => ({ ...prev, submissionRate: `${rate}%` }));
    }

    const chatMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const engagementScore = Math.min(100, 40 + (chatMessages.length * 2) + (studySubmissions.length * 5));
    setStats(prev => ({ ...prev, engagement: engagementScore }));

  }, []);

  const renderAvatar = (data: any, size: 'sm' | 'lg' = 'sm') => {
    if (!data) return null;
    if (data.avatar && data.avatar.type === 'human') {
      const { skinTone, hairColor, hairStyle, outfitColor, expression, accessory } = data.avatar;
      
      const headSize = size === 'lg' ? 'w-24 h-24' : 'w-10 h-10';
      const bodyWidth = size === 'lg' ? 'w-32 h-14' : 'w-14 h-6';
      
      return (
        <div className="flex flex-col items-center">
          <div 
            className={cx("rounded-full border-4 border-white shadow-xl relative z-10 overflow-hidden", headSize)}
            style={{ backgroundColor: skinTone }}
          >
            {/* Simple face features */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pt-1 scale-50">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-slate-800 opacity-80" />
                <div className="w-2 h-2 rounded-full bg-slate-800 opacity-80" />
              </div>
              {expression === 'Smile' && <div className="w-8 h-4 border-b-2 border-slate-800 rounded-full" />}
              {expression === 'Think' && <div className="w-6 h-1 bg-slate-800 rounded-full" />}
              {expression === 'Focus' && <div className="w-4 h-4 border-2 border-slate-800 rounded-full" />}
              {expression === 'Neutral' && <div className="w-6 h-0.5 bg-slate-800 rounded-full opacity-50" />}
            </div>

            <div className="absolute -top-1 -inset-x-0.5 flex justify-center">
               {hairStyle === 'Short' && <div className="w-full h-1/2 rounded-t-full" style={{ backgroundColor: hairColor }} />}
               {hairStyle === 'Long' && <div className="w-full h-full rounded-b-lg -mt-1" style={{ backgroundColor: hairColor }} />}
               {hairStyle === 'Curly' && <div className="w-[110%] h-[60%] rounded-full opacity-80" style={{ backgroundColor: hairColor }} />}
               {hairStyle === 'Ponytail' && <div className="w-full h-1/2 rounded-t-full relative" style={{ backgroundColor: hairColor }}><div className="absolute top-1 right-0 w-4 h-6 rounded-full" style={{ backgroundColor: hairColor }} /></div>}
            </div>
            {accessory === 'Glasses' && <div className="absolute top-[40%] inset-x-2 h-2 border-y-[1px] border-slate-800/20" />}
          </div>
          <div 
            className={cx("rounded-t-full mt-[-15px] shadow-lg", bodyWidth)}
            style={{ backgroundColor: outfitColor }}
          />
        </div>
      );
    }
    
    return (
      <div className={cx("bg-white shadow-xl border-4 border-white flex items-center justify-center relative", size === 'lg' ? "w-24 h-24 rounded-[2rem] text-5xl" : "w-10 h-10 rounded-xl text-xl")}>
        {data.emoji || '🐣'}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#FFFBF5] relative overflow-hidden font-sans">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -ml-20 -mb-20"></div>

        {/* Header */}
        <div className="px-6 py-8 flex justify-between items-center z-20 relative">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile</h1>
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/settings')}
                  className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Settings size={20} />
                </button>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lv. 14</span>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6 z-10 custom-scrollbar">
            {/* Identity Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
                {/* Assistant Card */}
                <div 
                  onClick={() => navigate('/assistant-setup')}
                  className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer"
                >
                    <div className="absolute top-0 left-0 w-full h-12 bg-indigo-50 group-hover:bg-indigo-100 transition-colors"></div>
                    <div className="relative z-10 mb-4 pt-2">
                        {renderAvatar(assistant, 'lg')}
                    </div>
                    <h2 className="text-sm font-black text-slate-900 leading-tight">Virtual Companion</h2>
                    <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mt-1">
                        YOUR REFLECTION
                    </p>
                </div>

                {/* Pet Card */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-12 bg-orange-50 group-hover:bg-orange-100 transition-colors"></div>
                    <div className="relative z-10 mb-4 pt-2">
                        {renderAvatar(pet, 'lg')}
                    </div>
                    <h2 className="text-sm font-black text-slate-900 leading-tight">{pet.name}</h2>
                    <p className="text-[8px] font-black text-orange-400 uppercase tracking-widest mt-1">
                        ORB ISLAND COMPANION
                    </p>
                </div>
            </div>

            {/* New Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                    <div className="text-xl font-black text-slate-900">{stats.attendance}</div>
                    <div className="w-full h-1 bg-slate-50 mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: stats.attendance }} />
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Submission Rate</p>
                    <div className="text-xl font-black text-slate-900">{stats.submissionRate}</div>
                    <div className="w-full h-1 bg-slate-50 mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400" style={{ width: stats.submissionRate }} />
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">App Streak</p>
                    <div className="flex items-center gap-2">
                        <div className="text-xl font-black text-slate-900">{stats.streak} Days</div>
                        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                            <Zap size={10} className="text-orange-500 fill-orange-500" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Engagement</p>
                    <div className="text-xl font-black text-slate-900">{stats.engagement}%</div>
                    <div className="w-full h-1 bg-slate-50 mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400" style={{ width: `${stats.engagement}%` }} />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FFF9F2] rounded-[2rem] p-6 border-2 border-orange-100">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-orange-500 mb-4">
                        <Clock size={20} />
                    </div>
                    <div className="text-2xl font-black text-slate-900">{stats.screenTime}</div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Screen Time</p>
                </div>
                <div className="bg-[#FFF9F2] rounded-[2rem] p-6 border-2 border-orange-100">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500 mb-4">
                        <Award size={20} />
                    </div>
                    <div className="text-2xl font-black text-slate-900">Synchronized</div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Social Harmony</p>
                </div>
            </div>

            {/* Settings & Misc */}
            <div className="space-y-3">
                <button 
                  onClick={() => navigate('/settings/privacy')}
                  className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between group active:scale-95 transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-100">
                            <Shield size={20} />
                        </div>
                        <span className="font-black text-slate-800 text-sm">Account Privacy</span>
                    </div>
                    <div className="text-slate-300">
                      <ArrowRight size={20} />
                    </div>
                </button>
                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                    }}
                    className="w-full bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between group active:scale-95 transition-all text-[#FF6B6B]"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100">
                            <Settings size={20} />
                        </div>
                        <span className="font-black text-sm">Reset Experience</span>
                    </div>
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    </div>
  );
}
