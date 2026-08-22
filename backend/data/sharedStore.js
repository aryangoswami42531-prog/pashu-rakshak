const store = require('./store');

module.exports = {
  vetsList: store.getVets(),
  requestsList: store.getRequests(),
  animalsList: store.getAnimals(),
  outbreaksList: store.getOutbreaks(),
  complaintsList: store.getComplaints(),
  store,
  generateHash: store.generateHash
};
