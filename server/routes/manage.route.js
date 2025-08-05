const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  healthCheck
} = require('../controllers/manager.controller');

// Validation middleware
const validateTask = (req, res, next) => {
  const { title } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Title is required and must be a non-empty string' 
    });
  }
  
  req.body.title = title.trim();
  next();
};

// Task routes
router.get('/tasks', getAllTasks);
router.post('/tasks', validateTask, createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.get('/tasks/:id', getTaskById);

// Health check route
router.get('/health', healthCheck);

module.exports = router;