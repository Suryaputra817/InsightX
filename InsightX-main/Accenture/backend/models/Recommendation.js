const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  investigationId: { type: String, required: true },
  title: { type: String, required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  confidence: { type: Number, required: true },
  owner: { type: String, required: true },
  reason: { type: String, required: true }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
