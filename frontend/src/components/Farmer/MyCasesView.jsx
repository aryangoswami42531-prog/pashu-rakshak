import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, CheckCircle2, Phone, AlertTriangle, ShieldCheck, 
  Stethoscope, FileWarning, Tag, RefreshCw, AlertOctagon 
} from 'lucide-react';

export const MyCasesView = () => {
  const { requestsList, complaintsList } = useApp();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            My Reported Cases & Live Vet Status
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Real-time tracking of reported animal diseases, vet acceptance status, & officer grievances
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-semibold">Live Real-Time Sync</span>
        </div>
      </div>

      {/* Reported Animal Cases List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-emerald-400" />
          Active Animal Emergency Dispatches ({requestsList.length})
        </h3>

        {requestsList && requestsList.length > 0 ? (
          <div className="space-y-4">
            {requestsList.map(req => {
              const isAccepted = req.status === 'ACCEPTED' || req.status === 'IN_TRANSIT';
              const isCompleted = req.status === 'COMPLETED';

              return (
                <div
                  key={req.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all space-y-4 ${
                    isAccepted
                      ? 'border-emerald-500/80 bg-gradient-to-r from-slate-900 via-slate-900 to-agri-950/40 ring-1 ring-emerald-500/40'
                      : isCompleted
                      ? 'border-blue-800 bg-slate-900/60'
                      : 'border-amber-700/80 bg-gradient-to-r from-slate-900 to-amber-950/30'
                  }`}
                >
                  {/* Top Bar: Animal & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg">
                        {req.species === 'Cattle' ? '🐄' : req.species === 'Swine' || req.species === 'Pig' ? '🐖' : req.species === 'Poultry' ? '🐓' : '🐐'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                          <span>{req.animalTag}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({req.species})</span>
                        </div>
                        <div className="text-sm font-extrabold text-red-400">
                          Suspected: {req.suspectedDisease}
                        </div>
                      </div>
                    </div>

                    {/* LIVE VET DISPATCH STATUS BADGE */}
                    <div className="flex items-center gap-2">
                      {isAccepted ? (
                        <div className="flex items-center gap-2 bg-emerald-950 border border-emerald-500 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-extrabold animate-pulse shadow-lg shadow-emerald-900/40">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>ACCEPTED — Vet En Route (ETA {req.etaMinutes || 18} mins)</span>
                        </div>
                      ) : isCompleted ? (
                        <div className="flex items-center gap-2 bg-blue-950 border border-blue-600 text-blue-300 px-3 py-1.5 rounded-xl text-xs font-bold">
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                          <span>COMPLETED — Visit Logged & Record Updated</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-amber-950 border border-amber-600 text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>WAITING FOR VET ACCEPTANCE...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vet & Symptoms Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px] font-semibold uppercase">Assigned Veterinary Officer:</div>
                      <div className="font-bold text-white text-sm">{req.requestedVetName || 'Dr. Rajesh Sharma'}</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">Senior DVO Ludhiana</span>
                        <a
                          href={`tel:${req.farmerPhone}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 btn-pop"
                        >
                          <Phone className="w-3 h-3" /> Call Vet
                        </a>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px] font-semibold uppercase">Reported Symptoms:</div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {req.symptoms?.map((sym, idx) => (
                          <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-700">
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
            No active emergency case requests filed yet. Use AI Disease Scanner to request a vet visit.
          </div>
        )}
      </div>

      {/* Official Grievances Log */}
      {complaintsList && complaintsList.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileWarning className="w-4 h-4 text-red-400" />
            Filed Officer Grievances ({complaintsList.length})
          </h3>
          <div className="space-y-2">
            {complaintsList.map(c => (
              <div key={c.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-white">Ref: #{c.id} • Officer: {c.vetName}</div>
                  <div className="text-slate-400 text-[11px] truncate max-w-md">{c.description}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700 text-[10px] font-bold">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
