import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Crown, 
  Shield,
  Building,
  UserPlus,
  Settings
} from 'lucide-react';

interface OrganizationManagerProps {
  userRole: string;
}

export function OrganizationManager({ userRole }: OrganizationManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch organizations
  const { data: organizations, isLoading } = useQuery({
    queryKey: ['/api/organizations'],
    enabled: userRole === 'super_admin'
  });

  // Fetch organization members for selected organization
  const { data: members } = useQuery({
    queryKey: ['/api/organizations', selectedOrganization, 'members'],
    enabled: !!selectedOrganization && userRole === 'super_admin'
  });

  // Create organization form
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      plan: 'free'
    }
  });

  // Create organization mutation
  const createOrganizationMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/organizations', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/organizations'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Organization created",
        description: "New organization has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create organization",
        variant: "destructive",
      });
    }
  });

  const onCreateSubmit = (data: any) => {
    createOrganizationMutation.mutate(data);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4 text-purple-500" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'manager': return <Users className="h-4 w-4 text-green-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'admin': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'manager': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'pro': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'free': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (userRole !== 'super_admin') {
    return (
      <Card data-testid="organization-access-denied">
        <CardHeader>
          <CardTitle>Organization Management</CardTitle>
          <CardDescription>Access denied - Super administrator privileges required</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="organization-manager">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Organization Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage organizations, teams, and member permissions
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="create-organization-button">
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent data-testid="create-organization-dialog">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
              <DialogDescription>
                Add a new organization to the platform
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Acme Corporation" 
                          {...field}
                          data-testid="input-organization-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief description of the organization" 
                          {...field}
                          data-testid="input-organization-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-organization-plan">
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createOrganizationMutation.isPending}
                    data-testid="submit-create-organization"
                  >
                    {createOrganizationMutation.isPending ? 'Creating...' : 'Create Organization'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Organizations Table */}
      <Card data-testid="organizations-table">
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            All organizations in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          ) : organizations?.organizations?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.organizations.map((org: any) => (
                  <TableRow 
                    key={org.id} 
                    className={selectedOrganization === org.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    data-testid={`organization-row-${org.id}`}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{org.name}</div>
                          {org.description && (
                            <div className="text-xs text-muted-foreground">
                              {org.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPlanColor(org.plan)}>
                        {org.plan.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {org.memberCount || 0} members
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="text-green-600 bg-green-50 border-green-200">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrganization(
                            selectedOrganization === org.id ? '' : org.id
                          )}
                          data-testid={`view-organization-${org.id}`}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          {selectedOrganization === org.id ? 'Hide' : 'View'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`edit-organization-${org.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No organizations found</p>
              <p className="text-sm">Create your first organization to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organization Members (when organization is selected) */}
      {selectedOrganization && members && (
        <Card data-testid="organization-members">
          <CardHeader>
            <CardTitle>Organization Members</CardTitle>
            <CardDescription>
              Members and their roles in the selected organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {members.members?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.members.map((member: any) => (
                    <TableRow key={member.id} data-testid={`member-row-${member.id}`}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{member.user?.email || member.userId}</div>
                            <div className="text-xs text-muted-foreground">
                              {member.user?.firstName} {member.user?.lastName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(member.role)}
                          <Badge className={getRoleColor(member.role)}>
                            {member.role.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {member.user?.updatedAt ? 
                            new Date(member.user.updatedAt).toLocaleDateString() : 
                            'Never'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`edit-member-${member.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {member.role !== 'super_admin' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              data-testid={`remove-member-${member.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No members found</p>
                <p className="text-sm">Invite users to join this organization</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}