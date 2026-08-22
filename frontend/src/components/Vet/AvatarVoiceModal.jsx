import React, { useEffect, useState } from 'react';
import { AlertTriangle, Stethoscope, Volume2, X, ArrowRight, CheckCircle2 } from 'lucide-react';

// ULTRA-PREMIUM 3D ANIMATED FEMALE AI DOCTOR AVATAR (NO GLASSES, GORGEOUS EYES, DYNAMIC FACIAL EXPRESSIONS & LIP-SYNC)
const Animated3DDoctorAvatar = ({ isSpeaking }) => {
  return (
    <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
      {/* Outer Cyan Glowing Pulsing Aura */}
      <div className={`absolute inset-0 rounded-full bg-cyan-500/30 blur-2xl transition-all duration-500 ${isSpeaking ? 'opacity-100 scale-110' : 'opacity-60 scale-100'}`} />

      {/* Main Cyan Glowing Border Ring */}
      <div className="relative w-52 h-52 rounded-full bg-[#080f24] border-4 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.95)] overflow-hidden flex items-center justify-center avatar-talking-glow">
        
        {/* Vector 3D Stylized Avatar with Real-time CSS Micro-Animations */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            {/* Rich Silky Hair Gradients */}
            <linearGradient id="hairDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a261c" />
              <stop offset="50%" stopColor="#2c140d" />
              <stop offset="100%" stopColor="#150805" />
            </linearGradient>

            <linearGradient id="hairHighlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#683427" />
              <stop offset="100%" stopColor="#2c140d" />
            </linearGradient>

            {/* Soft Human Skin Gradient */}
            <linearGradient id="humanSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffebd9" />
              <stop offset="60%" stopColor="#fcd7c3" />
              <stop offset="100%" stopColor="#f8c2aa" />
            </linearGradient>

            <linearGradient id="neckShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e29b82" />
              <stop offset="100%" stopColor="#c87960" />
            </linearGradient>

            {/* Doctor Gold Collar Coat Gradient */}
            <linearGradient id="doctorCoatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* Iris Golden Eye Gradient */}
            <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
          </defs>

          {/* Background Inside Circle */}
          <circle cx="100" cy="100" r="100" fill="#080f24" />

          {/* DYNAMIC FLOWING HAIR - BACK LAYER (SWAYS IN BREEZE) */}
          <g className="animate-hair-breeze-left">
            <path d="M 35,65 Q 18,120 26,180 L 62,180 Q 45,120 52,65 Z" fill="url(#hairDarkGrad)" />
          </g>
          <g className="animate-hair-breeze-right">
            <path d="M 165,65 Q 182,120 174,180 L 138,180 Q 155,120 148,65 Z" fill="url(#hairDarkGrad)" />
          </g>

          {/* HEAD & FACE GROUP (SUBTLE NATURAL HEAD SWAYING) */}
          <g className="animate-head-sway">
            {/* Neck & Shadow */}
            <rect x="87" y="124" width="26" height="30" fill="url(#humanSkinGrad)" rx="5" />
            <path d="M 87,124 Q 100,134 113,124 L 113,131 Q 100,139 87,131 Z" fill="url(#neckShadowGrad)" opacity="0.6" />

            {/* Doctor Outfit */}
            <path d="M 45,178 L 100,140 L 155,178 Z" fill="url(#doctorCoatGrad)" />
            <path d="M 84,150 L 100,178 L 116,150 Z" fill="#0f172a" />
            <path d="M 75,178 Q 100,164 125,178" stroke="#06b6d4" strokeWidth="2.5" fill="none" opacity="0.9" />

            {/* Human Face Shape */}
            <path d="M 54,72 Q 54,136 100,136 Q 146,136 146,72 Q 146,40 100,40 Q 54,40 54,72 Z" fill="url(#humanSkinGrad)" />

            {/* Ears */}
            <ellipse cx="53" cy="89" rx="7" ry="12" fill="#fcd7c3" />
            <ellipse cx="147" cy="89" rx="7" ry="12" fill="#fcd7c3" />

            {/* DYNAMIC FLOWING FRONT BANGS HAIR */}
            <g className="animate-hair-breeze-left">
              <path d="M 50,68 Q 95,78 102,46 Q 75,36 50,68 Z" fill="url(#hairHighlightGrad)" />
              <path d="M 45,68 Q 38,110 50,148 Q 58,110 50,68 Z" fill="url(#hairDarkGrad)" />
            </g>
            <g className="animate-hair-breeze-right">
              <path d="M 150,68 Q 105,78 98,46 Q 125,36 150,68 Z" fill="url(#hairHighlightGrad)" />
              <path d="M 155,68 Q 162,110 150,148 Q 142,110 150,68 Z" fill="url(#hairDarkGrad)" />
            </g>

            {/* ELEGANT ARCHED EYEBROWS (NO GLASSES!) */}
            <g className="animate-eyebrow-flex">
              <path d="M 64,74 Q 80,63 94,72" stroke="#2c140d" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 106,72 Q 120,63 136,74" stroke="#2c140d" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>

            {/* GORGEOUS ALMOND EYES WITH NATURAL EYE BLINKING (NO GLASSES!) */}
            <g className="animate-eye-blink-natural">
              {/* Left Eye */}
              <ellipse cx="78" cy="86" rx="10" ry="7.5" fill="#ffffff" />
              <circle cx="78" cy="86" r="6" fill="url(#irisGrad)" />
              <circle cx="78" cy="86" r="3" fill="#0f172a" />
              <circle cx="80.5" cy="83.5" r="1.8" fill="#ffffff" />
              <circle cx="75.5" cy="88" r="1" fill="#ffffff" opacity="0.8" />
              {/* Double Eyelid & Eyelashes */}
              <path d="M 66,80 Q 78,74 90,80" stroke="#2c140d" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 67,83 Q 78,78 89,83" stroke="#1c0f0d" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Right Eye */}
              <ellipse cx="122" cy="86" rx="10" ry="7.5" fill="#ffffff" />
              <circle cx="122" cy="86" r="6" fill="url(#irisGrad)" />
              <circle cx="122" cy="86" r="3" fill="#0f172a" />
              <circle cx="124.5" cy="83.5" r="1.8" fill="#ffffff" />
              <circle cx="119.5" cy="88" r="1" fill="#ffffff" opacity="0.8" />
              {/* Double Eyelid & Eyelashes */}
              <path d="M 110,80 Q 122,74 134,80" stroke="#2c140d" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 111,83 Q 122,78 133,83" stroke="#1c0f0d" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>

            {/* Soft Rosy Glowing Cheeks */}
            <ellipse cx="68" cy="102" rx="11" ry="6" fill="#ff7e95" opacity="0.65" />
            <ellipse cx="132" cy="102" rx="11" ry="6" fill="#ff7e95" opacity="0.65" />

            {/* Delicate Nose Contour */}
            <path d="M 98,95 L 102,102 L 96,104" stroke="#e29b82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* REALISTIC LIP-SYNC TALKING MOUTH */}
            {isSpeaking ? (
              <g className="animate-mouth-lip-sync">
                {/* Open Lips */}
                <ellipse cx="100" cy="116" rx="13" ry="8" fill="#be123c" />
                {/* Mouth Inner Cavity */}
                <ellipse cx="100" cy="117" rx="11" ry="6" fill="#4c0519" />
                {/* Upper Teeth Line */}
                <path d="M 91,113 Q 100,110 109,113 L 109,114.5 Q 100,113 91,114.5 Z" fill="#ffffff" />
                {/* Tongue Detail */}
                <ellipse cx="100" cy="119" rx="7" ry="3.5" fill="#f43f5e" />
              </g>
            ) : (
              <path d="M 87,115 Q 100,124 113,115" stroke="#e11d48" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            )}
          </g>
        </svg>
      </div>
    </div>
  );
};

export const AvatarVoiceModal = ({ isOpen, onClose, onGoToQueue, onConfirmInspectionAndOpenAlert }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakHindiNotice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const hindiPhrase = "पहले पशु के फार्म पर जाकर निरीक्षण करें और पुष्टि करें कि वह संक्रमित है या नहीं!";
      const utterance = new SpeechSynthesisUtterance(hindiPhrase);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.92;
      utterance.pitch = 1.15; // Natural female voice pitch

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isOpen) {
      speakHindiNotice();
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full rounded-3xl border border-amber-500/70 p-6 space-y-6 animate-fadeIn text-center shadow-2xl relative overflow-hidden">
        
        {/* Background Waveform Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 animate-pulse text-red-400" />
            <span>Field Inspection Gate (क्षेत्रीय निरीक्षण आवश्यक)</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DYNAMIC ANIMATED 3D FEMALE AI DOCTOR AVATAR (NO GLASSES, GORGEOUS EYES & REAL LIP-SYNC) */}
        <div className="space-y-4 relative z-10">
          <div className="relative">
            <Animated3DDoctorAvatar isSpeaking={isSpeaking} />

            {/* Re-play Voice Button */}
            <button
              onClick={speakHindiNotice}
              className="absolute bottom-1 right-1/4 p-2.5 rounded-full bg-cyan-400 text-slate-950 shadow-xl border-2 border-white hover:scale-110 active:scale-95 transition-all"
              title="Play Voice Notice Again"
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          {/* Cyan Sound Waves Animation */}
          <div className="flex items-center justify-center gap-1.5 h-6">
            {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
              <span
                key={bar}
                className={`w-1 rounded-full bg-cyan-400 transition-all duration-200 ${
                  isSpeaking ? 'animate-pulse h-5' : 'h-1.5 opacity-40'
                }`}
                style={{ animationDelay: `${bar * 0.1}s` }}
              />
            ))}
          </div>

          {/* Hindi Voice Box */}
          <div className="space-y-2">
            <div className="text-lg font-extrabold text-amber-300 font-display leading-snug p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-inner">
              "पहले पशु के फार्म पर जाकर निरीक्षण करें और पुष्टि करें कि वह संक्रमित है या नहीं!"
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Before broadcasting a regional containment alert to all farmers, confirm field inspection for this animal.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-800 space-y-2 relative z-10">
          <button
            onClick={() => {
              if (onConfirmInspectionAndOpenAlert) onConfirmInspectionAndOpenAlert();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 btn-pop"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Mark Field Visit Inspected & Open Geo-Alert Form Now</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onGoToQueue) onGoToQueue();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 btn-pop"
          >
            <Stethoscope className="w-4 h-4 text-blue-400" />
            <span>Go to Queue to View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
