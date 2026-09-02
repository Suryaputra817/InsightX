const Metric = require('../models/Metric');

class AnomalyService {
  async detectAnomaly(metricId) {
    const metric = await Metric.findById(metricId);
    if (!metric) {
      throw new Error(`Metric not found: ${metricId}`);
    }

    const expected = metric.expectedValue;
    const actual = metric.actualValue;
    const variance = actual - expected;
    const percentageChange = (variance / expected) * 100;

    // A simple threshold: if deviation is > 5%, it's abnormal
    const isAnomaly = Math.abs(percentageChange) > 5.0;

    return {
      metricId: metric._id.toString(),
      name: metric.name,
      expectedValue: expected,
      actualValue: actual,
      variance,
      percentageChange,
      isAnomaly,
      severity: Math.abs(percentageChange) > 15.0 ? 'HIGH' : (Math.abs(percentageChange) > 8.0 ? 'HIGH' : 'MEDIUM')
    };
  }
}

module.exports = new AnomalyService();
