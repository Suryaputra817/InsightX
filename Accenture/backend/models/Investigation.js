const mongoose = require('mongoose');

const InvestigationSchema = new mongoose.Schema({
  metricId: { type: String, required: true },
  name: { type: String, required: true },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  status: { type: String, enum: ['DETECTED', 'INVESTIGATING', 'COMPLETED'], default: 'DETECTED' },
  expectedValue: { type: Number, required: true },
  actualValue: { type: Number, required: true },
  change: { type: Number, required: true },
  affectedDimensions: { type: mongoose.Schema.Types.Mixed, default: {} }, // { region: [...], customer: [...] }
  confidence: { type: Number, default: 0 },
  detectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investigation', InvestigationSchema);
