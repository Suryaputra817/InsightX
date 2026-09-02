const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Metric = require('./models/Metric');
const Investigation = require('./models/Investigation');
const Evidence = require('./models/Evidence');
const Hypothesis = require('./models/Hypothesis');
const Recommendation = require('./models/Recommendation');
const Action = require('./models/Action');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/insightx';

const seedData = {
  metric: {
    name: "Revenue",
    expectedValue: 46.6,
    actualValue: 42.8,
    change: -8.2,
    currency: "₹",
    unit: "M",
    timestamp: new Date("2026-08-24T00:00:00Z"),
    trendData: [
      { name: "Week 1", expected: 42.0, actual: 42.2 },
      { name: "Week 2", expected: 43.0, actual: 43.1 },
      { name: "Week 3", expected: 44.5, actual: 44.6 },
      { name: "Week 4", expected: 45.0, actual: 45.2 },
      { name: "Week 5", expected: 46.0, actual: 45.9 },
      { name: "Week 6 (Current)", expected: 46.6, actual: 42.8 }
    ]
  },
  otherKPIs: [
    { name: "Orders", actual: "184K", change: 2.4, status: "up" },
    { name: "Customers", actual: "92.4K", change: -1.8, status: "down" },
    { name: "Conversion Rate", actual: "3.82%", change: 0.15, status: "up" },
    { name: "Complaints", actual: "1,240", change: 18.2, status: "down-bad" }
  ],
  dimensions: {
    region: [
      { name: "North", change: -17.4, contribution: -3.0 },
      { name: "South", change: -3.1, contribution: -0.5 },
      { name: "East", change: 1.2, contribution: 0.2 },
      { name: "West", change: -2.8, contribution: -0.5 }
    ],
    customer: [
      { name: "Enterprise", change: -23.1, contribution: -3.2 },
      { name: "SMB", change: -5.4, contribution: -0.7 },
      { name: "Consumer", change: 1.2, contribution: 0.1 }
    ],
    product: [
      { name: "Product A", change: -21.0, contribution: -2.8 },
      { name: "Product B", change: -3.0, contribution: -0.4 },
      { name: "Product C", change: 2.0, contribution: 0.4 }
    ]
  },
  evidence: [
    {
      source: "LOGISTICS",
      finding: "Delivery delays increased 31% overall.",
      value: "+31%",
      reliability: 95,
      timestamp: new Date("2026-08-23T14:30:00Z"),
      relatedHypotheses: ["Logistics disruption"]
    },
    {
      source: "LOGISTICS",
      finding: "North-region delivery delays soared by 44%.",
      value: "+44%",
      reliability: 94,
      timestamp: new Date("2026-08-23T16:00:00Z"),
      relatedHypotheses: ["Logistics disruption"]
    },
    {
      source: "LOGISTICS",
      finding: "Enterprise customer delayed orders increased by 39%.",
      value: "+39%",
      reliability: 92,
      timestamp: new Date("2026-08-24T09:15:00Z"),
      relatedHypotheses: ["Logistics disruption"]
    },
    {
      source: "CRM",
      finding: "Delivery-related complaints increased by 27%.",
      value: "+27%",
      reliability: 91,
      timestamp: new Date("2026-08-24T10:30:00Z"),
      relatedHypotheses: ["Logistics disruption"]
    },
    {
      source: "MARKET INTELLIGENCE",
      finding: "Competitor enterprise pricing decreased by 12% in key products.",
      value: "-12%",
      reliability: 68,
      timestamp: new Date("2026-08-22T11:00:00Z"),
      relatedHypotheses: ["Competitor pricing pressure"]
    },
    {
      source: "SALES",
      finding: "Sales team performance dashboard shows normal variance with no strong evidence of decline.",
      value: "0% deviation",
      reliability: 89,
      timestamp: new Date("2026-08-24T08:00:00Z"),
      relatedHypotheses: ["Sales performance"]
    }
  ],
  hypotheses: [
    {
      title: "Logistics disruption in North region",
      confidence: 87,
      causalStatus: "SUPPORTED",
      supportingEvidence: ["Delivery delays increased 31% overall.", "North-region delivery delays soared by 44%.", "Enterprise customer delayed orders increased by 39%.", "Delivery-related complaints increased by 27%."],
      contradictingEvidence: [],
      alternatives: "Temporary regional demand fluctuation.",
      causalWarning: "Evidence strongly supports logistics disruption as a likely contributor, but observational data does not establish experimental causality."
    },
    {
      title: "Competitor pricing pressure on Enterprise segment",
      confidence: 54,
      causalStatus: "CORRELATED",
      supportingEvidence: ["Competitor enterprise pricing decreased by 12% in key products."],
      contradictingEvidence: ["Revenue decline is highly concentrated in North-region logistics-affected customers, whereas competitor price drop was nationwide."],
      alternatives: "Product feature gap.",
      causalWarning: "Correlation identified. Price reduction matches segment, but geographic concentration suggests this is secondary."
    },
    {
      title: "Sales team underperformance",
      confidence: 29,
      causalStatus: "INSUFFICIENT_EVIDENCE",
      supportingEvidence: [],
      contradictingEvidence: ["Sales team performance dashboard shows normal variance with no strong evidence of decline."],
      alternatives: "Changes in commission structure or sales churn (not observed).",
      causalWarning: "No data supports sales team performance issues as a cause."
    }
  ],
  recommendations: [
    {
      title: "Investigate North-region logistics partners and prioritize delayed enterprise orders.",
      priority: "CRITICAL",
      confidence: 82,
      owner: "Operations",
      reason: "Delivery delays increased 31%, North-region delays increased 44%, and enterprise delayed orders increased 39%."
    },
    {
      title: "Establish temporary customer-success outreach for affected Enterprise clients in North.",
      priority: "HIGH",
      confidence: 75,
      owner: "Customer Success",
      reason: "Enterprise complaints have surged 27% following delivery delays, risking churn."
    },
    {
      title: "Monitor competitor enterprise pricing strategy and evaluate contract terms.",
      priority: "MEDIUM",
      confidence: 60,
      owner: "Sales Strategy",
      reason: "Competitor enterprise pricing dropped 12%, which could compound current delivery issues if left unaddressed."
    }
  ]
};

async function seed() {
  try {
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log("Connected to database successfully. Purging existing collections...");

    await Metric.deleteMany({});
    await Investigation.deleteMany({});
    await Evidence.deleteMany({});
    await Hypothesis.deleteMany({});
    await Recommendation.deleteMany({});
    await Action.deleteMany({});

    // 1. Seed Metrics
    const createdMetric = await Metric.create(seedData.metric);
    console.log(`Seeded Metric: ${createdMetric.name}`);

    // 2. Seed Investigation (Detected state initially)
    const createdInvestigation = await Investigation.create({
      metricId: createdMetric._id.toString(),
      name: "Revenue Decline",
      severity: "HIGH",
      status: "DETECTED",
      expectedValue: createdMetric.expectedValue,
      actualValue: createdMetric.actualValue,
      change: createdMetric.change,
      affectedDimensions: seedData.dimensions,
      confidence: 87,
      detectedAt: createdMetric.timestamp
    });
    console.log(`Seeded Investigation: ${createdInvestigation.name} (Status: ${createdInvestigation.status})`);

    // 3. Seed Evidence
    const evidenceList = seedData.evidence.map(ev => ({
      ...ev,
      investigationId: createdInvestigation._id.toString()
    }));
    const createdEvidence = await Evidence.create(evidenceList);
    console.log(`Seeded ${createdEvidence.length} evidence records.`);

    // 4. Seed Hypotheses
    const hypothesesList = seedData.hypotheses.map(h => ({
      ...h,
      investigationId: createdInvestigation._id.toString()
    }));
    const createdHypotheses = await Hypothesis.create(hypothesesList);
    console.log(`Seeded ${createdHypotheses.length} hypothesis records.`);

    // 5. Seed Recommendations
    const recommendationsList = seedData.recommendations.map(r => ({
      ...r,
      investigationId: createdInvestigation._id.toString()
    }));
    const createdRecommendations = await Recommendation.create(recommendationsList);
    console.log(`Seeded ${createdRecommendations.length} recommendations.`);

    console.log("Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
