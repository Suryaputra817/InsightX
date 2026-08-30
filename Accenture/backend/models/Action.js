const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  recommendationId: { type: String, required: true },
  title: { type: String, required: true },
  owner: { type: String, required: true },
  priority: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['OPEN', 'INVESTIGATING', 'RESOLVED'], 
    default: 'OPEN' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Action', ActionSchema);
