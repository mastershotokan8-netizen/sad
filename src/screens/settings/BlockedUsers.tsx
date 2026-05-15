import { ArrowLeft, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BlockedUsers() {
  const navigate = useNavigate();

  // Mock list of blocked users
  const blockedUsers = [
    { id: 1, name: "Toxic Player 1" },
    { id: 2, name: "Spammer123" }
  ];

  return (
    <div className="h-full flex flex-col bg-[#fdfaf8]">
      <div className="flex items-center gap-4 px-6 py-5 bg-white z-10 sticky top-0 shadow-sm border-b border-gray-100">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} strokeWidth={2.5}/>
        </button>
        <span className="text-lg font-bold text-slate-900">Blocked Users</span>
      </div>
      <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
        {blockedUsers.length > 0 ? (
          <div className="flex flex-col gap-3">
            {blockedUsers.map(user => (
              <div key={user.id} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <span className="font-bold text-slate-800">{user.name}</span>
                <button className="text-sm font-bold text-orange-500 hover:text-orange-600 bg-orange-50 px-4 py-2 rounded-lg cursor-pointer">Unblock</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center text-slate-400 gap-3">
            <UserX size={40} className="text-slate-300" />
            <p>No blocked users.</p>
          </div>
        )}
      </div>
    </div>
  );
}
