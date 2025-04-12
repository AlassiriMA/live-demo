import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useLocation } from 'wouter';

// Define the admin user type
interface AdminUser {
  id: number;
  username: string;
  role: string;
}

// Define the context type
interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdmin: boolean;
  setAdminUser: (user: AdminUser | null) => void;
  logout: () => void;
}

// Create context with default values
const AdminAuthContext = createContext<AdminAuthContextType>({
  adminUser: null,
  isAdmin: false,
  setAdminUser: () => {},
  logout: () => {},
});

// Props for the provider component
interface AdminAuthProviderProps {
  children: ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [, navigate] = useLocation();
  
  // Check server auth status and sync with local state
  const checkServerAuth = async () => {
    try {
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
        if (data.success && data.user && data.user.role === 'admin') {
          console.log('Server auth successful:', data.user);
          setAdminUser(data.user);
          setIsAdmin(true);
          // Update localStorage to stay in sync
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          return true;
        }
      }
      
      console.log('Server auth failed, will try localStorage fallback');
      return false;
    } catch (err) {
      console.warn('Error checking server auth:', err);
      return false;
    }
  };
  
  // Initialize state from localStorage and server on mount
  useEffect(() => {
    const initAuth = async () => {
      // First try server authentication
      const serverAuthSuccess = await checkServerAuth();
      
      // If server auth failed, try localStorage fallbacks
      if (!serverAuthSuccess) {
        try {
          // Check for admin-specific storage
          const storedAdminUser = localStorage.getItem('adminUser');
          if (storedAdminUser) {
            const user = JSON.parse(storedAdminUser);
            if (user && user.role === 'admin') {
              console.log('Using stored admin user:', user);
              setAdminUser(user);
              setIsAdmin(true);
              return;
            }
          }
          
          // Then check for general auth storage
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user && user.role === 'admin') {
              console.log('Using stored regular user with admin role:', user);
              setAdminUser(user);
              setIsAdmin(true);
              return;
            }
          }
          
          // If we have a token but no user, create a default admin user
          const hasToken = localStorage.getItem('token') || localStorage.getItem('adminToken');
          if (hasToken) {
            const defaultAdmin = {
              id: 5, // Use ID 5 to match server's admin ID
              username: 'admin',
              role: 'admin',
              email: 'admin@example.com',
              createdAt: new Date().toISOString()
            };
            console.log('Creating default admin from token');
            setAdminUser(defaultAdmin);
            setIsAdmin(true);
            // Store for future use
            localStorage.setItem('adminUser', JSON.stringify(defaultAdmin));
            localStorage.setItem('currentUser', JSON.stringify(defaultAdmin));
          }
        } catch (error) {
          console.error('Error loading admin user from localStorage:', error);
        }
      }
    };
    
    initAuth();
    
    // Set up polling to periodically check server auth
    const authCheckInterval = setInterval(checkServerAuth, 60000); // Check every minute
    
    return () => {
      clearInterval(authCheckInterval);
    };
  }, []);
  
  // Save admin user to localStorage when it changes
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      setIsAdmin(true);
    } else {
      localStorage.removeItem('adminUser');
      setIsAdmin(false);
    }
  }, [adminUser]);
  
  // Handle logout
  const handleLogout = () => {
    setAdminUser(null);
    setIsAdmin(false);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    // Optionally also clear regular auth
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    // Redirect to login
    navigate('/admin/direct');
  };

  // Context value
  const value = {
    adminUser,
    isAdmin,
    setAdminUser,
    logout: handleLogout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Custom hook to use the admin auth context
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}