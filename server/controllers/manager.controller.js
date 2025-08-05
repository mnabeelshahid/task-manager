const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TASKS_FILE = path.join(__dirname, '..', 'data', 'tasks.json');

// Utility functions for file operations
const readTasks = async () => {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty array
    if (error.code === 'ENOENT') {
      await writeTasks([]);
      return [];
    }
    throw error;
  }
};

const writeTasks = async (tasks) => {
  try {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(TASKS_FILE), { recursive: true });
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks:', error);
    throw error;
  }
};

// Controller functions
const getAllTasks = async (req, res) => {
  try {
    const tasks = await readTasks();
    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('Error reading tasks:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve tasks' 
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const tasks = await readTasks();
    
    const newTask = {
      id: uuidv4(),
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    await writeTasks(tasks);
    
    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create task' 
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Task not found' 
      });
    }
    
    // Validate updates
    const updates = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Title must be a non-empty string' 
        });
      }
      updates.title = title.trim();
    }
    
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ 
          success: false,
          error: 'Completed must be a boolean' 
        });
      }
      updates.completed = completed;
    }
    
    // Update task
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await writeTasks(tasks);
    
    res.json({
      success: true,
      data: tasks[taskIndex],
      message: 'Task updated successfully'
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update task' 
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const initialLength = tasks.length;
    
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === initialLength) {
      return res.status(404).json({ 
        success: false,
        error: 'Task not found' 
      });
    }
    
    await writeTasks(filteredTasks);
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete task' 
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await readTasks();
    const task = tasks.find(task => task.id === id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        error: 'Task not found' 
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error retrieving task:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve task' 
    });
  }
};

const healthCheck = (req, res) => {
  res.json({ 
    success: true,
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
  healthCheck
};