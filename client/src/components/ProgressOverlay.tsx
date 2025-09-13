import React from 'react';

type Props = {
  progress: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
};

export default function ProgressOverlay({ progress, status }: Props) {
  if (status === 'idle') return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" data-testid="progress-overlay">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-[320px] shadow-lg">
        <div className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
          Processing AI Analysis…
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
          <div
            className="h-2 rounded bg-blue-500 transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            data-testid="progress-bar"
          />
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {status === 'running' && `Working (${Math.round(progress)}%)`}
          {status === 'completed' && 'Completed ✅'}
          {status === 'failed' && 'Failed — please retry ❌'}
        </div>
      </div>
    </div>
  );
}