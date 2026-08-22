const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const aiRoutes = require('./routes/ai');
const vetRoutes = require('./routes/vets');
const recordRoutes = require('./routes/records');
const outbreakRoutes = require('./routes/outbreaks');
const complaintRoutes = require('./routes/complaints');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes Integration
app.use('/api/ai', aiRoutes);
app.use('/api/vets', vetRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/outbreaks', outbreakRoutes);
app.use('/api/complaints', complaintRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Pashu Rakshak - Digital Farm Biosecurity Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root fallback
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Pashu Rakshak Backend API',
    endpoints: [
      '/api/health',
      '/api/ai/predict',
      '/api/vets',
      '/api/records',
      '/api/outbreaks/summary',
      '/api/complaints'
    ]
  });
});

// Server Listener
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  PASHU RAKHSAK Biosecurity Server running on PORT ${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const ALT_PORT = Number(PORT) + 1;
    console.log(`Port ${PORT} in use, retrying on PORT ${ALT_PORT}...`);
    app.listen(ALT_PORT, () => {
      console.log(`=======================================================`);
      console.log(`  PASHU RAKHSAK Biosecurity Server running on PORT ${ALT_PORT}`);
      console.log(`  Health Check: http://localhost:${ALT_PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } else {
    console.error('Server error:', err);
  }
});

