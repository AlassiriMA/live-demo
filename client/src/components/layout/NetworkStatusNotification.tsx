import { useState, useEffect } from 'react';
import { watchNetworkStatus } from '@/lib/networkUtils';

/**
 * Component that shows a notification when the user is offline
 * Uses the Network Information API when available
 */
export function NetworkStatusNotification() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  useEffect(() => {
    // Return cleanup function from watchNetworkStatus
    return watchNetworkStatus(
      () => setIsOnline(true),
      () => setIsOnline(false)
    );
  }, []);
  
  if (isOnline) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white py-2 px-4 text-center z-50">
      You are offline. Some features may be unavailable.
    </div>
  );
}

export default NetworkStatusNotification;