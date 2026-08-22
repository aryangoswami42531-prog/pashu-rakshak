import React, { useState, useEffect, useRef } from 'react';

// ULTRA-PREMIUM CARTOON INDIAN FARMER WAVING HELLO (HI 👋) LOGO (NO CIRCLE BACKDROP)
const WavingFarmerLogo = () => (
  <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="turbanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffebd9" />
            <stop offset="60%" stopColor="#fcd7c3" />
            <stop offset="100%" stopColor="#f8c2aa" />
          </linearGradient>

          <linearGradient id="kurtaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#080D1A" />
          </linearGradient>

          <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
        </defs>

        {/* Neck */}
        <rect x="88" y="125" width="24" height="28" fill="url(#skinGrad)" rx="6" />

        {/* Executive Outfit / Kurta */}
        <path d="M 40,180 Q 100,138 160,180 Z" fill="url(#kurtaGrad)" />
        <path d="M 85,150 L 100,180 L 115,150 Z" fill="#ffffff" opacity="0.95" />
        <path d="M 72,180 Q 100,165 128,180" stroke="#10b981" strokeWidth="2.5" fill="none" opacity="0.8" />

        {/* Human Face Shape */}
        <path d="M 58,76 Q 58,135 100,135 Q 142,135 142,76 Q 142,46 100,46 Q 58,46 58,76 Z" fill="url(#skinGrad)" />

        {/* Ears */}
        <ellipse cx="56" cy="90" rx="7" ry="11" fill="#fcd7c3" />
        <ellipse cx="144" cy="90" rx="7" ry="11" fill="#fcd7c3" />

        {/* Ultra-Premium Traditional Indian Pagri (Turban) */}
        <path d="M 48,72 Q 100,26 152,72 Q 156,52 136,38 Q 100,26 64,38 Q 44,52 48,72 Z" fill="url(#turbanGrad)" />
        <path d="M 58,56 Q 100,40 142,56" stroke="#fbbf24" strokeWidth="3" fill="none" />
        <ellipse cx="100" cy="38" rx="14" ry="8" fill="#fbbf24" opacity="0.9" />
        <circle cx="100" cy="38" r="4" fill="#ffffff" />

        {/* Eyes with Natural Blinking */}
        <g className="animate-eye-blink-natural">
          <ellipse cx="78" cy="85" rx="8.5" ry="6.5" fill="#ffffff" />
          <circle cx="78" cy="85" r="5" fill="url(#irisGrad)" />
          <circle cx="78" cy="85" r="2.5" fill="#0f172a" />
          <circle cx="80" cy="83" r="1.5" fill="#ffffff" />

          <ellipse cx="122" cy="85" rx="8.5" ry="6.5" fill="#ffffff" />
          <circle cx="122" cy="85" r="5" fill="url(#irisGrad)" />
          <circle cx="122" cy="85" r="2.5" fill="#0f172a" />
          <circle cx="124" cy="83" r="1.5" fill="#ffffff" />
        </g>

        {/* Eyebrows */}
        <path d="M 68,73 Q 78,67 88,73" stroke="#2c140d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 112,73 Q 122,67 132,73" stroke="#2c140d" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Nose Contour */}
        <path d="M 98,92 L 102,98 L 96,100" stroke="#e29b82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Mustache */}
        <path d="M 74,104 Q 100,97 126,104 Q 112,110 100,107 Q 88,110 74,104 Z" fill="#2c140d" />

        {/* Warm Happy Smile */}
        <path d="M 82,112 Q 100,125 118,112" stroke="#be123c" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* WAVING HAND GESTURE ("HI 👋") */}
        <g className="animate-wave-hi">
          {/* Hand Palm & Waving Fingers */}
          <path d="M 148,115 L 165,88 C 168,83 174,85 173,90 L 168,118 Z" fill="url(#skinGrad)" />
          <ellipse cx="166" cy="85" rx="4" ry="7" fill="#fcd7c3" transform="rotate(15 166 85)" />
          <ellipse cx="171" cy="88" rx="3.5" ry="6" fill="#fcd7c3" transform="rotate(25 171 88)" />
          <ellipse cx="175" cy="93" rx="3" ry="5.5" fill="#fcd7c3" transform="rotate(35 175 93)" />
        </g>
      </svg>
    </div>
  </div>
);

export const SplashScreen = ({ onFinish }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [showLogo, setShowLogo] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoCutReached, setVideoCutReached] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const isFinishedRef = useRef(false);

  const finishSplash = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    setFadeOut(true);

    setTimeout(() => {
      onFinish();
    }, 700); // 700ms smooth fade transition
  };

  const triggerAudioPlay = () => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setAudioStarted(true);
        }).catch(err => {
          console.log("Default autoplay check:", err);
        });
      }
    }
  };

  useEffect(() => {
    // FORCE PLAY IMMEDIATELY BY DEFAULT ON MOUNT
    triggerAudioPlay();

    // Fast retry loop to ensure playback starts instantly
    const intervalId = setInterval(() => {
      if (audioRef.current && audioRef.current.paused) {
        triggerAudioPlay();
      } else if (audioRef.current && !audioRef.current.paused) {
        clearInterval(intervalId);
      }
    }, 100);

    // Global listener backup in case browser blocks early promise
    const handleUserUnlock = () => {
      triggerAudioPlay();
    };

    window.addEventListener('click', handleUserUnlock, { once: true });
    window.addEventListener('pointerdown', handleUserUnlock, { once: true });
    window.addEventListener('touchstart', handleUserUnlock, { once: true });

    // Safety fallback timer: max 8s splash cap
    const fallbackTimer = setTimeout(() => {
      finishSplash();
    }, 8000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('click', handleUserUnlock);
      window.removeEventListener('pointerdown', handleUserUnlock);
      window.removeEventListener('touchstart', handleUserUnlock);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleVideoPlay = () => {
    setShowLogo(true);
    triggerAudioPlay();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;

      if (!showLogo) {
        setShowLogo(true);
      }

      if (currentTime >= 4.5 && !videoCutReached) {
        setVideoCutReached(true);
        videoRef.current.pause();

        if (audioRef.current && !audioRef.current.paused && !audioRef.current.ended) {
          console.log("Video cut at 4.5s, keeping splash active while voiceover audio finishes...");
        } else {
          finishSplash();
        }
      }
    }
  };

  const handleAudioEnded = () => {
    console.log("Voiceover audio completed naturally. Closing splash screen now!");
    finishSplash();
  };

  const handleVideoError = () => {
    console.warn("Splash video fallback triggered.");
    setVideoError(true);
    setShowLogo(true);
    triggerAudioPlay();
  };

  return (
    <div
      onClick={() => {
        triggerAudioPlay();
        finishSplash();
      }}
      className={`fixed inset-0 z-[9999] bg-[#030712] flex items-center justify-center overflow-hidden transition-opacity duration-700 cursor-pointer ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Voiceover Audio Element (public/voiceover.mp3) with autoPlay */}
      <audio
        ref={audioRef}
        src="/voiceover.mp3"
        autoPlay
        preload="auto"
        onEnded={handleAudioEnded}
      />

      {/* Fullscreen Video (0:00 to 0:05 clip) */}
      {!videoError && (
        <video
          ref={videoRef}
          src="/splash.mp4"
          autoPlay
          muted
          playsInline
          onPlay={handleVideoPlay}
          onTimeUpdate={handleTimeUpdate}
          onError={handleVideoError}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-75"
        />
      )}

      {/* Dark Vignette Overlay for Premium Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/50 to-[#030712]/80 pointer-events-none" />

      {/* Centered Waving Cartoon Indian Farmer Logo & App Title */}
      <div
        className={`relative z-10 text-center space-y-3 transition-all duration-700 transform ${
          showLogo ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* ULTRA-PREMIUM CARTOON FARMER LOGO */}
        <WavingFarmerLogo />

        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight drop-shadow-md">
            Pashu Rakshak
          </h1>
          <p className="text-xs sm:text-sm text-emerald-400 font-mono uppercase tracking-widest font-extrabold">
            National Livestock Biosecurity Platform
          </p>
        </div>

        {/* Subtle Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};
