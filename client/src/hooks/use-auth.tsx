import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
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
  refreshAuth: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'currentUser';
const TOKEN_STORAGE_KEY = 'token';
const MAX_RETRY_COUNT = 3;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced auth check with retry logic and better localStorage support
  const checkAuthStatus = useCallback(async (retryCount = 0) => {
    try {
      // First priority: Check localStorage for existing user
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      const headers: Record<string, string> = {};
      
      // Initialize with cached user data immediately
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser); // Set user from localStorage immediately
          console.log('Initial auth state set from localStorage:', parsedUser);
        } catch (parseError) {
          // Invalid JSON in localStorage, clear it
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
      
      // If token exists, add it to headers for server auth
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Try server authentication second
      try {
        console.log('Attempting server auth...');
        const response = await apiRequest('GET', '/api/auth/me', undefined, { 
          headers,
          cache: 'no-cache',  // Ensure fresh response
          credentials: 'include' // Include cookies
        }) as AuthResponse;
        
        if (response.success && response.user) {
          console.log('Server auth successful, updating state:', response.user);
          setUser(response.user);
          
          // Update localStorage with latest user data
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
          return; // Exit early if server auth works
        }
      } catch (serverAuthError) {
        console.log('Server auth failed:', serverAuthError);
        
        // If we have a token but server auth failed, and we have a stored user,
        // we'll continue using the localStorage user from above
        if (token && storedUser) {
          console.log('Using existing localStorage auth with token');
        } else if (retryCount < MAX_RETRY_COUNT) {
          // Retry with exponential backoff
          const delay = Math.pow(2, retryCount) * 500;
          console.log(`Retrying auth check in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRY_COUNT})`);
          
          setTimeout(() => {
            checkAuthStatus(retryCount + 1);
          }, delay);
          return;
        } else {
          console.log('Auth check failed after maximum retries');
        }
      }
    } catch (error) {
      console.log('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth status on component mount and when auth events occur
  useEffect(() => {
    checkAuthStatus();
    
    // Set up listener for auth events
    window.addEventListener('auth:refresh', () => checkAuthStatus());
    
    return () => {
      window.removeEventListener('auth:refresh', () => checkAuthStatus());
    };
  }, [checkAuthStatus]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest('POST', '/api/auth/login', { username, password }) as AuthResponse;

      if (response.success && response.user) {
        // Ensure user is set in state
        setUser(response.user);
        console.log('Login successful, user set:', response.user);
        
        // Store token and user in localStorage for production environment
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Token stored in localStorage');
        }
        
        // Store the user object for fallback authentication
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        console.log('User object stored in localStorage');
        
        // Force refresh token header for subsequent requests
        window.dispatchEvent(new Event('auth:login'));
        
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
  
  // Add refresh auth function that can be called manually
  const refreshAuth = async () => {
    console.log('Manual auth refresh requested');
    await checkAuthStatus();
    window.dispatchEvent(new Event('auth:refresh'));
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
        refreshAuth
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