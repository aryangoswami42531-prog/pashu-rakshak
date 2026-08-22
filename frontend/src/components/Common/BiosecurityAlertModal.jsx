import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Volume2, X, ShieldAlert, CheckCircle2, MapPin, Radio } from 'lucide-react';

// STUNNING 3D ANIMATED FEMALE AI DOCTOR AVATAR WITH NATURAL EYE BLINKING, FLOWING HAIR BREEZE, FACIAL EXPRESSIONS & REAL LIP-SYNC
const Animated3DDoctorAvatar = ({ isSpeaking }) => {
  return (
    <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
      {/* Outer Cyan Glowing Pulsing Aura */}
      <div className={`absolute inset-0 rounded-full bg-cyan-500/30 blur-2xl transition-all duration-500 ${isSpeaking ? 'opacity-100 scale-110' : 'opacity-60 scale-100'}`} />

      {/* Main Cyan Glowing Border Ring */}
      <div className="relative w-52 h-52 rounded-full bg-[#080f24] border-4 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.95)] overflow-hidden flex items-center justify-center avatar-talking-glow">
        
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="hairDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4a261c" />
              <stop offset="50%" stopColor="#2c140d" />
              <stop offset="100%" stopColor="#150805" />
            </linearGradient>

            <linearGradient id="hairHighlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#683427" />
              <stop offset="100%" stopColor="#2c140d" />
            </linearGradient>

            <linearGradient id="humanSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffebd9" />
              <stop offset="60%" stopColor="#fcd7c3" />
              <stop offset="100%" stopColor="#f8c2aa" />
            </linearGradient>

            <linearGradient id="neckShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e29b82" />
              <stop offset="100%" stopColor="#c87960" />
            </linearGradient>

            <linearGradient id="doctorCoatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>
          </defs>

          <circle cx="100" cy="100" r="100" fill="#080f24" />

          {/* DYNAMIC FLOWING HAIR - BACK LAYER */}
          <g className="animate-hair-breeze-left">
            <path d="M 35,65 Q 18,120 26,180 L 62,180 Q 45,120 52,65 Z" fill="url(#hairDarkGrad)" />
          </g>
          <g className="animate-hair-breeze-right">
            <path d="M 165,65 Q 182,120 174,180 L 138,180 Q 155,120 148,65 Z" fill="url(#hairDarkGrad)" />
          </g>

          {/* HEAD & FACE GROUP */}
          <g className="animate-head-sway">
            <rect x="87" y="124" width="26" height="30" fill="url(#humanSkinGrad)" rx="5" />
            <path d="M 87,124 Q 100,134 113,124 L 113,131 Q 100,139 87,131 Z" fill="url(#neckShadowGrad)" opacity="0.6" />

            <path d="M 45,178 L 100,140 L 155,178 Z" fill="url(#doctorCoatGrad)" />
            <path d="M 84,150 L 100,178 L 116,150 Z" fill="#0f172a" />
            <path d="M 75,178 Q 100,164 125,178" stroke="#06b6d4" strokeWidth="2.5" fill="none" opacity="0.9" />

            <path d="M 54,72 Q 54,136 100,136 Q 146,136 146,72 Q 146,40 100,40 Q 54,40 54,72 Z" fill="url(#humanSkinGrad)" />

            <ellipse cx="53" cy="89" rx="7" ry="12" fill="#fcd7c3" />
            <ellipse cx="147" cy="89" rx="7" ry="12" fill="#fcd7c3" />

            <g className="animate-hair-breeze-left">
              <path d="M 50,68 Q 95,78 102,46 Q 75,36 50,68 Z" fill="url(#hairHighlightGrad)" />
              <path d="M 45,68 Q 38,110 50,148 Q 58,110 50,68 Z" fill="url(#hairDarkGrad)" />
            </g>
            <g className="animate-hair-breeze-right">
              <path d="M 150,68 Q 105,78 98,46 Q 125,36 150,68 Z" fill="url(#hairHighlightGrad)" />
              <path d="M 155,68 Q 162,110 150,148 Q 142,110 150,68 Z" fill="url(#hairDarkGrad)" />
            </g>

            {/* EYEBROWS */}
            <g className="animate-eyebrow-flex">
              <path d="M 64,74 Q 80,63 94,72" stroke="#2c140d" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 106,72 Q 120,63 136,74" stroke="#2c140d" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>

            {/* ALMOND EYES WITH NATURAL EYE BLINKING */}
            <g className="animate-eye-blink-natural">
              <ellipse cx="78" cy="86" rx="10" ry="7.5" fill="#ffffff" />
              <circle cx="78" cy="86" r="6" fill="url(#irisGrad)" />
              <circle cx="78" cy="86" r="3" fill="#0f172a" />
              <circle cx="80.5" cy="83.5" r="1.8" fill="#ffffff" />
              <circle cx="75.5" cy="88" r="1" fill="#ffffff" opacity="0.8" />
              <path d="M 66,80 Q 78,74 90,80" stroke="#2c140d" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 67,83 Q 78,78 89,83" stroke="#1c0f0d" strokeWidth="3" strokeLinecap="round" fill="none" />

              <ellipse cx="122" cy="86" rx="10" ry="7.5" fill="#ffffff" />
              <circle cx="122" cy="86" r="6" fill="url(#irisGrad)" />
              <circle cx="122" cy="86" r="3" fill="#0f172a" />
              <circle cx="124.5" cy="83.5" r="1.8" fill="#ffffff" />
              <circle cx="119.5" cy="88" r="1" fill="#ffffff" opacity="0.8" />
              <path d="M 110,80 Q 122,74 134,80" stroke="#2c140d" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
              <path d="M 111,83 Q 122,78 133,83" stroke="#1c0f0d" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>

            <ellipse cx="68" cy="102" rx="11" ry="6" fill="#ff7e95" opacity="0.65" />
            <ellipse cx="132" cy="102" rx="11" ry="6" fill="#ff7e95" opacity="0.65" />

            <path d="M 98,95 L 102,102 L 96,104" stroke="#e29b82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* REALISTIC LIP-SYNC TALKING MOUTH */}
            {isSpeaking ? (
              <g className="animate-mouth-lip-sync">
                <ellipse cx="100" cy="116" rx="13" ry="8" fill="#be123c" />
                <ellipse cx="100" cy="117" rx="11" ry="6" fill="#4c0519" />
                <path d="M 91,113 Q 100,110 109,113 L 109,114.5 Q 100,113 91,114.5 Z" fill="#ffffff" />
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

export const BiosecurityAlertModal = ({ isOpen, onClose }) => {
  const { alertsList } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const activeAlert = alertsList && alertsList.length > 0 ? alertsList[0] : {
    title: "BIOSECURITY ALERT: Lumpy Skin Outbreak in 15km Radius",
    message: "Confirmed LSD cases detected in Ludhiana rural belt. Restrict cattle movement, apply ectoparasite repellents, and report nodular skin lesions immediately.",
    issuedBy: "Govt Biosecurity Command"
  };

  const speakAlertNotice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const hindiPhrase = "बायोसिक्योरिटी अलर्ट! लुधियाना ग्रामीण क्षेत्र में 15 किलोमीटर के दायरे में लम्पी स्किन बीमारी का प्रकोप पाया गया है। पशुओं की आवाजाही तुरंत रोकें, कीटनाशक स्प्रे का प्रयोग करें और त्वचा पर गांठें दिखने पर तुरंत पशु चिकित्सक को सूचित करें!";
      const utterance = new SpeechSynthesisUtterance(hindiPhrase);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.92;
      utterance.pitch = 1.12;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isOpen) {
      speakAlertNotice();
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 text-white">
      <div className="glass-panel max-w-lg w-full rounded-3xl border border-amber-500/70 p-6 space-y-6 animate-fadeIn text-center shadow-2xl relative overflow-hidden">
        
        {/* Background Waveform Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-display">
            <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            <span>National Biosecurity Alert (एआई डॉक्टर अलर्ट)</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DYNAMIC ANIMATED 3D AI DOCTOR AVATAR SPEAKING THE ALERT */}
        <div className="space-y-4 relative z-10">
          <div className="relative">
            <Animated3DDoctorAvatar isSpeaking={isSpeaking} />

            {/* Re-play Voice Button */}
            <button
              onClick={speakAlertNotice}
              className="absolute bottom-1 right-1/4 p-3 rounded-full bg-cyan-400 text-slate-950 shadow-xl border-2 border-white hover:scale-110 active:scale-95 transition-all"
              title="Play AI Avatar Voice Alert Notice Again"
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce' : ''}`} />
            </button>
          </div>

          {/* Sound Waves Animation */}
          <div className="flex items-center justify-center gap-1.5 h-6">
            {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
              <span
                key={bar}
                className={`w-1.5 rounded-full bg-cyan-400 transition-all duration-200 ${
                  isSpeaking ? 'animate-pulse h-6' : 'h-2 opacity-40'
                }`}
                style={{ animationDelay: `${bar * 0.1}s` }}
              />
            ))}
          </div>

          {/* Voice Text Box */}
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/50 text-left space-y-2 shadow-inner">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{activeAlert.title}</span>
              </div>
              <p className="text-sm font-medium text-slate-200 leading-relaxed">
                "{activeAlert.message}"
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>Issued by: <strong>{activeAlert.issuedBy}</strong></span>
                <span className="text-emerald-400 font-bold">• Audio Broadcast Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-800 relative z-10">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 btn-pop flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Acknowledge Biosecurity Notice & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
