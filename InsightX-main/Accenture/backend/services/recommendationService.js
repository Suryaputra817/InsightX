const Recommendation = require('../models/Recommendation');

class RecommendationService {
  async getRecommendationsForInvestigation(investigationId) {
    return await Recommendation.find({ investigationId });
  }

  generateRecommendations(hypotheses) {
    // Generates recommendations based on evaluated hypotheses
    const recommendations = [];

    const topHypothesis = hypotheses[0];
    if (topHypothesis && topHypothesis.confidence > 70) {
      recommendations.push({
        title: "Investigate North-region logistics partners and prioritize delayed enterprise orders.",
        priority: "CRITICAL",
        confidence: 82,
        owner: "Operations",
        reason: "Delivery delays increased 31%, North-region delays increased 44%, and enterprise delayed orders increased 39%."
      });

      recommendations.push({
        title: "Establish temporary customer-success outreach for affected Enterprise clients in North.",
        priority: "HIGH",
        confidence: 75,
        owner: "Customer Success",
        reason: "Enterprise complaints have surged 27% following delivery delays, risking churn."
      });
    }

    const priceHypothesis = hypotheses.find(h => h.title.includes("pricing"));
    if (priceHypothesis && priceHypothesis.confidence > 50) {
      recommendations.push({
        title: "Monitor competitor enterprise pricing strategy and evaluate contract terms.",
        priority: "MEDIUM",
        confidence: 60,
        owner: "Sales Strategy",
        reason: "Competitor enterprise pricing dropped 12%, which could compound current delivery issues if left unaddressed."
      });
    }

    return recommendations;
  }
}

module.exports = new RecommendationService();
