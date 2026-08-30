const mongoose = require('mongoose');
const Metric = require('../models/Metric');
const Investigation = require('../models/Investigation');
const memoryDb = require('../utils/memoryDb');

exports.getDashboardData = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    let primaryMetric;
    let investigations;

    if (isDbConnected) {
      primaryMetric = await Metric.findOne({ name: "Revenue" });
      investigations = await Investigation.find({ status: { $ne: 'COMPLETED' } }).limit(5);
    } else {
      console.log("Mongoose disconnected. Using memoryDb for dashboard data.");
      primaryMetric = memoryDb.getMetricByName("Revenue");
      investigations = memoryDb.getInvestigations().filter(i => i.status !== 'COMPLETED');
    }

    const otherKPIs = [
      { name: "Orders", actual: "184K", change: 2.4, status: "up" },
      { name: "Customers", actual: "92.4K", change: -1.8, status: "down" },
      { name: "Conversion Rate", actual: "3.82%", change: 0.15, status: "up" },
      { name: "Complaints", actual: "1,240", change: 18.2, status: "down-bad" }
    ];

    res.json({
      success: true,
      data: {
        primaryMetric: primaryMetric || {
          name: "Revenue",
          expectedValue: 46.6,
          actualValue: 42.8,
          change: -8.2,
          currency: "₹",
          unit: "M",
          trendData: []
        },
        otherKPIs,
        activeInvestigations: investigations
      }
    });
  } catch (error) {
    next(error);
  }
};
