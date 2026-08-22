import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FarmerAvatar3D, VetOfficerAvatar3D, GovtAdminAvatar3D } from './Common/Avatars';
import { LogOut, ShieldCheck, UserCheck, Maximize2, Minimize2, Menu, Bell } from 'lucide-react';

export const Navbar = ({ onLogout, onOpenSidebar, onOpenAlerts }) => {
  const { activeRole, activeLang, setActiveLang, t } = useApp();
  const currentLang = (activeLang || 'EN').toUpperCase();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn("Fullscreen request error:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const roleLabel = activeRole === 'FARMER'
    ? (currentLang === 'HI' ? '🌾 किसान पोर्टल' : '🌾 Farmer Portal')
    : activeRole === 'VET'
    ? (currentLang === 'HI' ? '🩺 पशु चिकित्सक पोर्टल' : '🩺 Vet Officer Portal')
    : (currentLang === 'HI' ? '🏛️ सरकारी प्रशासन' : '🏛️ Govt Admin Portal');

  const roleBadgeStyle = activeRole === 'FARMER'
    ? 'bg-emerald-950/90 text-emerald-400 border-emerald-700'
    : activeRole === 'VET'
    ? 'bg-blue-950/90 text-blue-400 border-blue-700'
    : 'bg-amber-950/90 text-amber-400 border-amber-700';

  return (
    <header className="relative z-50 bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left Side: Sidebar Drawer Menu Button & Brand Title */}
          <div className="flex items-center gap-3">
            
            {/* MENU BUTTON FOR SIDEBAR DRAWER */}
            {onOpenSidebar && (
              <button
                onClick={onOpenSidebar}
                className="p-2.5 rounded-2xl bg-[#0B0F19]/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-emerald-500/50 hover:border-emerald-400 transition-all btn-pop cursor-pointer backdrop-blur-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40 group"
                title={currentLang === 'HI' ? 'मेन्यू खोलें (Menu)' : 'Open Menu Drawer'}
              >
                <Menu className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-extrabold hidden sm:inline text-slate-200">{currentLang === 'HI' ? 'मेन्यू' : 'Menu'}</span>
              </button>
            )}

            {/* Brand Logo & 3D Pixar Avatar */}
            <div className="flex items-center gap-2.5">
              {activeRole === 'FARMER' && <FarmerAvatar3D size={48} />}
              {activeRole === 'VET' && <VetOfficerAvatar3D size={48} />}
              {activeRole === 'ADMIN' && <GovtAdminAvatar3D size={48} />}
              <div>
                <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight golden-shimmer-title drop-shadow-md">
                  Pashu Rakshak
                </h1>
              </div>
            </div>

          </div>

          {/* Right Side: Active Role Badge, Emergency Alerts, Fullscreen, Lang & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Emergency Geo-Alerts Notification Bell */}
            {onOpenAlerts && (
              <button
                onClick={onOpenAlerts}
                className="p-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-400 border border-amber-700/80 transition-all btn-pop cursor-pointer backdrop-blur-xl relative"
                title={currentLang === 'HI' ? 'आपातकालीन चेतावनी (Emergency Alerts)' : 'Emergency Outbreak Geo-Alerts'}
              >
                <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              </button>
            )}

            {/* Active Portal Badge */}
            <div className={`hidden md:block px-3.5 py-1.5 rounded-xl text-xs font-black border font-mono shadow-inner ${roleBadgeStyle}`}>
              {roleLabel}
            </div>

            {/* Native Fullscreen Mode Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-[#0B0F19]/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all btn-pop cursor-pointer backdrop-blur-xl"
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen Mode"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-[#0B0F19]/90 rounded-xl border border-slate-800 p-1 backdrop-blur-xl">
              <button
                onClick={() => setActiveLang('EN')}
                className={`px-2 py-1 rounded text-[11px] font-extrabold transition-all ${
                  currentLang === 'EN' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setActiveLang('HI')}
                className={`px-2 py-1 rounded text-[11px] font-extrabold transition-all ${
                  currentLang === 'HI' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Switch Account / Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="py-2 px-3 rounded-xl bg-[#0B0F19]/90 hover:bg-red-950 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-800 text-xs font-bold flex items-center gap-1.5 transition-all btn-pop cursor-pointer backdrop-blur-xl"
                title="Switch Portal Account"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">{currentLang === 'HI' ? 'पोर्टल बदलें' : 'Switch Portal'}</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
