import axios from 'axios';
import { novamartData } from '../data/novamartSeed';

// Set VITE_API_URL in Vercel to the Render service URL, e.g.
// https://insightx-api.onrender.com/api.  The local default keeps development
// setup zero-config.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 5000
});

// Robust wrapper that falls back to seed data if server is offline
export const api = {
  getDashboard: async () => {
    try {
      const res = await client.get('/dashboard');
      return res.data.data;
    } catch (err) {
      console.warn("API server offline, using local simulation data:", err.message);
      return {
        primaryMetric: novamartData.metric,
        otherKPIs: novamartData.otherKPIs,
        activeInvestigations: [
          {
            _id: "revenue-decline",
            metricId: "revenue-decline",
            name: "Revenue Decline",
            severity: "HIGH",
            status: "DETECTED",
            expectedValue: 46.6,
            actualValue: 42.8,
            change: -8.2,
            affectedDimensions: novamartData.dimensions,
            confidence: 87,
            detectedAt: "2026-08-24T00:00:00Z"
          }
        ]
      };
    }
  },

  getInvestigations: async () => {
    try {
      const res = await client.get('/investigations');
      return res.data.data;
    } catch (err) {
      console.warn("API server offline, using local simulation data.");
      return novamartData.investigations || [
        {
          _id: "revenue-decline",
          metricId: "revenue-decline",
          name: "Revenue Decline",
          severity: "HIGH",
          status: "INVESTIGATING",
          expectedValue: 46.6,
          actualValue: 42.8,
          change: -8.2,
          affectedDimensions: novamartData.dimensions,
          confidence: 87,
          detectedAt: "2026-08-24T00:00:00Z"
        }
      ];
    }
  },

  getInvestigation: async (id) => {
    try {
      const res = await client.get(`/investigations/${id}`);
      return res.data.data;
    } catch (err) {
      console.warn("API server offline, using local simulation data.");
      return {
        _id: "revenue-decline",
        metricId: "revenue-decline",
        name: "Revenue Decline",
        severity: "HIGH",
        status: "DETECTED",
        expectedValue: 46.6,
        actualValue: 42.8,
        change: -8.2,
        affectedDimensions: novamartData.dimensions,
        confidence: 87,
        detectedAt: "2026-08-24T00:00:00Z"
      };
    }
  },

  runInvestigation: async (id) => {
    try {
      const res = await client.post(`/investigations/${id}/run`);
      return res.data.data;
    } catch (err) {
      console.warn("API server offline, using local simulation.");
      return {
        success: true,
        message: "Simulation completed."
      };
    }
  },

  getEvidence: async (id, source = 'ALL', strength = '') => {
    try {
      const res = await client.get(`/investigations/${id}/evidence`, {
        params: { source, strength }
      });
      return res.data.data;
    } catch (err) {
      console.warn("API server offline, using local simulation.");
      let data = [...novamartData.evidence];
      if (source !== 'ALL') {
        data = data.filter(e => e.source === source);
      }
      if (strength) {
        if (strength === 'STRONG') {
          data = data.filter(e => e.reliability >= 80);
        } else if (strength === 'MEDIUM') {
          data = data.filter(e => e.reliability >= 50 && e.reliability < 80);
        } else if (strength === 'WEAK') {
          data = data.filter(e => e.reliability < 50);
        }
      }
      return data;
    }
  },

  getHypotheses: async (id) => {
    try {
      const res = await client.get(`/investigations/${id}/hypotheses`);
      return res.data.data;
    } catch (err) {
      console.warn("API server offline, using local simulation.");
      return novamartData.hypotheses;
    }
  },

  getRecommendations: async () => {
    try {
      const res = await client.get('/recommendations');
      return res.data.data;
    } catch (err) {
      console.warn("API server offline, using local simulation.");
      return novamartData.recommendations;
    }
  },

  getActions: async () => {
    try {
      const res = await client.get('/actions');
      return res.data.data;
    } catch (err) {
      console.warn("API server offline, using local storage simulation.");
      const local = localStorage.getItem('insightx_actions');
      if (local) {
        return JSON.parse(local);
      }
      // default initial actions
      const defaults = [
        {
          _id: "act-1",
          recommendationId: "rec-1",
          title: "Investigate North-region logistics partners",
          owner: "Operations",
          priority: "CRITICAL",
          status: "OPEN",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: [{ status: "OPEN", timestamp: new Date().toISOString() }]
        }
      ];
      localStorage.setItem('insightx_actions', JSON.stringify(defaults));
      return defaults;
    }
  },

  createAction: async (actionData) => {
    try {
      const res = await client.post('/actions', actionData);
      return res.data.data;
    } catch (err) {
      console.warn("API server offline, creating action locally.");
      const local = localStorage.getItem('insightx_actions');
      const list = local ? JSON.parse(local) : [];
      const newAction = {
        _id: `act-${Date.now()}`,
        ...actionData,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [{ status: 'OPEN', timestamp: new Date().toISOString() }]
      };
      list.unshift(newAction);
      localStorage.setItem('insightx_actions', JSON.stringify(list));
      return newAction;
    }
  },

  updateAction: async (id, status) => {
    try {
      const res = await client.patch(`/actions/${id}`, { status });
      return res.data.data;
    } catch (err) {
      console.warn("API server offline, updating action locally.");
      const local = localStorage.getItem('insightx_actions');
      if (!local) return null;
      const list = JSON.parse(local);
      const index = list.findIndex(a => a._id === id);
      if (index !== -1) {
        list[index].status = status;
        list[index].updatedAt = new Date().toISOString();
        list[index].timeline.push({ status, timestamp: new Date().toISOString() });
        localStorage.setItem('insightx_actions', JSON.stringify(list));
        return list[index];
      }
      return null;
    }
  }
};
