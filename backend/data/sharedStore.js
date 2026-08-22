const { seedVets, seedVetRequests, seedAnimals, seedOutbreaks, generateHash } = require('./seedData');

// Unified single in-memory store shared across all API routes (records, vets, ai, outbreaks)
const vetsList = [...seedVets];
const requestsList = [...seedVetRequests];
const animalsList = [...seedAnimals];
const outbreaksList = [...seedOutbreaks];

module.exports = {
  vetsList,
  requestsList,
  animalsList,
  outbreaksList,
  generateHash
};
