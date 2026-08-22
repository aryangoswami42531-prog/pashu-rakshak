import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('FARMER'); // FARMER, VET, ADMIN
  const [activeLang, setActiveLang] = useState('EN'); // EN, HI
  const [toasts, setToasts] = useState([]);
  
  // Real-time state caches
  const [vetsList, setVetsList] = useState([]);
  const [requestsList, setRequestsList] = useState([]);
  const [animalsList, setAnimalsList] = useState([]);
  const [outbreaksSummary, setOutbreaksSummary] = useState(null);
  const [alertsList, setAlertsList] = useState([]);
  const [complaintsList, setComplaintsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch initial backend state
  const refreshAllData = async () => {
    try {
      setIsLoading(true);
      const [vetsRes, reqsRes, animsRes, outbRes, alertsRes, cmplRes] = await Promise.all([
        fetch('/api/vets').then(r => r.json()).catch(() => null),
        fetch('/api/vets/requests').then(r => r.json()).catch(() => null),
        fetch('/api/records').then(r => r.json()).catch(() => null),
        fetch('/api/outbreaks/summary').then(r => r.json()).catch(() => null),
        fetch('/api/outbreaks/alerts').then(r => r.json()).catch(() => null),
        fetch('/api/complaints').then(r => r.json()).catch(() => null)
      ]);

      if (vetsRes?.vets) setVetsList(vetsRes.vets);
      if (reqsRes?.requests) setRequestsList(reqsRes.requests);
      if (animsRes?.animals) setAnimalsList(animsRes.animals);
      if (outbRes) setOutbreaksSummary(outbRes);
      if (alertsRes?.alerts) setAlertsList(alertsRes.alerts);
      if (cmplRes?.complaints) setComplaintsList(cmplRes.complaints);

    } catch (err) {
      console.error("Error loading app data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
    // Real-time polling interval so Vet acceptance syncs instantly to Farmer screen
    const interval = setInterval(() => {
      refreshAllData();
    }, 3000);
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
      refreshAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
