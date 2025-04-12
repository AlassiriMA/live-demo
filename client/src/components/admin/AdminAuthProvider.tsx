import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';

// Admin user interface that will be stored in localStorage
export interface AdminUser {
  id: number;
  username: string;
  role: string;
}

// Context interface
interface AdminAuthContextType {
  adminUser: AdminUser | null;
  isAdmin: boolean;
  setAdminUser: (user: AdminUser | null) => void;
  logout: () => void;
}

// Create context
const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

// Storage keys
const ADMIN_USER_KEY = 'adminUser';
const ADMIN_TOKEN_KEY = 'adminToken';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUserState] = useState<AdminUser | null>(null);
  const [, navigate] = useLocation();

  // On component mount, try to load admin user from localStorage
  useEffect(() => {
    // Try to load from localStorage
    try {
      const storedUser = localStorage.getItem(ADMIN_USER_KEY);
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('Loaded admin user from localStorage:', parsedUser);
        setAdminUserState(parsedUser);
      }
    } catch (error) {
      console.error('Error loading admin user from localStorage:', error);
    }
  }, []);

  // Wrapper for setting admin user that also updates localStorage
  const setAdminUser = (user: AdminUser | null) => {
    if (user) {
      // Store in localStorage
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
      console.log('Stored admin user in localStorage:', user);
    } else {
      // Remove from localStorage
      localStorage.removeItem(ADMIN_USER_KEY);
      console.log('Removed admin user from localStorage');
    }
    setAdminUserState(user);
  };

  // Logout function
  const logout = () => {
    // Clear state
    setAdminUserState(null);
    
    // Clear localStorage
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    console.log('Admin logged out, all auth data cleared');
    
    // Redirect to login
    navigate('/admin/login');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAdmin: !!adminUser && adminUser.role === 'admin',
        setAdminUser,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

// Hook for accessing the admin auth context
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}