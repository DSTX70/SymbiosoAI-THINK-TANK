import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Clock, DollarSign, Bell, Workflow, Play, CheckCircle2, AlertCircle } from "lucide-react";

interface TimeLog {
  id: string;
  description: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  billableRate: string;
  isBillable: boolean;
  isInvoiced: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientEmail: string;
  status: string;
  totalAmount: string;
  dueDate: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: string;
  usageCount: number;
  tags: string[];
}

export default function AutomationPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTimeLog, setActiveTimeLog] = useState<string | null>(null);

  // Mock user for demo
  const mockUser = {
    id: "demo-user",
    organizationId: "demo-org",
    email: "demo@example.com"
  };

  // Time Tracking Mutations
  const startTimeMutation = useMutation({
    mutationFn: async (data: { description: string; billableRate: number }) => {
      const response = await fetch("/api/automation/time-logs/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          organizationId: mockUser.organizationId,
          userId: mockUser.id,
          isBillable: true
        })
      });
      return response.json();
    },
    onSuccess: (data) => {
      setActiveTimeLog(data.timeLogId);
      toast({ title: "Time tracking started!", description: "Your session is now being tracked." });
    }
  });

  const stopTimeMutation = useMutation({
    mutationFn: async (timeLogId: string) => {
      const response = await fetch(`/api/automation/time-logs/${timeLogId}/stop`, {
        method: "POST"
      });
      return response.json();
    },
    onSuccess: () => {
      setActiveTimeLog(null);
      toast({ title: "Time tracking stopped!", description: "Your session has been logged." });
      queryClient.invalidateQueries({ queryKey: ["/api/automation/time-logs/billable"] });
    }
  });

  // Invoice Generation
  const generateInvoiceMutation = useMutation({
    mutationFn: async (data: { clientEmail: string; timeLogIds: string[]; dueDate: string }) => {
      const response = await fetch("/api/automation/invoices/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          organizationId: mockUser.organizationId
        })
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Invoice generated!", description: "Your invoice has been created successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/automation/invoices"] });
    }
  });

  // Workflow Templates Query
  const { data: workflowTemplates } = useQuery({
    queryKey: ["/api/automation/workflow-templates"],
    queryFn: async () => {
      const response = await fetch("/api/automation/workflow-templates?isPublic=true");
      const data = await response.json();
      return data.templates || [];
    }
  });

  // Execute Workflow
  const executeWorkflowMutation = useMutation({
    mutationFn: async (data: { templateId: string; input: any }) => {
      const response = await fetch("/api/automation/workflows/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          organizationId: mockUser.organizationId,
          userId: mockUser.id
        })
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Workflow started!", description: "Your automation workflow is now running." });
    }
  });

  // Create Notification
  const createNotificationMutation = useMutation({
    mutationFn: async (data: { title: string; message: string; type: string; priority: string }) => {
      const response = await fetch("/api/automation/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId: mockUser.id,
          organizationId: mockUser.organizationId,
          deliveryMethods: ["in_app"]
        })
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Notification created!", description: "Your smart notification has been sent." });
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Workflow className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Enterprise Automation Suite</h1>
        <Badge variant="secondary" className="ml-2">Phase 3 Features</Badge>
      </div>

      <Tabs defaultValue="time-tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="time-tracking" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Time Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="invoicing" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Invoicing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Smart Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center space-x-2">
            <Workflow className="h-4 w-4" />
            <span>Workflow Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="time-tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Time Tracking & Billing</span>
              </CardTitle>
              <CardDescription>
                Track billable hours automatically with smart time logging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!activeTimeLog ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description">Task Description</Label>
                    <Input
                      id="description"
                      placeholder="Working on client project..."
                      data-testid="input-task-description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rate">Hourly Rate ($)</Label>
                    <Input
                      id="rate"
                      type="number"
                      placeholder="150"
                      data-testid="input-hourly-rate"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      const description = (document.getElementById("description") as HTMLInputElement)?.value;
                      const rate = parseFloat((document.getElementById("rate") as HTMLInputElement)?.value || "0");
                      if (description && rate > 0) {
                        startTimeMutation.mutate({ description, billableRate: rate });
                      }
                    }}
                    className="col-span-2"
                    disabled={startTimeMutation.isPending}
                    data-testid="button-start-time-tracking"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Time Tracking
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <div className="animate-pulse bg-green-500 rounded-full h-3 w-3"></div>
                    <span className="font-semibold">Time tracking active</span>
                  </div>
                  <Button
                    onClick={() => stopTimeMutation.mutate(activeTimeLog)}
                    variant="destructive"
                    disabled={stopTimeMutation.isPending}
                    data-testid="button-stop-time-tracking"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Stop & Save Time Log
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoicing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Automated Invoice Generation</span>
              </CardTitle>
              <CardDescription>
                Generate professional invoices from time logs with smart calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client-email">Client Email</Label>
                  <Input
                    id="client-email"
                    type="email"
                    placeholder="client@company.com"
                    data-testid="input-client-email"
                  />
                </div>
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    data-testid="input-due-date"
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  const clientEmail = (document.getElementById("client-email") as HTMLInputElement)?.value;
                  const dueDate = (document.getElementById("due-date") as HTMLInputElement)?.value;
                  if (clientEmail && dueDate) {
                    generateInvoiceMutation.mutate({
                      clientEmail,
                      dueDate,
                      timeLogIds: ["demo-time-log"] // Demo data
                    });
                  }
                }}
                disabled={generateInvoiceMutation.isPending}
                data-testid="button-generate-invoice"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Smart Notification System</span>
              </CardTitle>
              <CardDescription>
                Intelligent alerts with personalized delivery preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notif-title">Notification Title</Label>
                  <Input
                    id="notif-title"
                    placeholder="Project milestone reached"
                    data-testid="input-notification-title"
                  />
                </div>
                <div>
                  <Label htmlFor="notif-message">Message</Label>
                  <Textarea
                    id="notif-message"
                    placeholder="Your project has reached an important milestone..."
                    data-testid="textarea-notification-message"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notif-type">Type</Label>
                    <Select defaultValue="project" data-testid="select-notification-type">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="invoice">Invoice</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="workflow">Workflow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notif-priority">Priority</Label>
                    <Select defaultValue="medium" data-testid="select-notification-priority">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    const title = (document.getElementById("notif-title") as HTMLInputElement)?.value;
                    const message = (document.getElementById("notif-message") as HTMLTextAreaElement)?.value;
                    if (title && message) {
                      createNotificationMutation.mutate({
                        title,
                        message,
                        type: "project",
                        priority: "medium"
                      });
                    }
                  }}
                  disabled={createNotificationMutation.isPending}
                  data-testid="button-create-notification"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Send Smart Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Workflow className="h-5 w-5" />
                <span>Workflow Template Library</span>
              </CardTitle>
              <CardDescription>
                Pre-built automation templates for common business processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {workflowTemplates?.map((template: WorkflowTemplate) => (
                  <Card key={template.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {template.tags?.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            ⭐ {template.rating} | Used {template.usageCount} times
                          </div>
                          <Button
                            size="sm"
                            onClick={() => executeWorkflowMutation.mutate({
                              templateId: template.id,
                              input: {
                                clientEmail: "demo@client.com",
                                projectName: "Demo Project",
                                organizationName: "SymbiosoAi ThinkTank"
                              }
                            })}
                            disabled={executeWorkflowMutation.isPending}
                            className="mt-2"
                            data-testid={`button-execute-workflow-${template.id}`}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Execute
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Phase 3 Automation Features</h4>
            <p className="text-blue-800 text-sm">
              This demonstration showcases the enterprise automation capabilities including smart time tracking,
              automated invoice generation, intelligent notifications, and pre-built workflow templates.
              All features include comprehensive API integration and real-time processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}