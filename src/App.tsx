import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Onboarding1 from './screens/Onboarding1';
import Onboarding2 from './screens/Onboarding2';
import AvatarSetup from './screens/AvatarSetup';
import AvatarTypeSelection from './screens/AvatarTypeSelection';
import HumanAvatarSetup from './screens/HumanAvatarSetup';
import NovaChat from './screens/NovaChat';
import Hub from './screens/Hub';
import Missions from './screens/Missions';
import ProfileHub from './screens/ProfileHub';
import Settings from './screens/Settings';
import Hatch from './screens/Hatch';
import Home from './screens/Home';
import OrbIsland from './screens/OrbIsland';
import Submissions from './screens/Submissions';
import AccountDetails from './screens/settings/AccountDetails';
import PrivacySecurity from './screens/settings/PrivacySecurity';
import BlockedUsers from './screens/settings/BlockedUsers';
import Notifications from './screens/settings/Notifications';
import DisplayAppearance from './screens/settings/DisplayAppearance';
import PasswordAuth from './screens/settings/PasswordAuth';
import BottomNav from './components/BottomNav';

function AnimatedOutlet() {
  const location = useLocation();
  const isTabBarRoute = ['/nova', '/home', '/hub', '/missions', '/profile'].includes(location.pathname);
  
  return (
    <>
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-[#fdfaf8]">
        <AnimatePresence initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="h-full w-full absolute inset-0"
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/onboarding1" replace />} />
              <Route path="/onboarding1" element={<Onboarding1 />} />
              <Route path="/onboarding2" element={<Onboarding2 />} />
              <Route path="/assistant-setup" element={<HumanAvatarSetup />} />
              <Route path="/pet-setup" element={<AvatarSetup />} />
              <Route path="/hatch" element={<Hatch />} />
              <Route path="/home" element={<Home />} />
              <Route path="/island" element={<OrbIsland />} />
              <Route path="/submissions" element={<Submissions />} />
              <Route path="/nova" element={<NovaChat />} />
              <Route path="/hub" element={<Hub />} />
              <Route path="/explore" element={<Navigate to="/hub" replace />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/profile" element={<ProfileHub />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/account" element={<AccountDetails />} />
              <Route path="/settings/privacy" element={<PrivacySecurity />} />
              <Route path="/settings/blocked-users" element={<BlockedUsers />} />
              <Route path="/settings/notifications" element={<Notifications />} />
              <Route path="/settings/display" element={<DisplayAppearance />} />
              <Route path="/settings/security" element={<PasswordAuth />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
      {isTabBarRoute && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-50 flex justify-center">
        <div className="w-full max-w-[400px] bg-white h-screen sm:h-[850px] sm:my-auto sm:rounded-[3rem] sm:shadow-2xl overflow-hidden relative flex flex-col sm:border-[8px] sm:border-gray-200">
          <AnimatedOutlet />
        </div>
      </div>
    </Router>
  );
}
