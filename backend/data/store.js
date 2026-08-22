const fs = require('fs');
const path = require('path');
const { seedVets, seedVetRequests, seedAnimals, seedOutbreaks, generateHash } = require('./seedData');

// Determine persistent data file path (/tmp/pashu_store.json on Vercel, local fallback in dev)
const STORE_PATH = process.env.VERCEL 
  ? path.join('/tmp', 'pashu_store.json')
  : path.join(__dirname, 'pashu_store.json');

// Memory cache initialized with seed data
let cache = {
  vetsList: [...seedVets],
  requestsList: [...seedVetRequests],
  animalsList: [...seedAnimals],
  outbreaksList: [...seedOutbreaks],
  complaintsList: []
};

// Helper to load persistent store from disk if present
function loadStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed.requestsList && Array.isArray(parsed.requestsList)) {
        cache.requestsList = parsed.requestsList;
      }
      if (parsed.animalsList && Array.isArray(parsed.animalsList)) {
        cache.animalsList = parsed.animalsList;
      }
      if (parsed.outbreaksList && Array.isArray(parsed.outbreaksList)) {
        cache.outbreaksList = parsed.outbreaksList;
      }
      if (parsed.complaintsList && Array.isArray(parsed.complaintsList)) {
        cache.complaintsList = parsed.complaintsList;
      }
      if (parsed.vetsList && Array.isArray(parsed.vetsList)) {
        cache.vetsList = parsed.vetsList;
      }
    }
  } catch (err) {
    console.warn("Could not load persistent store file:", err);
  }
}

// Helper to save current cache to disk
function saveStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  } catch (err) {
    console.warn("Could not save persistent store file:", err);
  }
}

// Initial load
loadStore();

module.exports = {
  getVets: () => { loadStore(); return cache.vetsList; },
  getRequests: () => { loadStore(); return cache.requestsList; },
  getAnimals: () => { loadStore(); return cache.animalsList; },
  getOutbreaks: () => { loadStore(); return cache.outbreaksList; },
  getComplaints: () => { loadStore(); return cache.complaintsList; },

  addRequest: (reqObj) => {
    loadStore();
    cache.requestsList.unshift(reqObj);
    saveStore();
  },

  updateRequestStatus: (id, status, etaMinutes) => {
    loadStore();
    const req = cache.requestsList.find(r => r.id === id || r.animalTag === id);
    if (req) {
      req.status = status;
      if (etaMinutes) req.etaMinutes = etaMinutes;
      saveStore();
      return req;
    }
    return null;
  },

  completeRequest: (requestId, animalTag, inspectionLog) => {
    loadStore();
    const req = cache.requestsList.find(r => r.id === requestId || r.animalTag === animalTag);
    if (req) {
      req.status = "COMPLETED";
      req.completedAt = new Date().toISOString();
      req.inspectionLog = inspectionLog;
    }

    // Update animal status
    const anim = cache.animalsList.find(a => a.tagNumber === animalTag || a.id === animalTag);
    if (anim) {
      anim.status = "VERIFIED_PASSPORT";
      if (!anim.medicalHistory) anim.medicalHistory = [];
      anim.medicalHistory.unshift({
        date: new Date().toISOString().split('T')[0],
        diagnosis: inspectionLog.diagnosis || "Clinical Field Inspection Complete",
        vetName: inspectionLog.vetName || "Dr. Rajesh Sharma",
        prescriptions: [inspectionLog.treatmentAdministered || "Standard Biosecurity Vaccine"],
        remarks: "Field Inspection & Clinical Diagnosis Completed. Case Resolved."
      });
    }

    saveStore();
    return req;
  },

  addAnimal: (animObj) => {
    loadStore();
    cache.animalsList.unshift(animObj);
    saveStore();
  },

  addComplaint: (cmpObj) => {
    loadStore();
    cache.complaintsList.unshift(cmpObj);
    saveStore();
  },

  generateHash
};
