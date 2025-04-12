import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth } from './AdminAuthProvider';
import { Loader2 } from 'lucide-react';

interface RequireAdminProps {
  children: ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { adminUser, isAdmin } = useAdminAuth();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [localStorageChecked, setLocalStorageChecked] = useState(false);

  // First check localStorage for admin credentials
  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        // Try both the admin-specific storage and the general auth storage
        const adminUserStr = localStorage.getItem('adminUser');
        const currentUserStr = localStorage.getItem('currentUser');
        const hasToken = !!localStorage.getItem('token') || !!localStorage.getItem('adminToken');
        
        if (!adminUserStr && !currentUserStr) {
          console.log('No admin credentials found in localStorage');
          setLocalStorageChecked(true);
          return false;
        }
        
        let user;
        if (adminUserStr) {
          user = JSON.parse(adminUserStr);
        } else if (currentUserStr) {
          user = JSON.parse(currentUserStr);
        }
        
        // If we have a user and they are an admin
        if (user && user.role === 'admin' && hasToken) {
          console.log('Found admin user in localStorage:', user);
          setLocalStorageChecked(true);
          return true;
        }
        
        console.log('User found but not admin:', user);
        setLocalStorageChecked(true);
        return false;
      } catch (e) {
        console.error('Error checking localStorage for admin:', e);
        setLocalStorageChecked(true);
        return false;
      }
    };
    
    checkLocalStorage();
  }, []);
  
  // Check admin status once localStorage check is complete
  useEffect(() => {
    if (!localStorageChecked) {
      return; // Wait for localStorage check
    }
    
    // Set loading to false after a short delay to allow auth check to complete
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Redirect to login if not admin after delay to allow time for auth to load
      if (!isAdmin && !loading) {
        console.log('User is not admin, redirecting to login');
        navigate('/admin/login');
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [isAdmin, loading, navigate, localStorageChecked]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // If user is admin, render children
  if (isAdmin || !!adminUser) {
    return <>{children}</>;
  }

  // Otherwise render nothing (we'll redirect in the useEffect)
  return null;
}