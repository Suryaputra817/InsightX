const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const investigationController = require('../controllers/investigationController');
const actionController = require('../controllers/actionController');
const Recommendation = require('../models/Recommendation');

const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

// Dashboard
router.get('/dashboard', dashboardController.getDashboardData);

// Business Data Upload & Training Routes
router.post('/upload/detect', upload.single('dataset'), uploadController.detectSchema);
router.post('/upload/analyze', upload.single('dataset'), uploadController.analyzeDataset);

// Investigations
router.get('/investigations', investigationController.getInvestigations);
router.get('/investigations/:id', investigationController.getInvestigationById);
router.post('/investigations/:id/run', investigationController.runInvestigation);
router.get('/investigations/:id/evidence', investigationController.getEvidence);
router.get('/investigations/:id/hypotheses', investigationController.getHypotheses);


const mongoose = require('mongoose');
const memoryDb = require('../utils/memoryDb');
const isConnected = () => mongoose.connection.readyState === 1;

// Recommendations (returns all recommendations for the NovaMart anomaly)
router.get('/recommendations', async (req, res, next) => {
  try {
    if (isConnected()) {
      const list = await Recommendation.find({});
      res.json({
        success: true,
        data: list
      });
    } else {
      console.log("Mongoose disconnected. Using memoryDb for recommendations.");
      res.json({
        success: true,
        data: memoryDb.getRecommendations()
      });
    }
  } catch (error) {
    next(error);
  }
});

// Actions
router.get('/actions', actionController.getActions);
router.post('/actions', actionController.createAction);
router.patch('/actions/:id', actionController.updateAction);

module.exports = router;
