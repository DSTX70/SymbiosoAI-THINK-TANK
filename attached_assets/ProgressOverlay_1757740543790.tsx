import React from 'react';

type Props = {
  progress: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
};

export default function ProgressOverlay({ progress, status }: Props) {
  if (status === 'idle') return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-[320px] shadow-lg">
        <div className="mb-2 font-semibold">Processing…</div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 rounded"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%`, background: '#444' }}
          />
        </div>
        <div className="mt-2 text-sm">
          {status === 'running' && `Working (${Math.round(progress)}%)`}
          {status === 'completed' && 'Completed'}
          {status === 'failed' && 'Failed — please retry'}
        </div>
      </div>
    </div>
  );
}
