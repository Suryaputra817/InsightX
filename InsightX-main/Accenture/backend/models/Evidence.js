const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  investigationId: { type: String, required: true },
  source: { type: String, required: true }, // LOGISTICS, CRM, etc.
  finding: { type: String, required: true },
  value: { type: String, required: true },
  reliability: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  relatedHypotheses: [{ type: String }]
});

module.exports = mongoose.model('Evidence', EvidenceSchema);
