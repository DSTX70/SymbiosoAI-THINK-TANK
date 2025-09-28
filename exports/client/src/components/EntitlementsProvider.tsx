import { useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EntitlementsContext, type EntitlementsContextType, type FeatureFlags, defaultFeatureFlags } from '@/hooks/useEntitlements';

interface EntitlementsProviderProps {
  children: ReactNode;
}

export function EntitlementsProvider({ children }: EntitlementsProviderProps) {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(defaultFeatureFlags);
  const [isLoading, setIsLoading] = useState(true);

  // Query feature flags from the API
  const { data: apiFlags, isLoading: queryLoading } = useQuery<FeatureFlags>({
    queryKey: ['/api/feature-flags'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/feature-flags');
        if (response.ok) {
          return await response.json();
        }
        // Return defaults if API fails
        return defaultFeatureFlags;
      } catch (error) {
        console.warn('Failed to load feature flags, using defaults:', error);
        return defaultFeatureFlags;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Update feature flags when API data is available
  useEffect(() => {
    if (apiFlags) {
      setFeatureFlags(apiFlags);
    }
    setIsLoading(queryLoading);
  }, [apiFlags, queryLoading]);

  // Helper function to check if a feature is enabled
  const hasFeature = (feature: keyof FeatureFlags): boolean => {
    return featureFlags[feature] === true;
  };

  // Function to reload feature flags
  const loadFeatureFlags = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/feature-flags');
      if (response.ok) {
        const flags = await response.json();
        setFeatureFlags(flags);
      }
    } catch (error) {
      console.error('Failed to reload feature flags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: EntitlementsContextType = {
    featureFlags,
    hasFeature,
    loadFeatureFlags,
    isLoading,
  };

  return (
    <EntitlementsContext.Provider value={contextValue}>
      {children}
    </EntitlementsContext.Provider>
  );
}