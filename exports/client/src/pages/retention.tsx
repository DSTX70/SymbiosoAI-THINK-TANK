import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEntitlements } from "@/hooks/useEntitlements";
import { useI18n } from "@/hooks/useI18n";
import { AlertCircle, Shield, Clock, Archive, FileText, Scale } from "lucide-react";

export default function RetentionPage() {
  const { can } = useEntitlements();
  const { t } = useI18n();

  // Check if retention admin feature is enabled
  if (!can.useRetentionAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Feature Not Available</h2>
            <p className="text-muted-foreground mb-4">
              Data retention and legal hold management are not enabled for your workspace.
            </p>
            <p className="text-sm text-muted-foreground">
              Contact your administrator or upgrade your plan to access this feature.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: retentionStats } = useQuery({
    queryKey: ['/api/retention/stats'],
    enabled: true,
  });

  const { data: policies = [] } = useQuery({
    queryKey: ['/api/retention/policies'],
    enabled: true,
  });

  const { data: legalHolds = [] } = useQuery({
    queryKey: ['/api/retention/legal-holds'],
    enabled: true,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Archive className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('retention.policies')}
            </h1>
            <p className="text-muted-foreground">
              Manage data retention policies and legal holds
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Policies</p>
                  <p className="text-2xl font-bold">{retentionStats?.activePolicies || 3}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Legal Holds</p>
                  <p className="text-2xl font-bold">{legalHolds.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jobs Today</p>
                  <p className="text-2xl font-bold">{retentionStats?.jobsRunToday || 1}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Archive className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data Scanned</p>
                  <p className="text-2xl font-bold">{retentionStats?.totalDataScanned || 2547}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="policies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="policies">Retention Policies</TabsTrigger>
          <TabsTrigger value="legal-holds">Legal Holds</TabsTrigger>
          <TabsTrigger value="jobs">Scheduled Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Data Retention Policies</h2>
            <Button data-testid="create-policy">Create Policy</Button>
          </div>
          
          <div className="grid gap-4">
            {[
              {
                id: 'policy-1',
                name: 'Analysis Sessions Retention',
                dataType: 'analysis_sessions',
                retentionDays: 90,
                status: 'active',
                lastRun: '2024-01-14T02:00:00Z'
              },
              {
                id: 'policy-2', 
                name: 'Reports Retention',
                dataType: 'reports',
                retentionDays: 365,
                status: 'active',
                lastRun: '2024-01-14T02:00:00Z'
              },
              {
                id: 'policy-3',
                name: 'Audit Logs Retention',
                dataType: 'audit_logs', 
                retentionDays: 2555,
                status: 'active',
                lastRun: '2024-01-14T02:00:00Z'
              }
            ].map((policy) => (
              <Card key={policy.id} data-testid={`policy-${policy.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{policy.name}</CardTitle>
                    <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                      {policy.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Data Type</p>
                      <p className="font-medium">{policy.dataType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Retention Period</p>
                      <p className="font-medium">{policy.retentionDays} days</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Run</p>
                      <p className="font-medium">
                        {new Date(policy.lastRun).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Run Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="legal-holds" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{t('retention.legal_holds')}</h2>
            <Button data-testid="create-legal-hold">Create Legal Hold</Button>
          </div>
          
          <Card>
            <CardContent className="p-12 text-center">
              <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Legal Holds</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                No legal holds are currently in effect. Legal holds prevent automatic data deletion for litigation or regulatory requirements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Scheduled Retention Jobs</h2>
            <Button data-testid="create-job">Schedule Job</Button>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Daily Retention Scan</h4>
                      <p className="text-sm text-muted-foreground">
                        Runs daily at 2:00 AM - Next run in 8 hours
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Archive className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">Analysis Sessions Cleanup</h4>
                      <p className="text-sm text-muted-foreground">
                        Last run: Today at 2:00 AM - 0 items deleted (dry run)
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}