import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const AppContext = createContext();

// Helper to append no-cache headers to prevent stale Vercel CDN/edge responses
const fetchNoCache = async (url, options = {}) => {
  const defaultHeaders = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };
  return fetch(url, {
    ...options,
    cache: 'no-store',
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  });
};

export const AppProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('FARMER'); // FARMER, VET, ADMIN
  const [activeLang, setActiveLang] = useState('EN'); // EN, HI
  const [toasts, setToasts] = useState([]);
  
  // Real-time state caches with LocalStorage persistence to prevent data loss or flickering
  const [vetsList, setVetsList] = useState([]);
  
  const [requestsList, setRequestsList] = useState(() => {
    try {
      const cached = localStorage.getItem('pr_requestsList');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [animalsList, setAnimalsList] = useState(() => {
    try {
      const cached = localStorage.getItem('pr_animalsList');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [outbreaksSummary, setOutbreaksSummary] = useState(null);
  const [alertsList, setAlertsList] = useState([]);
  
  const [complaintsList, setComplaintsList] = useState(() => {
    try {
      const cached = localStorage.getItem('pr_complaintsList');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync state changes to LocalStorage for persistent offline-first stability
  useEffect(() => {
    try {
      if (requestsList.length > 0) {
        localStorage.setItem('pr_requestsList', JSON.stringify(requestsList));
      }
    } catch (e) {}
  }, [requestsList]);

  useEffect(() => {
    try {
      if (animalsList.length > 0) {
        localStorage.setItem('pr_animalsList', JSON.stringify(animalsList));
      }
    } catch (e) {}
  }, [animalsList]);

  useEffect(() => {
    try {
      if (complaintsList.length > 0) {
        localStorage.setItem('pr_complaintsList', JSON.stringify(complaintsList));
      }
    } catch (e) {}
  }, [complaintsList]);

  // Robust case-insensitive Helper translation function
  const t = (path) => {
    if (!path) return '';
    const keys = path.split('.');
    const langKey = (activeLang || 'EN').toUpperCase();
    let current = translations[langKey] || translations.EN;
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return path;
      }
    }
    return current;
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Fetch backend state seamlessly without triggering UI loading flicker
  const refreshAllData = async (isInitial = false) => {
    try {
      if (isInitial && requestsList.length === 0) {
        setIsLoading(true);
      }

      // Add cache: 'no-store' & anti-cache headers to ALL endpoint fetches
      const [vetsRes, reqsRes, animsRes, outbRes, alertsRes, cmplRes] = await Promise.all([
        fetchNoCache('/api/vets').then(r => r.json()).catch(() => null),
        fetchNoCache('/api/vets/requests').then(r => r.json()).catch(() => null),
        fetchNoCache('/api/records').then(r => r.json()).catch(() => null),
        fetchNoCache('/api/outbreaks/summary').then(r => r.json()).catch(() => null),
        fetchNoCache('/api/outbreaks/alerts').then(r => r.json()).catch(() => null),
        fetchNoCache('/api/complaints').then(r => r.json()).catch(() => null)
      ]);

      if (vetsRes?.vets && Array.isArray(vetsRes.vets)) {
        setVetsList(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(vetsRes.vets)) {
            return vetsRes.vets;
          }
          return prev;
        });
      }

      if (reqsRes?.requests && Array.isArray(reqsRes.requests)) {
        setRequestsList(prev => {
          const mergedMap = new Map();
          // First add existing local requests
          prev.forEach(item => mergedMap.set(item.id, item));
          // Overlay backend requests
          reqsRes.requests.forEach(item => mergedMap.set(item.id, item));
          const nextArr = Array.from(mergedMap.values());
          
          // Strict Reference Stability Check: Only trigger React update if content actually changed!
          if (JSON.stringify(prev) !== JSON.stringify(nextArr)) {
            return nextArr;
          }
          return prev; // Return exact same array reference if unchanged -> STOP UI FLICKER!
        });
      }

      if (animsRes?.animals && Array.isArray(animsRes.animals)) {
        setAnimalsList(prev => {
          const mergedMap = new Map();
          prev.forEach(item => mergedMap.set(item.id || item.tagNumber, item));
          animsRes.animals.forEach(item => mergedMap.set(item.id || item.tagNumber, item));
          const nextArr = Array.from(mergedMap.values());
          if (JSON.stringify(prev) !== JSON.stringify(nextArr)) {
            return nextArr;
          }
          return prev;
        });
      }

      if (outbRes) {
        setOutbreaksSummary(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(outbRes)) {
            return outbRes;
          }
          return prev;
        });
      }

      if (alertsRes?.alerts && Array.isArray(alertsRes.alerts)) {
        setAlertsList(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(alertsRes.alerts)) {
            return alertsRes.alerts;
          }
          return prev;
        });
      }

      if (cmplRes?.complaints && Array.isArray(cmplRes.complaints)) {
        setComplaintsList(prev => {
          const mergedMap = new Map();
          prev.forEach(item => mergedMap.set(item.id, item));
          cmplRes.complaints.forEach(item => mergedMap.set(item.id, item));
          const nextArr = Array.from(mergedMap.values());
          if (JSON.stringify(prev) !== JSON.stringify(nextArr)) {
            return nextArr;
          }
          return prev;
        });
      }

    } catch (err) {
      console.error("Error loading app data:", err);
    } finally {
      if (isInitial) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    refreshAllData(true);
    // Real-time background sync interval (silent without toggling isLoading or changing unchanged array references)
    const interval = setInterval(() => {
      refreshAllData(false);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      activeRole,
      setActiveRole,
      activeLang,
      setActiveLang,
      t,
      toasts,
      showToast,
      vetsList,
      requestsList,
      animalsList,
      outbreaksSummary,
      alertsList,
      complaintsList,
      isLoading,
      refreshAllData: () => refreshAllData(false)
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
