import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User, Settings } from "lucide-react";
import { Link } from "wouter";
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
    return (
      <Button 
        variant="default" 
        size="sm" 
        onClick={() => window.location.href = "/api/login"}
        data-testid="button-login"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
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
              src={typedUser?.profileImageUrl} 
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