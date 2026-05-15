import { MessageCircle, Globe, Shield, User, Home as HomeIcon, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function cx(...args: (string | undefined | null | false)[]) {
  return args.filter(Boolean).join(' ');
}

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentScreen = location.pathname.replace('/', '') || 'home';
  const [showPanic, setShowPanic] = useState(false);

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', path: '/home' },
    { id: 'nova', icon: MessageCircle, label: 'Chat', path: '/nova' },
    { id: 'safe', label: '', path: '#' },
    { id: 'explore', icon: Globe, label: 'Hub', path: '/hub' },
    { id: 'profile', icon: User, label: 'Me', path: '/profile' },
  ];

  return (
    <>
      <div className="absolute bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-orange-50 flex justify-between items-end px-6 pb-6 pt-3 z-[100] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => {
          if (item.id === 'safe') {
            return (
              <div key="safe" className="relative flex-1 flex flex-col items-center justify-center cursor-pointer group" onClick={() => setShowPanic(true)}>
                <div className="absolute -top-[42px] bg-white p-1.5 rounded-full shadow-2xl transition-all group-hover:-top-[46px]">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(239,68,68,0)", "0 0 20px rgba(239,68,68,0.2)", "0 0 0px rgba(239,68,68,0)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-linear-to-tr from-[#FF6B6B] to-[#FF8E8E] w-14 h-14 rounded-full flex items-center justify-center transform active:scale-90 transition-all duration-300"
                  >
                    <Shield className="text-white" size={24} fill="currentColor" fillOpacity={0.2} />
                  </motion.div>
                </div>
                <span className="text-[9px] text-[#FF6B6B] mt-10 font-black uppercase tracking-[0.2em]">Panic</span>
              </div>
            );
          }

          const isActive = currentScreen === item.id;
          const Icon = item.icon!;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 flex-1 cursor-pointer active:scale-95 transition-transform"
            >
              <Icon
                size={22}
                className={cx(
                   "transition-all duration-300",
                   isActive ? 'text-orange-500 scale-110' : 'text-slate-400'
                )}
                strokeWidth={isActive ? 3 : 2}
              />
              <span className={cx(
                "text-[8px] font-black uppercase tracking-widest transition-all",
                isActive ? 'text-slate-900' : 'text-slate-400'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showPanic && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm"
              onClick={() => setShowPanic(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[3rem] p-10 border border-orange-50 relative z-10 flex flex-col items-center shadow-2xl"
            >
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-5xl mb-6 shadow-inner">
                <span>🧘</span>
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 text-center mb-2 tracking-tight">
                Breath pause
              </h2>
              <p className="text-[14px] text-slate-500 text-center leading-relaxed mb-8 px-4 font-bold italic">
                A quick moment for you. We're right here. Everything is okay.
              </p>

              <div className="w-full space-y-3">
                <a 
                  href="tel:911"
                  className="w-full bg-[#FF6B6B] text-white font-black py-5 rounded-2xl active:scale-95 transition-transform text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
                >
                  <AlertCircle size={20} />
                  Call Emergency Help
                </a>
                
                <button 
                  onClick={() => { setShowPanic(false); navigate('/settings/security'); }}
                  className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl active:scale-95 transition-transform text-xs uppercase tracking-widest"
                >
                  Connect local support
                </button>
                
                <button 
                  onClick={() => { setShowPanic(false); navigate('/hub'); }}
                  className="w-full bg-indigo-50 text-indigo-500 font-black py-4 rounded-2xl active:scale-95 transition-transform text-xs uppercase tracking-widest"
                >
                  Deep breath pause
                </button>
              </div>

              <button 
                onClick={() => setShowPanic(false)}
                className="mt-8 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors"
                id="close-panic-id"
              >
                Close moment
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
