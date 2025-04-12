import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

interface AuthCheckProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * Enhanced AuthCheck component with improved reliability for production deployment
 * - Performs better localStorage fallback
 * - Adds manual auth refresh capability
 * - More graceful handling of authentication transitions
 */
export function AuthCheck({ children, requiredRole }: AuthCheckProps) {
  const { user, isLoading, refreshAuth } = useAuth();
  const [, navigate] = useLocation();
  const [retryCount, setRetryCount] = useState(0);
  const [hasCheckedLocalStorage, setHasCheckedLocalStorage] = useState(false);
  
  // On initial render, check if we have a user in localStorage
  useEffect(() => {
    // This additional localStorage check provides a faster initial render
    // while the main auth system is initializing
    if (!hasCheckedLocalStorage && !user) {
      try {
        const storedUserStr = localStorage.getItem('currentUser');
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          console.log('AuthCheck: Found user in localStorage:', storedUser);
          
          // If we have a token stored, trigger a refresh to validate with server
          const hasToken = !!localStorage.getItem('token');
          if (hasToken) {
            refreshAuth().catch(e => console.error('Auth refresh error:', e));
          }
        }
      } catch (e) {
        console.error('Error checking localStorage:', e);
      }
      setHasCheckedLocalStorage(true);
    }
  }, [hasCheckedLocalStorage, user, refreshAuth]);
  
  // Main auth check logic
  useEffect(() => {
    // Debug log to track auth check
    console.log('AuthCheck running, auth state:', { 
      isAuthenticated: !!user, 
      isLoading, 
      userRole: user?.role, 
      requiredRole,
      currentPath: window.location.pathname,
      retryCount
    });
    
    const currentPath = window.location.pathname;
    const isAdminPath = currentPath.includes('/admin');
    const isLoginPath = currentPath.includes('/admin/login') || currentPath.includes('/auth');
    
    // Only perform redirects when auth state is settled (not loading)
    if (!isLoading) {
      // Case 1: User is not authenticated
      if (!user) {
        // Check localStorage one more time as a last resort
        try {
          const storedUserStr = localStorage.getItem('currentUser');
          const hasToken = !!localStorage.getItem('token');
          
          // If we have local credentials but no user state, try refreshing auth
          if (storedUserStr && hasToken && retryCount < 2) {
            console.log(`AuthCheck: Attempting auth refresh (retry ${retryCount + 1})`);
            setRetryCount(prev => prev + 1);
            refreshAuth().catch(console.error);
            
            // Don't redirect yet, wait for refresh to complete
            return;
          }
          
          // If we've tried refreshing and still no user, redirect
          if (isAdminPath && !isLoginPath && retryCount >= 2) {
            console.log('AuthCheck: Redirecting to login page after retries from:', currentPath);
            navigate('/admin/login');
          }
        } catch (e) {
          console.error('Error in auth fallback check:', e);
          
          // Redirect if on admin path but not login page
          if (isAdminPath && !isLoginPath) {
            navigate('/admin/login');
          }
        }
      } 
      // Case 2: User is authenticated but doesn't have required role
      else if (requiredRole && user.role !== requiredRole) {
        console.log('AuthCheck: User does not have required role. Redirecting to homepage.');
        navigate('/');
      } 
      // Case 3: User is properly authenticated
      else {
        console.log('AuthCheck: User is authenticated with proper permissions:', user);
        
        // If we're on the login page but already authenticated, redirect to dashboard
        if (isLoginPath && user.role === 'admin') {
          console.log('AuthCheck: Already logged in, redirecting to dashboard');
          navigate('/admin/dashboard');
        }
      }
    }
  }, [user, isLoading, navigate, requiredRole, retryCount, refreshAuth]);
  
  // Show loading state while checking auth
  if (isLoading && !hasCheckedLocalStorage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Optimistic rendering - if we're still loading but have a user in context or localStorage
  const storedUser = !user ? (() => {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  })() : null;
  
  // Return children if we have a user either in state or localStorage
  return (user || storedUser) ? <>{children}</> : null;
}

export default AuthCheck;