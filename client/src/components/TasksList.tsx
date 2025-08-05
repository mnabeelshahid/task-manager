import React from 'react';
import type { Task } from '../types';
import TaskItem from './TaskItem';

interface TasksListProps {
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
  onError: (error: string) => void;
}

const TasksList: React.FC<TasksListProps> = ({ 
  tasks, 
  onTaskUpdated, 
  onTaskDeleted, 
  onError 
}) => {
  return (
    <div className="tasks-list-section">
      <div className="tasks-list-header">
        <h2>Tasks</h2>
        <span className="tasks-count">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Create your first task above!</p>
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