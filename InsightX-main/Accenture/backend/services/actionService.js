const Action = require('../models/Action');

class ActionService {
  async getActions() {
    return await Action.find({}).sort({ createdAt: -1 });
  }

  async createAction(actionData) {
    const action = new Action({
      recommendationId: actionData.recommendationId,
      title: actionData.title,
      owner: actionData.owner,
      priority: actionData.priority,
      status: 'OPEN',
      timeline: [{ status: 'OPEN', timestamp: new Date() }]
    });

    return await action.save();
  }

  async updateActionStatus(actionId, status) {
    const action = await Action.findById(actionId);
    if (!action) {
      throw new Error(`Action not found: ${actionId}`);
    }

    action.status = status;
    action.updatedAt = new Date();
    action.timeline.push({ status, timestamp: new Date() });
    
    return await action.save();
  }
}

module.exports = new ActionService();
