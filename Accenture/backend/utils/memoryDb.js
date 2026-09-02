const initialSeed = {
  metrics: [
    {
      _id: "met-1",
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
    }
  ],
  investigations: [
    {
      _id: "revenue-decline",
      metricId: "met-1",
      name: "Revenue Decline",
      severity: "HIGH",
      status: "INVESTIGATING",
      expectedValue: 46.6,
      actualValue: 42.8,
      change: -8.2,
      affectedDimensions: {
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
      confidence: 87,
      detectedAt: new Date("2026-08-24T00:00:00Z")
    },
    {
      _id: "customer-churn",
      metricId: "met-3",
      name: "Customer Churn",
      severity: "MEDIUM",
      status: "ACTIVE",
      expectedValue: 2.1,
      actualValue: 2.4,
      change: 14.7,
      affectedDimensions: {
        region: [
          { name: "West", change: 18.2, contribution: 1.2 },
          { name: "North", change: 12.4, contribution: 0.8 }
        ],
        customer: [
          { name: "SMB", change: 19.5, contribution: 1.5 }
        ],
        product: [
          { name: "Product B", change: 15.0, contribution: 1.0 }
        ]
      },
      confidence: 76,
      detectedAt: new Date("2026-08-23T00:00:00Z")
    },
    {
      _id: "order-cancellations",
      metricId: "met-2",
      name: "Order Cancellations",
      severity: "MEDIUM",
      status: "ACTIVE",
      expectedValue: 4.0,
      actualValue: 4.37,
      change: 9.2,
      affectedDimensions: {
        region: [
          { name: "North", change: 14.2, contribution: 0.9 }
        ],
        customer: [
          { name: "Enterprise", change: 11.0, contribution: 0.7 }
        ],
        product: [
          { name: "Product A", change: 12.0, contribution: 0.8 }
        ]
      },
      confidence: 68,
      detectedAt: new Date("2026-08-22T00:00:00Z")
    }
  ],
  evidence: [
    {
      _id: "ev-1",
      investigationId: "revenue-decline",
      source: "LOGISTICS",
      finding: "North-region delivery delays increased 44%.",
      value: "+44%",
      reliability: 94,
      timestamp: new Date("2026-08-23T16:00:00Z"),
      relatedHypotheses: ["LOGISTICS DISRUPTION"]
    },
    {
      _id: "ev-2",
      investigationId: "revenue-decline",
      source: "ORDERS",
      finding: "Enterprise delayed orders increased 39%.",
      value: "+39%",
      reliability: 92,
      timestamp: new Date("2026-08-24T09:15:00Z"),
      relatedHypotheses: ["LOGISTICS DISRUPTION"]
    },
    {
      _id: "ev-3",
      investigationId: "revenue-decline",
      source: "CUSTOMER SUPPORT",
      finding: "Delivery-related complaints increased 27%.",
      value: "+27%",
      reliability: 91,
      timestamp: new Date("2026-08-24T10:30:00Z"),
      relatedHypotheses: ["LOGISTICS DISRUPTION"]
    },
    {
      _id: "ev-4",
      investigationId: "revenue-decline",
      source: "LOGISTICS",
      finding: "Delivery delays increased 31% overall.",
      value: "+31%",
      reliability: 94,
      timestamp: new Date("2026-08-23T14:30:00Z"),
      relatedHypotheses: ["LOGISTICS DISRUPTION"]
    },
    {
      _id: "ev-5",
      investigationId: "revenue-decline",
      source: "MARKET INTELLIGENCE",
      finding: "Competitor enterprise pricing decreased 12%.",
      value: "-12%",
      reliability: 68,
      timestamp: new Date("2026-08-22T11:00:00Z"),
      relatedHypotheses: ["COMPETITOR PRICING PRESSURE"]
    },
    {
      _id: "ev-6",
      investigationId: "revenue-decline",
      source: "SALES",
      finding: "Sales performance: No strong evidence of decline.",
      value: "0% deviation",
      reliability: 89,
      timestamp: new Date("2026-08-24T08:00:00Z"),
      relatedHypotheses: ["SALES PERFORMANCE"]
    }
  ],
  hypotheses: [
    {
      _id: "hyp-1",
      investigationId: "revenue-decline",
      title: "LOGISTICS DISRUPTION",
      confidence: 87,
      causalStatus: "SUPPORTED",
      supportingEvidence: [
        "Delivery delays ↑31%",
        "North delays ↑44%",
        "Enterprise delayed orders ↑39%",
        "Complaints ↑27%"
      ],
      contradictingEvidence: [],
      alternatives: "Temporary regional demand fluctuation.",
      causalWarning: "Strong evidence supports this hypothesis, but observational data does not establish experimental causality."
    },
    {
      _id: "hyp-2",
      investigationId: "revenue-decline",
      title: "COMPETITOR PRICING PRESSURE",
      confidence: 54,
      causalStatus: "CORRELATED",
      supportingEvidence: ["Competitor enterprise pricing decreased 12%."],
      contradictingEvidence: ["Revenue decline is highly concentrated in North-region logistics-affected customers, whereas competitor price drop was nationwide."],
      alternatives: "Product feature gap.",
      causalWarning: "Correlation identified. Competitor price reduction matches customer segment, but geographic concentration in the North suggests pricing alone does not explain the full variance."
    },
    {
      _id: "hyp-3",
      investigationId: "revenue-decline",
      title: "SALES PERFORMANCE",
      confidence: 29,
      causalStatus: "INSUFFICIENT EVIDENCE",
      supportingEvidence: [],
      contradictingEvidence: ["Sales team performance shows normal variance with no strong evidence of decline."],
      alternatives: "Commission restructuring or sales churn (not observed).",
      causalWarning: "No data supports sales team performance issues as a contributing cause."
    }
  ],
  recommendations: [
    {
      _id: "rec-1",
      investigationId: "revenue-decline",
      title: "Investigate North-region logistics partners and prioritize delayed enterprise orders.",
      priority: "CRITICAL",
      confidence: 82,
      owner: "Operations",
      reason: "Delivery delays increased 31%, North-region delays increased 44%, and enterprise delayed orders increased 39%."
    },
    {
      _id: "rec-2",
      investigationId: "revenue-decline",
      title: "Prioritize delayed enterprise orders.",
      priority: "HIGH",
      confidence: 75,
      owner: "Operations",
      reason: "Enterprise delayed orders increased 39% and customer complaints surged 27%."
    },
    {
      _id: "rec-3",
      investigationId: "revenue-decline",
      title: "Monitor competitor enterprise pricing.",
      priority: "MEDIUM",
      confidence: 60,
      owner: "Sales Strategy",
      reason: "Competitor enterprise pricing dropped 12%."
    }
  ],
  actions: [
    {
      _id: "act-1",
      recommendationId: "rec-1",
      title: "Investigate North-region logistics partners",
      owner: "Operations",
      priority: "CRITICAL",
      status: "OPEN",
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [{ status: "OPEN", timestamp: new Date() }]
    }
  ]
};

const memoryDb = { ...initialSeed };

module.exports = {
  getMetrics: () => memoryDb.metrics,
  getMetricByName: (name) => memoryDb.metrics.find(m => m.name === name),
  
  getInvestigations: () => memoryDb.investigations,
  getInvestigationById: (id) => memoryDb.investigations.find(i => i._id === id),
  updateInvestigationStatus: (id, status) => {
    const inv = memoryDb.investigations.find(i => i._id === id);
    if (inv) {
      inv.status = status;
    }
    return inv;
  },

  getEvidence: (investigationId) => memoryDb.evidence.filter(e => e.investigationId === investigationId),
  
  getHypotheses: (investigationId) => memoryDb.hypotheses.filter(h => h.investigationId === investigationId),
  
  getRecommendations: () => memoryDb.recommendations,
  
  getActions: () => memoryDb.actions,
  createAction: (actionData) => {
    const newAction = {
      _id: `act-${Date.now()}`,
      recommendationId: actionData.recommendationId,
      title: actionData.title,
      owner: actionData.owner,
      priority: actionData.priority,
      status: "OPEN",
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [{ status: "OPEN", timestamp: new Date() }]
    };
    memoryDb.actions.unshift(newAction);
    return newAction;
  },
  updateActionStatus: (id, status) => {
    const act = memoryDb.actions.find(a => a._id === id);
    if (act) {
      act.status = status;
      act.updatedAt = new Date();
      act.timeline.push({ status, timestamp: new Date() });
    }
    return act;
  }
};
