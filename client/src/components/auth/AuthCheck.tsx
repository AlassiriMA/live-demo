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
    
    // Only perform redirects when auth state is settled (not loading)
    if (!isLoading) {
      // Case 1: User is not authenticated
      if (!user) {
        // Redirect to login page, supporting both paths for better compatibility
        const currentPath = window.location.pathname;
        if (currentPath.includes('/admin') && 
            !currentPath.includes('/admin/login') && 
            !currentPath.includes('/auth')) {
          console.log('AuthCheck: Redirecting to login page from:', currentPath);
          navigate('/admin/login');
        }
      } 
      // Case 2: User is authenticated but doesn't have required role
      else if (requiredRole && user.role !== requiredRole) {
        console.log('AuthCheck: User does not have required role. Redirecting to homepage.');
        navigate('/');
      } 
      // Case 3: User is properly authenticated
      else {
        console.log('AuthCheck: User is authenticated and has proper permissions.', user);
      }
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