import React from 'react';
import { ArrowLeft, Bell, KeyRound, Monitor, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-[#fdfaf8]">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-6 py-5 bg-white z-10 sticky top-0 shadow-sm border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} strokeWidth={2.5}/>
        </button>
        <span className="text-lg font-bold text-slate-900">Settings</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-10 flex flex-col gap-4 no-scrollbar">
        <div className="bg-white rounded-[1.5rem] p-2 shadow-sm border border-gray-100 flex flex-col">
          <SettingItem onClick={() => navigate('/settings/account')} icon={<User size={20} />} title="Account Details" subtitle="Update your email and personal info" />
          <SettingItem onClick={() => navigate('/settings/privacy')} icon={<Shield size={20} />} title="Privacy & Security" subtitle="Manage your data and security preferences" />
          <SettingItem onClick={() => navigate('/settings/notifications')} icon={<Bell size={20} />} title="Notifications" subtitle="Choose what you want to hear about" />
          <SettingItem onClick={() => navigate('/settings/display')} icon={<Monitor size={20} />} title="Display & Appearance" subtitle="Theme, fonts and accessibility" borderBottom={false} />
        </div>
      </div>
    </div>
  );
}

function SettingItem({ icon, title, subtitle, borderBottom = true, onClick }: { icon: React.ReactNode, title: string, subtitle: string, borderBottom?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left w-full cursor-pointer rounded-xl ${borderBottom ? 'border-b border-gray-50' : ''}`}>
      <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col flex-1">
        <span className="font-bold text-slate-900 text-[15px]">{title}</span>
        <span className="text-slate-500 text-[13px] font-medium mt-0.5">{subtitle}</span>
      </div>
    </button>
  );
}
