const express = require('express');
const cors = require('cors');
const path = require('path');
const manageRoutes = require('./routes/manage.route');

const app = express();
const PORT = process.env.PORT || 5000;
const TASKS_FILE = path.join(__dirname, 'data', 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', manageRoutes);

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found' 
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Task Manager API is running on http://localhost:${PORT}`);
  console.log(`📁 Data file: ${TASKS_FILE}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Task Manager API...');
  process.exit(0);
});