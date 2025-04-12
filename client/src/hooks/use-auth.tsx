import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface AuthUser {
  id: number;
  username: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  user: AuthUser;
  token?: string;
  message?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for token in localStorage as a fallback
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {};
        
        // If token exists in localStorage, add it to headers
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Try server authentication first
        try {
          const response = await apiRequest('GET', '/api/auth/me', undefined, headers) as AuthResponse;
          
          if (response.success && response.user) {
            console.log('Server auth successful:', response.user);
            setUser(response.user);
            return; // Exit early if server auth works
          }
        } catch (serverAuthError) {
          console.log('Server auth failed, trying localStorage fallback');
        }
        
        // Fallback to localStorage user if server auth fails
        // This is critical for production where cookies may not work as expected
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Using localStorage user fallback:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('No stored user found in localStorage');
        }
      } catch (error) {
        // User is not logged in, no need to show error
        console.log('User not authenticated');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest('POST', '/api/auth/login', { username, password }) as AuthResponse;

      if (response.success && response.user) {
        // Ensure user is set in state
        setUser(response.user);
        console.log('Login successful, user set:', response.user);
        
        // Store token and user in localStorage for non-cookie fallback
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Token stored in localStorage');
        }
        
        // Store the user object for fallback authentication
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        console.log('User object stored in localStorage');
        
        // Force a slight delay to ensure state update before any navigation
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        setError(response.message || 'Failed to login');
      }
    } catch (err) {
      setError('Invalid credentials');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      await apiRequest('POST', '/api/auth/logout');
      
      // Clear all auth state
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      console.log('User logged out, all auth data cleared');
    } catch (err) {
      console.error('Logout error:', err);
      
      // Even if server logout fails, clear local state
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}