import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

interface AuthCheckProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * Component to check if user is authenticated before rendering children
 * If not authenticated, redirects to login page
 */
export function AuthCheck({ children, requiredRole }: AuthCheckProps) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Debug log to track auth check
    console.log('AuthCheck running, auth state:', { 
      isAuthenticated: !!user, 
      isLoading, 
      userRole: user?.role, 
      requiredRole,
      currentPath: window.location.pathname
    });
    
    if (!isLoading && !user) {
      // Redirect to login page, supporting both paths for better compatibility
      // Some links in the app might use /auth, others might use /admin/login
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin') && !currentPath.includes('/admin/login') && !currentPath.includes('/auth')) {
        console.log('AuthCheck: Redirecting to login page from:', currentPath);
        // Force a slight delay to ensure redirect happens after render
        setTimeout(() => {
          navigate('/auth');
        }, 100);
      }
    } else if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      // Redirect to homepage if authenticated but doesn't have required role
      console.log('AuthCheck: User does not have required role. Redirecting to homepage.');
      navigate('/');
    } else if (!isLoading && user) {
      console.log('AuthCheck: User is authenticated and has proper permissions.');
    }
  }, [user, isLoading, navigate, requiredRole]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Only render children if authenticated
  return user ? <>{children}</> : null;
}

export default AuthCheck;