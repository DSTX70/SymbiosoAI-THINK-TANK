import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }), // Don't throw on 401, just return null
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    throwOnError: false, // Prevent unhandled promise rejections
    enabled: true, // Always enabled but handle errors gracefully
  });

  // Force loading to false after a reasonable time during development
  const forceNotLoading = React.useRef(false);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      forceNotLoading.current = true;
    }, 3000); // Force not loading after 3 seconds
    
    return () => clearTimeout(timer);
  }, []);

  return {
    user,
    isLoading: isLoading && !forceNotLoading.current,
    isAuthenticated: !!user,
    error,
  };
}