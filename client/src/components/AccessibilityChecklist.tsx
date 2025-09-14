import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock, RefreshCw, Shield } from 'lucide-react';

interface AccessibilityCheck {
  check: string;
  status: 'pass' | 'warning' | 'fail';
  details: string;
  last_run: string;
}

interface AccessibilityResult {
  success: boolean;
  checks: string[];
  results: AccessibilityCheck[];
  summary: {
    total_checks: number;
    passed: number;
    warnings: number;
    overall_score: number;
  };
  result: 'pass' | 'warning' | 'fail';
  message: string;
  error?: string;
}

export default function AccessibilityChecklist() {
  const [result, setResult] = useState<AccessibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccessibilityCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/admin/a11y/quickcheck');
      const data: AccessibilityResult = await response.json();
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to run accessibility check');
      }
    } catch (err) {
      console.error('Error fetching accessibility check:', err);
      setError('Unable to connect to accessibility service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessibilityCheck();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'fail':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'fail':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getOverallStatusColor = (result: string) => {
    switch (result) {
      case 'pass':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'fail':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <Card data-testid="a11y-check" className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Accessibility Quick Check
          </CardTitle>
          <CardDescription>
            Automated accessibility compliance verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="ml-2">Running accessibility checks...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="a11y-check" className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Accessibility Quick Check
          </CardTitle>
          <CardDescription>
            Automated accessibility compliance verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <Button 
            onClick={fetchAccessibilityCheck}
            variant="outline"
            className="mt-4"
            data-testid="button-retry"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Check
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card data-testid="a11y-check" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Accessibility Quick Check
        </CardTitle>
        <CardDescription>
          Automated accessibility compliance verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Status</span>
              <Badge 
                variant="secondary" 
                className={`${getOverallStatusColor(result.result)} font-semibold`}
                data-testid="status-overall"
              >
                {result.result.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{result.message}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{result.summary.overall_score}%</div>
            <div className="text-xs text-muted-foreground">Compliance Score</div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-600">{result.summary.passed}</div>
            <div className="text-xs text-green-600">Passed</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-lg font-bold text-yellow-600">{result.summary.warnings}</div>
            <div className="text-xs text-yellow-600">Warnings</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-lg font-bold text-gray-600">{result.summary.total_checks}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>

        {/* Individual Checks */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Check Results</h4>
          <div className="space-y-2">
            {result.results.map((check, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(check.status)}`}
                data-testid={`check-${check.check}`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <div className="font-medium capitalize">{check.check}</div>
                    <div className="text-xs opacity-75">{check.details}</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {check.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={fetchAccessibilityCheck}
            variant="outline"
            className="flex-1"
            data-testid="button-refresh"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Check
          </Button>
          <Button variant="outline" className="flex-1" data-testid="button-report">
            View Full Report
          </Button>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="text-xs text-muted-foreground cursor-pointer">
              Debug Information
            </summary>
            <pre className="mt-2 bg-gray-50 p-3 rounded text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        )}
      </CardContent>
    </Card>
  );
}