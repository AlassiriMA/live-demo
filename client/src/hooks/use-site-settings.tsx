import { useQuery } from "@tanstack/react-query";

export interface SiteSettings {
  [key: string]: any;
}

/**
 * Hook to fetch site settings from the database
 * @param category Optional category to filter settings
 * @returns The site settings and query status
 */
export function useSiteSettings(category?: string) {
  const endpoint = category ? `/api/settings?category=${category}` : "/api/settings";
  
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<{ success: boolean; settings: SiteSettings }>({
    queryKey: [endpoint],
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    settings: data?.settings || {},
    isLoading,
    error,
    refetch,
  };
}

/**
 * Utility function to get a specific setting value with type safety
 * @param settings The settings object
 * @param key The key of the setting to get
 * @param defaultValue Optional default value if the setting doesn't exist
 * @returns The setting value or default value
 */
export function getSetting<T>(
  settings: SiteSettings,
  key: string,
  defaultValue?: T
): T {
  return settings[key] !== undefined ? settings[key] : defaultValue;
}