/**
 * Utility functions for optimizing network performance
 */

type NetworkQuality = 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';

/**
 * Get the current network connection quality
 * @returns The estimated network quality
 */
export function getNetworkQuality(): NetworkQuality {
  if (typeof navigator === 'undefined') return 'unknown';
  
  // Use the Network Information API if available
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
  
  if (connection && connection.effectiveType) {
    return connection.effectiveType as NetworkQuality;
  }
  
  // Fallback: try to estimate based on navigator.onLine
  if (navigator.onLine === false) {
    return 'slow-2g'; // Assume worst case if offline
  }
  
  return 'unknown';
}

/**
 * Check if the current connection is considered "fast"
 * @returns True if the connection is 4g or better
 */
export function hasFastConnection(): boolean {
  const quality = getNetworkQuality();
  return quality === '4g' || quality === 'unknown';
}

/**
 * Check if the current connection is metered
 * @returns True if the connection is metered, false if unmetered, null if unknown
 */
export function isConnectionMetered(): boolean | null {
  if (typeof navigator === 'undefined') return null;
  
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
                     
  if (connection && connection.saveData !== undefined) {
    return connection.saveData === true;
  }
  
  return null;
}

/**
 * Throttle bandwidth-intensive operations based on connection quality
 * @param operation The operation to perform
 * @param lowQualityFallback Optional fallback for low-quality connections
 */
export function adaptToNetworkQuality<T>(
  operation: () => T,
  lowQualityFallback?: () => T
): T {
  const quality = getNetworkQuality();
  const isSaveDataEnabled = isConnectionMetered() === true;
  
  // Use fallback for slow connections or when save-data is enabled
  if (
    (quality === 'slow-2g' || quality === '2g' || quality === '3g' || isSaveDataEnabled) &&
    lowQualityFallback !== undefined
  ) {
    return lowQualityFallback();
  }
  
  return operation();
}

/**
 * Get optimized image quality based on network conditions
 * @param defaultQuality The default image quality (0-100)
 * @returns Optimized quality value
 */
export function getAdaptiveImageQuality(defaultQuality: number = 85): number {
  const quality = getNetworkQuality();
  const isSaveDataEnabled = isConnectionMetered() === true;
  
  if (isSaveDataEnabled) {
    return Math.min(defaultQuality, 60); // Aggressive reduction for save-data
  }
  
  // Adjust quality based on connection speed
  switch (quality) {
    case 'slow-2g':
      return Math.min(defaultQuality, 30);
    case '2g':
      return Math.min(defaultQuality, 50);
    case '3g':
      return Math.min(defaultQuality, 70);
    default:
      return defaultQuality;
  }
}

/**
 * Monitor for network status changes and execute callbacks
 * @param onOnline Callback when network comes online
 * @param onOffline Callback when network goes offline
 * @returns Cleanup function to remove event listeners
 */
export function watchNetworkStatus(
  onOnline?: () => void,
  onOffline?: () => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handleOnline = () => {
    if (onOnline) onOnline();
  };
  
  const handleOffline = () => {
    if (onOffline) onOffline();
  };
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}