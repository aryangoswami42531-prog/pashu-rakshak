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

  // Session splash screen check (plays video + voiceover.mp3 on site load)
  const [showSplash, setShowSplash] = useState(true);

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
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative">
      {/* Top Header Navbar */}
      <Navbar 
        onLogout={handleLogout} 
        onOpenSidebar={() => setIsSidebarOpen(true)} 
        onOpenAlerts={() => setIsBiosecurityAlertOpen(true)}
      />

      {/* Main Workspace View */}
      <MainContent 
        activeTab={activeTab} 
        setActiveTab={handleNavigateToTab} 
        onOpenComplaint={() => setIsComplaintOpen(true)} 
      />

      {/* Slide-over Navigation Drawer */}
      <SidebarDrawer 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={handleNavigateToTab} 
        onLogout={handleLogout} 
        onOpenComplaint={() => setIsComplaintOpen(true)} 
      />

      {/* Global Toast Alert Notifications */}
      <ToastContainer />

      {/* Farmer Grievance Complaint Modal */}
      <ComplaintModal 
        isOpen={isComplaintOpen} 
        onClose={() => setIsComplaintOpen(false)} 
      />

      {/* Regional Biosecurity Outbreak Emergency Alert Modal */}
      <BiosecurityAlertModal 
        isOpen={isBiosecurityAlertOpen} 
        onClose={() => setIsBiosecurityAlertOpen(false)} 
      />

      {/* Smooth 0.95s Section Navigation Loading Overlay */}
      {isNavigating && (
        <SectionNavigationLoader targetTab={navigatingTab} />
      )}
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
