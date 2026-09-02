const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 120000 // 120s timeout for large dataset ML training/predictions
});


class MLService {
  async checkHealth() {
    try {
      const res = await client.get('/health');
      return res.data;
    } catch (err) {
      console.warn("ML Service health check failed:", err.message);
      return { status: "offline", models_loaded: false };
    }
  }

  async runInvestigation(data) {
    try {
      const res = await client.post('/investigate', data);
      return res.data;
    } catch (err) {
      console.error("Error calling ML /investigate endpoint:", err.message);
      throw err;
    }
  }

  async detectSchema(records) {
    try {
      const res = await client.post('/upload/detect', { records });
      return res.data;
    } catch (err) {
      console.error("Error calling ML /upload/detect endpoint:", err.message);
      throw err;
    }
  }

  async analyzeCustomDataset(records, columnMapping, datasetName) {
    try {
      const res = await client.post('/upload/analyze', {
        records,
        column_mapping: columnMapping,
        dataset_name: datasetName
      });
      return res.data;
    } catch (err) {
      console.error("Error calling ML /upload/analyze endpoint:", err.message);
      throw err;
    }
  }
}

module.exports = new MLService();
