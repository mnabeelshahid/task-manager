import React, { useState } from 'react';
import { Edit2, Trash2, Check, X, Loader2 } from 'lucide-react';
import { tasksApi } from '../api/api';
import type { Task, UpdateTaskRequest } from '../types';

interface EditingTask {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
  onError: (error: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onTaskUpdated, 
  onTaskDeleted, 
  onError 
}) => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null);
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

  const handleToggleComplete = async () => {
    try {
      setUpdating(true);
      onError('');
      
      const updatedTask = await tasksApi.updateTask(task.id, {
        completed: !task.completed
      });
      
      onTaskUpdated(updatedTask);
    } catch (err) {
      onError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleStartEdit = () => {
    setEditingTask({
      id: task.id,
      title: task.title,
      completed: task.completed
    });
    setTitleError('');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setTitleError('');
  };

  const handleSaveEdit = async () => {
    if (!editingTask || !validateTitle(editingTask.title)) {
      return;
    }

    try {
      setUpdating(true);
      onError('');
      
      const updates: UpdateTaskRequest = {};
      
      if (editingTask.title.trim() !== task.title) {
        updates.title = editingTask.title.trim();
      }
      
      if (editingTask.completed !== task.completed) {
        updates.completed = editingTask.completed;
      }
      
      if (Object.keys(updates).length > 0) {
        const updatedTask = await tasksApi.updateTask(editingTask.id, updates);
        onTaskUpdated(updatedTask);
      }
      
      setEditingTask(null);
      setTitleError('');
    } catch (err) {
      onError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setDeleting(true);
      onError('');
      
      await tasksApi.deleteTask(task.id);
      onTaskDeleted(task.id);
    } catch (err) {
      onError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={updating}
          />
        </div>
        
        <div className="task-details">
          {editingTask?.id === task.id ? (
            <div className="edit-form">
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => setEditingTask(prev => 
                  prev ? { ...prev, title: e.target.value } : null
                )}
                className={`task-input ${titleError ? 'error' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
              />
              {titleError && <span className="field-error">{titleError}</span>}
              <label className="checkbox-label edit-checkbox">
                <input
                  type="checkbox"
                  checked={editingTask.completed}
                  onChange={(e) => setEditingTask(prev =>
                    prev ? { ...prev, completed: e.target.checked } : null
                  )}
                />
                <span className="checkbox-text">Completed</span>
              </label>
            </div>
          ) : (
            <>
              <h3 className="task-title">{task.title}</h3>
              <p className="task-meta">
                Created: {new Date(task.createdAt).toLocaleDateString()}
                {task.updatedAt !== task.createdAt && (
                  <> • Updated: {new Date(task.updatedAt).toLocaleDateString()}</>
                )}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="task-actions">
        {editingTask?.id === task.id ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="btn btn-success btn-sm"
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="btn-icon spinning" />
              ) : (
                <Check className="btn-icon" />
              )}
            </button>
            <button
              onClick={handleCancelEdit}
              className="btn btn-secondary btn-sm"
            >
              <X className="btn-icon" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleStartEdit}
              className="btn btn-secondary btn-sm"
              disabled={updating || deleting}
              title="Edit task"
            >
              <Edit2 className="btn-icon" />
            </button>
            <button
              onClick={handleDeleteTask}
              className="btn btn-danger btn-sm"
              disabled={updating || deleting}
              title="Delete task"
            >
              {deleting ? (
                <Loader2 className="btn-icon spinning" />
              ) : (
                <Trash2 className="btn-icon" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;