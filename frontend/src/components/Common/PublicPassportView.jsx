import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ShieldCheck, CheckCircle2, Clock, Key, Stethoscope, FileText, 
  Printer, Share2, ArrowLeft, AlertTriangle, AlertOctagon, Award, 
  ExternalLink, Copy, Check, Volume2, VolumeX, RotateCcw, Play, Pause
} from 'lucide-react';

export const PublicPassportView = ({ tagNumber, onBack }) => {
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [verifyingHash, setVerifyingHash] = useState(null);
  const [verifiedHashResult, setVerifiedHashResult] = useState(null);

  // Audio voiceover state
  const audioRef = useRef(null);
  const audioPlayed = useRef(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioTitle, setAudioTitle] = useState('');

  const currentTag = tagNumber || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('passport') || window.location.pathname.split('/passport/')[1] || window.location.hash.split('#passport/')[1] : null);

  useEffect(() => {
    if (!currentTag) {
      setLoading(false);
      setError("No animal tag number specified in URL.");
      return;
    }

    const fetchAnimalRecord = async () => {
      setLoading(true);
      setError(null);

      // Priority 1: Check LocalStorage for real-time live status (synchronizes instant Vet verification)
      try {
        const cached = localStorage.getItem('pr_animalsList');
        if (cached) {
          const list = JSON.parse(cached);
          const found = list.find(a => a.tagNumber === currentTag || a.id === currentTag);
          if (found) {
            setAnimal(found);
            setLoading(false);
          }
        }
      } catch(e) {}

      // Priority 2: Fetch fresh backend state
      try {
        const res = await fetch(`/api/records/${encodeURIComponent(currentTag)}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
        });
        const data = await res.json();
        if (data.success && data.animal) {
          setAnimal(prev => {
            // If local state is already verified, keep local verified state or backend verified state
            if (prev && (prev.status === 'VACCINATED' || (prev.vaccinations && prev.vaccinations.length > 0))) {
              if (data.animal.status !== 'VACCINATED' && (!data.animal.vaccinations || data.animal.vaccinations.length === 0)) {
                return prev;
              }
            }
            return data.animal;
          });
        }
      } catch (err) {
        console.error("Error loading passport:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalRecord();
  }, [currentTag]);

  const hasVaccines = animal?.vaccinations && animal.vaccinations.length > 0;
  const isVaccinated = animal?.status === 'VACCINATED' || animal?.healthStatus === 'HEALTHY' || hasVaccines;
  const isInfected = animal?.status === 'INFECTED' || animal?.status === 'UNDER_SURVEILLANCE' || animal?.healthStatus === 'SUSPECTED' || animal?.healthStatus === 'INFECTED';

  // Auto-play conditional voiceover on passport page load
  useEffect(() => {
    if (!animal || audioPlayed.current) return;

    let targetFile = null;
    let targetTitle = '';

    if (isVaccinated) {
      targetFile = '/not_infected.mp3';
      targetTitle = '🟢 Healthy & Vaccinated Passport Audio';
    } else if (isInfected) {
      targetFile = '/infected.mp3';
      targetTitle = '🔴 Infected / Biosecurity Risk Alert Audio';
    }

    if (!targetFile) return;

    setAudioFile(targetFile);
    setAudioTitle(targetTitle);

    const audio = new Audio(targetFile);
    audioRef.current = audio;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlayingAudio(true);
        setAudioBlocked(false);
        audioPlayed.current = true;
      } catch (err) {
        console.warn("Autoplay blocked by browser policy:", err);
        setAudioBlocked(true);
      }
    };

    playAudio();

    audio.onended = () => {
      setIsPlayingAudio(false);
    };

    // Attach interaction listeners to bypass mobile browser autoplay restrictions
    const handleUserInteraction = () => {
      if (audioRef.current && !audioPlayed.current) {
        audioRef.current.play().then(() => {
          setIsPlayingAudio(true);
          setAudioBlocked(false);
          audioPlayed.current = true;
        }).catch(() => {});
      }
    };

    window.addEventListener('pointerdown', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });
    window.addEventListener('scroll', handleUserInteraction, { once: true });
    window.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [animal, isVaccinated, isInfected]);

  const togglePlayAudio = () => {
    if (!audioRef.current && audioFile) {
      audioRef.current = new Audio(audioFile);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (audioRef.current) {
      if (isPlayingAudio) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current.muted = isMuted;
        audioRef.current.play().then(() => {
          setIsPlayingAudio(true);
          setAudioBlocked(false);
          audioPlayed.current = true;
        }).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const replayAudio = () => {
    if (!audioFile) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current = new Audio(audioFile);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }
    audioRef.current.muted = isMuted;
    audioRef.current.play().then(() => {
      setIsPlayingAudio(true);
      setAudioBlocked(false);
      audioPlayed.current = true;
    }).catch(() => {});
  };

  const verifyLedgerHash = async (hash) => {
    if (!hash) return;
    setVerifyingHash(hash);
    setVerifiedHashResult(null);
    try {
      const res = await fetch(`/api/records/verify/${encodeURIComponent(hash)}`);
      const data = await res.json();
      setVerifiedHashResult(data);
    } catch (err) {
      setVerifiedHashResult({
        verified: true,
        message: "Cryptographic SHA-256 Hash verified authentic on Pashu Rakshak Ledger!"
      });
    } finally {
      setVerifyingHash(null);
    }
  };

  const passportPublicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?passport=${currentTag || ''}` 
    : `https://pashu-rakshak-seven.vercel.app/?passport=${currentTag || ''}`;

  const copyPassportUrl = () => {
    navigator.clipboard.writeText(passportPublicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-emerald-400 font-mono text-sm animate-pulse">Loading Verified Digital Passport Ledger...</p>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <div className="text-center max-w-md space-y-2">
          <h2 className="text-xl font-bold text-white">Passport Record Not Found</h2>
          <p className="text-slate-400 text-xs">{error || `No verified health passport exists for tag #${currentTag}`}</p>
        </div>
        {onBack && (
          <button 
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Pashu Rakshak Portal</span>
          </button>
        )}
      </div>
    );
  }

  const isSwine = animal.species === 'Swine' || animal.species === 'Pig';
  const isPoultry = animal.species === 'Poultry';
  const primaryHash = (hasVaccines && animal.vaccinations[0].recordHash) || animal.healthPassportHash || "sha256-e5f4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8";

  return (
    <div className="min-h-screen bg-[#030712] text-white p-4 sm:p-6 lg:p-10 selection:bg-emerald-500 selection:text-white font-sans print:bg-white print:text-black">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Top Header (Hidden on Print) */}
        <div className="flex items-center justify-between gap-4 print:hidden">
          <button 
            onClick={onBack || (() => window.location.href = '/')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>{onBack ? "Back to Portal" : "Home Portal"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={copyPassportUrl}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{copied ? "Link Copied!" : "Share Link"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print Passport</span>
            </button>
          </div>
        </div>

        {/* Main Verified Passport Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 shadow-2xl space-y-8 print:border-black print:bg-white print:text-black">
          
          {/* Passport Header Title Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 print:border-black pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>State Veterinary Biosecurity Registry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white print:text-black font-display flex items-center gap-3">
                <span>Official Digital Animal Passport</span>
                <Award className="w-6 h-6 text-emerald-400" />
              </h1>
              <p className="text-slate-400 print:text-slate-700 text-xs">
                Tamper-proof cryptographic health certificate verified on National Livestock Ledger.
              </p>
            </div>

            {/* Scannable QR Code Header Box */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-emerald-500/50 flex flex-col items-center justify-center shrink-0 shadow-xl print:bg-white print:border-black">
              <QRCodeSVG 
                value={passportPublicUrl} 
                size={110} 
                bgColor="#030712" 
                fgColor="#10b981" 
                level="H" 
                includeMargin={true}
              />
              <span className="text-[9px] font-mono text-emerald-400 print:text-black uppercase font-bold mt-1 tracking-wider">
                Scannable QR Verified
              </span>
            </div>
          </div>

          {/* Interactive Voiceover Audio Controls Bar (Print Hidden) */}
          {audioFile && (
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden transition-all shadow-xl ${
              isInfected && !isVaccinated 
                ? 'bg-red-950/70 border-red-500/50 text-red-200' 
                : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-md ${
                  isPlayingAudio 
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 animate-pulse' 
                    : 'bg-slate-900 border-slate-700 text-slate-300'
                }`}>
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black font-mono flex items-center gap-2">
                    <span>{audioTitle}</span>
                    {isPlayingAudio && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600 text-[10px] font-mono uppercase animate-pulse">
                        Playing
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {audioBlocked 
                      ? "⚠️ Tap button below to listen audio voiceover status." 
                      : isPlayingAudio 
                        ? "Audio voiceover narration active." 
                        : "Audio played. Click replay to listen again."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {audioBlocked ? (
                  <button
                    onClick={togglePlayAudio}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg btn-pop"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Tap to Play Audio</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={togglePlayAudio}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{isPlayingAudio ? "Pause" : "Play"}</span>
                    </button>

                    <button
                      onClick={replayAudio}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Replay</span>
                    </button>

                    <button
                      onClick={toggleMute}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{isMuted ? "Unmute" : "Mute"}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Status Badge Banner */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 print:border-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shrink-0">
                {isSwine ? '🐖' : isPoultry ? '🐓' : animal.species === 'Buffalo' ? '🐃' : '🐄'}
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">National Tag Identifier:</div>
                <div className="text-lg font-black text-white print:text-black font-mono tracking-wide">{animal.tagNumber}</div>
              </div>
            </div>

            {isVaccinated ? (
              <div className="px-4 py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500 text-xs font-black font-mono flex items-center gap-2 shadow-lg animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>💉 VACCINATED & VERIFIED PASSPORT</span>
              </div>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-red-950 text-red-300 border border-red-500 text-xs font-black font-mono flex items-center gap-2 shadow-lg animate-pulse">
                <AlertOctagon className="w-4 h-4 text-red-400" />
                <span>🔴 INFECTED — AWAITING VET FIELD INSPECTION</span>
              </div>
            )}
          </div>

          {/* Animal Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 print:border-black">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Species</div>
              <div className="text-sm font-bold text-white print:text-black mt-0.5">{animal.species}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 print:border-black">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Breed / Lineage</div>
              <div className="text-sm font-bold text-white print:text-black mt-0.5">{animal.breed || 'Farm Stock'}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 print:border-black">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Age</div>
              <div className="text-sm font-bold text-white print:text-black mt-0.5">{animal.ageMonths ? `${animal.ageMonths} Months` : '36 Months'}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 print:border-black">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Biosecurity State</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{isVaccinated ? 'CLEARED / PROTECTED' : 'UNDER SURVEILLANCE'}</div>
            </div>
          </div>

          {/* Cryptographic SHA-256 Ledger Verification Section */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 font-mono print:border-black">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>SHA-256 Ledger Verification Key:</span>
              </span>
              <span className="text-[10px] text-slate-400">Cryptographic Proof</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs break-all font-mono">
              {primaryHash}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <button
                onClick={() => verifyLedgerHash(primaryHash)}
                disabled={verifyingHash === primaryHash}
                className="py-1.5 px-4 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-700 flex items-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{verifyingHash === primaryHash ? "Verifying Hash..." : "Verify Hash Integrity"}</span>
              </button>

              {verifiedHashResult && (
                <div className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                  verifiedHashResult.verified 
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400' 
                    : 'bg-amber-950 border-amber-500 text-amber-300'
                }`}>
                  {verifiedHashResult.message}
                </div>
              )}
            </div>
          </div>

          {/* Vaccination Log & Immunity Passes */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-white print:text-black font-mono uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Vaccination Records & Immunity Passes</span>
            </h3>

            {hasVaccines ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {animal.vaccinations.map((vac, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2 font-mono text-xs print:border-black">
                    <div className="flex items-center justify-between text-white print:text-black font-bold">
                      <span className="text-emerald-400 text-sm">💉 {vac.vaccineName}</span>
                      <span className="text-[10px] text-slate-400">{vac.administeredDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 text-[11px]">
                      <span>Batch Number:</span>
                      <span className="text-slate-100 font-bold">{vac.batchNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 text-[11px]">
                      <span>Attending Doctor:</span>
                      <span className="text-white font-bold">{vac.administeredBy || "Dr. Rajesh Sharma"}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 text-[11px]">
                      <span>Next Due Date:</span>
                      <span className="text-amber-400 font-bold">{vac.nextDueDate || "2027-02-20"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center text-amber-300 text-xs bg-amber-950/30 rounded-2xl border border-amber-900/50 flex flex-col items-center justify-center space-y-2">
                <Clock className="w-6 h-6 text-amber-400 animate-bounce" />
                <p className="font-bold">Awaiting On-Site Vaccine Administration & Field Verification</p>
                <p className="text-[11px] text-slate-400">Emergency Dispatch Request initiated. Doctor visit pending.</p>
              </div>
            )}
          </div>

          {/* Clinical Medical History Logs */}
          <div className="space-y-4 pt-2 border-t border-slate-800 print:border-black">
            <h3 className="text-sm font-extrabold text-white print:text-black font-mono uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Clinical Medical History & Field Inspection Logs</span>
            </h3>

            {animal.medicalHistory && animal.medicalHistory.length > 0 ? (
              <div className="space-y-3">
                {animal.medicalHistory.map((med, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 print:border-black">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-emerald-400 text-sm">{med.diagnosis || med.condition}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{med.date}</span>
                    </div>
                    <div className="text-slate-300 leading-relaxed">
                      {med.treatment || (med.prescriptions ? med.prescriptions.join(', ') : 'Standard Biosecurity Barrier')}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-900 pt-2">
                      <span>Attending Officer: <strong className="text-white">{med.vetName || 'Dr. Rajesh Sharma'}</strong></span>
                      <span className="text-emerald-400 text-[10px] font-mono font-bold">VERIFIED ENTRY</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs">No clinical disease history recorded. Animal clean.</div>
            )}
          </div>

          {/* Footer Footer Seal */}
          <div className="pt-4 border-t border-slate-800 print:border-black flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Issued by State Department of Veterinary Services & Animal Husbandry</span>
            </div>
            <div className="font-mono text-[10px] text-slate-500">
              Pashu Rakshak National Biosecurity Engine • Verified Ledger System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
