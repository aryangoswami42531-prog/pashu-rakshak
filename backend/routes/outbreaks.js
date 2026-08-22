const express = require('express');
const router = express.Router();
const { seedOutbreaks, seedGeoAlerts, seedFarms, seedVets } = require('../data/seedData');
const { requestsList } = require('../data/sharedStore');

let outbreaksList = [...seedOutbreaks];
let alertsList = [...seedGeoAlerts];

/**
 * GET /api/outbreaks/summary
 * Returns outbreak analytics, metrics, heatmap cluster points
 */
router.get('/summary', (req, res) => {
  const totalMonitoredFarms = 1420;
  const totalAnimalsProtected = 18450;
  
  // Dynamic Un-inspected Active Farmer Requests (Status !== 'COMPLETED')
  const activeUninspectedRequests = requestsList.filter(r => r.status !== 'COMPLETED' && r.status !== 'RESOLVED' && r.status !== 'INSPECTED');

  const activeOutbreaksCount = outbreaksList.filter(o => o.severity === 'HIGH' || o.severity === 'CRITICAL').length + activeUninspectedRequests.length;
  
  const totalCases = outbreaksList.reduce((acc, curr) => acc + curr.confirmedCases + curr.suspectedCases, 0) + activeUninspectedRequests.length;

  // Convert Active Un-inspected Farmer Requests into Red Spot Map Hotspots
  const farmerCasePoints = activeUninspectedRequests.map(r => ({
    id: "farmer-spot-" + r.id,
    requestId: r.id,
    disease: r.suspectedDisease || "Reported Infection / Outbreak",
    lat: r.farmLocation ? r.farmLocation.lat : 30.8920,
    lng: r.farmLocation ? r.farmLocation.lng : 75.8450,
    intensity: 1.0,
    radiusKm: 12,
    cases: 1,
    district: r.village || "Local Farm Region",
    farmerName: r.farmerName,
    animalTag: r.animalTag,
    quarantineStatus: "🔴 ACTIVE UN-INSPECTED CASE (AWAITING VET FIELD DIAGNOSIS)"
  }));

  // Seed outbreak cluster points
  const seedPoints = outbreaksList.map(o => ({
    id: o.id,
    disease: o.diseaseName,
    lat: o.centerLocation ? o.centerLocation.lat : (o.lat || 30.9000),
    lng: o.centerLocation ? o.centerLocation.lng : (o.lng || 75.8500),
    intensity: o.severity === 'CRITICAL' ? 1.0 : (o.severity === 'HIGH' ? 0.85 : 0.5),
    radiusKm: o.radiusKm || 12,
    cases: o.confirmedCases || 25,
    district: o.district || "Ludhiana",
    quarantineStatus: o.quarantineStatus || "BIOSECURITY_QUARANTINE_ACTIVE"
  }));

  const heatmapPoints = [...farmerCasePoints, ...seedPoints];

  const officerAccountability = seedVets.map(v => ({
    vetId: v.id,
    name: v.name,
    designation: v.designation,
    district: v.district,
    avgResponseMinutes: v.avgResponseMinutes,
    completedVisits: v.completedVisits,
    rating: v.rating,
    status: v.status
  }));

  res.json({
    success: true,
    metrics: {
      totalMonitoredFarms,
      totalAnimalsProtected,
      activeOutbreaksCount,
      totalCases,
      avgOfficerResponseTimeMinutes: 19
    },
    heatmapPoints,
    outbreaks: outbreaksList,
    officerAccountability
  });
});

/**
 * GET /api/outbreaks/alerts
 */
router.get('/alerts', (req, res) => {
  res.json({
    success: true,
    alerts: alertsList
  });
});

/**
 * POST /api/outbreaks/broadcast
 * Broadcast emergency biosecurity containment radius alert & add RED SPOT on map
 */
router.post('/broadcast', (req, res) => {
  try {
    const { title, message, severity = "HIGH", targetDistrict = "Ludhiana", radiusKm = 15, location = { lat: 30.8920, lng: 75.8450 }, issuedBy = "District Veterinary Officer" } = req.body;

    const newAlert = {
      id: "alert-" + Date.now(),
      title: title || `BIOSECURITY ALERT: Outbreak Quarantine Active (${radiusKm}km)`,
      message: message || `Confirmed disease outbreak reported in ${targetDistrict}. Emergency containment protocols enforced.`,
      severity,
      targetDistrict,
      radiusKm,
      issuedBy,
      timestamp: new Date().toISOString()
    };

    alertsList.unshift(newAlert);

    // Add new confirmed RED SPOT outbreak cluster on Govt Map at exact farm GPS
    const newOutbreakSpot = {
      id: "outbreak-" + Date.now(),
      diseaseName: title || "Confirmed Disease Outbreak",
      affectedSpecies: "Livestock",
      severity,
      district: targetDistrict,
      state: "Punjab",
      centerLocation: location,
      lat: location ? location.lat : 30.8920,
      lng: location ? location.lng : 75.8450,
      radiusKm,
      confirmedCases: 18,
      suspectedCases: 42,
      quarantineStatus: "BIOSECURITY_QUARANTINE_ENFORCED"
    };

    outbreaksList.unshift(newOutbreakSpot);

    res.json({
      success: true,
      message: `Emergency Geo-Alert Broadcasted to ${targetDistrict} Sector! Red Outbreak Containment Zone Activated.`,
      alert: newAlert,
      outbreak: newOutbreakSpot
    });

  } catch (error) {
    console.error("Broadcast error:", error);
    res.status(500).json({ success: false, message: "Broadcast failed" });
  }
});

module.exports = router;
