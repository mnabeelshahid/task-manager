import React from 'react';
import { Filter, CheckCircle, Circle, List } from 'lucide-react';
import type { FilterType } from '../pages/Tasks';

interface TaskCounts {
  all: number;
  completed: number;
  incomplete: number;
}

interface TasksFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: TaskCounts;
}

const TasksFilter: React.FC<TasksFilterProps> = ({ 
  activeFilter, 
  onFilterChange, 
  taskCounts 
}) => {
  const filterOptions: Array<{
    key: FilterType;
    label: string;
    icon: React.ReactNode;
    count: number;
  }> = [
    {
      key: 'all',
      label: 'All Tasks',
      icon: <List className="filter-icon" />,
      count: taskCounts.all,
    },
    {
      key: 'incomplete',
      label: 'Incomplete',
      icon: <Circle className="filter-icon" />,
      count: taskCounts.incomplete,
    },
    {
      key: 'completed',
      label: 'Completed',
      icon: <CheckCircle className="filter-icon" />,
      count: taskCounts.completed,
    },
  ];

  return (
    <div className="tasks-filter-section">
      <div className="filter-header">
        <Filter className="filter-header-icon" />
        <h3>Filter Tasks</h3>
      </div>
      
      <div className="filter-buttons">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onFilterChange(option.key)}
            className={`filter-btn ${activeFilter === option.key ? 'active' : ''}`}
          >
            {option.icon}
            <span className="filter-label">{option.label}</span>
            <span className="filter-count">{option.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TasksFilter;