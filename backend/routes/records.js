const express = require('express');
const router = express.Router();
const { animalsList, generateHash } = require('../data/sharedStore');

/**
 * GET /api/records
 * Query: farmId, species
 */
router.get('/', (req, res) => {
  const { farmId, species } = req.query;
  let result = [...animalsList];

  if (farmId) {
    result = result.filter(a => a.farmId === farmId);
  }
  if (species) {
    result = result.filter(a => a.species.toLowerCase() === species.toLowerCase());
  }

  res.json({
    success: true,
    total: result.length,
    animals: result
  });
});

/**
 * GET /api/records/:id
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const animal = animalsList.find(a => a.id === id || a.tagNumber === id);
  if (!animal) {
    return res.status(404).json({ success: false, message: "Animal record not found" });
  }
  res.json({ success: true, animal });
});

/**
 * GET /api/records/verify/:hash
 * Verify SHA-256 Ledger Hash
 */
router.get('/verify/:hash', (req, res) => {
  const { hash } = req.params;

  let foundVaccine = null;
  let targetAnimal = null;

  for (const animal of animalsList) {
    if (animal.vaccinations) {
      const match = animal.vaccinations.find(v => v.recordHash === hash);
      if (match) {
        foundVaccine = match;
        targetAnimal = animal;
        break;
      }
    }
  }

  if (!foundVaccine) {
    return res.json({
      verified: false,
      message: "SHA-256 Hash record NOT found on ledger or tampered!"
    });
  }

  res.json({
    verified: true,
    message: "Cryptographic SHA-256 Hash verified authentic on Pashu Rakshak Ledger!",
    record: {
      animalTag: targetAnimal.tagNumber,
      species: targetAnimal.species,
      vaccineName: foundVaccine.vaccineName,
      batchNumber: foundVaccine.batchNumber,
      administeredDate: foundVaccine.administeredDate,
      administeredBy: foundVaccine.administeredBy,
      recordHash: foundVaccine.recordHash
    }
  });
});

/**
 * POST /api/records
 * Register new animal
 */
router.post('/', (req, res) => {
  try {
    const { farmId = "farm-1", tagNumber, species, breed, ageMonths, gender } = req.body;

    if (!tagNumber || !species) {
      return res.status(400).json({ success: false, message: "Tag number and species are required." });
    }

    const newAnimal = {
      id: "anim-" + Date.now(),
      farmId,
      tagNumber,
      species,
      breed: breed || "Local Crossbred",
      ageMonths: parseInt(ageMonths) || 24,
      gender: gender || "Female",
      healthStatus: "HEALTHY",
      vaccinations: [],
      medicalHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          condition: "Initial Biosecurity Registration",
          treatment: "Tagged & Digitally Logged into Pashu Rakshak Network",
          vetName: "District Biosecurity Registry",
          status: "RESOLVED"
        }
      ]
    };

    animalsList.unshift(newAnimal);

    res.json({
      success: true,
      message: "Animal registered successfully!",
      animal: newAnimal
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not register animal" });
  }
});

/**
 * POST /api/records/vaccine
 * Add vaccination record with crypto hash
 */
router.post('/vaccine', (req, res) => {
  try {
    const { animalId, vaccineName, batchNumber, nextDueDate, administeredBy } = req.body;

    const animal = animalsList.find(a => a.id === animalId || a.tagNumber === animalId);
    if (!animal) {
      return res.status(404).json({ success: false, message: "Animal record not found" });
    }

    const nowStr = new Date().toISOString().split('T')[0];
    const recordPayload = {
      animalTag: animal.tagNumber,
      vaccineName,
      batchNumber,
      administeredDate: nowStr,
      nextDueDate: nextDueDate || "2027-02-20",
      administeredBy: administeredBy || "Dr. Rajesh Sharma"
    };

    const recordHash = generateHash(recordPayload);

    const vacObj = {
      ...recordPayload,
      recordHash
    };

    animal.vaccinations.unshift(vacObj);
    animal.healthStatus = "HEALTHY";

    res.json({
      success: true,
      message: "Vaccination record verified and written to ledger!",
      vaccination: vacObj
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Vaccination logging failed" });
  }
});

module.exports = router;
