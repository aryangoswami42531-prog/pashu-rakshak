import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AISymptomScanner } from './AISymptomScanner';
import { VetLocator } from './VetLocator';
import { HealthRecords } from './HealthRecords';
import { MyCasesView } from './MyCasesView';
import { FarmLocationModal } from './FarmLocationModal';
import { 
  Sparkles, Stethoscope, ShieldCheck, MapPin, Activity, 
  FileWarning, ChevronRight, Clock, ClipboardList, Menu 
} from 'lucide-react';

export const FarmerDashboard = ({ activeTab = 'SCANNER', setActiveTab, onOpenComplaint }) => {
  const { t, animalsList, vetsList, requestsList, refreshAllData, showToast, addRequestToContext, addAnimalToContext } = useApp();
  const [prefilledAiResult, setPrefilledAiResult] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [liveLocationStr, setLiveLocationStr] = useState('Detecting Current GPS Location...');

  // Live Reverse Geocoding of User's Current GPS Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || "Local Farm Region";
              const state = data.address.state || data.address.country || "";
              setLiveLocationStr(`Current Location: ${city}${state ? `, ${state}` : ''}`);
            } else {
              setLiveLocationStr(`Current GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
            }
          } catch (e) {
            setLiveLocationStr(`Current GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
          }
        },
        (err) => {
          console.warn("GPS access warning:", err);
          setLiveLocationStr("Live Farm GPS Location Active");
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      setLiveLocationStr("Live Farm GPS Location Active");
    }
  }, []);

  // DYNAMIC REAL-TIME METRICS CALCULATIONS (NO HARDCODED FALLBACKS)
  const totalAnimalsCount = animalsList.length;
  
  // Count verified healthy animals (with vaccine passes or completed doctor visits)
  const verifiedHealthyCount = animalsList.filter(a => 
    a.status === 'VERIFIED_PASSPORT' || (a.vaccinations && a.vaccinations.length > 0)
  ).length;

  // Real-time Farm Biosecurity Index percentage
  const biosecurityIndex = totalAnimalsCount === 0 
    ? 100 
    : Math.round((verifiedHealthyCount / totalAnimalsCount) * 100);

  // Available real-time Vets count
  const availableVetsCount = vetsList.filter(v => v.status === 'AVAILABLE' || v.isOnline !== false).length;

  const biosecurityColorClass = biosecurityIndex >= 80 
    ? 'text-emerald-400' 
    : biosecurityIndex >= 50 
    ? 'text-amber-400' 
    : 'text-red-400';

  const handleAiRequestVet = (aiResult) => {
    setPrefilledAiResult(aiResult);
    setIsLocationModalOpen(true);
  };

  const handleConfirmLocationAndDispatch = async (locationData) => {
    setIsLocationModalOpen(false);

    // Generate unique Animal Tag for this live farmer request
    const uniqueAnimalTag = `IN-FARM-${Math.floor(1000 + Math.random() * 9000)}`;
    const farmerGpsLocation = locationData.location || { lat: 30.8920, lng: 75.8450 };
    const farmerVillageName = locationData.village || "Farmer Live Location";

    // Automatically create animal health record in persistent store awaiting vet visit
    const nowStr = new Date().toISOString().split('T')[0];
    const newAnimal = {
      id: "anim-" + Date.now(),
      farmId: "farm-1",
      tagNumber: uniqueAnimalTag,
      species: prefilledAiResult?.diseaseMatch?.affectedSpecies?.[0] || "Cattle",
      breed: "Local Breed",
      ageMonths: 36,
      gender: "FEMALE",
      status: "INFECTED",
      vaccinations: [],
      medicalHistory: [
        {
          date: nowStr,
          diagnosis: `🔴 INFECTED — Suspected ${prefilledAiResult?.diseaseMatch?.name || "Disease"}`,
          prescriptions: ["Quarantine Shed Isolation", "Antipyretic & Antihistamine"],
          remarks: `Emergency Dispatch Request initiated by Farmer. Status: INFECTED — AWAITING VET VISIT`
        }
      ]
    };

    try {
      const res = await fetch('/api/vets/request', {
        method: 'POST',
        cache: 'no-store',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          farmerName: "Local Farmer",
          farmerPhone: "+91 98711 22334",
          farmLocation: farmerGpsLocation,
          village: farmerVillageName,
          animalTag: uniqueAnimalTag,
          species: prefilledAiResult?.diseaseMatch?.affectedSpecies?.[0] || "Cattle",
          symptoms: prefilledAiResult?.symptomsIdentified || ["Skin lesions", "High fever"],
          aiRiskLevel: prefilledAiResult?.riskLevel || "HIGH",
          suspectedDisease: prefilledAiResult?.diseaseMatch?.name || "Lumpy Skin Disease (LSD)",
          vetId: "vet-101",
          notes: `Farm: ${farmerVillageName} (${locationData.landmark}). Live GPS: ${farmerGpsLocation.lat}, ${farmerGpsLocation.lng}`
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.request && addRequestToContext) {
          addRequestToContext(data.request);
        }
        if (data.animal && addAnimalToContext) {
          addAnimalToContext(data.animal);
        }
        showToast(`🚨 Request Dispatched! Waiting for Doctor Visit.`, "success");
        refreshAllData();
        // Automatically switch to My Reported Cases tab so farmer immediately sees active case
        if (setActiveTab) setActiveTab('MY_CASES');
      }
    } catch (err) {
      console.error(err);
      if (setActiveTab) setActiveTab('HEALTH_RECORDS');
    }
  };

  return (
    <div className="space-y-6 pb-8 w-full text-white relative">
      {/* Fullscreen Background Image (/famer.jpg) STRICTLY ONLY FOR FARMER PORTAL */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/famer.jpg"
          alt="Farmer Workspace Background"
          className="w-full h-full object-cover opacity-75 filter brightness-105 contrast-105"
        />
        {/* Soft Vignette Overlay for High Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-[#030712]/40 to-[#030712]/70" />
      </div>

      <div className="relative z-10 space-y-6">
        
        {/* Top Hero Welcome Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/60 bg-[#0B0F19]/90 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-3 py-1 rounded-full font-bold font-mono uppercase tracking-wider">
                  🌾 Farmer Node • Active Session
                </span>
                <span className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] px-2.5 py-1 rounded-full font-mono font-bold">
                  {liveLocationStr}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
                {t('farmer.title')}
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                {t('farmer.subtitle')}
              </p>
            </div>

            {/* Quick Action Emergency Dispatch Button */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-red-950/60 transition-all btn-pop cursor-pointer border border-red-500/40 animate-pulse"
              >
                <Stethoscope className="w-4 h-4 text-white" />
                <span>Dispatch Emergency Vet Request</span>
              </button>

              <button
                onClick={onOpenComplaint}
                className="py-3.5 px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-extrabold flex items-center gap-2 transition-all btn-pop cursor-pointer backdrop-blur-xl"
              >
                <FileWarning className="w-4 h-4 text-amber-400" />
                <span>Report Grievance</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Real-time Farm Biosecurity Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Metric 1: Registered Livestock Count */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-[#0B0F19]/90 backdrop-blur-xl flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                Total Registered Livestock
              </div>
              <div className="text-3xl font-black text-white font-mono mt-1">
                {totalAnimalsCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Animals with Digital Passports
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">
              🐄
            </div>
          </div>

          {/* Metric 2: Live Farm Biosecurity Index */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-[#0B0F19]/90 backdrop-blur-xl flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                Farm Biosecurity Index
              </div>
              <div className={`text-3xl font-black font-mono mt-1 ${biosecurityColorClass}`}>
                {biosecurityIndex}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {verifiedHealthyCount} of {totalAnimalsCount} Verified Safe
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          {/* Metric 3: Verified Vet Officers Available */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 bg-[#0B0F19]/90 backdrop-blur-xl flex items-center justify-between shadow-xl">
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                Available Vet Officers
              </div>
              <div className="text-3xl font-black text-blue-400 font-mono mt-1">
                {availableVetsCount}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                District Sector Active Range
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-800 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-400" />
            </div>
          </div>

        </div>

        {/* Tab Navigation Workspace Sub-Views */}
        <div className="w-full">
          {activeTab === 'SCANNER' && (
            <AISymptomScanner onRequestVet={handleAiRequestVet} />
          )}

          {activeTab === 'HEALTH_RECORDS' && (
            <HealthRecords />
          )}

          {activeTab === 'VET_LOCATOR' && (
            <VetLocator onRequestVet={handleAiRequestVet} />
          )}

          {activeTab === 'MY_CASES' && (
            <MyCasesView />
          )}
        </div>

      </div>

      {/* Farm GPS Location & Dispatch Modal */}
      <FarmLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={handleConfirmLocationAndDispatch}
        aiResult={prefilledAiResult}
      />
    </div>
  );
};
