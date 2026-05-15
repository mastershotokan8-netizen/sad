import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AccountDetails() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    dob: '',
    gender: 'prefer-not-to-say'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    // Supabase update logic would go here
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
    navigate(-1);
  };

  return (
    <div className="h-full flex flex-col bg-[#fdfaf8]">
      <div className="flex justify-between items-center px-6 py-5 bg-white z-10 sticky top-0 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} strokeWidth={2.5}/>
          </button>
          <span className="text-lg font-bold text-slate-900">Account Details</span>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="text-orange-500 font-bold text-[15px] hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-1 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-12 no-scrollbar">
        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
          
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium placeholder:text-slate-400"
            />
            <span className="text-xs text-slate-400 pl-1 mt-0.5">Changing your email requires verification.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Date of Birth</label>
            <input 
              type="date" 
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-slate-500 focus:text-slate-900"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Gender</label>
            <div className="relative">
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium appearance-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

        </div>
        
        <div className="mt-6 flex justify-center">
            <button className="text-red-500 font-bold hover:bg-red-50 px-6 py-3.5 rounded-[1rem] transition-colors cursor-pointer w-full text-center border border-red-100 bg-white shadow-sm active:scale-[0.98]">
                Delete Account
            </button>
        </div>
      </div>
    </div>
  );
}
