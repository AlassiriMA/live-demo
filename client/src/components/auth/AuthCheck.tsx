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
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      navigate('/admin/login');
    } else if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      // Redirect to homepage if authenticated but doesn't have required role
      navigate('/');
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