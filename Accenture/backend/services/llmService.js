const axios = require('axios');

class LlmService {
  constructor() {
    this.apiKey = process.env.LLM_API_KEY;
  }

  async enrichReasoning(findingsSummary) {
    if (!this.apiKey) {
      console.log("No LLM_API_KEY provided. Falling back to deterministic reasoning enrichment.");
      return this.fallbackReasoning(findingsSummary);
    }

    try {
      // In a real application, you'd configure an actual LLM client call (e.g. Gemini, OpenAI, etc.)
      // For this Express server, we demonstrate the pattern:
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional Business Intelligence AI analyst. Your role is to enrich anomalies, hypotheses, and alternative explanations. Keep explanations clear, professional, and emphasize the distinction between correlation and causation. Output only structured JSON."
          },
          {
            role: "user",
            content: `Analyze this summary: ${JSON.stringify(findingsSummary)}`
          }
        ],
        response_format: { type: "json_object" }
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 4000 // fail fast
      });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error("LLM reasoning service call failed, loading fallback content:", error.message);
      return this.fallbackReasoning(findingsSummary);
    }
  }

  fallbackReasoning(findingsSummary) {
    // Deterministic fallback response mapping
    return {
      success: true,
      isFallback: true,
      summary: "A critical 8.2% drop in revenue is heavily concentrated in the North region (-17.4%) and Enterprise segment (-23.1%). Parallel logistics data shows delivery delays increasing by 31% (44% in the North), which strongly aligns with the timing and target demographics of the sales drop.",
      hypotheses: [
        {
          title: "Logistics disruption in North region",
          alternativeExplanation: "Could represent a temporary supplier-level bottleneck or carrier capacity constraint, but the direct impact on enterprise customers is highly acute.",
          summary: "Delivery delays match geographical and segment anomalies, causing customer dissatisfaction and order cancellations."
        },
        {
          title: "Competitor pricing pressure on Enterprise segment",
          alternativeExplanation: "A competitor pricing campaign could drive enterprise churn, though regional concentration in the North suggests pricing alone does not explain the full variance.",
          summary: "A 12% pricing drop by competitor overlaps with Enterprise customer segment but is nationwide, unlike our regionalized revenue drop."
        }
      ]
    };
  }
}

module.exports = new LlmService();
