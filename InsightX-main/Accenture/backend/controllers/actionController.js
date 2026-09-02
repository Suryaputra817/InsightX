const mongoose = require('mongoose');
const Action = require('../models/Action');
const memoryDb = require('../utils/memoryDb');

const isConnected = () => mongoose.connection.readyState === 1;

exports.getActions = async (req, res, next) => {
  try {
    if (isConnected()) {
      const list = await Action.find({}).sort({ createdAt: -1 });
      res.json({ success: true, data: list });
    } else {
      console.log("Mongoose disconnected. Using memoryDb for actions.");
      res.json({ success: true, data: memoryDb.getActions() });
    }
  } catch (error) {
    next(error);
  }
};

exports.createAction = async (req, res, next) => {
  try {
    const { recommendationId, title, owner, priority } = req.body;
    
    if (!recommendationId || !title || !owner || !priority) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    if (isConnected()) {
      const action = new Action({
        recommendationId,
        title,
        owner,
        priority,
        status: 'OPEN',
        timeline: [{ status: 'OPEN', timestamp: new Date() }]
      });
      const saved = await action.save();
      res.status(201).json({ success: true, data: saved });
    } else {
      console.log("Mongoose disconnected. Creating action in memoryDb.");
      const saved = memoryDb.createAction({ recommendationId, title, owner, priority });
      res.status(201).json({ success: true, data: saved });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateAction = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status || !['OPEN', 'INVESTIGATING', 'RESOLVED'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid or missing status" });
    }

    if (isConnected()) {
      const action = await Action.findById(req.params.id);
      if (!action) {
        return res.status(404).json({ success: false, message: "Action not found" });
      }
      action.status = status;
      action.updatedAt = new Date();
      action.timeline.push({ status, timestamp: new Date() });
      const updated = await action.save();
      res.json({ success: true, data: updated });
    } else {
      console.log("Mongoose disconnected. Updating action in memoryDb.");
      const updated = memoryDb.updateActionStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Action not found" });
      }
      res.json({ success: true, data: updated });
    }
  } catch (error) {
    next(error);
  }
};
