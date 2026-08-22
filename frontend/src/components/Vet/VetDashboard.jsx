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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
    <div className="space-y-6 pb-8 w-full text-white relative">
      {/* Fullscreen Background Image (/vettt.jpg) STRICTLY ONLY FOR VET OFFICER PORTAL */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/vettt.jpg"
          alt="Vet Officer Portal Background"
          className="w-full h-full object-cover opacity-75 filter brightness-100 contrast-105"
        />
        {/* Soft Ambient Overlay for Optimal Visibility & UI Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/70 via-[#030712]/50 to-[#030712]/80" />
      </div>

      {/* Officer Header Card */}
      <div className="relative z-10 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-[#0B0F19]/90 hover:bg-[#0B0F19] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-950 border border-blue-800 p-1 text-center shrink-0 flex items-center justify-center shadow-lg">
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

        {activeTab === 'MAP' && (
          <div className="h-[480px] rounded-3xl overflow-hidden border-2 border-blue-500/60 relative shadow-2xl">
            <MapContainer
              center={[30.8920, 75.8450]}
              zoom={12}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {requestsList.map(req => (
                <Marker key={req.id} position={[req.farmLocation?.lat || 30.8920, req.farmLocation?.lng || 75.8450]} icon={reqIcon}>
                  <Popup>
                    <div className="p-1.5 text-xs space-y-1">
                      <div className="font-extrabold text-emerald-400 text-sm">🌾 {req.farmerName}</div>
                      <div>Animal Tag: <strong>{req.animalTag}</strong></div>
                      <div className="text-red-400 font-bold">{req.suspectedDisease}</div>
                      <div className="text-[10px] text-slate-300 font-mono">GPS: {req.farmLocation?.lat}, {req.farmLocation?.lng}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>

      {/* VISIT REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[9990] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-emerald-500/60 p-6 space-y-5 animate-fadeIn shadow-2xl bg-[#0B0F19]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base font-display">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Log Clinical Inspection & Issue Passport</span>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Confirmed Clinical Diagnosis:</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Treatment & Prescriptions Administered:</label>
                <textarea
                  rows={2}
                  required
                  value={treatmentAdministered}
                  onChange={e => setTreatmentAdministered(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Vaccine Administered:</label>
                  <input
                    type="text"
                    value={vaccineGiven}
                    onChange={e => setVaccineGiven(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Vaccine Batch Number:</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={e => setBatchNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px] font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Logging inspection will verify passport & remove Red Spot from Govt Outbreak Map.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 btn-pop cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying & Saving...' : 'Log Field Inspection & Diagnosis'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
