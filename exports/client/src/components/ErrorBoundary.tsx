import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full mx-auto p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                The application encountered an unexpected error. Please try refreshing the page.
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
                data-testid="button-refresh"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}