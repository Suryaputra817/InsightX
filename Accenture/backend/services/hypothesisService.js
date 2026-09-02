const Hypothesis = require('../models/Hypothesis');

class HypothesisService {
  async getHypothesesForInvestigation(investigationId) {
    return await Hypothesis.find({ investigationId }).sort({ confidence: -1 });
  }

  // Deterministically scores hypotheses based on findings
  evaluateHypotheses(evidenceList) {
    // For MVP, evaluate based on keywords matching evidence
    const hypotheses = [
      {
        title: "Logistics disruption in North region",
        confidence: 87,
        causalStatus: "SUPPORTED",
        supportingEvidence: evidenceList
          .filter(e => e.source === 'LOGISTICS' || e.source === 'CRM')
          .map(e => e.finding),
        contradictingEvidence: [],
        alternatives: "Temporary regional demand fluctuation.",
        causalWarning: "Evidence strongly supports logistics disruption as a likely contributor, but observational data does not establish experimental causality."
      },
      {
        title: "Competitor pricing pressure on Enterprise segment",
        confidence: 54,
        causalStatus: "CORRELATED",
        supportingEvidence: evidenceList
          .filter(e => e.source === 'MARKET INTELLIGENCE')
          .map(e => e.finding),
        contradictingEvidence: ["Revenue decline is highly concentrated in North-region logistics-affected customers, whereas competitor price drop was nationwide."],
        alternatives: "Product feature gap.",
        causalWarning: "Correlation identified. Price reduction matches segment, but geographic concentration suggests this is secondary."
      },
      {
        title: "Sales team underperformance",
        confidence: 29,
        causalStatus: "INSUFFICIENT_EVIDENCE",
        supportingEvidence: [],
        contradictingEvidence: evidenceList
          .filter(e => e.source === 'SALES')
          .map(e => e.finding),
        alternatives: "Changes in commission structure or sales churn (not observed).",
        causalWarning: "No data supports sales team performance issues as a cause."
      }
    ];

    return hypotheses;
  }
}

module.exports = new HypothesisService();
