const express = require('express');
const router = express.Router();
const { store, generateHash } = require('../data/sharedStore');

// Helper: Haversine distance in KM between 2 GPS coords
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

/**
 * GET /api/vets/requests
 * Returns all active & completed farmer vet dispatch requests from persistent store
 */
router.get('/requests', (req, res) => {
  const reqs = store.getRequests();
  res.json({
    success: true,
    total: reqs.length,
    requests: reqs
  });
});

/**
 * PUT /api/vets/requests/:id
 * Update request status (e.g. ACCEPTED, ON_WAY, COMPLETED) in persistent store
 */
router.put('/requests/:id', (req, res) => {
  const reqId = req.params.id;
  const { status, etaMinutes } = req.body;
  
  const updatedReq = store.updateRequestStatus(reqId, status, etaMinutes);
  
  if (updatedReq) {
    return res.json({
      success: true,
      message: `Request ${reqId} status updated to ${updatedReq.status}`,
      request: updatedReq
    });
  }
  
  res.status(404).json({ success: false, message: "Request not found" });
});

/**
 * POST /api/vets/visit-report
 * Vet logs field inspection & diagnosis -> Marks request as COMPLETED in persistent store
 */
router.post('/visit-report', (req, res) => {
  try {
    const { requestId, animalTag, diagnosis, treatmentAdministered, vaccineGiven, batchNumber, followUpDate, vetName } = req.body;
    
    const inspectionLog = {
      diagnosis,
      treatmentAdministered,
      vaccineGiven,
      batchNumber,
      followUpDate,
      vetName: vetName || "Dr. Rajesh Sharma"
    };

    const completedReq = store.completeRequest(requestId, animalTag, inspectionLog);

    res.json({
      success: true,
      message: `Field Inspection & Diagnosis Logged! Red Spot removed from Govt Map for Case #${animalTag || requestId}.`,
      request: completedReq
    });
  } catch (error) {
    console.error("Error logging visit report:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * GET /api/vets
 * Query: lat, lng, radius
 */
router.get('/', (req, res) => {
  const vetsList = store.getVets();
  const userLat = parseFloat(req.query.lat) || 30.8920;
  const userLng = parseFloat(req.query.lng) || 75.8450;

  // Calculate distance to static seed vets
  let vetsWithDistance = vetsList.map(v => {
    const distanceKm = calculateDistance(userLat, userLng, v.location.lat, v.location.lng);
    return {
      ...v,
      distanceKm
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  // If the closest static vet is more than 35km away, dynamically project nearby local Government Vet Officers around user's GPS
  if (vetsWithDistance.length === 0 || vetsWithDistance[0].distanceKm > 35) {
    const dynamicLocalVets = [
      {
        id: "vet-local-101",
        name: "Dr. Rajesh Sharma",
        qualification: "B.V.Sc & A.H., M.V.Sc (Veterinary Epidemiology)",
        designation: "Senior District Veterinary Officer",
        phone: "+91 98765 43210",
        email: "dr.rajesh.sharma@gov.in",
        district: "District Biosecurity Center",
        state: "State Animal Husbandry Dept",
        location: { lat: userLat + 0.012, lng: userLng + 0.015 },
        address: "District Civil Veterinary Hospital & Polyclinic",
        status: "AVAILABLE",
        assignedRadiusKm: 25,
        rating: 4.9,
        completedVisits: 142,
        avgResponseMinutes: 18,
        avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
        distanceKm: calculateDistance(userLat, userLng, userLat + 0.012, userLng + 0.015)
      },
      {
        id: "vet-local-102",
        name: "Dr. Sunita Verma",
        qualification: "B.V.Sc, M.V.Sc (Virology)",
        designation: "Block Veterinary Extension Officer",
        phone: "+91 98123 87654",
        email: "dr.sunita.verma@gov.in",
        district: "District Biosecurity Center",
        state: "State Animal Husbandry Dept",
        location: { lat: userLat - 0.018, lng: userLng + 0.022 },
        address: "Government Veterinary Dispensary",
        status: "ON_FIELD",
        assignedRadiusKm: 20,
        rating: 4.8,
        completedVisits: 98,
        avgResponseMinutes: 22,
        avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78036?w=150&auto=format&fit=crop&q=80",
        distanceKm: calculateDistance(userLat, userLng, userLat - 0.018, userLng + 0.022)
      }
    ];

    vetsWithDistance = dynamicLocalVets.sort((a, b) => a.distanceKm - b.distanceKm);
  }

  res.json({
    success: true,
    total: vetsWithDistance.length,
    userLocation: { lat: userLat, lng: userLng },
    vets: vetsWithDistance
  });
});

/**
 * POST /api/vets/request
 * Body: { farmerName, farmerPhone, farmLocation, animalTag, species, symptoms, aiRiskLevel, suspectedDisease, vetId, notes }
 */
router.post('/request', (req, res) => {
  try {
    const vetsList = store.getVets();
    const farmLocation = req.body.farmLocation && req.body.farmLocation.lat ? req.body.farmLocation : { lat: 30.8920, lng: 75.8450 };
    const village = req.body.village || "Farmer Region";
    const farmerName = req.body.farmerName || "Local Farmer";
    const farmerPhone = req.body.farmerPhone || "+91 98711 22334";
    const animalTag = req.body.animalTag || "IN-PB-2024-8842";
    const species = req.body.species || "Cattle";
    const symptoms = req.body.symptoms || [];
    const aiRiskLevel = req.body.aiRiskLevel || "HIGH";
    const suspectedDisease = req.body.suspectedDisease || "Lumpy Skin Disease (LSD)";
    const vetId = req.body.vetId;
    const notes = req.body.notes || "";

    let assignedVet = vetsList.find(v => v.id === vetId);
    if (!assignedVet) {
      const sorted = vetsList.map(v => ({
        ...v,
        dist: calculateDistance(farmLocation.lat, farmLocation.lng, v.location.lat, v.location.lng)
      })).sort((a, b) => a.dist - b.dist);

      assignedVet = sorted[0] || { id: "vet-101", name: "Dr. Rajesh Sharma" };
    }

    const newRequest = {
      id: "req-" + Date.now(),
      farmId: "farm-" + Date.now(),
      farmerName,
      farmerPhone,
      farmLocation,
      village,
      animalTag,
      species,
      symptoms,
      aiRiskLevel,
      suspectedDisease,
      requestedVetId: assignedVet.id,
      requestedVetName: assignedVet.name,
      status: "PENDING",
      urgency: aiRiskLevel === "HIGH" ? "CRITICAL" : "HIGH",
      createdAt: new Date().toISOString(),
      notes
    };

    // SAVE TO PERSISTENT STORE
    store.addRequest(newRequest);

    // Automatically create animal health record in persistent store awaiting vet visit
    const nowStr = new Date().toISOString().split('T')[0];
    const newAnimal = {
      id: "anim-" + Date.now(),
      farmId: "farm-1",
      tagNumber: animalTag,
      species: species || "Cattle",
      breed: species === "Swine" || species === "Pig" ? "Large White Yorkshire" : species === "Poultry" ? "Broiler/Layer" : "Holstein Cross",
      ageMonths: 36,
      gender: "FEMALE",
      healthPassportHash: generateHash({ tag: animalTag, disease: suspectedDisease, date: nowStr }),
      status: "UNDER_SURVEILLANCE",
      vaccinations: [
        { name: "FMD Vaccine (Stage 1)", date: "2024-01-15", verifiedBy: "Govt Vet Dept" }
      ],
      medicalHistory: [
        {
          date: nowStr,
          diagnosis: suspectedDisease,
          vetId: assignedVet.id,
          vetName: assignedVet.name,
          prescriptions: ["Isolate animal in quarantine shed", "Administer Antipyretic & Antihistamine", "Apply Antiseptic Spray"],
          remarks: `Emergency Dispatch Request initiated. Status: PENDING VET VISIT (${assignedVet.name})`
        }
      ]
    };

    store.addAnimal(newAnimal);

    res.json({
      success: true,
      message: `Emergency Vet Request Dispatched to ${assignedVet.name}! Digital Health Passport #${animalTag} created.`,
      request: newRequest,
      animal: newAnimal
    });

  } catch (error) {
    console.error("Error creating vet request:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
