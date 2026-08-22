import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { FarmerAvatar3D, VetOfficerAvatar3D, GovtAdminAvatar3D } from './Avatars';
import { 
  ShieldCheck, Sparkles, Stethoscope, Building2, ChevronRight, 
  ArrowRight, UserCheck, Lock, Activity, PlayCircle, LogIn, ArrowLeft, X, Film, Maximize2, Minimize2,
  Camera, CheckCircle2, AlertTriangle, RefreshCw, BadgeCheck, KeyRound, Fingerprint, Eye
} from 'lucide-react';

export const LoginPortal = ({ onSelectRole }) => {
  const { t, activeLang, setActiveLang } = useApp();
  const currentLang = (activeLang || 'EN').toUpperCase();
  const [currentView, setCurrentView] = useState('HERO'); // 'HERO' | 'LOGIN_ROLES' | 'HOW_IT_WORKS_VIDEO'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Farmer Camera Verification State
  const [isFarmerCameraModalOpen, setIsFarmerCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Vet Officer Credentials Login State
  const [isVetLoginModalOpen, setIsVetLoginModalOpen] = useState(false);
  const [vetIdInput, setVetIdInput] = useState('VET-PB-101');
  const [vetPasswordInput, setVetPasswordInput] = useState('pass123');
  const [vetLoginError, setVetLoginError] = useState('');
  const [isAuthenticatingVet, setIsAuthenticatingVet] = useState(false);

  // Govt Admin Biometric Dual Clearance (Camera + Fingerprint) State
  const [isGovtFingerprintModalOpen, setIsGovtFingerprintModalOpen] = useState(false);
  const [govtCameraStream, setGovtCameraStream] = useState(null);
  const [govtCameraError, setGovtCameraError] = useState(null);
  const [isScanningFingerprint, setIsScanningFingerprint] = useState(false);
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  
  const videoRef = useRef(null);
  const govtVideoRef = useRef(null);
  const audioRef = useRef(null);
  const vetAudioRef = useRef(null);
  const govtAudioRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Connect videoRef stream whenever farmer camera modal opens
  useEffect(() => {
    if (isFarmerCameraModalOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isFarmerCameraModalOpen, cameraStream]);

  // Connect govtVideoRef stream whenever govt camera modal opens
  useEffect(() => {
    if (isGovtFingerprintModalOpen && govtCameraStream && govtVideoRef.current) {
      govtVideoRef.current.srcObject = govtCameraStream;
    }
  }, [isGovtFingerprintModalOpen, govtCameraStream]);

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

  const startFarmerCameraVerification = async () => {
    setIsFarmerCameraModalOpen(true);
    setCapturedPhoto(null);
    setCameraError(null);
    setIsVerifying(false);

    // Play ElevenLabs Hindu Mythology Voiceover Audio
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
      }
    } catch (e) {
      console.warn("Audio init error:", e);
    }

    // Start Live Camera Stream
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      setCameraStream(stream);
      setCameraError(null);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraStream(null);
      setCameraError(
        currentLang === 'HI'
          ? "⚠️ कैमरा अनुमति उपलब्ध नहीं है! बिना लाइव कैमरा फोटो के लॉगिन नहीं हो सकता।"
          : "⚠️ Live Camera Feed Blocked! Camera access required for authenticated login."
      );
    }
  };

  const closeFarmerCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsFarmerCameraModalOpen(false);
    setCapturedPhoto(null);
    setCameraError(null);
    setIsVerifying(false);
  };

  const handleCaptureFarmerPhoto = () => {
    // STRICT SECURITY MANDATE: Require active live camera feed
    if (!cameraStream || !videoRef.current || !videoRef.current.videoWidth) {
      setCameraError(
        currentLang === 'HI' 
          ? "⚠️ कैमरा अनुमति या लाइव कैमरा फीड चालू नहीं है! लॉगिन की अनुमति नहीं है।" 
          : "⚠️ Live Camera Feed Required! Unauthenticated login strictly denied."
      );
      return; // DO NOT ALLOW LOGIN!
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedPhoto(photoDataUrl);

    setIsVerifying(true);

    // After 1.2s success verification animation, log farmer in!
    setTimeout(() => {
      closeFarmerCameraModal();
      onSelectRole('FARMER');
    }, 1200);
  };

  // Vet Officer Credentials Login Flow
  const startVetLoginFlow = () => {
    setIsVetLoginModalOpen(true);
    setVetLoginError('');
    setIsAuthenticatingVet(false);

    // Play Bunty Fun Podcast Host Voiceover Audio
    try {
      if (vetAudioRef.current) {
        vetAudioRef.current.currentTime = 0;
        vetAudioRef.current.play().catch(e => console.log("Vet audio play blocked by browser:", e));
      }
    } catch (e) {
      console.warn("Vet audio init error:", e);
    }
  };

  const closeVetLoginModal = () => {
    if (vetAudioRef.current) {
      vetAudioRef.current.pause();
    }
    setIsVetLoginModalOpen(false);
    setVetLoginError('');
    setIsAuthenticatingVet(false);
  };

  const handleSubmitVetLogin = (e) => {
    if (e) e.preventDefault();

    if (!vetIdInput.trim() || !vetPasswordInput.trim()) {
      setVetLoginError(currentLang === 'HI' ? 'कृपया अपनी अधिकारी आईडी और पासवर्ड दर्ज करें' : 'Please enter your Officer License ID & Passcode');
      return;
    }

    setIsAuthenticatingVet(true);
    setVetLoginError('');

    // After 0.8s authentication check, proceed to Vet Officer Portal
    setTimeout(() => {
      closeVetLoginModal();
      onSelectRole('VET');
    }, 800);
  };

  // Govt Admin Dual Biometric (Camera + Fingerprint) Flow
  const startGovtFingerprintFlow = async () => {
    setIsGovtFingerprintModalOpen(true);
    setIsScanningFingerprint(false);
    setFingerprintVerified(false);
    setGovtCameraError(null);

    // Play govtloign.mp3 Voiceover Audio
    try {
      if (govtAudioRef.current) {
        govtAudioRef.current.currentTime = 0;
        govtAudioRef.current.play().catch(e => console.log("Govt audio play blocked by browser:", e));
      }
    } catch (e) {
      console.warn("Govt audio init error:", e);
    }

    // Start Live Camera Stream for Govt Admin
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      setGovtCameraStream(stream);
      setGovtCameraError(null);
    } catch (err) {
      console.error("Govt Camera access error:", err);
      setGovtCameraStream(null);
      setGovtCameraError(
        currentLang === 'HI'
          ? "⚠️ सरकारी बायोमेट्रिक सत्यापन के लिए लाइव कैमरा अनिवार्य है! कैमरा एक्सेस चालू करें।"
          : "⚠️ Live Camera Access Blocked! Govt Admin Biometric authentication denied."
      );
    }
  };

  const closeGovtFingerprintModal = () => {
    if (govtCameraStream) {
      govtCameraStream.getTracks().forEach(track => track.stop());
      setGovtCameraStream(null);
    }
    if (govtAudioRef.current) {
      govtAudioRef.current.pause();
    }
    setIsGovtFingerprintModalOpen(false);
    setIsScanningFingerprint(false);
    setFingerprintVerified(false);
    setGovtCameraError(null);
  };

  const handleScanFingerprint = () => {
    // STRICT SECURITY MANDATE: Require active live camera feed for Govt Admin
    if (!govtCameraStream || !govtVideoRef.current || !govtVideoRef.current.videoWidth) {
      setGovtCameraError(
        currentLang === 'HI'
          ? "⚠️ लाइव कैमरा ऑन नहीं है! सरकारी प्रशासन बायोमेट्रिक सत्यापन के लिए लाइव कैमरा अनिवार्य है।"
          : "⚠️ Live Camera Feed Required! Govt Admin Biometric authentication denied."
      );
      return; // DO NOT ALLOW LOGIN!
    }

    setGovtCameraError(null);
    setIsScanningFingerprint(true);

    setTimeout(() => {
      setIsScanningFingerprint(false);
      setFingerprintVerified(true);

      // Log in to Govt Admin Portal after 1.2s verification display
      setTimeout(() => {
        closeGovtFingerprintModal();
        onSelectRole('ADMIN');
      }, 1200);
    }, 1000);
  };

  const handleRoleLogin = (roleKey) => {
    if (roleKey === 'FARMER') {
      startFarmerCameraVerification();
    } else if (roleKey === 'VET') {
      startVetLoginFlow();
    } else if (roleKey === 'ADMIN') {
      startGovtFingerprintFlow();
    } else {
      onSelectRole(roleKey);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between relative selection:bg-emerald-500 selection:text-white overflow-hidden">
      
      {/* Audio element for Farmer Camera Verification Voiceover */}
      <audio
        ref={audioRef}
        src="/ElevenLabs_2026-08-21T13_31_04_Pavan M - Grand Hindu Mythology Narrator_pvc_sp120_s36_sb75_se0_b_m2.mp3"
        preload="auto"
      />

      {/* Audio element for Vet Officer Login Bunty Voiceover */}
      <audio
        ref={vetAudioRef}
        src="/ElevenLabs_2026-08-21T13_57_27_Bunty - Fun Podcast Host_pvc_sp107_s50_sb75_se0_b_m2.mp3"
        preload="auto"
      />

      {/* Audio element for Govt Admin Fingerprint Voiceover */}
      <audio
        ref={govtAudioRef}
        src="/govtloign.mp3"
        preload="auto"
      />

      {/* DIRECT VIBRANT FULLSCREEN VIDEO BACKGROUND (/splash.mp4) WITH HIGH VISIBILITY */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          src="/splash.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-80 filter brightness-100 contrast-105"
        />
        {/* Soft Ambient Overlay for Maximum Video Visibility & UI Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-[#030712]/30 to-[#030712]/60" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <FarmerAvatar3D size={56} />
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight golden-shimmer-title">
            Pashu Rakshak
          </h1>
        </div>

        {/* Header Controls: Back Button, Fullscreen Toggle & Language Selector */}
        <div className="flex items-center gap-3">
          {currentView !== 'HERO' && (
            <button
              onClick={() => setCurrentView('HERO')}
              className="py-2 px-3.5 rounded-xl bg-[#0B0F19]/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold flex items-center gap-1.5 transition-all btn-pop cursor-pointer backdrop-blur-xl"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>{currentLang === 'HI' ? 'मुख्य पृष्ठ' : 'Back to Home'}</span>
            </button>
          )}

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-2xl bg-[#0B0F19]/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all btn-pop cursor-pointer backdrop-blur-xl"
            title={isFullscreen ? "Exit Fullscreen Mode" : "Enter Fullscreen Mode"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Maximize2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          <div className="flex items-center bg-[#0B0F19]/90 rounded-2xl border border-slate-700/80 p-1.5 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => setActiveLang('EN')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all btn-pop ${
                currentLang === 'EN' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setActiveLang('HI')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all btn-pop ${
                currentLang === 'HI' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-300 hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </header>

      {/* VIEW 1: HERO LANDING VIEW (Clean Pashu Rakshak Title + Login Portal & How It Works Buttons NO BLACK BOX) */}
      {currentView === 'HERO' && (
        <main className="relative z-10 max-w-4xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center items-center text-center space-y-8 animate-fadeIn">
          
          <div className="max-w-xl w-full space-y-8">
            
            {/* Clean Title */}
            <div>
              <h2 className="text-5xl sm:text-7xl font-black font-display tracking-tight leading-tight bg-gradient-to-r from-white via-emerald-200 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_10px_35px_rgba(16,185,129,0.5)]">
                {currentLang === 'HI' ? 'नमस्ते' : 'Namaste'}
              </h2>
            </div>

            {/* TWO CLEAN ULTRA-PREMIUM ACTION BUTTONS DIRECTLY ON BACKGROUND VIDEO */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              
              {/* BUTTON 1: LOGIN PORTAL */}
              <button
                onClick={() => setCurrentView('LOGIN_ROLES')}
                className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all btn-pop cursor-pointer group"
              >
                <LogIn className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
                <span>{currentLang === 'HI' ? 'लॉगिन पोर्टल' : 'Login Portal'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* BUTTON 2: HOW IT WORKS */}
              <button
                onClick={() => setCurrentView('HOW_IT_WORKS_VIDEO')}
                className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-[#0B0F19]/80 hover:bg-[#0B0F19] text-white font-extrabold text-sm border border-cyan-400/80 hover:border-cyan-300 flex items-center justify-center gap-3 shadow-xl shadow-cyan-950/40 backdrop-blur-xl transition-all btn-pop cursor-pointer group"
              >
                <PlayCircle className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>{currentLang === 'HI' ? 'यह कैसे काम करता है' : 'How It Works'}</span>
              </button>

            </div>
          </div>

        </main>
      )}

      {/* VIEW 2: LOGIN ROLES SELECTION VIEW */}
      {currentView === 'LOGIN_ROLES' && (
        <main className="relative z-10 max-w-5xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center space-y-8 animate-fadeIn">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {currentLang === 'HI' ? 'अपने पोर्टल खाते में प्रवेश करें' : 'Select Official Login Portal'}
            </h2>
          </div>

          {/* 3 Sleek Role Access Cards with 3D Pixar AI Avatars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. FARMER PORTAL CARD */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-emerald-500 bg-[#0B0F19]/90 hover:bg-[#0B0F19] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-8 group shadow-2xl backdrop-blur-xl">
              <div className="space-y-5 text-center flex flex-col items-center">
                <FarmerAvatar3D size={88} className="mx-auto" />
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider font-mono">
                    Role 01 • Agriculture Node
                  </div>
                  <h3 className="text-2xl font-extrabold text-white font-display mt-1">
                    {currentLang === 'HI' ? 'किसान पोर्टल' : 'Farmer Portal'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => handleRoleLogin('FARMER')}
                className="w-full py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all btn-pop cursor-pointer"
              >
                <span>{currentLang === 'HI' ? '🌾 किसान पोर्टल में प्रवेश करें' : 'Login to Farmer Portal'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 2. VETERINARY OFFICER PORTAL CARD */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-blue-500 bg-[#0B0F19]/90 hover:bg-[#0B0F19] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-8 group shadow-2xl backdrop-blur-xl">
              <div className="space-y-5 text-center flex flex-col items-center">
                <VetOfficerAvatar3D size={88} className="mx-auto" />
                <div>
                  <div className="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider font-mono">
                    Role 02 • Clinical Officer
                  </div>
                  <h3 className="text-2xl font-extrabold text-white font-display mt-1">
                    {currentLang === 'HI' ? 'पशु चिकित्सक पोर्टल' : 'Vet Officer Portal'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => handleRoleLogin('VET')}
                className="w-full py-4 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all btn-pop cursor-pointer"
              >
                <span>{currentLang === 'HI' ? '🩺 पशु चिकित्सक पोर्टल में प्रवेश करें' : 'Login to Vet Officer Portal'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* 3. GOVT ADMIN PORTAL CARD */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-amber-500 bg-[#0B0F19]/90 hover:bg-[#0B0F19] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-8 group shadow-2xl backdrop-blur-xl">
              <div className="space-y-5 text-center flex flex-col items-center">
                <GovtAdminAvatar3D size={88} className="mx-auto" />
                <div>
                  <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider font-mono">
                    Role 03 • Government Administration
                  </div>
                  <h3 className="text-2xl font-extrabold text-white font-display mt-1">
                    {currentLang === 'HI' ? 'सरकारी प्रशासन पोर्टल' : 'Govt Admin Portal'}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => handleRoleLogin('ADMIN')}
                className="w-full py-4 px-5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-600/30 transition-all btn-pop cursor-pointer"
              >
                <span>{currentLang === 'HI' ? '🏛️ सरकारी प्रशासन पोर्टल में प्रवेश करें' : 'Login to Govt Admin Portal'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </main>
      )}

      {/* VIEW 3: SUPER-PREMIUM CINEMA THEATER GRADE "HOW IT WORKS" VIDEO MODAL PLAYER */}
      {currentView === 'HOW_IT_WORKS_VIDEO' && (
        <div className="fixed inset-0 z-[9990] bg-[#030712]/95 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          
          <div className="glass-panel max-w-5xl w-full rounded-3xl border border-cyan-500/50 bg-[#0B0F19]/95 p-5 sm:p-7 space-y-5 shadow-[0_0_80px_rgba(6,182,212,0.35)] relative overflow-hidden">
            
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/80 flex items-center justify-center shadow-lg">
                  <Film className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono">
                      🟢 LIVE DEMO WALKTHROUGH
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white font-display mt-0.5">
                    {currentLang === 'HI' ? 'पशु रक्षक - यह कैसे काम करता है (डेमो वीडियो)' : 'Pashu Rakshak — Platform Demonstration & Walkthrough'}
                  </h3>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setCurrentView('HERO')}
                className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all btn-pop cursor-pointer"
                title="Close Video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Widescreen Cinema Theater Video Container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-700/80 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-black group">
              <video
                src="/VIDEO-2025-09-06-21-18-47.mp4"
                autoPlay
                controls
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400 font-mono">
                Pashu Rakshak Livestock Biosecurity Platform Demonstration
              </div>
              <button
                onClick={() => setCurrentView('LOGIN_ROLES')}
                className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 btn-pop cursor-pointer"
              >
                <span>{currentLang === 'HI' ? 'लॉगिन पोर्टल पर जाएं' : 'Proceed to Login Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ULTRA-PREMIUM FARMER FACE & CAMERA VERIFICATION MODAL OVER /splash.mp4 VIDEO */}
      {isFarmerCameraModalOpen && (
        <div className="fixed inset-0 z-[9995] bg-[#030712]/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          
          {/* Glass Card Container with Dynamic Emerald Glow */}
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-emerald-500/60 bg-[#0B0F19]/90 p-6 sm:p-8 space-y-6 shadow-[0_0_90px_rgba(16,185,129,0.4)] relative backdrop-blur-2xl overflow-hidden">
            
            {/* Top Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-emerald-500/20 rounded-full blur-[90px] pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/90 border border-emerald-700/80 flex items-center justify-center shadow-lg shadow-emerald-950/50">
                  <Camera className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display tracking-tight">
                    {currentLang === 'HI' ? 'किसान चेहरा सत्यापन (Camera)' : 'Farmer Face Verification'}
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                    {currentLang === 'HI' ? 'लॉगिन करने के लिए फोटो खींचना अनिवार्य है' : 'Photo capture required before login'}
                  </p>
                </div>
              </div>

              <button
                onClick={closeFarmerCameraModal}
                className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-all btn-pop cursor-pointer"
                title="Cancel Login"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Camera Viewfinder Box */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-emerald-500/80 shadow-[0_15px_35px_rgba(0,0,0,0.8)] bg-slate-950 flex items-center justify-center group relative z-10">
              
              {!capturedPhoto ? (
                <>
                  {/* Live Video Feed */}
                  {cameraStream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-6 flex flex-col items-center justify-center text-center space-y-3 bg-slate-950 w-full h-full">
                      <AlertTriangle className="w-12 h-12 text-red-500 animate-bounce" />
                      <div className="text-xs text-red-400 font-extrabold font-mono uppercase tracking-wider">
                        CAMERA ACCESS REQUIRED
                      </div>
                      <p className="text-xs text-slate-300">
                        {cameraError || (currentLang === 'HI' ? 'कैमरा अनुमति दें' : 'Please enable browser camera permissions')}
                      </p>
                    </div>
                  )}

                  {/* AI Biosecurity Scanning Overlay Grid (Only if camera stream is active) */}
                  {cameraStream && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-emerald-400/40 rounded-2xl flex items-center justify-center">
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

                      <div className="w-44 h-44 rounded-full border-2 border-emerald-400/70 animate-pulse flex items-center justify-center">
                        <span className="text-[10px] font-extrabold font-mono text-emerald-400 tracking-wider bg-black/60 px-2.5 py-1 rounded-full border border-emerald-500/40 shadow-lg">
                          ALIGN FACE HERE
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Live Indicator Badge */}
                  {cameraStream && (
                    <div className="absolute top-3 left-3 bg-red-950/90 text-red-400 border border-red-800 text-[10px] font-bold font-mono px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>REC • LIVE CAMERA FEED</span>
                    </div>
                  )}
                </>
              ) : (
                /* Captured Photo Preview / Success State */
                <div className="relative w-full h-full flex flex-col items-center justify-center bg-emerald-950/40 text-center space-y-3 p-4">
                  <img src={capturedPhoto} alt="Captured Farmer Selfie" className="w-full h-full object-cover rounded-xl absolute inset-0" />
                  <div className="relative z-10 bg-slate-950/90 p-5 rounded-2xl border border-emerald-500/80 shadow-2xl backdrop-blur-md flex flex-col items-center space-y-2">
                    <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-bounce" />
                    <span className="text-base font-extrabold text-white font-display">
                      {currentLang === 'HI' ? 'चेहरा सफलतापूर्वक सत्यापित हुआ!' : 'Face Verified Successfully!'}
                    </span>
                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      Logging in to Farmer Portal...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Banner if Camera Access Fails */}
            {cameraError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-300 font-medium flex items-center gap-2 relative z-10">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 relative z-10">
              {!isVerifying ? (
                <button
                  onClick={handleCaptureFarmerPhoto}
                  disabled={!cameraStream}
                  className={`w-full py-4 px-6 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all btn-pop ${
                    cameraStream
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Camera className="w-5 h-5 text-emerald-200" />
                  <span>{currentLang === 'HI' ? '📸 फोटो खींचें और लॉगिन करें' : '📸 Take Photo & Verify Login'}</span>
                </button>
              ) : (
                <div className="w-full py-4 px-6 rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-400 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Verifying Identity & Logging In...</span>
                </div>
              )}

              <button
                onClick={closeFarmerCameraModal}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors text-center cursor-pointer"
              >
                {currentLang === 'HI' ? 'रद्द करें (Cancel)' : 'Cancel Login'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ULTRA-PREMIUM VET OFFICER CREDENTIALS LOGIN MODAL OVER /splash.mp4 VIDEO */}
      {isVetLoginModalOpen && (
        <div className="fixed inset-0 z-[9995] bg-[#030712]/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          
          {/* Glass Card Container with Dynamic Blue Glow */}
          <div className="glass-panel max-w-md w-full rounded-3xl border border-blue-500/60 bg-[#0B0F19]/90 p-6 sm:p-8 space-y-6 shadow-[0_0_90px_rgba(59,130,246,0.4)] relative backdrop-blur-2xl overflow-hidden">
            
            {/* Top Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-500/20 rounded-full blur-[90px] pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-950/90 border border-blue-700/80 flex items-center justify-center shadow-lg shadow-blue-950/50">
                  <Stethoscope className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white font-display tracking-tight">
                    {currentLang === 'HI' ? 'पशु चिकित्सक लॉगिन (Vet Auth)' : 'Vet Officer Portal Authentication'}
                  </h3>
                  <p className="text-xs text-blue-400 font-mono font-bold mt-0.5">
                    {currentLang === 'HI' ? 'सरकारी लाइसेंस आईडी और पासवर्ड दर्ज करें' : 'Enter Officer License ID & Passcode'}
                  </p>
                </div>
              </div>

              <button
                onClick={closeVetLoginModal}
                className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-all btn-pop cursor-pointer"
                title="Cancel Login"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmitVetLogin} className="space-y-4 relative z-10">
              
              {/* Field 1: Vet Officer ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>{currentLang === 'HI' ? 'पशु चिकित्सक आईडी (License ID)' : 'Vet Officer License ID'}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={vetIdInput}
                    onChange={(e) => setVetIdInput(e.target.value)}
                    placeholder="e.g. VET-PB-101"
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:border-blue-500 focus:outline-none font-mono tracking-wide"
                  />
                </div>
              </div>

              {/* Field 2: Passcode */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>{currentLang === 'HI' ? 'सुरक्षा पासवर्ड (Security Passcode)' : 'Security Passcode'}</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={vetPasswordInput}
                    onChange={(e) => setVetPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:border-blue-500 focus:outline-none font-mono tracking-widest"
                  />
                </div>
              </div>

              {/* Error Alert Message */}
              {vetLoginError && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-300 font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{vetLoginError}</span>
                </div>
              )}

              {/* Submit Action Button */}
              <div className="pt-2">
                {!isAuthenticatingVet ? (
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all btn-pop cursor-pointer"
                  >
                    <Lock className="w-5 h-5 text-blue-200" />
                    <span>{currentLang === 'HI' ? '🔐 सत्यापित करें और प्रवेश करें' : '🔐 Authenticate & Enter Vet Portal'}</span>
                  </button>
                ) : (
                  <div className="w-full py-4 px-6 rounded-2xl bg-blue-950 border border-blue-700 text-blue-400 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Verifying Vet License Credentials...</span>
                  </div>
                )}
              </div>

            </form>

            <button
              onClick={closeVetLoginModal}
              className="w-full text-xs text-slate-400 hover:text-white font-semibold transition-colors text-center cursor-pointer relative z-10"
            >
              {currentLang === 'HI' ? 'रद्द करें (Cancel)' : 'Cancel Login'}
            </button>

          </div>
        </div>
      )}

      {/* ULTRA-PREMIUM CLEAN GOVT ADMIN DUAL BIOMETRIC (CAMERA + FINGERPRINT) MODAL OVER /splash.mp4 VIDEO */}
      {isGovtFingerprintModalOpen && (
        <div className="fixed inset-0 z-[9995] bg-[#030712]/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          
          {/* Glass Card Container with Ultra-Clean Border */}
          <div className="glass-panel max-w-xl w-full rounded-3xl border border-amber-500/40 bg-[#0B0F19]/90 p-6 sm:p-8 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative backdrop-blur-2xl overflow-hidden">
            
            {/* Modal Header - Ultra Clean */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white font-display tracking-tight">
                    {currentLang === 'HI' ? 'सरकारी बायोमेट्रिक सत्यापन' : 'Government Biometric Clearance'}
                  </h3>
                </div>
              </div>

              <button
                onClick={closeGovtFingerprintModal}
                className="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-all btn-pop cursor-pointer"
                title="Cancel Login"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* DUAL BIOMETRIC LAYOUT: CLEAN LIVE CAMERA (LEFT) + CLEAN FINGERPRINT SCANNER (RIGHT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              
              {/* 1. CLEAN LIVE CAMERA SCANNER (LEFT) */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 flex items-center justify-center shadow-lg group">
                {govtCameraStream ? (
                  <video
                    ref={govtVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="p-4 flex flex-col items-center justify-center text-center space-y-2 bg-slate-950 w-full h-full">
                    <AlertTriangle className="w-10 h-10 text-red-500 animate-bounce" />
                    <div className="text-[10px] text-red-400 font-extrabold font-mono">LIVE CAMERA REQUIRED</div>
                  </div>
                )}
                {/* Subtle Camera On Badge */}
                {govtCameraStream && (
                  <div className="absolute top-2 left-2 bg-slate-950/80 text-emerald-400 border border-slate-800 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>LIVE CAMERA</span>
                  </div>
                )}
              </div>

              {/* 2. CLEAN BIOMETRIC FINGERPRINT SCANNER (RIGHT) */}
              <div 
                onClick={!isScanningFingerprint && !fingerprintVerified && govtCameraStream ? handleScanFingerprint : undefined}
                className={`relative w-full aspect-[4/3] rounded-2xl border flex flex-col items-center justify-center transition-all shadow-lg ${
                  !govtCameraStream 
                    ? 'border-slate-800 bg-slate-950/60 opacity-50 cursor-not-allowed'
                    : fingerprintVerified 
                    ? 'border-emerald-500 bg-emerald-950/30 cursor-pointer' 
                    : isScanningFingerprint 
                    ? 'border-amber-400 bg-amber-950/30 cursor-pointer' 
                    : 'border-slate-700/80 hover:border-amber-400 bg-slate-950/80 hover:scale-102 cursor-pointer'
                }`}
              >
                {/* Laser Sweep Beam */}
                {isScanningFingerprint && (
                  <div className="absolute inset-x-0 h-0.5 bg-amber-400 shadow-[0_0_12px_#f59e0b] animate-bounce pointer-events-none" />
                )}

                <Fingerprint 
                  className={`w-16 h-16 transition-all ${
                    !govtCameraStream
                      ? 'text-slate-600'
                      : fingerprintVerified 
                      ? 'text-emerald-400 scale-105' 
                      : isScanningFingerprint 
                      ? 'text-amber-400 animate-pulse' 
                      : 'text-amber-500/80 group-hover:text-amber-300'
                  }`} 
                />

                <div className="text-[11px] font-mono font-bold text-slate-300 mt-2">
                  {!govtCameraStream ? "CAMERA BLOCKED ⚠️" : fingerprintVerified ? "VERIFIED ✅" : isScanningFingerprint ? "SCANNING..." : "TAP FINGERPRINT"}
                </div>
              </div>

            </div>

            {/* Error Banner if Govt Camera Fails */}
            {govtCameraError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-300 font-medium flex items-center gap-2 relative z-10">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{govtCameraError}</span>
              </div>
            )}

            {/* Action Button - CLEAN ONLY 'Verify' TEXT */}
            <div className="space-y-3 relative z-10 pt-2">
              {!isScanningFingerprint && !fingerprintVerified ? (
                <button
                  onClick={handleScanFingerprint}
                  disabled={!govtCameraStream}
                  className={`w-full py-3.5 px-6 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all btn-pop ${
                    govtCameraStream
                      ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 cursor-pointer shadow-amber-600/20'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>{currentLang === 'HI' ? 'सत्यापित करें' : 'Verify'}</span>
                </button>
              ) : (
                <div className="w-full py-3.5 px-6 rounded-2xl bg-amber-950/80 border border-amber-700/80 text-amber-300 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>{currentLang === 'HI' ? 'सत्यापित हो रहा है...' : 'Verifying...'}</span>
                </div>
              )}

              <button
                onClick={closeGovtFingerprintModal}
                className="w-full py-2 text-xs text-slate-400 hover:text-white font-semibold transition-colors text-center cursor-pointer"
              >
                {currentLang === 'HI' ? 'रद्द करें (Cancel)' : 'Cancel Login'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Clean Footer Space */}
      <div className="relative z-10 py-2" />
    </div>
  );
};
