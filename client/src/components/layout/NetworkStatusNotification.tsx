import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { watchNetworkStatus } from '@/lib/networkUtils';

/**
 * A component that displays a notification when the user's network connection status changes
 * Features:
 * - Shows non-intrusive notifications when going online/offline
 * - Auto-dismisses after a configurable period
 * - Can be manually dismissed
 * - Animated transitions
 * - Responsive design for all device sizes
 */
const NetworkStatusNotification = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showNotification, setShowNotification] = useState(false);
  const [lastChangeTime, setLastChangeTime] = useState(0);
  
  // Watch network status and update state
  useEffect(() => {
    // Watch for status changes
    const cleanup = watchNetworkStatus(
      // When network becomes available
      () => {
        setIsOnline(true);
        setShowNotification(true);
        setLastChangeTime(Date.now());
        
        // Log for diagnostics
        console.log('Network connection restored');
      },
      // When network becomes unavailable
      () => {
        setIsOnline(false);
        setShowNotification(true);
        setLastChangeTime(Date.now());
        
        // Log for diagnostics
        console.log('Network connection lost');
      }
    );
    
    // Auto-dismiss notifications after delay (but keep offline warning visible)
    const dismissTimer = setInterval(() => {
      const now = Date.now();
      // Only auto-dismiss online notification
      if (isOnline && showNotification && now - lastChangeTime > 5000) {
        setShowNotification(false);
      }
    }, 1000);
    
    return () => {
      cleanup();
      clearInterval(dismissTimer);
    };
  }, [isOnline, showNotification, lastChangeTime]);
  
  // Don't show anything initially (avoid flashy notifications on page load)
  if (lastChangeTime === 0) return null;
  
  return (
    <AnimatePresence>
      {(showNotification || !isOnline) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4 z-50`}
        >
          <div 
            className={`
              rounded-lg shadow-lg flex items-center px-4 py-3
              ${isOnline 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'}
            `}
          >
            <div className="flex-shrink-0 mr-3">
              {isOnline ? (
                <Wifi className="h-5 w-5" />
              ) : (
                <WifiOff className="h-5 w-5" />
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-medium">
                {isOnline
                  ? 'You are back online'
                  : 'You are offline. Some features may be unavailable.'}
              </p>
            </div>
            
            {/* Only show dismiss button when online */}
            {isOnline && (
              <button
                className="ml-4 flex-shrink-0 text-white hover:text-white/80 focus:outline-none"
                onClick={() => setShowNotification(false)}
                aria-label="Dismiss"
              >
                <svg 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatusNotification;