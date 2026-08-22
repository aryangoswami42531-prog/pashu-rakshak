import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AvatarVoiceModal } from './AvatarVoiceModal';
import { VetGeoAlertHistoryView } from './VetGeoAlertHistoryView';
import { 
  Stethoscope, Clock, MapPin, Phone, CheckCircle2, AlertTriangle, 
  Send, FileText, X, Navigation, ShieldCheck, Radio, AlertOctagon 
} from 'lucide-react';

const reqIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ef4444" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -32]
});

export const VetDashboard = ({ activeTab = 'QUEUE', setActiveTab }) => {
  const { t, requestsList, refreshAllData, showToast } = useApp();
  const [dutyStatus, setDutyStatus] = useState('AVAILABLE');
  const [selectedReq, setSelectedReq] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Visit report form
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentAdministered, setTreatmentAdministered] = useState('');
  const [vaccineGiven, setVaccineGiven] = useState('FMD Dual Antigen');
  const [batchNumber, setBatchNumber] = useState('VAC-2026-8801');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Count completed visits
  const completedVisits = requestsList.filter(r => r.status === 'COMPLETED');
  const completedVisitsCount = completedVisits.length;

  const updateStatus = async (reqId, status, etaMinutes = 20) => {
    try {
      const res = await fetch(`/api/vets/requests/${reqId}`, {
        method: 'PUT',
        cache: 'no-store',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({ status, etaMinutes })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        refreshAllData();
      }
    } catch (err) {
      showToast("Status update failed", "error");
    }
  };

  const openReportModal = (req) => {
    setSelectedReq(req);
    setDiagnosis(req.suspectedDisease || 'Clinical Biosecurity Inspection');
    setTreatmentAdministered('Symptomatic Anti-inflammatory + Broad spectrum antibiotic barrier');
    setVaccineGiven('FMD Dual Antigen');
    setBatchNumber('VAC-2026-8801');
    setIsReportModalOpen(true);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/vets/visit-report', {
        method: 'POST',
        cache: 'no-store',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          requestId: selectedReq.id,
          animalTag: selectedReq.animalTag,
          diagnosis,
          treatmentAdministered,
          vaccineGiven,
          batchNumber,
          followUpDate: "2027-02-20",
          vetName: "Dr. Rajesh Sharma"
        })
      });

      const data = await res.json();
      if (data.success) {
        if (selectedReq) {
          selectedReq.status = 'COMPLETED';
        }
        showToast("⚡ Inspection Logged & Verified! Red Spot removed from Govt Map.", "success");
        setIsReportModalOpen(false);
        refreshAllData();
      } else {
        showToast("Could not submit health record", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Could not submit health record", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8 text-white relative">
      {/* Fullscreen Background Image (/vettt.jpg) STRICTLY ONLY FOR VET OFFICER PORTAL */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/vettt.jpg"
          alt="Veterinary Officer Workspace Background"
          className="w-full h-full object-cover opacity-75 filter brightness-105 contrast-105"
        />
        {/* Soft Vignette Overlay for High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-[#030712]/40 to-[#030712]/70" />
      </div>

      <div className="relative z-10 space-y-6">

        {/* Top Header Profile Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-blue-500/60 bg-[#0B0F19]/90 relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-700/80 flex items-center justify-center shadow-lg">
                <Stethoscope className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-950 text-blue-400 border border-blue-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    DVO License #VET-PB-1049
                  </span>
                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    {completedVisitsCount} Verified Visits
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-white font-display mt-1">
                  {t('vet.welcome')}
                </h1>
                <p className="text-xs text-slate-300">
                  District Veterinary Officer • Ludhiana Biosecurity Sector 4
                </p>
              </div>
            </div>

            {/* Duty Status Selector */}
            <div className="flex items-center gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-bold px-2">{t('vet.dutyStatus')}:</span>
              <button
                onClick={() => setDutyStatus('AVAILABLE')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all btn-pop cursor-pointer ${
                  dutyStatus === 'AVAILABLE'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('vet.available')}
              </button>
              <button
                onClick={() => setDutyStatus('ON_FIELD')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all btn-pop cursor-pointer ${
                  dutyStatus === 'ON_FIELD'
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('vet.onField')}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Workspace Tabs */}
        <div className="relative z-10 w-full">
          {activeTab === 'QUEUE' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-white font-display flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>{t('vet.pendingRequests')}</span>
                  <span className="bg-red-950 text-red-400 border border-red-800 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
                    {requestsList.filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED').length} ACTIVE
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requestsList.map((req) => {
                  const isCompleted = req.status === 'COMPLETED';
                  const isAccepted = req.status === 'ACCEPTED';
                  const isPending = req.status === 'PENDING';

                  return (
                    <div 
                      key={req.id}
                      className={`glass-panel p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-5 backdrop-blur-xl ${
                        isPending 
                          ? 'border-red-500/60 bg-gradient-to-b from-red-950/30 to-slate-900/90 shadow-red-950/30' 
                          : isAccepted 
                          ? 'border-amber-500/60 bg-gradient-to-b from-amber-950/30 to-slate-900/90' 
                          : 'border-slate-800 bg-slate-900/80 opacity-85'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider border ${
                            req.aiRiskLevel === 'HIGH' || req.aiRiskLevel === 'CRITICAL' 
                              ? 'bg-red-950 text-red-400 border-red-800 animate-pulse' 
                              : 'bg-amber-950 text-amber-400 border-amber-800'
                          }`}>
                            Risk: {req.aiRiskLevel || 'HIGH'}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{req.requestedAt || '10 mins ago'}</span>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                            <span>{req.farmerName}</span>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                              {req.animalTag}
                            </span>
                          </h3>
                          <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>{req.village} ({req.notes})</span>
                          </p>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                          <div className="text-[11px] text-slate-400 font-bold uppercase">AI Suspected Disease:</div>
                          <div className="text-sm font-black text-amber-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{req.suspectedDisease}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {req.symptoms?.map((s, idx) => (
                              <span key={idx} className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-700">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                        <a
                          href={`tel:${req.farmerPhone}`}
                          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all btn-pop"
                        >
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span>{t('vet.callFarmer')}</span>
                        </a>

                        {isPending && (
                          <button
                            onClick={() => updateStatus(req.id, 'ACCEPTED', 20)}
                            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 btn-pop cursor-pointer"
                          >
                            <Navigation className="w-4 h-4" />
                            <span>{t('vet.acceptBtn')} (ETA 20m)</span>
                          </button>
                        )}

                        {isAccepted && (
                          <button
                            onClick={() => openReportModal(req)}
                            className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 btn-pop cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                            <span>{t('vet.logInspection')}</span>
                          </button>
                        )}

                        {isCompleted && (
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{t('vet.inspectionLogged')}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'GEO_ALERTS' && (
            <VetGeoAlertHistoryView />
          )}

          {activeTab === 'AVATAR_VOICE' && (
            <AvatarVoiceModal isOpen={true} onClose={() => setActiveTab('QUEUE')} />
          )}
        </div>

      </div>

      {/* Field Visit & Health Record Logging Modal */}
      {isReportModalOpen && selectedReq && (
        <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-emerald-500/60 bg-[#0B0F19]/95 p-6 space-y-5 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white font-display">
                  Log Field Inspection & Diagnosis
                </h3>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-white">Animal Tag: {selectedReq.animalTag} ({selectedReq.species})</div>
                <div className="text-slate-400">Farmer: {selectedReq.farmerName} • {selectedReq.village}</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Final Clinical Diagnosis</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Treatment & Antibiotic Protocol Administered</label>
                <textarea
                  rows={2}
                  required
                  value={treatmentAdministered}
                  onChange={(e) => setTreatmentAdministered(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Vaccine Administered</label>
                  <input
                    type="text"
                    value={vaccineGiven}
                    onChange={(e) => setVaccineGiven(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Vaccine Batch No.</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 btn-pop"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting & Updating Passport...' : 'Verify & Complete Case'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
