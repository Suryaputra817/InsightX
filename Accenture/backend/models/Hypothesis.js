const mongoose = require('mongoose');

const HypothesisSchema = new mongoose.Schema({
  investigationId: { type: String, required: true },
  title: { type: String, required: true },
  confidence: { type: Number, required: true }, // e.g. 87
  causalStatus: { 
    type: String, 
    enum: ['SUPPORTED', 'CORRELATED', 'CONTRADICTED', 'INSUFFICIENT_EVIDENCE', 'CAUSALITY_NOT_ESTABLISHED'],
    default: 'INSUFFICIENT_EVIDENCE'
  },
  supportingEvidence: [{ type: String }], // Array of Evidence ID or finding text
  contradictingEvidence: [{ type: String }],
  alternatives: { type: String },
  causalWarning: { type: String }
});

module.exports = mongoose.model('Hypothesis', HypothesisSchema);
