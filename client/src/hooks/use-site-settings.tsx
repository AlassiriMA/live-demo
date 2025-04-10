import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";

export interface SiteSettings {
  [key: string]: any;
}

/**
 * Hook to fetch site settings from the database
 * @param category Optional category to filter settings
 * @returns The site settings and query status
 */
export function useSiteSettings(category?: string) {
  const queryKey = category 
    ? [`/api/site-settings?category=${category}`] 
    : ['/api/site-settings'];
    
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery<{ success: boolean; settings: SiteSettings }>({
    queryKey,
    queryFn: getQueryFn(),
  });

  return {
    settings: data?.settings || {},
    isLoading,
    error: error as Error | null,
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
  if (key in settings) {
    return settings[key] as T;
  }
  return defaultValue as T;
}