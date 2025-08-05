import React, { useState, useEffect } from 'react';
import { tasksApi } from '../api/api';
import type { Task } from '../types';
import TasksHeader from '../components/TasksHeader';
import CreateTaskForm from '../components/CreateTaskForm';
import TasksList from '../components/TasksList';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const tasksData = await tasksApi.getAllTasks();
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev => 
      prev.map(t => t.id === updatedTask.id ? updatedTask : t)
    );
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const setGlobalError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (loading) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  return (
    <div className="tasks-container">
      <TasksHeader />
      
      <ErrorMessage error={error} />
      
      <CreateTaskForm 
        onTaskCreated={handleTaskCreated}
        onError={setGlobalError}
      />
      
      <TasksList 
        tasks={tasks}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
        onError={setGlobalError}
      />
    </div>
  );
};

export default TasksPage;