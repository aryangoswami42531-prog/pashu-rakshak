const store = require('./store');

module.exports = {
  get vetsList() { return store.getVets(); },
  get requestsList() { return store.getRequests(); },
  get animalsList() { return store.getAnimals(); },
  get outbreaksList() { return store.getOutbreaks(); },
  get complaintsList() { return store.getComplaints(); },
  store,
  generateHash: store.generateHash
};
