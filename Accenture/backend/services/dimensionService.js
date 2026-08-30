class DimensionService {
  analyzeDimensions(dimensionsData) {
    const results = {};
    
    for (const [dimensionName, segments] of Object.entries(dimensionsData)) {
      // Sort segments by absolute change descending to find top contributors
      const sorted = [...segments].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
      
      results[dimensionName] = {
        segments: sorted,
        topContributor: sorted[0] ? sorted[0].name : null,
        topDeviation: sorted[0] ? sorted[0].change : 0
      };
    }

    // Identify the global top contributing segments across all dimensions
    const allSegments = [];
    for (const [dimensionName, info] of Object.entries(results)) {
      info.segments.forEach(seg => {
        allSegments.push({
          dimension: dimensionName,
          name: seg.name,
          change: seg.change,
          absChange: Math.abs(seg.change),
          contribution: seg.contribution || 0
        });
      });
    }

    const globalTopContributors = allSegments
      .sort((a, b) => b.absChange - a.absChange)
      .slice(0, 3);

    return {
      breakdown: results,
      topContributors: globalTopContributors
    };
  }
}

module.exports = new DimensionService();
