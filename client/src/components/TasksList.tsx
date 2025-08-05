import React from 'react';
import type { Task } from '../types';
import type { FilterType } from '../pages/Tasks';
import TaskItem from './TaskItem';

interface TasksListProps {
  tasks: Task[];
  activeFilter: FilterType;
  totalTasks: number;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
  onError: (error: string) => void;
}

const TasksList: React.FC<TasksListProps> = ({ 
  tasks, 
  activeFilter,
  totalTasks,
  onTaskUpdated, 
  onTaskDeleted, 
  onError 
}) => {
  const getFilteredMessage = () => {
    switch (activeFilter) {
      case 'completed':
        return tasks.length === 0 
          ? 'No completed tasks yet!' 
          : `Showing ${tasks.length} completed task${tasks.length !== 1 ? 's' : ''}`;
      case 'incomplete':
        return tasks.length === 0 
          ? 'All tasks are completed! 🎉' 
          : `Showing ${tasks.length} incomplete task${tasks.length !== 1 ? 's' : ''}`;
      case 'all':
      default:
        return `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
    }
  };

  const getEmptyStateMessage = () => {
    if (totalTasks === 0) {
      return 'No tasks yet. Create your first task above!';
    }
    
    switch (activeFilter) {
      case 'completed':
        return 'No completed tasks yet. Mark some tasks as complete!';
      case 'incomplete':
        return 'All tasks are completed! Great job! 🎉';
      case 'all':
      default:
        return 'No tasks found.';
    }
  };

  return (
    <div className="tasks-list-section">
      <div className="tasks-list-header">
        <h2>Tasks</h2>
        <span className="tasks-count">{getFilteredMessage()}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>{getEmptyStateMessage()}</p>
          {activeFilter !== 'all' && totalTasks > 0 && (
            <p className="empty-state-hint">
              Try switching to "All Tasks" to see all your tasks.
            </p>
          )}
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskUpdated={onTaskUpdated}
              onTaskDeleted={onTaskDeleted}
              onError={onError}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksList;