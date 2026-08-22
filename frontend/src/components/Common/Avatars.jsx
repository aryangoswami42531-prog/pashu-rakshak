import React from 'react';

// 🌾 1. ULTRA-PREMIUM 3D PIXAR-GRADE INDIAN FARMER AI AVATAR (BIG BRIGHT SMILE + MOVING EYEBROWS)
export const FarmerAvatar3D = ({ className = "", size = 80 }) => (
  <div 
    className={`relative shrink-0 transition-transform hover:scale-105 drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)] ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, maxWidth: '100%', maxHeight: '100%' }}
  >
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        {/* 3D Pagri (Turban) Spherical Gradient */}
        <radialGradient id="turban3DGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ff8c00" />
          <stop offset="45%" stopColor="#ea580c" />
          <stop offset="85%" stopColor="#9a3412" />
          <stop offset="100%" stopColor="#431407" />
        </radialGradient>

        {/* 3D Skin Realistic Soft Studio Lighting */}
        <radialGradient id="skin3DGrad" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff5eb" />
          <stop offset="50%" stopColor="#fcd7c3" />
          <stop offset="85%" stopColor="#e8a589" />
          <stop offset="100%" stopColor="#b86b4d" />
        </radialGradient>

        {/* 3D Kurta Ambient Occlusion */}
        <linearGradient id="kurta3DGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#047857" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>

        {/* 3D Realistic Eye Pupil Iris */}
        <radialGradient id="iris3DGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#b45309" />
          <stop offset="90%" stopColor="#451a03" />
        </radialGradient>

        {/* Specular Glow Highlight */}
        <radialGradient id="specularGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Head Group with Lifelike 3D Tilt */}
      <g className="animate-3d-head-tilt">
        {/* Shortened Natural Neck */}
        <rect x="88" y="122" width="24" height="15" fill="url(#skin3DGrad)" rx="4" />
        <rect x="88" y="130" width="24" height="7" fill="#b86b4d" opacity="0.3" rx="3" />

        {/* Kurta Body Shoulder Base & Resting Arms */}
        <path d="M 32,185 Q 100,132 168,185 Z" fill="url(#kurta3DGrad)" />
        <path d="M 85,145 L 100,175 L 115,145 Z" fill="#ffffff" opacity="0.95" />
        <path d="M 40,185 L 56,145 L 70,175 Z" fill="url(#kurta3DGrad)" />
        <path d="M 160,185 L 144,145 L 130,175 Z" fill="url(#kurta3DGrad)" />

        {/* 3D Human Face Geometry */}
        <path d="M 58,74 Q 58,135 100,135 Q 142,135 142,74 Q 142,44 100,44 Q 58,44 58,74 Z" fill="url(#skin3DGrad)" />
        {/* Cheek Blush 3D Depth */}
        <ellipse cx="70" cy="98" rx="11" ry="6" fill="#f43f5e" opacity="0.18" />
        <ellipse cx="130" cy="98" rx="11" ry="6" fill="#f43f5e" opacity="0.18" />

        {/* Ears */}
        <ellipse cx="54" cy="88" rx="7" ry="11" fill="#e8a589" />
        <ellipse cx="146" cy="88" rx="7" ry="11" fill="#e8a589" />

        {/* 3D Royal Turban (Pagri) */}
        <path d="M 46,70 Q 100,22 154,70 Q 158,48 136,34 Q 100,22 64,34 Q 42,48 46,70 Z" fill="url(#turban3DGrad)" />
        <path d="M 56,54 Q 100,38 144,54" stroke="#fbbf24" strokeWidth="3.5" fill="none" opacity="0.9" />
        <ellipse cx="100" cy="34" rx="14" ry="8" fill="#fbbf24" opacity="0.9" />

        {/* FREQUENT EYE BLINKING + LARGER EXPRESSIVE 3D PIXAR EYES */}
        <g className="animate-3d-frequent-blink">
          <g className="animate-3d-eye-gaze-down">
            {/* Left Eye (Bigger) */}
            <ellipse cx="76" cy="82" rx="13.5" ry="11.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
            <circle cx="76" cy="82" r="7.8" fill="url(#iris3DGrad)" />
            <circle cx="76" cy="82" r="3.8" fill="#090d16" />
            <circle cx="79.5" cy="79" r="2.2" fill="url(#specularGlow)" />
            <circle cx="73" cy="84" r="1.1" fill="#ffffff" opacity="0.7" />

            {/* Right Eye (Bigger) */}
            <ellipse cx="124" cy="82" rx="13.5" ry="11.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
            <circle cx="124" cy="82" r="7.8" fill="url(#iris3DGrad)" />
            <circle cx="124" cy="82" r="3.8" fill="#090d16" />
            <circle cx="127.5" cy="79" r="2.2" fill="url(#specularGlow)" />
            <circle cx="121" cy="84" r="1.1" fill="#ffffff" opacity="0.7" />
          </g>
        </g>

        {/* DYNAMIC MOVING EYEBROWS (eyebrow hilane wali animation) */}
        <g className="animate-eyebrow-flex">
          <path d="M 62,66 Q 76,59 88,66" stroke="#2c140d" strokeWidth="3.8" strokeLinecap="round" fill="none" />
          <path d="M 112,66 Q 124,59 138,66" stroke="#2c140d" strokeWidth="3.8" strokeLinecap="round" fill="none" />
        </g>

        {/* 3D Mustache */}
        <path d="M 74,101 Q 100,94 126,101 Q 112,108 100,104 Q 88,108 74,101 Z" fill="#2c140d" />

        {/* BIG BRIGHT JOYFUL 3D SMILE WITH WHITE TEETH (tez se smile) */}
        <g className="animate-farmer-smile-05s">
          <path d="M 74,108 Q 100,138 126,108 Q 100,114 74,108 Z" fill="#991b1b" />
          <path d="M 78,110 Q 100,116 122,110 Q 100,121 78,110 Z" fill="#ffffff" />
          <path d="M 86,128 Q 100,120 114,128 Q 100,136 86,128 Z" fill="#f43f5e" />
          <path d="M 72,107 Q 100,140 128,107" stroke="#be123c" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  </div>
);

// 🩺 2. ULTRA-PREMIUM 3D PIXAR-GRADE VETERINARY OFFICER AI AVATAR (BIG BRIGHT SMILE + MOVING EYEBROWS)
export const VetOfficerAvatar3D = ({ className = "", size = 80 }) => (
  <div 
    className={`relative shrink-0 transition-transform hover:scale-105 drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)] ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, maxWidth: '100%', maxHeight: '100%' }}
  >
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="vetCoat3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        <linearGradient id="vetScrubs3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="60%" stopColor="#0e7490" />
          <stop offset="100%" stopColor="#155e75" />
        </linearGradient>

        <radialGradient id="vetSkin3D" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="55%" stopColor="#ffedd5" />
          <stop offset="85%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#f97316" opacity="0.7" />
        </radialGradient>

        <linearGradient id="vetHair3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="40%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        <radialGradient id="vetIris3D" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="90%" stopColor="#0c4a6e" />
        </radialGradient>
      </defs>

      <g className="animate-3d-head-tilt">
        <rect x="88" y="122" width="24" height="15" fill="url(#vetSkin3D)" rx="4" />
        <path d="M 30,185 Q 100,130 170,185 Z" fill="url(#vetCoat3D)" />
        <path d="M 80,145 L 100,175 L 120,145 Z" fill="url(#vetScrubs3D)" />

        <path d="M 64,132 Q 100,178 136,132" stroke="#334155" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M 64,132 Q 100,178 136,132" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
        <circle cx="100" cy="168" r="7.5" fill="#f59e0b" stroke="#334155" strokeWidth="2" />
        <circle cx="100" cy="168" r="3.5" fill="#ffffff" opacity="0.8" />

        <path d="M 58,74 Q 58,135 100,135 Q 142,135 142,74 Q 142,44 100,44 Q 58,44 58,74 Z" fill="url(#vetSkin3D)" />
        <ellipse cx="54" cy="88" rx="6.5" ry="10" fill="#fed7aa" />
        <ellipse cx="146" cy="88" rx="6.5" ry="10" fill="#fed7aa" />

        <path d="M 52,70 C 50,42 72,24 100,24 C 130,24 150,42 148,70 C 144,48 125,32 100,32 C 76,32 56,48 52,70 Z" fill="url(#vetHair3D)" />
        <path d="M 52,65 Q 75,32 110,26 Q 138,28 148,60 C 142,38 118,28 96,30 C 72,32 56,46 52,65 Z" fill="#64748b" opacity="0.7" />
        <path d="M 68,36 Q 95,24 125,34" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />

        {/* FREQUENT EYE BLINKING + LARGER EXPRESSIVE 3D PIXAR EYES */}
        <g className="animate-3d-frequent-blink">
          <g className="animate-3d-eye-gaze-down">
            {/* Left Eye (Bigger) */}
            <ellipse cx="76" cy="82" rx="13.5" ry="11.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
            <circle cx="76" cy="82" r="7.8" fill="url(#vetIris3D)" />
            <circle cx="76" cy="82" r="3.8" fill="#090d16" />
            <circle cx="79.5" cy="79" r="2.2" fill="#ffffff" opacity="0.95" />
            <circle cx="73" cy="84" r="1.1" fill="#ffffff" opacity="0.7" />

            {/* Right Eye (Bigger) */}
            <ellipse cx="124" cy="82" rx="13.5" ry="11.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
            <circle cx="124" cy="82" r="7.8" fill="url(#vetIris3D)" />
            <circle cx="124" cy="82" r="3.8" fill="#090d16" />
            <circle cx="127.5" cy="79" r="2.2" fill="#ffffff" opacity="0.95" />
            <circle cx="121" cy="84" r="1.1" fill="#ffffff" opacity="0.7" />
          </g>
        </g>

        {/* Glasses Frame Adjusted for Larger Eyes */}
        <rect x="60" y="69" width="32" height="24" rx="6" fill="none" stroke="#0f172a" strokeWidth="2.5" />
        <rect x="108" y="69" width="32" height="24" rx="6" fill="none" stroke="#0f172a" strokeWidth="2.5" />
        <path d="M 92,79 L 108,79" stroke="#0f172a" strokeWidth="2.5" />
        <path d="M 52,78 L 60,79" stroke="#0f172a" strokeWidth="2" />
        <path d="M 140,79 L 148,78" stroke="#0f172a" strokeWidth="2" />
        <path d="M 64,73 L 74,73" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M 112,73 L 122,73" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

        {/* DYNAMIC MOVING EYEBROWS (eyebrow hilane wali animation) */}
        <g className="animate-eyebrow-flex">
          <path d="M 62,63 Q 76,58 88,63" stroke="#1e293b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M 112,63 Q 124,58 138,63" stroke="#1e293b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </g>

        {/* BIG BRIGHT JOYFUL 3D SMILE WITH WHITE TEETH (tez se smile) */}
        <g className="animate-farmer-smile-05s">
          <path d="M 74,108 Q 100,138 126,108 Q 100,114 74,108 Z" fill="#991b1b" />
          <path d="M 78,110 Q 100,116 122,110 Q 100,121 78,110 Z" fill="#ffffff" />
          <path d="M 86,128 Q 100,120 114,128 Q 100,136 86,128 Z" fill="#f43f5e" />
          <path d="M 72,107 Q 100,140 128,107" stroke="#be123c" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  </div>
);

// 🏛️ 3. ULTRA-PREMIUM 3D PIXAR-GRADE GOVT ADMIN AI AVATAR (BIG BRIGHT SMILE + MOVING EYEBROWS)
export const GovtAdminAvatar3D = ({ className = "", size = 80 }) => (
  <div 
    className={`relative shrink-0 transition-transform hover:scale-105 drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)] ${className}`}
    style={{ width: `${size}px`, height: `${size}px`, maxWidth: '100%', maxHeight: '100%' }}
  >
    <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="adminSuit3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="adminHair3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="40%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        <radialGradient id="adminSkin3D" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="55%" stopColor="#ffedd5" />
          <stop offset="85%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#ea580c" opacity="0.6" />
        </radialGradient>
      </defs>

      <g className="animate-3d-head-tilt">
        <rect x="88" y="122" width="24" height="15" fill="url(#adminSkin3D)" rx="4" />
        <path d="M 30,185 Q 100,130 170,185 Z" fill="url(#adminSuit3D)" />
        <path d="M 85,145 L 100,175 L 115,145 Z" fill="#ffffff" opacity="0.95" />
        <path d="M 97,148 L 103,148 L 105,178 L 100,183 L 95,178 Z" fill="#b91c1c" />
        <circle cx="58" cy="162" r="4.5" fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
        <circle cx="58" cy="162" r="2" fill="#ffffff" />

        <path d="M 58,74 Q 58,135 100,135 Q 142,135 142,74 Q 142,44 100,44 Q 58,44 58,74 Z" fill="url(#adminSkin3D)" />
        <ellipse cx="54" cy="88" rx="6.5" ry="10" fill="#fed7aa" />
        <ellipse cx="146" cy="88" rx="6.5" ry="10" fill="#fed7aa" />

        <path d="M 50,68 C 48,38 72,22 100,22 C 128,22 152,38 150,68 C 144,44 125,28 100,28 C 75,28 56,44 50,68 Z" fill="url(#adminHair3D)" />
        <path d="M 54,58 Q 78,30 110,26 Q 138,28 146,55 C 140,36 116,28 94,30 C 72,32 58,44 54,58 Z" fill="#94a3b8" opacity="0.5" />

        {/* FREQUENT EYE BLINKING + LARGER EXPRESSIVE 3D PIXAR EYES */}
        <g className="animate-3d-frequent-blink">
          <g className="animate-3d-eye-gaze-down">
            {/* Left Eye (Bigger) */}
            <ellipse cx="76" cy="82" rx="13.5" ry="11.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
            <circle cx="76" cy="82" r="7.5" fill="#1e1b4b" />
            <circle cx="76" cy="82" r="3.6" fill="#020617" />
            <circle cx="79" cy="79" r="2.2" fill="#ffffff" opacity="0.95" />
            <circle cx="73" cy="84" r="1.1" fill="#ffffff" opacity="0.7" />

            {/* Right Eye (Bigger) */}
            <ellipse cx="124" cy="82" rx="13.5" ry="11.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.6" />
            <circle cx="124" cy="82" r="7.5" fill="#1e1b4b" />
            <circle cx="124" cy="82" r="3.6" fill="#020617" />
            <circle cx="127" cy="79" r="2.2" fill="#ffffff" opacity="0.95" />
            <circle cx="121" cy="84" r="1.1" fill="#ffffff" opacity="0.7" />
          </g>
        </g>

        <rect x="61" y="70" width="31" height="23" rx="5" fill="none" stroke="#d97706" strokeWidth="2" />
        <rect x="108" y="70" width="31" height="23" rx="5" fill="none" stroke="#d97706" strokeWidth="2" />
        <path d="M 92,79 L 108,79" stroke="#d97706" strokeWidth="2" />

        {/* DYNAMIC MOVING EYEBROWS (eyebrow hilane wali animation) */}
        <g className="animate-eyebrow-flex">
          <path d="M 62,64 Q 76,59 88,64" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M 112,64 Q 124,59 138,64" stroke="#334155" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </g>

        {/* BIG BRIGHT JOYFUL 3D SMILE WITH WHITE TEETH (tez se smile) */}
        <g className="animate-farmer-smile-05s">
          <path d="M 74,108 Q 100,138 126,108 Q 100,114 74,108 Z" fill="#991b1b" />
          <path d="M 78,110 Q 100,116 122,110 Q 100,121 78,110 Z" fill="#ffffff" />
          <path d="M 86,128 Q 100,120 114,128 Q 100,136 86,128 Z" fill="#f43f5e" />
          <path d="M 72,107 Q 100,140 128,107" stroke="#be123c" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  </div>
);
