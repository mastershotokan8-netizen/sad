import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PasswordAuth() {
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
        <span className="text-lg font-bold text-slate-900">Password & Authentication</span>
      </div>
      <div className="p-6">
        <p className="text-slate-500">Password and authentication settings will go here.</p>
      </div>
    </div>
  );
}
