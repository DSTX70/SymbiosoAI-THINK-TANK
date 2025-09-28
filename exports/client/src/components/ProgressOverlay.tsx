import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, AlertCircle, CheckCircle2, Loader2, Brain, Zap, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type ProgressStatus = 'idle' | 'connecting' | 'running' | 'completed' | 'failed' | 'reconnecting';

type Props = {
  progress: number;
  status: ProgressStatus;
  title?: string;
  description?: string;
  currentStep?: string;
  error?: string | null;
  onCancel?: () => void;
  allowCancel?: boolean;
  showDetails?: boolean;
  debateInfo?: {
    activeAgents?: string[];
    currentRound?: number;
    totalRounds?: number;
    consensusLevel?: number;
    phase?: string;
  };
};

const statusIcons = {
  connecting: Loader2,
  running: Brain,
  completed: CheckCircle2,
  failed: AlertCircle,
  reconnecting: Zap,
  idle: Brain
};

const statusColors = {
  connecting: 'text-blue-500',
  running: 'text-blue-500',
  completed: 'text-green-500',
  failed: 'text-red-500',
  reconnecting: 'text-orange-500',
  idle: 'text-gray-500'
};

export default function ProgressOverlay({ 
  progress, 
  status, 
  title = "Processing AI Analysis",
  description,
  currentStep,
  error,
  onCancel,
  allowCancel = false,
  showDetails = false,
  debateInfo
}: Props) {
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  if (status === 'idle') return null;

  const IconComponent = statusIcons[status];
  const iconColor = statusColors[status];
  
  const shouldShowCancel = allowCancel && onCancel && (status === 'running' || status === 'connecting');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" data-testid="progress-overlay">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${iconColor}`}>
                <IconComponent 
                  size={20} 
                  className={status === 'connecting' || status === 'reconnecting' ? 'animate-spin' : ''}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
            </div>
            {shouldShowCancel && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                className="h-8 w-8 p-0"
                data-testid="cancel-button"
              >
                <X size={16} />
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {currentStep || getStatusMessage(status, debateInfo)}
              </span>
              {status === 'running' && (
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {Math.round(animatedProgress)}%
                </span>
              )}
            </div>
            
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  status === 'completed' 
                    ? 'bg-green-500' 
                    : status === 'failed' 
                      ? 'bg-red-500'
                      : status === 'reconnecting'
                        ? 'bg-orange-500 animate-pulse'
                        : 'bg-blue-500'
                }`}
                style={{ 
                  width: `${Math.max(0, Math.min(100, status === 'completed' ? 100 : animatedProgress))}%` 
                }}
                data-testid="progress-bar"
              />
            </div>
          </div>

          {/* Status Message */}
          <div className="mt-3 flex items-center justify-between">
            <span className={`text-sm font-medium ${
              status === 'completed' ? 'text-green-600 dark:text-green-400' :
              status === 'failed' ? 'text-red-600 dark:text-red-400' :
              status === 'reconnecting' ? 'text-orange-600 dark:text-orange-400' :
              'text-blue-600 dark:text-blue-400'
            }`}>
              {getStatusDisplay(status)}
            </span>
            
            {showDetails && debateInfo && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailsPanel(!showDetailsPanel)}
                className="text-xs h-6"
              >
                {showDetailsPanel ? 'Hide Details' : 'Show Details'}
              </Button>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && status === 'failed' && (
          <div className="px-6 pb-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Debate Details Panel */}
        {showDetailsPanel && debateInfo && (
          <div className="px-6 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            {debateInfo.phase && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Phase:</span>
                <span className="font-medium capitalize">{debateInfo.phase}</span>
              </div>
            )}
            
            {debateInfo.currentRound !== undefined && debateInfo.totalRounds !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Round:</span>
                <span className="font-medium">{debateInfo.currentRound}/{debateInfo.totalRounds}</span>
              </div>
            )}
            
            {debateInfo.consensusLevel !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Consensus:</span>
                <span className="font-medium">{Math.round(debateInfo.consensusLevel)}%</span>
              </div>
            )}
            
            {debateInfo.activeAgents && debateInfo.activeAgents.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Agents:</span>
                <div className="flex flex-wrap gap-1">
                  {debateInfo.activeAgents.map((agent, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs"
                    >
                      <Users size={10} />
                      {agent}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getStatusMessage(status: ProgressStatus, debateInfo?: any): string {
  if (debateInfo?.phase) {
    switch (debateInfo.phase) {
      case 'initializing': return 'Setting up debate...';
      case 'debating': return `Round ${debateInfo.currentRound || 1} in progress...`;
      case 'consensus': return 'Building consensus...';
      case 'complete': return 'Debate completed';
      default: return 'Processing...';
    }
  }

  switch (status) {
    case 'connecting': return 'Connecting...';
    case 'running': return 'Processing...';
    case 'reconnecting': return 'Reconnecting...';
    case 'completed': return 'Complete';
    case 'failed': return 'Failed';
    default: return 'Processing...';
  }
}

function getStatusDisplay(status: ProgressStatus): string {
  switch (status) {
    case 'connecting': return 'Connecting...';
    case 'running': return 'In Progress';
    case 'reconnecting': return 'Reconnecting...';
    case 'completed': return 'Completed ✅';
    case 'failed': return 'Failed ❌';
    default: return 'Processing';
  }
}