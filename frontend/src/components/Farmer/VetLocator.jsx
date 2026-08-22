import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  MapPin, Phone, Star, Clock, Stethoscope, Send, CheckCircle2, AlertCircle, X, ShieldAlert 
} from 'lucide-react';

// Custom Leaflet Icons using SVG Data URIs
const vetIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981" width="36" height="36"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -32]
});

const farmIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f59e0b" width="36" height="36"><path d="M12 3L2 12h3v8h14v-8h3L12 3zm1 15h-2v-4h2v4z"/></svg>',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -32]
});

// Helper component to smoothly re-center map view
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 12);
    }
  }, [center, map]);
  return null;
}

export const VetLocator = ({ prefilledAiResult, onCloseModal }) => {
  const { t, refreshAllData, showToast } = useApp();
  const [selectedVet, setSelectedVet] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Real-time GPS Location & Dynamic Vets list state
  const [userCoords, setUserCoords] = useState({ lat: 30.8920, lng: 75.8450 });
  const [userAddressStr, setUserAddressStr] = useState("Detecting Current GPS Location...");
  const [vetsListDynamic, setVetsListDynamic] = useState([]);
  const [mapCenter, setMapCenter] = useState([30.8920, 75.8450]);

  // Fetch real-time GPS location and query nearby Vets API
  useEffect(() => {
    const fetchVetsForLocation = async (lat, lng) => {
      try {
        const res = await fetch(`/api/vets?lat=${lat}&lng=${lng}`);
        const data = await res.json();
        if (data.success && data.vets) {
          setVetsListDynamic(data.vets);
        }
      } catch (err) {
        console.error("Error fetching nearby vets:", err);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setMapCenter([lat, lng]);

          // Reverse Geocoding
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || "Your Region";
              const state = data.address.state || data.address.country || "";
              setUserAddressStr(`${city}${state ? `, ${state}` : ''}`);
            } else {
              setUserAddressStr(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
            }
          } catch (e) {
            setUserAddressStr(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`);
          }

          fetchVetsForLocation(lat, lng);
        },
        (err) => {
          console.warn("GPS access fallback:", err);
          setUserAddressStr("Ludhiana, Punjab (Fallback GPS)");
          fetchVetsForLocation(30.8920, 75.8450);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      fetchVetsForLocation(30.8920, 75.8450);
    }
  }, []);

  const handleOpenRequest = (vet) => {
    setSelectedVet(vet);
    setIsModalOpen(true);
  };

  const submitVetRequest = async () => {
    if (!selectedVet) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/vets/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName: "Local Farmer",
          farmerPhone: "+91 98711 22334",
          farmLocation: userCoords,
          village: userAddressStr,
          animalTag: `IN-FARM-${Math.floor(1000 + Math.random() * 9000)}`,
          species: prefilledAiResult?.diseaseMatch?.affectedSpecies?.[0] || "Cattle",
          symptoms: prefilledAiResult?.symptomsIdentified || ["Skin nodules", "High fever"],
          aiRiskLevel: prefilledAiResult?.riskLevel || "HIGH",
          suspectedDisease: prefilledAiResult?.diseaseMatch?.name || "Lumpy Skin Disease (LSD)",
          vetId: selectedVet.id,
          notes
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message, "success");
        setIsModalOpen(false);
        if (onCloseModal) onCloseModal();
        refreshAllData();
      } else {
        showToast("Request failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display">
            <Stethoscope className="w-5 h-5 text-emerald-400" />
            <span>{t('nav.vetConnect')}</span>
          </h2>
          <p className="text-slate-300 text-xs mt-1 flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Nearest certified Government Veterinary Officers around <strong className="text-emerald-400 font-mono">{userAddressStr}</strong></span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-200 font-semibold">{vetsListDynamic.length} Vets Online Nearby</span>
        </div>
      </div>

      {/* Map & List Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Leaflet Interactive Map */}
        <div className="lg:col-span-7 h-[480px] rounded-2xl overflow-hidden border border-slate-800 relative shadow-xl">
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
          >
            <ChangeView center={mapCenter} />
            
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Live Farm Marker */}
            <Marker position={[userCoords.lat, userCoords.lng]} icon={farmIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <div className="font-bold text-amber-400">Your Live Farm GPS Position</div>
                  <div className="text-slate-300">{userAddressStr}</div>
                </div>
              </Popup>
            </Marker>

            {/* Dynamic Nearby Vets Markers */}
            {vetsListDynamic.map(vet => (
              <Marker
                key={vet.id}
                position={[vet.location.lat, vet.location.lng]}
                icon={vetIcon}
              >
                <Popup>
                  <div className="p-2 space-y-2 text-xs">
                    <div className="font-bold text-emerald-400">{vet.name}</div>
                    <div className="text-slate-300">{vet.designation}</div>
                    <div className="text-slate-400 font-mono font-bold">Distance: {vet.distanceKm} km</div>
                    <button
                      onClick={() => handleOpenRequest(vet)}
                      className="w-full mt-2 py-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded cursor-pointer"
                    >
                      Request Visit
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Right: Nearby Vets Directory List */}
        <div className="lg:col-span-5 space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {vetsListDynamic.map(vet => (
            <div
              key={vet.id}
              onClick={() => setMapCenter([vet.location.lat, vet.location.lng])}
              className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-emerald-500/80 transition-all space-y-3 cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={vet.avatar}
                    alt={vet.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700 group-hover:border-emerald-500 transition-colors"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors">
                      {vet.name}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium">{vet.designation}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium border border-slate-700 font-mono">
                        {vet.address || vet.district}
                      </span>
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {vet.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  vet.status === 'AVAILABLE'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border-amber-800'
                }`}>
                  {vet.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{vet.distanceKm} km away</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Avg {vet.avgResponseMinutes} mins</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                <a
                  href={`tel:${vet.phone}`}
                  className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Vet</span>
                </a>
                <button
                  onClick={() => handleOpenRequest(vet)}
                  className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Visit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Request Modal */}
      {isModalOpen && selectedVet && (
        <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl border border-slate-700 p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {t('farmer.requestModalTitle')}
                </h3>
                <p className="text-xs text-slate-400">
                  Assigning request to: <span className="text-emerald-400 font-semibold">{selectedVet.name}</span>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Summary Banner inside modal if present */}
            {prefilledAiResult && (
              <div className="p-3 rounded-xl bg-bioalert-950/80 border border-bioalert-700/80 text-xs space-y-1">
                <div className="font-bold text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Attached AI Risk Findings:
                </div>
                <div className="text-slate-200">
                  Suspected: <span className="font-semibold text-white">{prefilledAiResult.diseaseMatch?.name}</span> ({prefilledAiResult.riskLevel} RISK)
                </div>
              </div>
            )}

            {/* Additional Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Additional Notes / Landmark Directions for Vet:
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Cow isolated in rear shed near tube well. High fever since morning..."
                className="w-full h-24 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={submitVetRequest}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Request Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
