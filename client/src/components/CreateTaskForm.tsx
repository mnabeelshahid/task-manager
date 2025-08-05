import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { tasksApi } from '../api/api';
import type { Task, CreateTaskRequest } from '../types';

interface CreateTaskFormProps {
  onTaskCreated: (task: Task) => void;
  onError: (error: string) => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onTaskCreated, onError }) => {
  const [creating, setCreating] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskCompleted, setNewTaskCompleted] = useState<boolean>(false);
  const [titleError, setTitleError] = useState<string>('');

  const validateTitle = (title: string): boolean => {
    if (!title.trim()) {
      setTitleError('Task title is required');
      return false;
    }
    if (title.trim().length < 2) {
      setTitleError('Task title must be at least 2 characters long');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTitle(newTaskTitle)) {
      return;
    }

    try {
      setCreating(true);
      onError('');
      
      const taskData: CreateTaskRequest = {
        title: newTaskTitle.trim(),
      };
      
      const newTask = await tasksApi.createTask(taskData);
      
      // If task should be created as completed, update it
      if (newTaskCompleted) {
        const updatedTask = await tasksApi.updateTask(newTask.id, { completed: true });
        onTaskCreated(updatedTask);
      } else {
        onTaskCreated(newTask);
      }
      
      // Reset form
      setNewTaskTitle('');
      setNewTaskCompleted(false);
      setTitleError('');
      
    } catch (err) {
      onError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="create-task-section">
      <h2>Add New Task</h2>
      <form onSubmit={handleCreateTask} className="create-task-form">
        <div className="form-group">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title..."
            className={`task-input ${titleError ? 'error' : ''}`}
            disabled={creating}
          />
          {titleError && <span className="field-error">{titleError}</span>}
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newTaskCompleted}
              onChange={(e) => setNewTaskCompleted(e.target.checked)}
              disabled={creating}
            />
            <span className="checkbox-text">Mark as completed</span>
          </label>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={creating || !newTaskTitle.trim()}
        >
          {creating ? (
            <>
              <Loader2 className="btn-icon spinning" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="btn-icon" />
              Add Task
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskForm;