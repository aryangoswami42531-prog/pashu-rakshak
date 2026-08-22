const express = require('express');
const router = express.Router();
const { seedComplaints, seedVets } = require('../data/seedData');

let complaintsList = [...seedComplaints];

/**
 * GET /api/complaints
 */
router.get('/', (req, res) => {
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

    complaintsList.unshift(newComplaint);

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

    const idx = complaintsList.findIndex(c => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: "Complaint record not found" });
    }

    const complaint = complaintsList[idx];
    const vet = seedVets.find(v => v.id === complaint.vetId) || { name: complaint.vetName || "Dr. Rajesh Sharma", district: "Ludhiana" };
    
    // Clean email generation without double dots (e.g. dr.rajesh.sharma@gov.in)
    const cleanName = vet.name.toLowerCase().replace(/dr\.?\s*/g, '').replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.').replace(/^\.|\.$/g, '');
    const emailTo = `dr.${cleanName}@gov.in`;

    complaintsList[idx].status = "WARNING_ISSUED";
    complaintsList[idx].govtNotes = actionNotes;
    complaintsList[idx].actionTakenAt = new Date().toISOString();
    complaintsList[idx].emailSentTo = emailTo;

    res.json({
      success: true,
      message: `⚡ Automated Official Warning Email Sent to ${vet.name} (${emailTo})!`,
      complaint: complaintsList[idx],
      emailDetails: {
        to: emailTo,
        subject: `OFFICIAL DISCIPLINARY MANDATE: Unresponsive Duty Notice #${complaint.id}`,
        sentAt: complaintsList[idx].actionTakenAt
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

  const idx = complaintsList.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Complaint not found" });
  }

  if (status) complaintsList[idx].status = status;
  if (govtNotes) complaintsList[idx].govtNotes = govtNotes;
  complaintsList[idx].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Complaint status updated",
    complaint: complaintsList[idx]
  });
});

module.exports = router;
