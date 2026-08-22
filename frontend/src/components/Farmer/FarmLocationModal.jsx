import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Send, X, CheckCircle2, Globe } from 'lucide-react';

export const FarmLocationModal = ({ isOpen, onClose, onConfirmDispatch, onConfirmLocation, onConfirm, aiResult }) => {
  const [village, setVillage] = useState('Detecting Location...');
  const [landmark, setLandmark] = useState('Farm Rear Shed / Main Gate');
  const [gpsCoords, setGpsCoords] = useState({ lat: 28.6139, lng: 77.2090 });
  const [selectedPreset, setSelectedPreset] = useState('AUTO');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  // Auto-detect browser location immediately on modal open
  useEffect(() => {
    if (isOpen) {
      detectGpsLocation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const detectGpsLocation = () => {
    setIsDetectingGps(true);
    setGpsSuccess(false);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lng = parseFloat(pos.coords.longitude.toFixed(4));
          setGpsCoords({ lat, lng });

          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
            const data = await response.json();
            if (data && data.address) {
              const place = data.address.village || data.address.town || data.address.suburb || data.address.city || data.address.county || "Detected Region";
              const state = data.address.state || "India";
              const road = data.address.road || data.address.neighbourhood || "Farm Road";
              
              setVillage(`${place}, ${state}`);
              setLandmark(`${road} (GPS: ${lat}, ${lng})`);
            } else {
              setVillage(`Live GPS Zone (${lat}, ${lng})`);
              setLandmark(`Satellite Fixed GPS Location`);
            }
          } catch (err) {
            setVillage(`Live GPS Node (${lat}, ${lng})`);
            setLandmark(`Satellite Fixed Location`);
          } finally {
            setIsDetectingGps(false);
            setGpsSuccess(true);
          }
        },
        (err) => {
          console.warn("Geolocation fallback used:", err);
          setIsDetectingGps(false);
          setGpsSuccess(true);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setIsDetectingGps(false);
    }
  };

  const handlePresetChange = (presetKey) => {
    setSelectedPreset(presetKey);
    setGpsSuccess(true);

    if (presetKey === 'DELHI') {
      setGpsCoords({ lat: 28.6139, lng: 77.2090 });
      setVillage('Connaught Place, New Delhi');
      setLandmark('Central Farm Depot (GPS: 28.6139, 77.2090)');
    } else if (presetKey === 'MUMBAI') {
      setGpsCoords({ lat: 19.0760, lng: 72.8777 });
      setVillage('Andheri East, Mumbai (Maharashtra)');
      setLandmark('West Dairy Hub (GPS: 19.0760, 72.8777)');
    } else if (presetKey === 'KARNAL') {
      setGpsCoords({ lat: 29.6900, lng: 77.0010 });
      setVillage('Gharaunda, Karnal (Haryana)');
      setLandmark('GT Road Farm Node (GPS: 29.6900, 77.0010)');
    } else if (presetKey === 'ANAND') {
      setGpsCoords({ lat: 22.5500, lng: 72.9150 });
      setVillage('Mogri, Anand (Gujarat)');
      setLandmark('Amul Dairy Compound (GPS: 22.5500, 72.9150)');
    } else if (presetKey === 'AUTO') {
      detectGpsLocation();
    }
  };

  const handleDispatch = (e) => {
    if (e) e.preventDefault();
    const dispatchFn = onConfirmDispatch || onConfirmLocation || onConfirm;
    if (dispatchFn) {
      dispatchFn({
        village,
        landmark,
        location: gpsCoords
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full rounded-3xl border border-emerald-500/50 bg-[#0B0F19]/95 p-6 space-y-5 animate-fadeIn shadow-[0_0_80px_rgba(16,185,129,0.3)]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base font-display">
            <MapPin className="w-5 h-5 animate-bounce text-emerald-400" />
            <span>Detect & Confirm Farm Location</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-snug">
          Select or detect your farm's exact location below. The Vet Officer & Govt Admin Map will fly directly to this <strong>exact Red Spot location</strong>!
        </p>

        <form onSubmit={handleDispatch} className="space-y-4 text-xs">
          {/* Quick Location Preset Selector */}
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Select Farm Location Preset:</label>
            <select
              value={selectedPreset}
              onChange={e => handlePresetChange(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-emerald-500 focus:outline-none"
            >
              <option value="AUTO">📍 Auto-Detect My Live Browser GPS Location</option>
              <option value="DELHI">📍 New Delhi (Lat: 28.6139, Lng: 77.2090)</option>
              <option value="MUMBAI">📍 Mumbai, Maharashtra (Lat: 19.0760, Lng: 72.8777)</option>
              <option value="KARNAL">📍 Karnal, Haryana (Lat: 29.6900, Lng: 77.0010)</option>
              <option value="ANAND">📍 Anand, Gujarat (Lat: 22.5500, Lng: 72.9150)</option>
              <option value="CUSTOM">📍 Custom Coordinates (Editable below)</option>
            </select>
          </div>

          {/* GPS Auto-Detect Button */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/50 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-semibold">Active Satellite GPS:</span>
              <span className="font-mono text-emerald-400 font-extrabold text-sm">
                {gpsCoords.lat}, {gpsCoords.lng}
              </span>
            </div>

            <button
              type="button"
              onClick={detectGpsLocation}
              disabled={isDetectingGps}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold flex items-center justify-center gap-2 border border-emerald-400 shadow-md btn-pop cursor-pointer"
            >
              <Navigation className={`w-4 h-4 text-white ${isDetectingGps ? 'animate-spin' : ''}`} />
              <span>{isDetectingGps ? 'Fixing GPS Satellites...' : 're-Detect Browser GPS Coordinates'}</span>
            </button>
          </div>

          {/* Manual Coordinate Override Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Latitude:</label>
              <input
                type="number"
                step="0.0001"
                value={gpsCoords.lat}
                onChange={e => setGpsCoords({ ...gpsCoords, lat: parseFloat(e.target.value) || 28.6139 })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Longitude:</label>
              <input
                type="number"
                step="0.0001"
                value={gpsCoords.lng}
                onChange={e => setGpsCoords({ ...gpsCoords, lng: parseFloat(e.target.value) || 77.2090 })}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Village / City & District Name:</label>
            <input
              type="text"
              required
              value={village}
              onChange={e => setVillage(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Landmark / Farm Gate Directions:</label>
            <input
              type="text"
              placeholder="e.g. Near Tube Well, Rear Shed"
              value={landmark}
              onChange={e => setLandmark(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleDispatch}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 btn-pop cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Request with Selected Location</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
