import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { LogIn, LogOut, User, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType } from "@shared/schema";

export function AuthButton() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Type assertion for user object
  const typedUser = user as UserType;

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled data-testid="auth-loading">
        Loading...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return <DemoLoginForm />;
  }

  const displayName = typedUser?.firstName && typedUser?.lastName 
    ? `${typedUser.firstName} ${typedUser.lastName}` 
    : typedUser?.email || 'User';

  const initials = typedUser?.firstName && typedUser?.lastName
    ? `${typedUser.firstName[0]}${typedUser.lastName[0]}`
    : typedUser?.email ? typedUser.email[0].toUpperCase() : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="button-user-menu">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={typedUser?.profileImageUrl || undefined} 
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback data-testid="avatar-initials">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {displayName && (
              <p className="font-medium text-sm" data-testid="text-display-name">
                {displayName}
              </p>
            )}
            {typedUser?.email && (
              <p className="w-[200px] truncate text-xs text-muted-foreground" data-testid="text-user-email">
                {typedUser.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" data-testid="link-profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" data-testid="link-settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => window.location.href = "/api/logout"}
          data-testid="button-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DemoLoginForm() {
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("demo123");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/demo-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Welcome to the If When Always Platform",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setShowForm(false);
      // Force a refresh of auth state without full page reload
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
      }, 100);
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    },
  });

  // Always show demo login - remove environment gating for visibility
  const isDevelopment = true;

  if (!showForm) {
    return (
      <div className="flex gap-2">
        {isDevelopment && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setShowForm(true)}
            data-testid="button-demo-login"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Demo Login
          </Button>
        )}
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => window.location.href = "/api/login"}
          data-testid="button-oauth-login"
          className="bg-white text-gray-900 hover:bg-gray-100"
        >
          OAuth Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 border rounded-lg bg-card min-w-[200px]">
      <div className="text-sm font-medium">Demo Login</div>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        data-testid="input-demo-username"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        data-testid="input-demo-password"
      />
      <div className="flex gap-2">
        <Button 
          size="sm" 
          onClick={() => loginMutation.mutate({ username, password })}
          disabled={loginMutation.isPending}
          data-testid="button-demo-submit"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowForm(false)}
          data-testid="button-demo-cancel"
        >
          Cancel
        </Button>
      </div>
      <div className="text-xs text-muted-foreground">
        Default: demo / demo123
      </div>
    </div>
  );
}