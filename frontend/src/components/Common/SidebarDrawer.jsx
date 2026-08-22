import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, Home, Camera, FileText, MapPin, ShieldCheck, AlertOctagon, 
  ChevronRight, Users, Activity, Radio, AlertTriangle, PhoneCall, Sparkles, LogOut, FileWarning
} from 'lucide-react';

export const SidebarDrawer = ({ 
  isOpen, 
  onClose, 
  activeTab, 
  setActiveTab, 
  onOpenComplaint,
  onOpenBiosecurityAlert,
  onLogout
}) => {
  const { activeRole, setActiveRole, t, activeLang } = useApp();
  const currentLang = (activeLang || 'EN').toUpperCase();

  if (!isOpen) return null;

  const handleGoHome = () => {
    if (activeRole === 'VET') {
      setActiveTab('QUEUE');
    } else if (activeRole === 'ADMIN') {
      setActiveTab('HEATMAP');
    } else {
      setActiveTab('SCANNER');
    }
    onClose();
  };

  return (
    <>
      {/* Backdrop Backdrop Blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-[998] bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
      />

      {/* Far-Left Sliding Drawer Panel */}
      <div className="fixed top-0 left-0 bottom-0 z-[999] w-84 max-w-[88vw] bg-[#070A14]/95 border-r border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] p-5 flex flex-col justify-between overflow-y-auto animate-slideInLeft text-white backdrop-blur-2xl">
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-2xl shadow-lg shadow-emerald-950/60">
                🐄
              </div>
              <div>
                <h2 className="text-base font-black text-white font-display tracking-tight golden-shimmer-title">
                  {t('appTitle')}
                </h2>
                <p className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider mt-0.5">
                  {t(`roles.${activeRole}`)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all btn-pop cursor-pointer"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 1. GLOBAL "HOME SCREEN" OPTION CARD */}
          <button
            onClick={handleGoHome}
            className="w-full p-4 rounded-2xl text-left border border-slate-800/80 bg-gradient-to-r from-slate-900/90 to-slate-950/90 hover:bg-slate-800/80 hover:border-emerald-500/60 text-slate-300 btn-pop flex items-center justify-between transition-all group cursor-pointer shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white">{t('nav.home')}</div>
                <div className="text-[11px] text-slate-400 font-medium">{t('nav.homeDesc')}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </button>

          {/* 2. BIOSECURITY ALERTS AI OPTION CARD */}
          <button
            onClick={() => { if (onOpenBiosecurityAlert) onOpenBiosecurityAlert(); onClose(); }}
            className="w-full p-4 rounded-2xl text-left border border-amber-500/50 bg-gradient-to-r from-amber-950/30 via-slate-900/90 to-slate-950/90 hover:border-amber-400 text-slate-300 btn-pop flex items-center justify-between transition-all group cursor-pointer shadow-lg shadow-amber-950/20"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-amber-300 flex items-center gap-1.5">
                  <span>{t('nav.biosecurityAlerts')}</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                </div>
                <div className="text-[11px] text-slate-400 font-medium">{t('nav.biosecurityAlertsDesc')}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* FARMER ROLE OPTIONS WORKSPACE */}
          {activeRole === 'FARMER' && (
            <nav className="space-y-2.5 pt-2">
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-2 font-mono">
                Farmer Workspace
              </div>

              {/* AI DISEASE SCANNER */}
              <button
                onClick={() => { setActiveTab('SCANNER'); onClose(); }}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group cursor-pointer btn-pop shadow-md ${
                  activeTab === 'SCANNER' 
                    ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-emerald-500/80 text-white shadow-emerald-950/40' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-emerald-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeTab === 'SCANNER' 
                      ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 shadow-lg' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:scale-110'
                  }`}>
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">{t('nav.aiScanner')}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{t('nav.aiScannerDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* MY REPORTED CASES */}
              <button
                onClick={() => { setActiveTab('MY_CASES'); onClose(); }}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group cursor-pointer btn-pop shadow-md ${
                  activeTab === 'MY_CASES' 
                    ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-emerald-500/80 text-white shadow-emerald-950/40' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-emerald-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeTab === 'MY_CASES' 
                      ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 shadow-lg' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:scale-110'
                  }`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">{t('nav.myCases')}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{t('nav.myCasesDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* EMERGENCY VET DISPATCH */}
              <button
                onClick={() => { setActiveTab('VET_LOCATOR'); onClose(); }}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group cursor-pointer btn-pop shadow-md ${
                  activeTab === 'VET_LOCATOR' 
                    ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-emerald-500/80 text-white shadow-emerald-950/40' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-emerald-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeTab === 'VET_LOCATOR' 
                      ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 shadow-lg' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:scale-110'
                  }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">{t('nav.vetLocator')}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{t('nav.vetLocatorDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* DIGITAL HEALTH CARDS */}
              <button
                onClick={() => { setActiveTab('HEALTH_RECORDS'); onClose(); }}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group cursor-pointer btn-pop shadow-md ${
                  activeTab === 'HEALTH_RECORDS' 
                    ? 'bg-gradient-to-r from-emerald-950/80 to-slate-900 border-emerald-500/80 text-white shadow-emerald-950/40' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-emerald-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeTab === 'HEALTH_RECORDS' 
                      ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/40 shadow-lg' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:scale-110'
                  }`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">{t('nav.healthRecords')}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{t('nav.healthRecordsDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* REPORT FARMER GRIEVANCE (OFFICER COMPLAINT) */}
              <button
                onClick={() => { if (onOpenComplaint) onOpenComplaint(); onClose(); }}
                className="w-full p-4 rounded-2xl text-left border border-rose-800/60 bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-slate-950/90 hover:border-rose-500 text-rose-200 btn-pop flex items-center justify-between transition-all group cursor-pointer shadow-lg shadow-rose-950/20"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-900/40 stroke-rose-400 text-rose-400 flex items-center justify-center border border-rose-700/50 group-hover:scale-110 transition-transform">
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">{t('nav.fileComplaint')}</div>
                    <div className="text-[11px] text-rose-300/80 font-medium">{t('nav.fileComplaintDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </nav>
          )}

          {/* VET OFFICER ROLE OPTIONS WORKSPACE */}
          {activeRole === 'VET' && (
            <nav className="space-y-2.5 pt-2">
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-2 font-mono">
                Vet Officer Workspace
              </div>

              <button
                onClick={() => { setActiveTab('QUEUE'); onClose(); }}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group cursor-pointer btn-pop shadow-md ${
                  activeTab === 'QUEUE' 
                    ? 'bg-gradient-to-r from-blue-950/80 to-slate-900 border-blue-500/80 text-white shadow-blue-950/40' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-blue-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeTab === 'QUEUE' 
                      ? 'bg-blue-500/25 text-blue-400 border border-blue-500/40 shadow-lg' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-blue-400 group-hover:scale-110'
                  }`}>
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">{t('nav.emergencyQueue')}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{t('nav.emergencyQueueDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                onClick={() => { setActiveTab('MAP'); onClose(); }}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group cursor-pointer btn-pop shadow-md ${
                  activeTab === 'MAP' 
                    ? 'bg-gradient-to-r from-blue-950/80 to-slate-900 border-blue-500/80 text-white shadow-blue-950/40' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-blue-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeTab === 'MAP' 
                      ? 'bg-blue-500/25 text-blue-400 border border-blue-500/40 shadow-lg' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-blue-400 group-hover:scale-110'
                  }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">{t('nav.dispatchMap')}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{t('nav.dispatchMapDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </button>
            </nav>
          )}

          {/* GOVT ADMIN ROLE OPTIONS WORKSPACE */}
          {activeRole === 'ADMIN' && (
            <nav className="space-y-2.5 pt-2">
              <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest px-2 font-mono">
                Govt Admin Workspace
              </div>

              {/* 1. OUTBREAK HEATMAP */}
              <button
                onClick={() => { setActiveTab('HEATMAP'); onClose(); }}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group cursor-pointer btn-pop shadow-md ${
                  activeTab === 'HEATMAP' 
                    ? 'bg-gradient-to-r from-amber-950/80 to-slate-900 border-amber-500/80 text-white shadow-amber-950/40' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    activeTab === 'HEATMAP' 
                      ? 'bg-amber-500/25 text-amber-400 border border-amber-500/40 shadow-lg' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-amber-400 group-hover:scale-110'
                  }`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">{t('nav.outbreakHeatmap')}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{t('nav.outbreakHeatmapDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* 2. OFFICER AUDIT & DUTY */}
              <button
                onClick={() => { setActiveTab('AUDIT'); onClose(); }}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group cursor-pointer btn-pop shadow-md ${
                  (activeTab === 'AUDIT' || activeTab === 'OFFICERS') 
                    ? 'bg-gradient-to-r from-amber-950/80 to-slate-900 border-amber-500/80 text-white shadow-amber-950/40' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-amber-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    (activeTab === 'AUDIT' || activeTab === 'OFFICERS') 
                      ? 'bg-amber-500/25 text-amber-400 border border-amber-500/40 shadow-lg' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-amber-400 group-hover:scale-110'
                  }`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">{t('nav.officerAudit')}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{t('nav.officerAuditDesc')}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </button>

              {/* 3. FARMER GRIEVANCE REPORTS */}
              <button
                onClick={() => { setActiveTab('REPORTS'); onClose(); }}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group cursor-pointer btn-pop shadow-md ${
                  (activeTab === 'REPORTS' || activeTab === 'COMPLAINTS') 
                    ? 'bg-gradient-to-r from-red-950/80 to-slate-900 border-red-500/80 text-white shadow-red-950/40' 
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/70 hover:border-red-500/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    (activeTab === 'REPORTS' || activeTab === 'COMPLAINTS') 
                      ? 'bg-red-500/25 text-red-400 border border-red-500/40 shadow-lg' 
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-red-400 group-hover:scale-110'
                  }`}>
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white">{currentLang === 'HI' ? 'किसान शिकायत रिपोर्ट्स' : 'Farmer Grievance Reports'}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{currentLang === 'HI' ? 'अधिकारियों पर कार्रवाई रिपोर्ट' : 'Live Unresponsive Officer Logs'}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
              </button>
            </nav>
          )}
        </div>

        {/* Footer Account Action */}
        <div className="pt-6 border-t border-slate-800/80 space-y-3">
          {onLogout && (
            <button
              onClick={() => { onLogout(); onClose(); }}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-900/90 hover:bg-red-950/80 text-slate-300 hover:text-red-300 border border-slate-800 hover:border-red-800 text-xs font-extrabold flex items-center justify-center gap-2 transition-all btn-pop cursor-pointer shadow-lg"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>{currentLang === 'HI' ? 'पोर्टल बदलें (लॉगआउट)' : 'Switch Portal (Logout)'}</span>
            </button>
          )}

          <div className="text-[10px] text-slate-500 text-center font-mono">
            Pashu Rakshak v2.4 • Digital India
          </div>
        </div>
      </div>
    </>
  );
};
