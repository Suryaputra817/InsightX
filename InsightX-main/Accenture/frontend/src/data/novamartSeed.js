export const novamartData = {
  metric: {
    id: "revenue-decline",
    name: "Revenue",
    expectedValue: 46.6,
    actualValue: 42.8,
    change: -8.2,
    currency: "₹",
    unit: "M",
    timestamp: "2026-08-24T00:00:00Z",
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
    { name: "Orders", actual: "184K", change: 2.4, status: "up", subtitle: "Nominal bound" },
    { name: "Customers", actual: "92.4K", change: -1.8, status: "down", subtitle: "Nominal bound" },
    { name: "Conversion", actual: "3.82%", change: 0.15, status: "up", subtitle: "Nominal bound" },
    { name: "Complaints", actual: "1,240", change: 18.2, status: "down-bad", subtitle: "Outside expected range" }
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
      id: "ev-1",
      source: "LOGISTICS",
      finding: "North-region delivery delays increased 44%.",
      value: "+44%",
      reliability: 94,
      timestamp: "2026-08-23T16:00:00Z",
      relatedHypotheses: ["Logistics Disruption"]
    },
    {
      id: "ev-2",
      source: "ORDERS",
      finding: "Enterprise delayed orders increased 39%.",
      value: "+39%",
      reliability: 92,
      timestamp: "2026-08-24T09:15:00Z",
      relatedHypotheses: ["Logistics Disruption"]
    },
    {
      id: "ev-3",
      source: "CUSTOMER SUPPORT",
      finding: "Delivery-related complaints increased 27%.",
      value: "+27%",
      reliability: 91,
      timestamp: "2026-08-24T10:30:00Z",
      relatedHypotheses: ["Logistics Disruption"]
    },
    {
      id: "ev-4",
      source: "LOGISTICS",
      finding: "Delivery delays increased 31% overall.",
      value: "+31%",
      reliability: 94,
      timestamp: "2026-08-23T14:30:00Z",
      relatedHypotheses: ["Logistics Disruption"]
    },
    {
      id: "ev-5",
      source: "MARKET INTELLIGENCE",
      finding: "Competitor enterprise pricing decreased 12%.",
      value: "-12%",
      reliability: 68,
      timestamp: "2026-08-22T11:00:00Z",
      relatedHypotheses: ["Competitor Pricing Pressure"]
    },
    {
      id: "ev-6",
      source: "SALES",
      finding: "Sales team performance dashboard shows normal variance with no strong evidence of decline.",
      value: "0% deviation",
      reliability: 89,
      timestamp: "2026-08-24T08:00:00Z",
      relatedHypotheses: ["Sales Performance"]
    }
  ],
  hypotheses: [
    {
      id: "hyp-1",
      title: "Logistics Disruption",
      confidence: 87,
      causalStatus: "SUPPORTED",
      supportingEvidence: [
        "Delivery delays increased 31% overall.",
        "North-region delivery delays increased 44%.",
        "Enterprise delayed orders increased 39%.",
        "Delivery-related complaints increased 27%."
      ],
      contradictingEvidence: [],
      alternatives: "Temporary regional demand fluctuation.",
      causalWarning: "Strong evidence supports this hypothesis, but observational data does not establish experimental causality."
    },
    {
      id: "hyp-2",
      title: "Competitor Pricing Pressure",
      confidence: 54,
      causalStatus: "CORRELATED",
      supportingEvidence: ["Competitor enterprise pricing decreased 12%."],
      contradictingEvidence: ["Revenue decline is highly concentrated in North-region logistics-affected customers, whereas competitor price drop was nationwide."],
      alternatives: "Product feature gap.",
      causalWarning: "Correlation identified. Competitor price reduction matches customer segment, but geographic concentration in the North suggests pricing alone does not explain the full variance."
    },
    {
      id: "hyp-3",
      title: "Sales Performance",
      confidence: 29,
      causalStatus: "INSUFFICIENT EVIDENCE",
      supportingEvidence: [],
      contradictingEvidence: ["Sales performance shows normal variance with no strong evidence of decline."],
      alternatives: "Commission restructuring or sales churn (not observed).",
      causalWarning: "No data supports sales team performance issues as a contributing cause."
    }
  ],
  recommendations: [
    {
      id: "rec-1",
      title: "Investigate North-region logistics partners and prioritize delayed enterprise orders.",
      priority: "CRITICAL",
      confidence: 82,
      owner: "Operations",
      reason: "Delivery delays increased 31%, North-region delays increased 44%, and enterprise delayed orders increased 39%."
    },
    {
      id: "rec-2",
      title: "Prioritize delayed enterprise orders.",
      priority: "HIGH",
      confidence: 75,
      owner: "Operations",
      reason: "Enterprise delayed orders increased 39% and customer complaints surged 27%."
    },
    {
      id: "rec-3",
      title: "Monitor competitor enterprise pricing.",
      priority: "MEDIUM",
      confidence: 60,
      owner: "Sales Strategy",
      reason: "Competitor enterprise pricing dropped 12%."
    }
  ],
  investigations: [
    {
      _id: "revenue-decline",
      name: "Revenue Decline",
      severity: "HIGH",
      status: "INVESTIGATING",
      change: -8.2,
      confidence: 87,
      detectedAt: "2026-08-24T00:00:00Z"
    },
    {
      _id: "customer-churn",
      name: "Customer Churn",
      severity: "MEDIUM",
      status: "ACTIVE",
      change: 14.7,
      confidence: 76,
      detectedAt: "2026-08-23T00:00:00Z"
    },
    {
      _id: "order-cancellations",
      name: "Order Cancellations",
      severity: "MEDIUM",
      status: "ACTIVE",
      change: 9.2,
      confidence: 68,
      detectedAt: "2026-08-22T00:00:00Z"
    }
  ]
};
