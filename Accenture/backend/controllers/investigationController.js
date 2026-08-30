const mongoose = require('mongoose');
const Investigation = require('../models/Investigation');
const Metric = require('../models/Metric');
const Evidence = require('../models/Evidence');
const Hypothesis = require('../models/Hypothesis');
const Recommendation = require('../models/Recommendation');
const memoryDb = require('../utils/memoryDb');

const isConnected = () => mongoose.connection.readyState === 1;

// Get all investigations
exports.getInvestigations = async (req, res, next) => {
  try {
    if (isConnected()) {
      const list = await Investigation.find({}).sort({ detectedAt: -1 });
      return res.json({ success: true, data: list });
    } else {
      console.log("Mongoose disconnected. Using memoryDb for investigations list.");
      return res.json({ success: true, data: memoryDb.getInvestigations() });
    }
  } catch (error) {
    next(error);
  }
};

// Get single investigation detail
exports.getInvestigationById = async (req, res, next) => {
  try {
    if (isConnected()) {
      const inv = await Investigation.findById(req.params.id);
      if (!inv) {
        return res.status(404).json({ success: false, message: "Investigation not found" });
      }
      return res.json({ success: true, data: inv });
    } else {
      const inv = memoryDb.getInvestigationById(req.params.id);
      if (!inv) {
        return res.status(404).json({ success: false, message: "Investigation not found" });
      }
      return res.json({ success: true, data: inv });
    }
  } catch (error) {
    next(error);
  }
};

// Run / execute investigation engine
exports.runInvestigation = async (req, res, next) => {
  try {
    if (isConnected()) {
      const inv = await Investigation.findById(req.params.id);
      if (!inv) {
        return res.status(404).json({ success: false, message: "Investigation not found" });
      }

      inv.status = 'COMPLETED';
      await inv.save();

      const evidence = await Evidence.find({ investigationId: inv._id.toString() });
      const hypotheses = await Hypothesis.find({ investigationId: inv._id.toString() });
      const recommendations = await Recommendation.find({ investigationId: inv._id.toString() });

      return res.json({
        success: true,
        message: "Investigation engine finished executing.",
        data: {
          investigation: inv,
          analysis: {
            dimensions: inv.affectedDimensions,
            evidenceCount: evidence.length,
            hypothesesCount: hypotheses.length,
            recommendationsCount: recommendations.length
          }
        }
      });
    } else {
      const inv = memoryDb.updateInvestigationStatus(req.params.id, 'COMPLETED');
      if (!inv) {
        return res.status(404).json({ success: false, message: "Investigation not found" });
      }
      return res.json({
        success: true,
        message: "Investigation engine finished executing (Memory DB).",
        data: {
          investigation: inv,
          analysis: {
            dimensions: inv.affectedDimensions,
            evidenceCount: memoryDb.getEvidence(req.params.id).length,
            hypothesesCount: memoryDb.getHypotheses(req.params.id).length,
            recommendationsCount: memoryDb.getRecommendations().length
          }
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get evidence for investigation with optional filters
exports.getEvidence = async (req, res, next) => {
  try {
    const { source, strength } = req.query;
    let evidenceList = [];

    if (isConnected()) {
      const query = { investigationId: req.params.id };

      if (source && source !== 'ALL') {
        query.source = source.toUpperCase();
      }

      if (strength) {
        if (strength === 'STRONG') {
          query.reliability = { $gte: 80 };
        } else if (strength === 'MEDIUM') {
          query.reliability = { $gte: 50, $lt: 80 };
        } else if (strength === 'WEAK') {
          query.reliability = { $lt: 50 };
        }
      }
      evidenceList = await Evidence.find(query);
    } else {
      evidenceList = memoryDb.getEvidence(req.params.id);
      if (source && source !== 'ALL') {
        evidenceList = evidenceList.filter(e => e.source === source.toUpperCase());
      }
      if (strength) {
        if (strength === 'STRONG') {
          evidenceList = evidenceList.filter(e => e.reliability >= 80);
        } else if (strength === 'MEDIUM') {
          evidenceList = evidenceList.filter(e => e.reliability >= 50 && e.reliability < 80);
        } else if (strength === 'WEAK') {
          evidenceList = evidenceList.filter(e => e.reliability < 50);
        }
      }
    }

    res.json({
      success: true,
      data: evidenceList
    });
  } catch (error) {
    next(error);
  }
};

// Get hypotheses
exports.getHypotheses = async (req, res, next) => {
  try {
    if (isConnected()) {
      const list = await Hypothesis.find({ investigationId: req.params.id }).sort({ confidence: -1 });
      return res.json({ success: true, data: list });
    } else {
      const list = memoryDb.getHypotheses(req.params.id).sort((a, b) => b.confidence - a.confidence);
      return res.json({ success: true, data: list });
    }
  } catch (error) {
    next(error);
  }
};
