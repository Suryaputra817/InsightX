const xlsx = require('xlsx');
const mlService = require('../services/mlService');
const memoryDb = require('../utils/memoryDb');

// Helper to parse CSV / XLSX buffer into records array
const parseFileBufferToRecords = (buffer, filename) => {
  try {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const records = xlsx.utils.sheet_to_json(worksheet, { defval: null });
    return records;
  } catch (err) {
    throw new Error(`Failed to parse file '${filename}': ${err.message}`);
  }
};

exports.detectSchema = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No dataset file uploaded." });
    }

    const filename = req.file.originalname;
    const records = parseFileBufferToRecords(req.file.buffer, filename);

    if (!records || records.length === 0) {
      return res.status(400).json({ success: false, message: "Uploaded dataset file is empty." });
    }

    if (records.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Dataset must contain at least 5 rows for machine learning analysis."
      });
    }

    // Call ML service schema detection
    try {
      const mlSchema = await mlService.detectSchema(records);
      return res.json({
        success: true,
        data: {
          filename,
          recordsCount: records.length,
          schema: mlSchema,
          records: records.slice(0, 500) // Pass up to 500 rows for processing
        }
      });
    } catch (mlErr) {
      console.warn("ML Service unavailable for schema detection, running fallback:", mlErr.message);
      
      // Fallback column detection in Node.js
      const cols = Object.keys(records[0] || {});
      const detectedMapping = {};
      
      cols.forEach(c => {
        const lower = c.toLowerCase();
        if (lower.includes('revenue') || lower.includes('sales') || lower.includes('amount')) detectedMapping.revenue = c;
        if (lower.includes('order') || lower.includes('volume')) detectedMapping.orders = c;
        if (lower.includes('customer') || lower.includes('user')) detectedMapping.customers = c;
        if (lower.includes('delay') || lower.includes('late')) detectedMapping.delivery_delay = c;
        if (lower.includes('region') || lower.includes('area') || lower.includes('state')) detectedMapping.region = c;
      });

      return res.json({
        success: true,
        data: {
          filename,
          recordsCount: records.length,
          schema: {
            totalRows: records.length,
            totalColumns: cols.length,
            detectedMapping,
            columns: cols.map(c => ({ name: c, type: typeof records[0][c] === 'number' ? 'numeric' : 'categorical' }))
          },
          records: records.slice(0, 500)
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.analyzeDataset = async (req, res, next) => {
  try {
    let records = [];
    let filename = "Dataset";
    let columnMapping = {};

    if (req.file) {
      filename = req.file.originalname;
      records = parseFileBufferToRecords(req.file.buffer, filename);
    } else if (req.body.records && Array.isArray(req.body.records)) {
      records = req.body.records;
      filename = req.body.filename || "Uploaded Dataset";
    }

    if (req.body.columnMapping) {
      try {
        columnMapping = typeof req.body.columnMapping === 'string' 
          ? JSON.parse(req.body.columnMapping) 
          : req.body.columnMapping;
      } catch (e) {
        columnMapping = {};
      }
    }

    if (!records || records.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Dataset must contain at least 5 rows for training."
      });
    }

    // Call ML service custom dataset training & investigation endpoint
    try {
      const mlResult = await mlService.analyzeCustomDataset(records, columnMapping, filename);
      
      // Store in memoryDb so frontend can access via GET /investigations/:id
      memoryDb.addCustomInvestigation(mlResult);

      return res.json({
        success: true,
        message: "ML model successfully trained and investigation generated.",
        data: mlResult
      });
    } catch (mlErr) {
      console.error("ML service error during custom analysis:", mlErr.message);
      return res.status(500).json({
        success: false,
        message: `ML Analysis failed: ${mlErr.message || 'Service unavailable'}. Please verify your dataset columns and try again.`
      });
    }
  } catch (error) {
    next(error);
  }
};
