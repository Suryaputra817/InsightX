const Evidence = require('../models/Evidence');

class EvidenceService {
  async getEvidenceForInvestigation(investigationId, filters = {}) {
    const query = { investigationId };
    
    if (filters.source && filters.source !== 'ALL') {
      query.source = filters.source.toUpperCase();
    }
    
    if (filters.strength) {
      if (filters.strength === 'STRONG') {
        query.reliability = { $gte: 80 };
      } else if (filters.strength === 'MEDIUM') {
        query.reliability = { $gte: 50, $lt: 80 };
      } else if (filters.strength === 'WEAK') {
        query.reliability = { $lt: 50 };
      }
    }

    return await Evidence.find(query);
  }
}

module.exports = new EvidenceService();
