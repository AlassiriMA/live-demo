/**
 * Network-related utilities to help adapt to different connection types and speeds
 */

/**
 * Connection speed categories
 */
export enum ConnectionSpeed {
  SLOW = 'slow',
  MEDIUM = 'medium',
  FAST = 'fast',
  UNKNOWN = 'unknown'
}

/**
 * Get the effective connection type if available
 * @returns The connection type or null if not available
 */
export function getConnectionType(): string | null {
  if (
    typeof navigator !== 'undefined' && 
    'connection' in navigator && 
    navigator.connection && 
    typeof navigator.connection === 'object' &&
    'effectiveType' in navigator.connection
  ) {
    return (navigator.connection as any).effectiveType;
  }
  
  return null;
}

/**
 * Check if the user has a fast network connection
 * @returns true if the connection is fast, false otherwise
 */
export function hasFastConnection(): boolean {
  const connectionType = getConnectionType();
  
  // 4g is considered fast
  if (connectionType === '4g') {
    return true;
  }
  
  // If we can't determine the connection, default to true to provide the best user experience
  if (!connectionType) {
    return true;
  }
  
  return false;
}

/**
 * Get the connection speed category
 * @returns The connection speed category
 */
export function getConnectionSpeed(): ConnectionSpeed {
  const connectionType = getConnectionType();
  
  if (!connectionType) {
    return ConnectionSpeed.UNKNOWN;
  }
  
  switch (connectionType) {
    case 'slow-2g':
    case '2g':
      return ConnectionSpeed.SLOW;
    case '3g':
      return ConnectionSpeed.MEDIUM;
    case '4g':
      return ConnectionSpeed.FAST;
    default:
      return ConnectionSpeed.UNKNOWN;
  }
}

/**
 * Get adaptive image quality based on network connection
 * @param defaultQuality The default quality to use if connection can't be determined
 * @returns A quality value between 0 and 100
 */
export function getAdaptiveImageQuality(defaultQuality: number = 85): number {
  const connectionSpeed = getConnectionSpeed();
  
  switch (connectionSpeed) {
    case ConnectionSpeed.SLOW:
      return 50; // Low quality for slow connections
    case ConnectionSpeed.MEDIUM:
      return 70; // Medium quality for medium connections
    case ConnectionSpeed.FAST:
      return 100; // High quality for fast connections
    default:
      return defaultQuality;
  }
}

/**
 * Check if the network is currently available
 * @returns true if online, false if offline
 */
export function isNetworkAvailable(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * Watch for network status changes
 * @param onlineCallback Function to call when network becomes available
 * @param offlineCallback Function to call when network becomes unavailable
 * @returns Cleanup function to remove event listeners
 */
export function watchNetworkStatus(
  onlineCallback: () => void,
  offlineCallback: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {}; // No cleanup needed in non-browser environment
  }
  
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);
  
  return () => {
    window.removeEventListener('online', onlineCallback);
    window.removeEventListener('offline', offlineCallback);
  };
}

/**
 * Retry a failed network request with exponential backoff
 * @param fetchFunc The fetch function to retry
 * @param retries Maximum number of retries
 * @param baseDelay Base delay in milliseconds between retries
 * @returns Promise that resolves with the fetch result
 */
export async function retryFetch<T>(
  fetchFunc: () => Promise<T>,
  retries: number = 3,
  baseDelay: number = 300
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchFunc();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < retries) {
        // Calculate exponential backoff delay
        const delay = baseDelay * Math.pow(2, attempt);
        
        // Add some jitter to prevent multiple clients from retrying at the same time
        const jitter = Math.random() * 100;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }
  }
  
  // If we exhaust all retries, throw the last error
  throw lastError;
}

export default {
  getConnectionType,
  hasFastConnection,
  getConnectionSpeed,
  getAdaptiveImageQuality,
  isNetworkAvailable,
  watchNetworkStatus,
  retryFetch
};