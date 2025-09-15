import React from 'react';
import { AlertCircle } from 'lucide-react';

const ValidationError = ({ error }) => {
  if (!error) return null;

  return (
    <div className="flex items-center gap-1 mt-1 text-sm text-red-600 dark:text-red-400">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

export default ValidationError;