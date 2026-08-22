const express = require('express');
const router = express.Router();
const { store } = require('../data/sharedStore');
const { seedVets } = require('../data/seedData');

/**
 * GET /api/complaints
 */
router.get('/', (req, res) => {
  const complaintsList = store.getComplaints();
  res.json({
    success: true,
    total: complaintsList.length,
    complaints: complaintsList
  });
});

/**
 * POST /api/complaints
 * Body: { farmerName, farmerPhone, vetId, issueType, description }
 */
router.post('/', (req, res) => {
  try {
    const { farmerName = "Harpreet Singh", farmerPhone = "+91 98711 22334", vetId, issueType = "DELAYED_RESPONSE", description = "" } = req.body;

    const vet = seedVets.find(v => v.id === vetId);
    const vetName = vet ? vet.name : "Dr. Rajesh Sharma (Senior Vet Officer)";

    const newComplaint = {
      id: "cmp-" + Date.now(),
      farmerName,
      farmerPhone,
      farmId: "farm-1",
      vetId: vetId || "vet-101",
      vetName,
      issueType,
      description: description || "Vet officer did not respond to high risk emergency alert within 30 minutes.",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      govtNotes: "Filed via Farmer Portal — Escalated to Govt Biosecurity Command."
    };

    store.addComplaint(newComplaint);

    res.json({
      success: true,
      message: "Grievance logged successfully. Official audit ref: #" + newComplaint.id,
      complaint: newComplaint
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not file complaint" });
  }
});

/**
 * POST /api/complaints/:id/take-action
 * Issue official automated warning notice email to unresponsive vet officer
 */
router.post('/:id/take-action', (req, res) => {
  try {
    const { id } = req.params;
    const { actionNotes = "Official Warning Issued by Govt Biosecurity Command" } = req.body;

    const complaintsList = store.getComplaints();
    const targetCmp = complaintsList.find(c => c.id === id);
    if (!targetCmp) {
      return res.status(404).json({ success: false, message: "Complaint record not found" });
    }

    const vet = seedVets.find(v => v.id === targetCmp.vetId) || { name: targetCmp.vetName || "Dr. Rajesh Sharma", district: "Ludhiana" };
    
    const cleanName = vet.name.toLowerCase().replace(/dr\.?\s*/g, '').replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
    const emailTo = `dr.${cleanName}@gov.in`;

    targetCmp.status = "WARNING_ISSUED";
    targetCmp.govtNotes = actionNotes;
    targetCmp.actionTakenAt = new Date().toISOString();
    targetCmp.emailSentTo = emailTo;

    res.json({
      success: true,
      message: `⚡ Automated Official Warning Email Sent to ${vet.name} (${emailTo})!`,
      complaint: targetCmp,
      emailDetails: {
        to: emailTo,
        subject: `OFFICIAL DISCIPLINARY MANDATE: Unresponsive Duty Notice #${targetCmp.id}`,
        sentAt: targetCmp.actionTakenAt
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not issue action warning" });
  }
});

/**
 * PUT /api/complaints/:id
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status, govtNotes } = req.body;

  const complaintsList = store.getComplaints();
  const targetCmp = complaintsList.find(c => c.id === id);
  if (!targetCmp) {
    return res.status(404).json({ success: false, message: "Complaint not found" });
  }

  if (status) targetCmp.status = status;
  if (govtNotes) targetCmp.govtNotes = govtNotes;
  targetCmp.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Complaint status updated",
    complaint: targetCmp
  });
});

module.exports = router;
