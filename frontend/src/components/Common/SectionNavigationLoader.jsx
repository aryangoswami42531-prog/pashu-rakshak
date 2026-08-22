import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

const SECTION_TITLES = {
  SCANNER: "AI Symptom Scanner",
  MY_CASES: "My Reported Cases",
  VET_LOCATOR: "Nearby Vet Officers",
  HEALTH_RECORDS: "Digital Health Passports",
  COMPLAINTS: "Grievance Reports & Audit",
  HEATMAP: "Outbreak GIS Surveillance",
  OFFICERS: "Vet Officer Duty Scorecard",
  MAP: "Emergency Field GPS Navigation",
  SEND_GEO_ALERT: "Broadcast Geo-Alert Panel",
  QUEUE: "Live Emergency Dispatch Queue"
};

export const SectionNavigationLoader = ({ targetTab }) => {
  const [progress, setProgress] = useState(18);
  const sectionTitle = SECTION_TITLES[targetTab] || "Pashu Rakshak";

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(68), 350);
    const timer2 = setTimeout(() => setProgress(100), 750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9995] bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-4 text-white animate-fadeIn">
      {/* Top Precision Sweep Progress Line (Linear / Vercel Grade) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900 z-50 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(16,185,129,0.9)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Super Minimal Floating Glass Pill */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#0B0F19]/95 border border-slate-700/80 shadow-[0_15px_35px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-xs font-black text-white font-display tracking-wide">
          {sectionTitle}
        </span>
      </div>
    </div>
  );
};
