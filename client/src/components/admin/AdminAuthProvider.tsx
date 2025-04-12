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
  
  // Initialize state from localStorage on mount
  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        // First check for admin-specific storage
        const storedAdminUser = localStorage.getItem('adminUser');
        if (storedAdminUser) {
          const user = JSON.parse(storedAdminUser);
          if (user && user.role === 'admin') {
            setAdminUser(user);
            setIsAdmin(true);
            return;
          }
        }
        
        // Then check for general auth storage as fallback
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user && user.role === 'admin') {
            setAdminUser(user);
            setIsAdmin(true);
            return;
          }
        }
        
        // If we have a token but no user, create a default admin user
        const hasToken = localStorage.getItem('token') || localStorage.getItem('adminToken');
        if (hasToken) {
          const defaultAdmin = {
            id: 1,
            username: 'admin',
            role: 'admin'
          };
          setAdminUser(defaultAdmin);
          setIsAdmin(true);
          // Also store it for future use
          localStorage.setItem('adminUser', JSON.stringify(defaultAdmin));
        }
      } catch (error) {
        console.error('Error loading admin user from localStorage:', error);
      }
    };
    
    checkLocalStorage();
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