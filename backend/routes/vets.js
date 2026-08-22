const express = require('express');
const router = express.Router();
const { vetsList, requestsList, animalsList, outbreaksList, generateHash } = require('../data/sharedStore');

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
 * Returns all active & completed farmer vet dispatch requests
 */
router.get('/requests', (req, res) => {
  res.json({
    success: true,
    total: requestsList.length,
    requests: requestsList
  });
});

/**
 * PUT /api/vets/requests/:id
 * Update request status (e.g. ACCEPTED, ON_WAY, COMPLETED)
 */
router.put('/requests/:id', (req, res) => {
  const reqId = req.params.id;
  const { status, etaMinutes } = req.body;
  const targetReq = requestsList.find(r => r.id === reqId);
  
  if (targetReq) {
    targetReq.status = status || targetReq.status;
    if (etaMinutes) targetReq.etaMinutes = etaMinutes;
    return res.json({
      success: true,
      message: `Request ${reqId} status updated to ${targetReq.status}`,
      request: targetReq
    });
  }
  res.status(404).json({ success: false, message: "Request not found" });
});

/**
 * POST /api/vets/visit-report
 * Vet logs field inspection & diagnosis -> Marks request as COMPLETED & REMOVES Red Spot from Govt Map
 */
router.post('/visit-report', (req, res) => {
  try {
    const { requestId, animalTag, diagnosis, treatmentAdministered, vaccineGiven, batchNumber, followUpDate, vetName } = req.body;
    
    // Find target request and mark status as COMPLETED
    const targetReq = requestsList.find(r => r.id === requestId || r.animalTag === animalTag);
    if (targetReq) {
      targetReq.status = "COMPLETED";
      targetReq.completedAt = new Date().toISOString();
      targetReq.inspectionLog = {
        diagnosis,
        treatmentAdministered,
        vaccineGiven,
        batchNumber,
        followUpDate,
        vetName: vetName || "Dr. Rajesh Sharma"
      };

      // REMOVE ANY RED SPOT OUTBREAK AT THIS LOCATION OR FOR THIS CASE!
      if (targetReq.farmLocation) {
        const targetLat = targetReq.farmLocation.lat;
        const targetLng = targetReq.farmLocation.lng;

        // Filter out any seed/active outbreak spot within 35km radius of this inspected farm
        for (let i = outbreaksList.length - 1; i >= 0; i--) {
          const ob = outbreaksList[i];
          const obLat = ob.centerLocation ? ob.centerLocation.lat : (ob.lat || 30.9000);
          const obLng = ob.centerLocation ? ob.centerLocation.lng : (ob.lng || 75.8500);
          const dist = calculateDistance(targetLat, targetLng, obLat, obLng);
          if (dist < 35 || ob.district === targetReq.village || ob.id === `farmer-spot-${requestId}`) {
            outbreaksList.splice(i, 1);
          }
        }
      }
    }

    // Also remove from outbreaksList if matching by ID directly
    for (let i = outbreaksList.length - 1; i >= 0; i--) {
      if (outbreaksList[i].id === `farmer-spot-${requestId}` || outbreaksList[i].requestId === requestId) {
        outbreaksList.splice(i, 1);
      }
    }

    // If no specific request, remove all outbreaks at default coordinates (e.g. Ludhiana demo spot)
    if (!targetReq && outbreaksList.length > 0) {
      outbreaksList.shift();
    }

    // Also update matching animal health record status
    const targetAnimal = animalsList.find(a => a.tagNumber === animalTag);
    if (targetAnimal) {
      targetAnimal.status = "VERIFIED_PASSPORT";
      if (!targetAnimal.medicalHistory) targetAnimal.medicalHistory = [];
      targetAnimal.medicalHistory.unshift({
        date: new Date().toISOString().split('T')[0],
        diagnosis: diagnosis || "Clinical Field Inspection Complete",
        vetName: vetName || "Dr. Rajesh Sharma",
        prescriptions: [treatmentAdministered || "Standard Biosecurity Vaccine"],
        remarks: "Field Inspection & Clinical Diagnosis Completed. Case Resolved."
      });
    }

    res.json({
      success: true,
      message: `Field Inspection & Diagnosis Logged! Red Spot removed from Govt Map for Case #${animalTag || requestId}.`,
      request: targetReq
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
      },
      {
        id: "vet-local-103",
        name: "Dr. Anil Kumar Patel",
        qualification: "B.V.Sc & A.H.",
        designation: "Mobile Veterinary Emergency Unit Lead",
        phone: "+91 94567 12345",
        email: "dr.anil.patel@gov.in",
        district: "District Biosecurity Center",
        state: "State Animal Husbandry Dept",
        location: { lat: userLat + 0.028, lng: userLng - 0.019 },
        address: "Mobile Emergency Vet Command Unit",
        status: "AVAILABLE",
        assignedRadiusKm: 30,
        rating: 4.7,
        completedVisits: 210,
        avgResponseMinutes: 15,
        avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
        distanceKm: calculateDistance(userLat, userLng, userLat + 0.028, userLng - 0.019)
      },
      {
        id: "vet-local-104",
        name: "Dr. Harish Chandra",
        qualification: "B.V.Sc & A.H., M.V.Sc (Surgery)",
        designation: "Assistant Director Veterinary Services",
        phone: "+91 97890 54321",
        email: "dr.harish.chandra@gov.in",
        district: "District Biosecurity Center",
        state: "State Animal Husbandry Dept",
        location: { lat: userLat - 0.035, lng: userLng - 0.028 },
        address: "Regional Veterinary Hospital",
        status: "AVAILABLE",
        assignedRadiusKm: 35,
        rating: 4.9,
        completedVisits: 176,
        avgResponseMinutes: 20,
        avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80",
        distanceKm: calculateDistance(userLat, userLng, userLat - 0.035, userLng - 0.028)
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
      // Find nearest available vet
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

    requestsList.unshift(newRequest);

    // Automatically create animal health record in animalsList awaiting vet visit
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

    animalsList.unshift(newAnimal);

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
