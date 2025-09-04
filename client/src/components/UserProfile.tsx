import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { User, Settings, Bell, Shield, Globe } from "lucide-react";
import type { User as UserType } from "@shared/schema";

export function UserProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Type assertion for user object
  const typedUser = user as UserType;
  
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      updates: false
    },
    privacy: {
      profileVisible: true,
      shareAnalytics: false
    }
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/user/profile'],
    enabled: !!user,
    retry: false,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (newPreferences: typeof preferences) => {
      await apiRequest('/api/user/preferences', {
        method: 'PATCH',
        body: JSON.stringify(newPreferences),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your preferences have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      setIsEditing(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || profileLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please sign in to view your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = typedUser?.firstName && typedUser?.lastName 
    ? `${typedUser.firstName} ${typedUser.lastName}` 
    : typedUser?.email || 'User';

  const initials = typedUser?.firstName && typedUser?.lastName
    ? `${typedUser.firstName[0]}${typedUser.lastName[0]}`
    : typedUser?.email ? typedUser.email[0].toUpperCase() : 'U';

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold" data-testid="heading-profile">User Profile</h1>
      
      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Your account details and basic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarImage 
                src={user.profileImageUrl} 
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="text-lg" data-testid="profile-avatar">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold" data-testid="text-profile-name">
                {displayName}
              </h3>
              <p className="text-muted-foreground" data-testid="text-profile-email">
                {user.email}
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary" data-testid="badge-user-role">
                  {user.role || 'Member'}
                </Badge>
                <Badge variant="outline" data-testid="badge-user-status">
                  Active
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input 
                value={user.firstName || ''} 
                disabled 
                data-testid="input-first-name"
              />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input 
                value={user.lastName || ''} 
                disabled 
                data-testid="input-last-name"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Email</Label>
              <Input 
                value={user.email || ''} 
                disabled 
                data-testid="input-email"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Preferences
          </CardTitle>
          <CardDescription>
            Customize your experience and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Account Settings</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              data-testid="button-edit-preferences"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={preferences.theme} 
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger data-testid="select-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={preferences.language} 
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={preferences.timezone} 
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger data-testid="select-timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </Label>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="text-sm font-normal">
                      Email Notifications
                    </Label>
                    <Switch
                      id="email-notifications"
                      checked={preferences.notifications.email}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, email: checked }
                        }))
                      }
                      disabled={!isEditing}
                      data-testid="switch-email-notifications"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications" className="text-sm font-normal">
                      Push Notifications
                    </Label>
                    <Switch
                      id="push-notifications"
                      checked={preferences.notifications.push}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, push: checked }
                        }))
                      }
                      disabled={!isEditing}
                      data-testid="switch-push-notifications"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="update-notifications" className="text-sm font-normal">
                      Product Updates
                    </Label>
                    <Switch
                      id="update-notifications"
                      checked={preferences.notifications.updates}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ 
                          ...prev, 
                          notifications: { ...prev.notifications, updates: checked }
                        }))
                      }
                      disabled={!isEditing}
                      data-testid="switch-update-notifications"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy
                </Label>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile-visible" className="text-sm font-normal">
                      Public Profile
                    </Label>
                    <Switch
                      id="profile-visible"
                      checked={preferences.privacy.profileVisible}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ 
                          ...prev, 
                          privacy: { ...prev.privacy, profileVisible: checked }
                        }))
                      }
                      disabled={!isEditing}
                      data-testid="switch-profile-visible"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="share-analytics" className="text-sm font-normal">
                      Share Analytics
                    </Label>
                    <Switch
                      id="share-analytics"
                      checked={preferences.privacy.shareAnalytics}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ 
                          ...prev, 
                          privacy: { ...prev.privacy, shareAnalytics: checked }
                        }))
                      }
                      disabled={!isEditing}
                      data-testid="switch-share-analytics"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={() => updatePreferencesMutation.mutate(preferences)}
                disabled={updatePreferencesMutation.isPending}
                data-testid="button-save-preferences"
              >
                {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsEditing(false)}
                data-testid="button-cancel-preferences"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Account status and membership details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Account Created</Label>
              <p className="text-sm text-muted-foreground" data-testid="text-account-created">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Last Updated</Label>
              <p className="text-sm text-muted-foreground" data-testid="text-account-updated">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">User ID</Label>
              <p className="text-sm text-muted-foreground font-mono" data-testid="text-user-id">
                {user.id}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Role</Label>
              <p className="text-sm text-muted-foreground" data-testid="text-user-role">
                {user.role || 'Member'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}