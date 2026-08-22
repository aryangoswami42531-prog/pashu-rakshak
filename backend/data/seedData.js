const crypto = require('crypto');

function generateHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data) + Date.now().toString()).digest('hex');
}

const seedVets = [
  {
    id: "vet-101",
    name: "Dr. Rajesh Sharma",
    qualification: "B.V.Sc & A.H., M.V.Sc (Veterinary Epidemiology)",
    designation: "Senior District Veterinary Officer",
    phone: "+91 98765 43210",
    email: "dr.rajesh.sharma@gov.in",
    district: "Ludhiana",
    state: "Punjab",
    location: { lat: 30.9010, lng: 75.8573 },
    address: "Civil Veterinary Hospital, Ferozepur Road, Ludhiana",
    status: "AVAILABLE",
    assignedRadiusKm: 25,
    rating: 4.9,
    completedVisits: 142,
    avgResponseMinutes: 18,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "vet-102",
    name: "Dr. Sunita Verma",
    qualification: "B.V.Sc, M.V.Sc (Virology)",
    designation: "Block Veterinary Extension Officer",
    phone: "+91 98123 87654",
    email: "dr.sunita.verma@gov.in",
    district: "Karnal",
    state: "Haryana",
    location: { lat: 29.6857, lng: 76.9905 },
    address: "Veterinary Polyclinic, Sector 12, Karnal",
    status: "ON_FIELD",
    assignedRadiusKm: 20,
    rating: 4.8,
    completedVisits: 98,
    avgResponseMinutes: 22,
    avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78036?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "vet-103",
    name: "Dr. Anil Kumar Patel",
    qualification: "B.V.Sc & A.H.",
    designation: "Mobile Veterinary Unit Lead",
    phone: "+91 94567 12345",
    email: "dr.anil.patel@gov.in",
    district: "Anand",
    state: "Gujarat",
    location: { lat: 22.5645, lng: 72.9289 },
    address: "NDDB Campus Road, Anand",
    status: "AVAILABLE",
    assignedRadiusKm: 30,
    rating: 4.7,
    completedVisits: 210,
    avgResponseMinutes: 15,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "vet-104",
    name: "Dr. Meenakshi Sundaram",
    qualification: "B.V.Sc, Ph.D. (Livestock Health)",
    designation: "Regional Biosecurity Inspector",
    phone: "+91 97890 65432",
    email: "dr.meenakshi.sundaram@gov.in",
    district: "Pune",
    state: "Maharashtra",
    location: { lat: 18.5204, lng: 73.8567 },
    address: "Animal Husbandry Dept Complex, Pune",
    status: "AVAILABLE",
    assignedRadiusKm: 35,
    rating: 4.9,
    completedVisits: 175,
    avgResponseMinutes: 20,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
  }
];

const seedFarms = [
  {
    id: "farm-1",
    name: "Green Pastures Dairy & Livestock",
    ownerName: "Harpreet Singh",
    phone: "+91 98711 22334",
    village: "Jagraon",
    district: "Ludhiana",
    state: "Punjab",
    location: { lat: 30.8920, lng: 75.8450 },
    totalAnimals: 18,
    biosecurityScore: 88,
    lastInspection: "2026-08-10"
  },
  {
    id: "farm-2",
    name: "Shree Krishna Cattle Farm",
    ownerName: "Rameshwar Yadav",
    phone: "+91 98222 33445",
    village: "Gharaunda",
    district: "Karnal",
    state: "Haryana",
    location: { lat: 29.6900, lng: 77.0010 },
    totalAnimals: 24,
    biosecurityScore: 72,
    lastInspection: "2026-08-05"
  },
  {
    id: "farm-3",
    name: "Amulya Poultry & Hatcheries",
    ownerName: "Bhavesh Patel",
    phone: "+91 94111 99887",
    village: "Mogri",
    district: "Anand",
    state: "Gujarat",
    location: { lat: 22.5500, lng: 72.9150 },
    totalAnimals: 450,
    biosecurityScore: 94,
    lastInspection: "2026-08-15"
  }
];

const seedAnimals = [
  {
    id: "anim-101",
    farmId: "farm-1",
    tagNumber: "IN-PB-2024-8841",
    species: "Cattle",
    breed: "Holstein Friesian Cross",
    ageMonths: 36,
    gender: "Female",
    healthStatus: "HEALTHY",
    vaccinations: [
      {
        vaccineName: "FMD Dual Antigen",
        batchNumber: "FMD-2026-0491",
        administeredDate: "2026-03-15",
        nextDueDate: "2026-09-15",
        administeredBy: "Dr. Rajesh Sharma",
        recordHash: "a7d9f21b8c6e4a3b1d9e7f5c3a1b9d8e7f5c3a1b9d8e7f5c3a1b9d8e7f5c3a1b"
      },
      {
        vaccineName: "Lumpy Skin Disease (Lumpy-Provac)",
        batchNumber: "LSD-2025-9921",
        administeredDate: "2025-11-10",
        nextDueDate: "2026-11-10",
        administeredBy: "Dr. Rajesh Sharma",
        recordHash: "f3c2b1a9d8e7f6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1"
      }
    ],
    medicalHistory: [
      {
        date: "2026-05-20",
        condition: "Mild Mastitis",
        treatment: "Ceftiofur Sodium intramammary infusion + Anti-inflammatory",
        vetName: "Dr. Rajesh Sharma",
        status: "RESOLVED"
      }
    ]
  },
  {
    id: "anim-102",
    farmId: "farm-1",
    tagNumber: "IN-PB-2024-8842",
    species: "Cattle",
    breed: "Sahiwal Purebred",
    ageMonths: 48,
    gender: "Female",
    healthStatus: "SUSPECTED",
    vaccinations: [
      {
        vaccineName: "FMD Dual Antigen",
        batchNumber: "FMD-2026-0491",
        administeredDate: "2026-03-15",
        nextDueDate: "2026-09-15",
        administeredBy: "Dr. Rajesh Sharma",
        recordHash: "e5f4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4"
      }
    ],
    medicalHistory: [
      {
        date: "2026-08-18",
        condition: "Nodular Skin Lesions & High Fever (40.5°C)",
        treatment: "Isolated from herd. Awaiting diagnostic sample confirmation.",
        vetName: "Dr. Rajesh Sharma",
        status: "UNDER_OBSERVATION"
      }
    ]
  },
  {
    id: "anim-103",
    farmId: "farm-2",
    tagNumber: "IN-HR-2025-1109",
    species: "Buffalo",
    breed: "Murrah",
    ageMonths: 52,
    gender: "Female",
    healthStatus: "HEALTHY",
    vaccinations: [
      {
        vaccineName: "Haemorrhagic Septicaemia (HS)",
        batchNumber: "HS-2026-0012",
        administeredDate: "2026-06-01",
        nextDueDate: "2027-06-01",
        administeredBy: "Dr. Sunita Verma",
        recordHash: "b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7"
      }
    ],
    medicalHistory: []
  },
  {
    id: "anim-104",
    farmId: "farm-3",
    tagNumber: "IN-GJ-BATCH-402",
    species: "Poultry",
    breed: "BV-300 Layer",
    ageMonths: 8,
    gender: "Female",
    healthStatus: "HEALTHY",
    vaccinations: [
      {
        vaccineName: "Ranikhet Disease (LaSota)",
        batchNumber: "RD-2026-880",
        administeredDate: "2026-02-10",
        nextDueDate: "2026-08-10",
        administeredBy: "Dr. Anil Kumar Patel",
        recordHash: "c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2"
      }
    ],
    medicalHistory: []
  }
];

const seedVetRequests = [
  {
    id: "req-500",
    farmId: "farm-1",
    farmerName: "Gurpreet Singh",
    farmerPhone: "+91 98144 55667",
    farmLocation: { lat: 30.8950, lng: 75.8490 },
    animalTag: "IN-PB-2024-8811",
    species: "Cattle",
    symptoms: ["Mild fever", "Udder swelling"],
    aiRiskLevel: "MEDIUM",
    suspectedDisease: "Bovine Mastitis",
    requestedVetId: "vet-101",
    requestedVetName: "Dr. Rajesh Sharma",
    status: "COMPLETED",
    urgency: "MEDIUM",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    notes: "Clinical inspection completed. Intramammary antibiotic administered."
  },
  {
    id: "req-499",
    farmId: "farm-1",
    farmerName: "Jaswinder Kaur",
    farmerPhone: "+91 98722 11223",
    farmLocation: { lat: 30.8880, lng: 75.8390 },
    animalTag: "IN-PB-2024-7720",
    species: "Cattle",
    symptoms: ["Skin lumps", "Fever"],
    aiRiskLevel: "HIGH",
    suspectedDisease: "Lumpy Skin Disease (LSD)",
    requestedVetId: "vet-101",
    requestedVetName: "Dr. Rajesh Sharma",
    status: "COMPLETED",
    urgency: "HIGH",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    notes: "Ring vaccination completed. Quarantined."
  },
  {
    id: "req-501",
    farmId: "farm-1",
    farmerName: "Harpreet Singh",
    farmerPhone: "+91 98711 22334",
    farmLocation: { lat: 30.8920, lng: 75.8450 },
    animalTag: "IN-PB-2024-8842",
    species: "Cattle",
    symptoms: ["Skin nodules/lumps", "High fever (40°C+)", "Loss of appetite", "Reduced milk production"],
    aiRiskLevel: "HIGH",
    suspectedDisease: "Lumpy Skin Disease (LSD)",
    requestedVetId: "vet-101",
    requestedVetName: "Dr. Rajesh Sharma",
    status: "PENDING",
    urgency: "CRITICAL",
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    notes: "Cow has suddenly developed firm raised lumps all over skin. Isolated in back shed."
  },
  {
    id: "req-502",
    farmId: "farm-2",
    farmerName: "Rameshwar Yadav",
    farmerPhone: "+91 98222 33445",
    farmLocation: { lat: 29.6900, lng: 77.0010 },
    animalTag: "IN-HR-2025-1109",
    species: "Buffalo",
    symptoms: ["Excessive drooling/salivation", "Limping / Foot lesions"],
    aiRiskLevel: "MEDIUM",
    suspectedDisease: "Foot & Mouth Disease (FMD)",
    requestedVetId: "vet-102",
    requestedVetName: "Dr. Sunita Verma",
    status: "ACCEPTED",
    urgency: "HIGH",
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    notes: "Vets estimated arrival in 15 mins."
  }
];

const seedOutbreaks = [
  {
    id: "outbreak-1",
    diseaseName: "Lumpy Skin Disease (LSD)",
    affectedSpecies: "Cattle / Buffalo",
    severity: "HIGH",
    district: "Ludhiana",
    state: "Punjab",
    centerLocation: { lat: 30.9000, lng: 75.8500 },
    radiusKm: 15,
    confirmedCases: 42,
    suspectedCases: 18,
    quarantineStatus: "CONTAINMENT_ZONE_ACTIVE",
    reportedDate: "2026-08-12",
    lastUpdated: "2026-08-19"
  },
  {
    id: "outbreak-2",
    diseaseName: "Foot & Mouth Disease (FMD)",
    affectedSpecies: "Cattle / Sheep / Swine",
    severity: "MEDIUM",
    district: "Karnal",
    state: "Haryana",
    centerLocation: { lat: 29.6800, lng: 76.9900 },
    radiusKm: 10,
    confirmedCases: 14,
    suspectedCases: 9,
    quarantineStatus: "RING_VACCINATION_IN_PROGRESS",
    reportedDate: "2026-08-14",
    lastUpdated: "2026-08-18"
  }
];

const seedAlerts = [
  {
    id: "alert-901",
    title: "BIOSECURITY NOTICE: Lumpy Skin Outbreak in 15km Radius",
    message: "Confirmed LSD cases detected in Ludhiana rural belt. Restrict cattle movement, apply ectoparasite repellents, and report nodular skin lesions immediately.",
    district: "Ludhiana",
    radiusKm: 15,
    severity: "HIGH",
    issuedBy: "Govt Biosecurity Command",
    timestamp: "2026-08-19T08:00:00.000Z"
  }
];

const seedGeoAlerts = [...seedAlerts];

const seedComplaints = [
  {
    id: "cmp-1787172189974",
    vetId: "vet-101",
    vetName: "Dr. Rajesh Sharma",
    farmerName: "Harpreet Singh",
    farmerPhone: "+91 98711 22334",
    description: "Dr. Rajesh Sharma did not arrive at farm node despite critical lumpy skin outbreak alert. High-risk contagion spreading in cattle shed.",
    status: "PENDING",
    createdAt: "2026-08-19T10:15:00.000Z"
  }
];

module.exports = {
  seedVets,
  seedFarms,
  seedAnimals,
  seedVetRequests,
  seedOutbreaks,
  seedAlerts,
  seedGeoAlerts,
  seedComplaints,
  generateHash
};
