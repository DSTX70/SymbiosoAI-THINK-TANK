import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface AuthUser {
  id: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  role: string;
  preferences?: any;
  subscription?: any;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  permissions?: Record<string, boolean>;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }), // Don't throw on 401, just return null
    retry: 1, // Only retry once
    retryDelay: 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: false,
    staleTime: 0, // Always fetch fresh data
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    throwOnError: false, // Prevent unhandled promise rejections
    enabled: true, // Always enabled but handle errors gracefully
  });

  // Simplified loading state - don't block the UI for too long
  const [maxWaitPassed, setMaxWaitPassed] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMaxWaitPassed(true);
    }, 1500); // Only wait 1.5 seconds max
    
    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    isLoading: isLoading && !maxWaitPassed,
    isAuthenticated: !!user,
    error,
  };
}
