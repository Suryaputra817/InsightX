const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expectedValue: { type: Number, required: true },
  actualValue: { type: Number, required: true },
  change: { type: Number, required: true },
  currency: { type: String, default: '₹' },
  unit: { type: String, default: 'M' },
  timestamp: { type: Date, default: Date.now },
  trendData: [{
    name: String,
    expected: Number,
    actual: Number
  }]
});

module.exports = mongoose.model('Metric', MetricSchema);
