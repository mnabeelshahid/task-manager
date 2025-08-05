import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="tasks-container">
      <div className="loading-container">
        <Loader2 className="loading-spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;