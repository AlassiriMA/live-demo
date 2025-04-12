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
  const [serverCheckComplete, setServerCheckComplete] = useState(false);
  const [localStorageChecked, setLocalStorageChecked] = useState(false);

  // Check server auth status
  useEffect(() => {
    const checkServerAuth = async () => {
      try {
        // Try to fetch the current user
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('adminToken') || ''}`,
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            console.log('Server auth confirmed user:', data.user);
            
            // If user exists but isn't admin role, redirect to home
            if (data.user.role !== 'admin') {
              console.log('User exists but not admin, redirecting to home');
              navigate('/');
              return false;
            }
            
            // Successfully authenticated as admin
            console.log('Server confirmed admin status');
            return true;
          }
        }
        
        console.log('Server auth check failed, trying localStorage next');
        return false;
      } catch (error) {
        console.warn('Error checking server auth in RequireAdmin:', error);
        return false;
      } finally {
        setServerCheckComplete(true);
      }
    };
    
    checkServerAuth();
  }, [navigate]);
  
  // Check localStorage as a fallback
  useEffect(() => {
    if (!serverCheckComplete) {
      return; // Wait for server check first
    }
    
    const checkLocalStorage = () => {
      try {
        // Check both admin-specific storage and general auth storage
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
  }, [serverCheckComplete]);
  
  // Final decision on access and loading state
  useEffect(() => {
    if (!serverCheckComplete || !localStorageChecked) {
      return; // Wait for both checks
    }
    
    // Set loading to false after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Redirect to login if not admin
      if (!isAdmin && !adminUser) {
        console.log('User is not admin, redirecting to login');
        navigate('/admin/direct');
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [isAdmin, adminUser, navigate, serverCheckComplete, localStorageChecked]);

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