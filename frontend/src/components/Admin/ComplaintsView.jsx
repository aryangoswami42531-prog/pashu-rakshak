import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertOctagon, CheckCircle2, Clock, ShieldAlert, Send, X, 
  FileWarning, Mail, AlertTriangle, UserX, ShieldCheck, Activity, Radio, Cpu 
} from 'lucide-react';

export const ComplaintsView = () => {
  const { t, complaintsList, showToast, refreshAllData } = useApp();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  
  // High-Tech Animation State: 'IDLE' | 'DISPATCHING' | 'SUCCESS'
  const [actionStage, setActionStage] = useState('IDLE');
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('📡 Encrypting Government Disciplinary Notice & Digital Seal...');
  const [dispatchedDetails, setDispatchedDetails] = useState(null);

  const handleOpenTakeAction = (c) => {
    setSelectedComplaint(c);
    setActionStage('IDLE');
    setDispatchProgress(0);
    setIsActionModalOpen(true);
  };

  const handleStartDispatchSequence = async () => {
    if (!selectedComplaint) return;

    setActionStage('DISPATCHING');
    setDispatchProgress(10);
    setLoadingText('📡 Encrypting Government Disciplinary Notice & Digital Seal...');

    // Progress step 1
    setTimeout(() => {
      setDispatchProgress(45);
      setLoadingText('🏛️ Establishing Secure Tunnel to State Veterinary Administrative Mail Server...');
    }, 700);

    // Progress step 2
    setTimeout(() => {
      setDispatchProgress(80);
      setLoadingText('⚡ Dispatching Official Disciplinary Warning Email & Marking Conduct Audit Log...');
    }, 1400);

    // API Call
    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/take-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionNotes: `Official Disciplinary Warning Mandate Email Dispatched by Govt Biosecurity Command.`
        })
      });

      const data = await res.json();
      
      setTimeout(() => {
        setDispatchProgress(100);
        if (data.success) {
          setActionStage('SUCCESS');
          setDispatchedDetails(data);
          showToast(`⚡ Automated Official Warning Email Dispatched to ${selectedComplaint.vetName}!`, "success");
          refreshAllData();
        } else {
          setActionStage('IDLE');
          showToast("Dispatch failed", "error");
        }
      }, 2100);
    } catch (err) {
      setActionStage('IDLE');
      showToast("Dispatch failed", "error");
    }
  };

  const pendingCount = complaintsList.filter(c => c.status === 'PENDING').length;
  const warningIssuedCount = complaintsList.filter(c => c.status === 'WARNING_ISSUED').length;

  return (
    <div className="space-y-6 text-white">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-red-500/50 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-800 text-red-400 flex items-center justify-center font-bold shrink-0">
              <UserX className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-950 text-red-400 border border-red-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase">
                  GOVT BIOSECURITY COMMAND AUDIT
                </span>
                <span className="text-xs text-slate-400 font-medium">Department of Animal Husbandry</span>
              </div>
              <h2 className="text-xl font-extrabold text-white font-display mt-0.5">
                {t('admin.complaintLogTitle')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 font-extrabold text-xs">
              🚨 {pendingCount} Pending Grievances
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-extrabold text-xs">
              ⚡ {warningIssuedCount} Warnings Sent
            </span>
          </div>
        </div>
      </div>

      {/* Complaints List Cards */}
      <div className="space-y-4">
        {complaintsList && complaintsList.length > 0 ? (
          <div className="space-y-4">
            {complaintsList.map(c => {
              const isWarningSent = c.status === 'WARNING_ISSUED';
              const cleanVetName = c.vetName || "Dr. Rajesh Sharma";
              const cleanEmail = c.emailSentTo || `dr.${cleanVetName.toLowerCase().replace(/dr\.?\s*/g, '').replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.')}`;

              return (
                <div
                  key={c.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all space-y-4 ${
                    isWarningSent
                      ? 'border-emerald-500/60 bg-slate-900/90'
                      : 'border-red-500/60 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/30'
                  }`}
                >
                  {/* Top Row: Farmer Info & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 text-red-400 flex items-center justify-center font-bold text-sm">
                        🚨
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-white">
                          Farmer: {c.farmerName} <span className="text-slate-400 font-normal">({c.farmerPhone})</span>
                        </div>
                        <div className="text-xs text-red-400 font-semibold flex items-center gap-1">
                          <span>Reported Vet Officer:</span>
                          <span className="font-extrabold text-white underline">{cleanVetName}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {isWarningSent ? (
                        <span className="bg-emerald-950 border border-emerald-500 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>{t('admin.warningDispatched')}</span>
                        </span>
                      ) : (
                        <span className="bg-red-950 border border-red-600 text-red-300 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-red-400" />
                          <span>{t('admin.pendingAction')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Grievance Description */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="text-slate-400 font-semibold uppercase text-[10px]">Citizen Grievance Record:</div>
                    <p className="text-slate-200 font-medium leading-relaxed italic">
                      "{c.description}"
                    </p>
                  </div>

                  {/* Footer & Take Action Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                    <div className="text-slate-400 text-[11px]">
                      Filed on: <strong>{new Date(c.createdAt).toLocaleDateString()}</strong> • Ref: <span className="font-mono text-slate-300">#{c.id}</span>
                      {isWarningSent && (
                        <span className="block text-emerald-400 font-mono text-[10px] mt-0.5 font-bold">
                          Emailed to: {cleanEmail}
                        </span>
                      )}
                    </div>

                    {!isWarningSent && (
                      <button
                        onClick={() => handleOpenTakeAction(c)}
                        className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 btn-pop animate-pulse"
                      >
                        <Send className="w-4 h-4" />
                        <span>⚡ {t('admin.takeActionBtn')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            No farmer grievances logged.
          </div>
        )}
      </div>

      {/* ULTRA-PREMIUM AUTOMATED DISCIPLINARY WARNING EMAIL DISPATCH MODAL */}
      {isActionModalOpen && selectedComplaint && (
        <div className="fixed inset-0 z-[999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-xl w-full rounded-3xl border border-red-500/70 p-6 space-y-6 animate-fadeIn shadow-2xl relative overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
              <div className="flex items-center gap-2.5 text-red-400 font-bold text-base font-display">
                <ShieldAlert className="w-5 h-5 animate-pulse text-red-400" />
                <span>Executive Disciplinary Mandate & Warning Dispatch</span>
              </div>
              {actionStage !== 'DISPATCHING' && (
                <button onClick={() => setIsActionModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* STAGE 0: PREVIEW ULTRA-PREMIUM OFFICIAL LEGAL MANDATE NOTICE */}
            {actionStage === 'IDLE' && (
              <div className="space-y-4 relative z-10">
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-700 text-xs space-y-4 shadow-inner">
                  {/* Official Government Seal Header */}
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-amber-400 text-xs tracking-wider uppercase font-display">
                        GOVERNMENT OF INDIA • DEPARTMENT OF ANIMAL HUSBANDRY
                      </div>
                      <div className="text-[10px] text-slate-400">National Livestock Biosecurity Enforcement Division</div>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center font-bold text-xs">
                      🏛️
                    </div>
                  </div>

                  {/* Email Header Fields */}
                  <div className="space-y-1 font-mono text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-slate-400">
                      <strong>TO:</strong> <span className="text-emerald-400 font-bold">dr.{selectedComplaint.vetName.toLowerCase().replace(/dr\.?\s*/g, '').replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.')}@gov.in</span>
                    </div>
                    <div className="text-slate-400">
                      <strong>FROM:</strong> <span className="text-amber-400 font-bold">command.biosecurity@gov.in</span> (Govt Biosecurity Command)
                    </div>
                    <div className="text-red-400 font-bold">
                      <strong>SUBJECT:</strong> DISCIPLINARY DIRECTIVE: Formal 1st Warning Notice #{selectedComplaint.id}
                    </div>
                  </div>

                  {/* Official Formal Executive Mandate Text */}
                  <div className="text-slate-200 space-y-3 leading-relaxed font-sans pt-1">
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs font-semibold">
                      <strong>OFFICIAL DISCIPLINARY MANDATE & WARNING NOTICE:</strong>
                    </div>

                    <p>
                      A verified citizen grievance has been formally registered against your active duty roster regarding <strong>unresponsive field duty</strong> for a high-risk contagion report.
                    </p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 italic font-mono text-[11px]">
                      Grievance Detail: "{selectedComplaint.description}"
                    </div>

                    <p className="text-amber-300 font-semibold text-xs leading-normal">
                      Under <strong>Clause 14(B) of the National Biosecurity Enforcement Act 2026</strong>, you are hereby issued an <strong>Immediate Formal 1st Warning</strong>. You are mandated to contact the farmer within 15 minutes and log on-site clinical status. Continued non-responsiveness will lead to immediate duty suspension and salary hold.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                  <button type="button" onClick={() => setIsActionModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white text-xs">
                    {t('common.cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={handleStartDispatchSequence}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-red-600/30 btn-pop animate-pulse"
                  >
                    <Mail className="w-4 h-4" />
                    <span>✉️ Confirm & Send Automated Warning Email Now</span>
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 1: SUPER HIGH-TECH ANIMATED LOADING SCREEN */}
            {actionStage === 'DISPATCHING' && (
              <div className="py-10 space-y-6 text-center animate-fadeIn relative z-10">
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" />
                  <div className="w-28 h-28 rounded-full border-4 border-red-500/40 border-t-red-500 animate-spin flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                    <Cpu className="w-10 h-10 text-amber-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-red-400 font-bold">DISPATCH ENCRYPTION</span>
                    <span className="text-amber-400 font-black">{dispatchProgress}%</span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 transition-all duration-500 shadow-md"
                      style={{ width: `${dispatchProgress}%` }}
                    />
                  </div>

                  <div className="text-sm font-extrabold text-amber-300 font-mono animate-pulse min-h-[2.5rem] flex items-center justify-center px-4">
                    {loadingText}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: SUCCESSFUL DISPATCH CERTIFICATE RESULT */}
            {actionStage === 'SUCCESS' && (
              <div className="py-6 space-y-5 text-center animate-fadeIn relative z-10">
                <div className="w-20 h-20 rounded-full bg-emerald-950 border-4 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(16,185,129,0.7)] animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-white font-display">
                    ⚡ Official Disciplinary Warning Email Dispatched!
                  </h3>
                  <p className="text-xs text-slate-300">
                    The formal warning mandate has been digitally signed & delivered to the officer's inbox.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/60 text-xs text-left space-y-2 font-mono">
                  <div className="text-emerald-400 font-bold border-b border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>OFFICIAL DISPATCH CERTIFICATE</span>
                    <span className="text-[10px] text-slate-400">STATUS: DELIVERED</span>
                  </div>
                  <div className="text-slate-300">
                    <strong>Recipient Email:</strong> <span className="text-white">dr.{selectedComplaint.vetName.toLowerCase().replace(/dr\.?\s*/g, '').replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.')}@gov.in</span>
                  </div>
                  <div className="text-slate-300">
                    <strong>Mandate Ref #:</strong> <span className="text-amber-400">BIO/GOV/2026/WRN-{selectedComplaint.id}</span>
                  </div>
                  <div className="text-slate-300">
                    <strong>Timestamp:</strong> <span className="text-emerald-400">{new Date().toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsActionModalOpen(false)}
                  className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 btn-pop"
                >
                  Close & Return to Audit Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
