const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const apiRouter = require('./routes/api');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/insightx';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRouter);

// Base route
app.get('/', (req, res) => {
  res.json({ message: "InsightX Business Investigator API is running." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Express Error Handler:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    data: null,
    message: err.message || "Internal Server Error"
  });
});

// Connect to DB and Start Server
console.log(`Connecting to database at: ${mongoUri}`);
mongoose.connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB database.");
    app.listen(port, () => {
      console.log(`InsightX API server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error. Falling back to In-Memory Datastore.");
    console.error("Reason:", err.message);
    app.listen(port, () => {
      console.log(`InsightX API server (Memory Mode) listening on port ${port}`);
    });
  });
