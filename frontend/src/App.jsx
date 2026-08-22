import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SidebarDrawer } from './components/Common/SidebarDrawer';
import { ToastContainer } from './components/Common/ToastContainer';
import { FarmerDashboard } from './components/Farmer/FarmerDashboard';
import { VetDashboard } from './components/Vet/VetDashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ComplaintModal } from './components/Farmer/ComplaintModal';
import { BiosecurityAlertModal } from './components/Common/BiosecurityAlertModal';
import { SectionNavigationLoader } from './components/Common/SectionNavigationLoader';
import { SplashScreen } from './components/Common/SplashScreen';
import { LoginPortal } from './components/Common/LoginPortal';
import { ShieldCheck, Menu } from 'lucide-react';

const MainContent = ({ activeTab, setActiveTab, onOpenComplaint }) => {
  const { activeRole } = useApp();

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
      {activeRole === 'FARMER' && (
        <FarmerDashboard 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenComplaint={onOpenComplaint} 
        />
      )}
      {activeRole === 'VET' && (
        <VetDashboard 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      )}
      {activeRole === 'ADMIN' && (
        <AdminDashboard 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      )}
    </main>
  );
};

export function AppContent() {
  const { activeRole, setActiveRole } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('SCANNER');
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isBiosecurityAlertOpen, setIsBiosecurityAlertOpen] = useState(false);

  // Session splash screen check (plays video + voiceover.mp3 on session startup)
  const [showSplash, setShowSplash] = useState(() => {
    return sessionStorage.getItem('hasSeenSplash') !== 'true';
  });

  // Perfectly Calibrated 0.95s Animated Section Navigation Loader State
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTab, setNavigatingTab] = useState(null);

  const handleNavigateToTab = (newTab) => {
    if (newTab === activeTab) return;

    setNavigatingTab(newTab);
    setIsNavigating(true);

    setTimeout(() => {
      setActiveTab(newTab);
      setIsNavigating(false);
    }, 950); // Exactly 0.95s (adds 0.5s for ideal smooth visibility)
  };

  const handleSelectRoleFromPortal = (roleKey) => {
    setActiveRole(roleKey);
    setIsLoggedIn(true);
    if (roleKey === 'VET') {
      setActiveTab('QUEUE');
    } else if (roleKey === 'ADMIN') {
      setActiveTab('HEATMAP');
    } else {
      setActiveTab('SCANNER');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Render Login Portal screen if user is not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#030712] text-white relative">
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
        <LoginPortal onSelectRole={handleSelectRoleFromPortal} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#030712] text-white relative">
      {/* 0.95s Ultra-Premium Section Navigation Loading Screen */}
      {isNavigating && (
        <SectionNavigationLoader targetTab={navigatingTab} />
      )}

      {/* FLOATING FAR-LEFT EDGE HAMBURGER MENU BUTTON */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-48 left-0 z-[990] bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 to-teal-400 text-white py-3 px-3.5 rounded-r-2xl shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-l-0 border-emerald-400/80 font-extrabold flex items-center gap-2 text-xs transition-all transform hover:translate-x-1.5 active:scale-95 group cursor-pointer"
        title="Open Navigation Menu"
      >
        <Menu className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
        <span className="font-extrabold tracking-wider hidden sm:inline font-mono">MENU</span>
      </button>

      <div className="flex-1 flex flex-col">
        <Navbar onLogout={handleLogout} />
        <MainContent 
          activeTab={activeTab} 
          setActiveTab={handleNavigateToTab} 
          onOpenComplaint={() => setIsComplaintOpen(true)}
        />
      </div>

      {/* Slide-Out Far-Left Drawer */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={handleNavigateToTab}
        onOpenComplaint={() => setIsComplaintOpen(true)}
        onOpenBiosecurityAlert={() => setIsBiosecurityAlertOpen(true)}
        onLogout={handleLogout}
      />

      {/* Farmer Grievance Complaint Modal */}
      <ComplaintModal
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
      />

      {/* Biosecurity Alert AI Voice Doctor Modal */}
      <BiosecurityAlertModal
        isOpen={isBiosecurityAlertOpen}
        onClose={() => setIsBiosecurityAlertOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0B0F19] py-6 px-4 text-center text-xs text-slate-400 space-y-2 mt-auto">
        <div className="flex items-center justify-center gap-2 text-slate-200 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Pashu Rakshak — Production-Ready Biosecurity & Vet Dispatch Engine</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Official Digital Farm Management System • Government Biosecurity Compliance
        </p>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
