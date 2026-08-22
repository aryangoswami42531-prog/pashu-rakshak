import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AvatarVoiceModal } from './AvatarVoiceModal';
import { 
  Radio, ShieldCheck, AlertTriangle, MapPin, Send, X, 
  Stethoscope, Clock, CheckCircle2 
} from 'lucide-react';

export const VetGeoAlertHistoryView = () => {
  const { requestsList, refreshAllData, showToast } = useApp();
  const [selectedAnimalForAlert, setSelectedAnimalForAlert] = useState(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Broadcast form state
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [radiusKm, setRadiusKm] = useState(15);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleAnimalGeoAlertClick = (req) => {
    const isVisited = req.status === 'COMPLETED';
    setSelectedAnimalForAlert(req);

    if (!isVisited) {
      // Animal NOT inspected yet -> Trigger Hindi Speaking AI Avatar with option to confirm inspection
      setIsAvatarModalOpen(true);
    } else {
      // Animal HAS BEEN inspected -> Open Geo-Alert broadcast form prefilled with farmer's live location
      openAlertFormForReq(req);
    }
  };

  const openAlertFormForReq = (req) => {
    setSelectedAnimalForAlert(req);
    setAlertTitle(`BIOSECURITY ALERT: ${req.suspectedDisease || 'Livestock Infection'}`);
    setAlertMessage(`Clinical inspection completed for Tag #${req.animalTag}. Quarantine active within ${radiusKm}km radius.`);
    setIsAlertModalOpen(true);
  };

  const handleConfirmInspectionAndOpenAlert = async () => {
    setIsAvatarModalOpen(false);
    if (!selectedAnimalForAlert) return;

    // Mark visit as COMPLETED on backend
    try {
      await fetch(`/api/vets/requests/${selectedAnimalForAlert.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      showToast(`✓ Field inspection confirmed for Tag #${selectedAnimalForAlert.animalTag}! Opening Geo-Alert form...`, "success");
      refreshAllData();
      
      // Update local object status & open form
      const updatedReq = { ...selectedAnimalForAlert, status: 'COMPLETED' };
      openAlertFormForReq(updatedReq);
    } catch (err) {
      openAlertFormForReq(selectedAnimalForAlert);
    }
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAnimalForAlert) return;
    setIsBroadcasting(true);

    const farmerLocation = selectedAnimalForAlert.farmLocation || { lat: 30.8920, lng: 75.8450 };
    const farmerVillageName = selectedAnimalForAlert.village || selectedAnimalForAlert.district || "Farmer Live Location";

    try {
      const res = await fetch('/api/outbreaks/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: alertTitle,
          message: alertMessage,
          severity: "HIGH",
          targetDistrict: farmerVillageName,
          radiusKm: Number(radiusKm) || 15,
          location: {
            lat: Number(farmerLocation.lat),
            lng: Number(farmerLocation.lng)
          },
          issuedBy: "Dr. Rajesh Sharma (Civil Vet Hospital)"
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`🚨 RED SPOT Created on Govt Map at farmer GPS (${farmerLocation.lat}, ${farmerLocation.lng})!`, "success");
        setIsAlertModalOpen(false);
        refreshAllData();
      }
    } catch (err) {
      showToast("Broadcast failed", "error");
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/50 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">
                Animal Inspection History & Geo-Alert Center
              </h2>
              <p className="text-xs text-slate-400">
                Select an animal from inspection history to broadcast regional biosecurity containment & map Red Spots at the farmer's live location
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animal History Cards List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Reported & Inspected Animal Registry ({requestsList.length})
        </h3>

        {requestsList && requestsList.length > 0 ? (
          <div className="space-y-4">
            {requestsList.map(req => {
              const isVisited = req.status === 'COMPLETED';

              return (
                <div
                  key={req.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all space-y-4 ${
                    isVisited
                      ? 'border-emerald-500/80 bg-gradient-to-r from-slate-900 via-slate-900 to-agri-950/40'
                      : 'border-slate-800 bg-slate-900/70'
                  }`}
                >
                  {/* Top Row: Animal Tag & Inspection Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                        {req.species === 'Cattle' ? '🐄' : req.species === 'Swine' || req.species === 'Pig' ? '🐖' : '🐓'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                          <span>Tag #{req.animalTag}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({req.species})</span>
                        </div>
                        <div className="text-sm font-extrabold text-red-400">
                          {req.suspectedDisease}
                        </div>
                      </div>
                    </div>

                    {/* Inspection Status Badge */}
                    <div>
                      {isVisited ? (
                        <span className="bg-emerald-950 border border-emerald-500 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>FIELD VISIT COMPLETED & VERIFIED</span>
                        </span>
                      ) : (
                        <span className="bg-amber-950 border border-amber-600 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>VISIT PENDING / NOT INSPECTED YET</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Farm Details with Live GPS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px] font-semibold uppercase">Farmer & Location:</div>
                      <div className="font-bold text-white">{req.farmerName} • {req.farmerPhone}</div>
                      <div className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> 
                        <span>Location: {req.village || req.district || "Farmer Farm"}</span>
                        <span>({req.farmLocation?.lat}, {req.farmLocation?.lng})</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px] font-semibold uppercase">Reported Symptoms:</div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {req.symptoms?.map((s, idx) => (
                          <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SEND GEO ALERT BUTTON ON EACH ANIMAL CARD */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
                    <button
                      onClick={() => handleAnimalGeoAlertClick(req)}
                      className={`py-2.5 px-5 rounded-xl font-extrabold text-xs flex items-center gap-2 btn-pop transition-all ${
                        isVisited
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/50'
                      }`}
                    >
                      <Radio className="w-4 h-4" />
                      <span>📢 Send Geo-Alert for Tag #{req.animalTag}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            No animal inspection history found.
          </div>
        )}
      </div>

      {/* Animated AI Vet Avatar Hindi Voice Modal (Triggered if NOT Visited) */}
      <AvatarVoiceModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onConfirmInspectionAndOpenAlert={handleConfirmInspectionAndOpenAlert}
      />

      {/* Geo-Alert Form Modal (Unlocked - Auto-filled with Farmer's Live GPS) */}
      {isAlertModalOpen && selectedAnimalForAlert && (
        <div className="fixed inset-0 z-[999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-amber-500/70 p-6 space-y-5 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Radio className="w-5 h-5 animate-pulse text-red-400" />
                <span>Broadcast Geo-Alert: Tag #{selectedAnimalForAlert.animalTag}</span>
              </div>
              <button onClick={() => setIsAlertModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AUTO-FILLED FARMER LIVE LOCATION SUMMARY */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/70 text-xs space-y-1.5">
              <div className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Farmer's Fetched Location (Auto-Synced to Govt Map):</span>
              </div>
              <div className="text-white font-bold text-sm">
                {selectedAnimalForAlert.village || selectedAnimalForAlert.district || "Farmer Location"}
              </div>
              <div className="text-emerald-300 font-mono font-extrabold text-xs">
                GPS Coords: {selectedAnimalForAlert.farmLocation?.lat}, {selectedAnimalForAlert.farmLocation?.lng}
              </div>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Alert Title:</label>
                <input
                  type="text"
                  required
                  value={alertTitle}
                  onChange={e => setAlertTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Containment Message:</label>
                <textarea
                  required
                  rows={3}
                  value={alertMessage}
                  onChange={e => setAlertMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsAlertModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 btn-pop"
                >
                  <Send className="w-4 h-4" />
                  <span>{isBroadcasting ? 'Broadcasting & Mapping Red Spot...' : 'Broadcast Alert & Create Red Spot at Farmer GPS'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
