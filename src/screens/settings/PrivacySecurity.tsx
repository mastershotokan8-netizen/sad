import { ArrowLeft, ChevronRight, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacySecurity() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-[#fdfaf8]">
      <div className="flex items-center gap-4 px-6 py-5 bg-white z-10 sticky top-0 shadow-sm border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} strokeWidth={2.5}/>
        </button>
        <span className="text-lg font-bold text-slate-900">Privacy & Security</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-12 no-scrollbar">
        <div className="bg-white rounded-[1.5rem] p-2 shadow-sm border border-gray-100 flex flex-col">
          <button 
            onClick={() => navigate('/settings/blocked-users')}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left w-full cursor-pointer rounded-xl"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
              <UserX size={20} />
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-bold text-slate-900 text-[15px]">Blocked Users</span>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
