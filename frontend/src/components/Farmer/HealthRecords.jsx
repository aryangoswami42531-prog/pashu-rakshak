import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, Syringe, Calendar, UserCheck, Key, Plus, CheckCircle2, 
  X, Tag, FileText, Search, AlertTriangle, ShieldAlert, Clock, Stethoscope, AlertOctagon
} from 'lucide-react';

export const HealthRecords = () => {
  const { t, animalsList, refreshAllData, showToast } = useApp();
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [verifyingHash, setVerifyingHash] = useState(null);
  const [verifiedResult, setVerifiedResult] = useState(null);

  const verifyHashOnLedger = async (hash) => {
    setVerifyingHash(hash);
    setVerifiedResult(null);

    try {
      const res = await fetch(`/api/records/verify/${hash}`);
      const data = await res.json();
      setVerifiedResult(data);
      if (data.verified) {
        showToast("Cryptographic SHA-256 Hash verified on Ledger!", "success");
      } else {
        showToast("Hash integrity check failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Verification server offline", "error");
    } finally {
      setVerifyingHash(null);
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>State Veterinary Biosecurity Registry</span>
          </div>
          <h2 className="text-xl font-extrabold text-white font-display">
            {t('nav.healthRecords')}
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            Official cryptographic health passports. Digital cards are <strong>automatically created when an emergency vet visit is dispatched</strong>.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold font-mono flex items-center gap-2 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-time Ledger Active</span>
        </span>
      </div>

      {/* Notice Info Box */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-3 shadow-md">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Automated Health Card & Red Spot Workflow: </span>
          When a farmer dispatches a case, the Digital Passport displays <strong>`WAITING FOR VET INSPECTION & VERIFICATION`</strong> and a <strong>Red Spot</strong> appears on the Govt GIS Map. Once the Vet Officer completes & logs field inspection, the card turns into a <strong>Verified SHA-256 Passport</strong> and the Red Spot auto-clears from the map!
        </div>
      </div>

      {/* Main Grid: Animal List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {animalsList.map(animal => {
          const hasVaccines = animal.vaccinations && animal.vaccinations.length > 0;
          const latestVaccine = hasVaccines ? animal.vaccinations[0] : null;
          const isSwine = animal.species === 'Swine' || animal.species === 'Pig';
          const isPoultry = animal.species === 'Poultry';

          return (
            <div
              key={animal.id || animal.tagNumber}
              className={`glass-panel p-5 rounded-2xl border transition-all space-y-4 flex flex-col justify-between shadow-xl ${
                hasVaccines
                  ? 'border-emerald-500/50 bg-slate-900/90'
                  : 'border-amber-500/50 bg-gradient-to-b from-slate-900 to-amber-950/20 ring-1 ring-amber-500/30'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                      {isSwine ? '🐖' : isPoultry ? '🐓' : animal.species === 'Buffalo' ? '🐃' : '🐄'}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white font-mono">{animal.tagNumber}</div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {isSwine ? 'Swine (सूअर)' : isPoultry ? 'Poultry (मुर्गी)' : 'Cattle (गाय)'} • {animal.breed || 'Farm Stock'}
                      </div>
                    </div>
                  </div>

                  {hasVaccines ? (
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-500 text-[10px] px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>VERIFIED PASSPORT</span>
                    </span>
                  ) : (
                    <span className="bg-amber-950/90 text-amber-300 border border-amber-500 text-[10px] px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1.5 animate-pulse shadow-md">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>WAITING FOR VET INSPECTION & VERIFICATION</span>
                    </span>
                  )}
                </div>

                {/* Health Status & Disease Diagnosis Info */}
                {hasVaccines ? (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Verified Vaccine:</span>
                      <span className="font-extrabold text-emerald-400">{latestVaccine.vaccineName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Batch Number:</span>
                      <span className="text-slate-200">{latestVaccine.batchNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Attending Doctor:</span>
                      <span className="text-white font-bold">{latestVaccine.administeredBy || "Dr. Rajesh Sharma"}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Next Due Date:</span>
                      <span className="text-amber-400 font-bold">{latestVaccine.nextDueDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/40 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase font-semibold font-mono">AI Suspected Threat:</span>
                      <span className="text-red-400 font-extrabold text-xs">{animal.suspectedDisease || "Lumpy Skin Disease (LSD)"}</span>
                    </div>

                    <div className="text-[11px] text-slate-300 flex items-center justify-between border-t border-slate-800 pt-1.5">
                      <span>Assigned Vet Officer:</span>
                      <span className="text-emerald-400 font-bold">{animal.assignedVetName || "Dr. Rajesh Sharma"}</span>
                    </div>

                    <div className="text-[11px] text-amber-300/90 bg-amber-950/50 p-2 rounded-lg border border-amber-900/60 leading-relaxed font-medium flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Dispatch Request Active. Waiting for doctor to arrive and log field inspection.</span>
                    </div>
                  </div>
                )}

                {/* Cryptographic SHA-256 Ledger Hash Section */}
                {hasVaccines && latestVaccine.recordHash && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] text-slate-400 font-mono uppercase font-bold">SHA-256 Ledger Hash:</div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10px] text-slate-300 truncate">
                      {latestVaccine.recordHash}
                    </div>
                    <button
                      onClick={() => verifyHashOnLedger(latestVaccine.recordHash)}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono text-[10px] font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Key className="w-3 h-3 text-emerald-400" />
                      <span>Verify Ledger Hash Integrity</span>
                    </button>
                  </div>
                )}
              </div>

              {/* View Full History Trigger */}
              <button
                onClick={() => setSelectedAnimal(animal)}
                className="w-full mt-3 py-2 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 btn-pop"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Full Medical History</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Full Medical History Modal */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-[999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-xl w-full rounded-3xl border border-slate-700 p-6 space-y-5 animate-fadeIn shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="text-sm font-extrabold text-white font-mono">{selectedAnimal.tagNumber}</div>
                <div className="text-xs text-slate-400">{selectedAnimal.species} • {selectedAnimal.breed}</div>
              </div>
              <button onClick={() => setSelectedAnimal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Medical History Events */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Clinical Medical History:</h4>
              {selectedAnimal.medicalHistory && selectedAnimal.medicalHistory.length > 0 ? (
                selectedAnimal.medicalHistory.map((med, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-emerald-400">
                      <span>{med.condition || med.diagnosis}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{med.date}</span>
                    </div>
                    <div className="text-slate-300 leading-relaxed">{med.treatment || med.prescriptions?.join(', ')}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Attending Officer: {med.vetName}</div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs">No medical history logged yet.</div>
              )}
            </div>

            {/* Vaccination Log */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Vaccination & Immunity Passes:</h4>
              {selectedAnimal.vaccinations && selectedAnimal.vaccinations.length > 0 ? (
                selectedAnimal.vaccinations.map((vac, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span className="text-emerald-400">💉 {vac.vaccineName}</span>
                      <span className="text-[10px] text-slate-400">{vac.administeredDate}</span>
                    </div>
                    <div className="text-slate-300 text-[11px]">Batch #: {vac.batchNumber}</div>
                    <div className="text-slate-300 text-[11px]">Administered By: <strong>{vac.administeredBy}</strong></div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 truncate">
                      Hash: {vac.recordHash}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-amber-400/80 text-xs bg-amber-950/30 rounded-xl border border-amber-900/50">
                  ⏳ Awaiting on-site vaccine administration by licensed Vet Officer.
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedAnimal(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
