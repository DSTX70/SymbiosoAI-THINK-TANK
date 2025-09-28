import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, DollarSign, Calendar, AlertCircle } from 'lucide-react';

interface BillingPortal {
  url: string;
  expiresAt: string;
}

interface BillingData {
  success: boolean;
  url?: string;
  expiresAt?: string;
  error?: string;
}

export default function AdminBilling() {
  const [portal, setPortal] = useState<BillingPortal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingPortal = async () => {
      try {
        setLoading(true);
        const response = await fetch('/billing/portal');
        const data: BillingData = await response.json();
        
        if (data.success && data.url) {
          setPortal({
            url: data.url,
            expiresAt: data.expiresAt || new Date(Date.now() + 60 * 60 * 1000).toISOString()
          });
          setError(null);
        } else {
          setError(data.error || 'Failed to load billing portal');
        }
      } catch (err) {
        console.error('Error fetching billing portal:', err);
        setError('Unable to connect to billing system');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingPortal();
  }, []);

  const handlePortalAccess = () => {
    if (portal?.url) {
      window.open(portal.url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatExpiryTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Card data-testid="admin-billing" className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Billing Management
          </CardTitle>
          <CardDescription>
            Access your organization's billing and invoice management portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading billing portal...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="admin-billing" className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Billing Management
          </CardTitle>
          <CardDescription>
            Access your organization's billing and invoice management portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="admin-billing" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Billing Management
        </CardTitle>
        <CardDescription>
          Access your organization's billing and invoice management portal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Invoice Portal</p>
            <p className="text-sm text-muted-foreground">
              Manage subscriptions, view invoices, and update payment methods
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Active
          </Badge>
        </div>

        {portal && (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">
              Portal expires: {formatExpiryTime(portal.expiresAt)}
            </div>
            
            <Button 
              onClick={handlePortalAccess}
              className="w-full"
              data-testid="button-portal"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Access Billing Portal
            </Button>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium">Billing Portal Access</p>
              <p className="mt-1">The portal provides secure access to your billing history, subscription management, and payment settings. Links expire after 1 hour for security.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}