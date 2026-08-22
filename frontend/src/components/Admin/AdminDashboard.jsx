import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MapContainer, TileLayer, CircleMarker, Popup, Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ComplaintsView } from './ComplaintsView';
import { 
  Building2, Radio, AlertOctagon, Users, ShieldAlert, Activity, 
  MapPin, Clock, Star, Send, X, CheckCircle2, FileText, ChevronRight,
  ClipboardList, AlertTriangle
} from 'lucide-react';

const redOutbreakIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ef4444" width="44" height="44"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -40]
});

// Auto Map Fly-To controller helper (runs ONLY when a new outbreak point is added)
const MapFlyController = ({ latestPointId, center }) => {
  const map = useMap();
  const lastFlownId = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    if (latestPointId && latestPointId !== lastFlownId.current && center && center[0] && center[1]) {
      lastFlownId.current = latestPointId;
      map.flyTo(center, 12, { animate: true, duration: 1.2 });
    }
    return () => clearTimeout(timer);
  }, [latestPointId, center, map]);

  return null;
};

export const AdminDashboard = ({ activeTab = 'HEATMAP', setActiveTab }) => {
  const { t, outbreaksSummary, complaintsList, requestsList, showToast, refreshAllData } = useApp();
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  useEffect(() => {
    refreshAllData();
  }, []);

  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [targetDistrict, setTargetDistrict] = useState('Ludhiana');
  const [radiusKm, setRadiusKm] = useState(15);
  const [severity, setSeverity] = useState('HIGH');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const metrics = outbreaksSummary?.metrics || {
    totalMonitoredFarms: 1420,
    totalAnimalsProtected: 18450,
    activeOutbreaksCount: 3,
    totalCases: 248,
    avgOfficerResponseTimeMinutes: 19
  };

  // Active UN-INSPECTED farmer requests (status !== 'COMPLETED')
  const activeUninspectedFarmerRequests = (requestsList || []).filter(
    r => r.status !== 'COMPLETED' && r.status !== 'RESOLVED' && r.status !== 'INSPECTED'
  );
  
  // Set of COMPLETED request IDs to guarantee Red Spot removal
  const completedReqIds = new Set(
    (requestsList || [])
      .filter(r => r.status === 'COMPLETED' || r.status === 'RESOLVED' || r.status === 'INSPECTED')
      .map(r => r.id)
  );

  const farmerCasePoints = activeUninspectedFarmerRequests.map(r => ({
    id: "farmer-spot-" + r.id,
    requestId: r.id,
    disease: r.suspectedDisease || "Reported Infection / Case",
    lat: r.farmLocation ? r.farmLocation.lat : 30.8920,
    lng: r.farmLocation ? r.farmLocation.lng : 75.8450,
    intensity: 1.0,
    radiusKm: 12,
    farmerName: r.farmerName,
    animalTag: r.animalTag,
    district: r.village || "Local Farm Region",
    quarantineStatus: "🔴 UN-INSPECTED ACTIVE CASE (AWAITING VET FIELD DIAGNOSIS)"
  }));

  // Filter rawHeatmapPoints from backend to strictly EXCLUDE any completed/inspected requests
  const rawHeatmapPoints = (outbreaksSummary?.heatmapPoints || []).filter(p => {
    if (p.requestId && completedReqIds.has(p.requestId)) return false;
    if (p.id && p.id.startsWith('farmer-spot-')) {
      const reqId = p.id.replace('farmer-spot-', '');
      if (completedReqIds.has(reqId)) return false;
    }
    return true;
  });

  // Deduplicate points by id
  const allPointsMap = new Map();
  [...farmerCasePoints, ...rawHeatmapPoints].forEach(p => {
    allPointsMap.set(p.id, p);
  });
  const heatmapPoints = Array.from(allPointsMap.values());

  const officerAccountability = outbreaksSummary?.officerAccountability || [];
  const pendingComplaintsCount = complaintsList ? complaintsList.filter(c => c.status === 'PENDING').length : 0;

  const latestPoint = heatmapPoints.length > 0 ? heatmapPoints[0] : null;
  const mapCenter = latestPoint ? [Number(latestPoint.lat), Number(latestPoint.lng)] : [30.8920, 75.8450];

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setIsBroadcasting(true);

    try {
      const res = await fetch('/api/outbreaks/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: alertTitle || `BIOSECURITY ALERT: Outbreak Quarantine Active (${radiusKm}km)`,
          message: alertMessage || `Confirmed outbreak reported in ${targetDistrict}. All cattle movement restricted.`,
          severity,
          targetDistrict,
          radiusKm
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        setIsBroadcastOpen(false);
        setAlertTitle('');
        setAlertMessage('');
        refreshAllData();
      }
    } catch (err) {
      showToast("Broadcast failed", "error");
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8 w-full text-white relative">
      {/* Fullscreen Background Image (/govt.dash .jpg) STRICTLY ONLY FOR GOVT ADMIN PORTAL */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/govt.dash .jpg"
          alt="Govt Admin Portal Background"
          className="w-full h-full object-cover opacity-75 filter brightness-100 contrast-105"
        />
        {/* Soft Ambient Overlay for Optimal Visibility & UI Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/70 via-[#030712]/50 to-[#030712]/80" />
      </div>

      {/* Command Header Banner */}
      <div className="relative z-10 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-[#0B0F19]/90 hover:bg-[#0B0F19] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-800 p-1 text-center shrink-0 flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                State Biosecurity Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Real-time Outbreak Surveillance, Vet Performance Audit & Farmer Grievance Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBroadcastOpen(true)}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-amber-600/20 btn-pop animate-pulse cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            <span>Broadcast Emergency Geo-Alert</span>
          </button>
        </div>

        {/* Analytics Counter Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shadow-inner">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Monitored Farms</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">{metrics.totalMonitoredFarms}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shadow-inner">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Protected Animals</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{metrics.totalAnimalsProtected.toLocaleString()}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shadow-inner">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Active Outbreak Zones</div>
            <div className="text-2xl font-black text-red-400 mt-1 font-mono">{heatmapPoints.length || metrics.activeOutbreaksCount} Zones</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shadow-inner">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Avg Vet Response Time</div>
            <div className="text-2xl font-black text-blue-400 mt-1 font-mono">{metrics.avgOfficerResponseTimeMinutes} Mins</div>
          </div>
        </div>
      </div>

      {/* TOP NAVIGATION WORKSPACE TABS */}
      <div className="relative z-10 flex items-center gap-3 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto backdrop-blur-xl">
        {/* Tab 1: Outbreak Heatmap */}
        <button
          onClick={() => setActiveTab && setActiveTab('HEATMAP')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all btn-pop cursor-pointer ${
            activeTab === 'HEATMAP'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Outbreak Heatmap GIS</span>
        </button>

        {/* Tab 2: Officer Audit & Duty Scorecard */}
        <button
          onClick={() => setActiveTab && setActiveTab('AUDIT')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all btn-pop cursor-pointer ${
            (activeTab === 'AUDIT' || activeTab === 'OFFICERS')
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Officer Audit & Duty</span>
        </button>

        {/* Tab 3: Real-Time Farmer Grievance Reports */}
        <button
          onClick={() => setActiveTab && setActiveTab('REPORTS')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all btn-pop cursor-pointer relative ${
            (activeTab === 'REPORTS' || activeTab === 'COMPLAINTS')
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <span>Farmer Grievance Reports</span>
          {pendingComplaintsCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-700 text-[10px] font-mono animate-pulse">
              {pendingComplaintsCount} LIVE
            </span>
          )}
        </button>
      </div>

      {/* Main Spacious Content Workspace */}
      <div className="relative z-10 w-full">
        {/* 1. HEATMAP TAB */}
        {activeTab === 'HEATMAP' && (
          <div className="h-[480px] rounded-2xl overflow-hidden border-2 border-red-500/60 relative shadow-2xl">
            <MapContainer
              center={mapCenter}
              zoom={11}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapFlyController latestPointId={latestPoint?.id} center={mapCenter} />

              {heatmapPoints.map(point => (
                <React.Fragment key={point.id}>
                  {/* Red Outbreak Containment Radius Circle */}
                  <Circle
                    center={[Number(point.lat), Number(point.lng)]}
                    radius={(point.radiusKm || 15) * 1000}
                    pathOptions={{
                      color: '#EF4444',
                      fillColor: '#EF4444',
                      fillOpacity: 0.35,
                      weight: 3
                    }}
                  />

                  {/* Pulsing Red Circle Marker */}
                  <CircleMarker
                    center={[Number(point.lat), Number(point.lng)]}
                    radius={16}
                    pathOptions={{
                      color: '#FFFFFF',
                      fillColor: '#EF4444',
                      fillOpacity: 0.95,
                      weight: 3
                    }}
                  />

                  {/* Red Marker Pin Icon */}
                  <Marker
                    position={[Number(point.lat), Number(point.lng)]}
                    icon={redOutbreakIcon}
                  >
                    <Popup>
                      <div className="p-2 text-xs space-y-1">
                        <div className="font-extrabold text-red-400 text-sm">🚨 {point.disease}</div>
                        {point.farmerName && <div>Farmer: <strong>{point.farmerName}</strong> (#{point.animalTag})</div>}
                        <div>District / Area: <strong>{point.district}</strong></div>
                        <div className="font-mono text-emerald-400 font-bold">GPS: {point.lat}, {point.lng}</div>
                        <div className="text-[10px] text-amber-300 font-bold uppercase pt-1">{point.quarantineStatus}</div>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              ))}
            </MapContainer>
          </div>
        )}

        {/* 2. OFFICER AUDIT & DUTY TAB */}
        {(activeTab === 'AUDIT' || activeTab === 'OFFICERS') && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-white font-display flex items-center gap-2.5">
                  <Users className="w-6 h-6 text-amber-400" />
                  <span>District Veterinary Officer Performance & Duty Scorecard</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Live Response Time Metrics, Attendance & Conduct Audit Log (ICAR Compliant)
                </p>
              </div>

              <div className="bg-amber-950/80 border border-amber-800 px-3 py-1.5 rounded-xl text-amber-400 text-xs font-mono font-bold">
                TOTAL OFFICERS: {officerAccountability.length || 4}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold font-mono">
                    <th className="p-3">Officer Name & Designation</th>
                    <th className="p-3">District Node</th>
                    <th className="p-3">Avg Response Time</th>
                    <th className="p-3">Completed Visits</th>
                    <th className="p-3">Conduct Rating</th>
                    <th className="p-3">Duty Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {officerAccountability.map((off, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px]">
                          {off.name?.slice(4, 6) || "DV"}
                        </div>
                        <div>
                          <div>{off.name}</div>
                          <div className="text-[10px] font-normal text-slate-400 font-mono">{off.designation}</div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-300 font-mono">{off.district}</td>
                      <td className="p-3 font-mono font-bold text-blue-400">{off.avgResponseMinutes} Mins</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">{off.completedVisits} Visits</td>
                      <td className="p-3 text-amber-400 font-bold font-mono">★ {off.rating} / 5.0</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                          off.status === 'AVAILABLE'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border-amber-800'
                        }`}>
                          {off.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. FARMER GRIEVANCE REPORTS TAB */}
        {(activeTab === 'REPORTS' || activeTab === 'COMPLAINTS') && (
          <ComplaintsView />
        )}
      </div>

      {/* EMERGENCY BROADCAST MODAL */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-[9990] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-3xl border border-red-500/60 p-6 space-y-5 animate-fadeIn shadow-2xl bg-[#0B0F19]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-red-400 font-extrabold text-base font-display">
                <Radio className="w-5 h-5 animate-pulse text-red-400" />
                <span>Broadcast Emergency Geo-Alert</span>
              </div>
              <button onClick={() => setIsBroadcastOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target District Sector:</label>
                <select
                  value={targetDistrict}
                  onChange={e => setTargetDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-red-500 focus:outline-none"
                >
                  <option value="Ludhiana">Ludhiana Biosecurity Sector</option>
                  <option value="Amritsar">Amritsar Border Sector</option>
                  <option value="Jalandhar">Jalandhar Central Sector</option>
                  <option value="Patiala">Patiala Southern Sector</option>
                  <option value="Karnal">Karnal Dairy Cluster</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Alert Title / Outbreak Type:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BIOSECURITY ALERT: FMD Outbreak Containment Zone"
                  value={alertTitle}
                  onChange={e => setAlertTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Alert Guidance & Directives:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter quarantine instructions for farmers & mobile vet teams in radius..."
                  value={alertMessage}
                  onChange={e => setAlertMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Quarantine Radius (KM):</label>
                  <input
                    type="number"
                    value={radiusKm}
                    onChange={e => setRadiusKm(Number(e.target.value) || 15)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Severity Level:</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-red-400 font-bold focus:border-red-500 focus:outline-none"
                  >
                    <option value="CRITICAL">🔴 CRITICAL SEVERITY</option>
                    <option value="HIGH">🟠 HIGH SEVERITY</option>
                    <option value="MODERATE">🟡 MODERATE ADVISORY</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setIsBroadcastOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 btn-pop cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isBroadcasting ? 'Broadcasting...' : 'Broadcast Geo-Alert Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
