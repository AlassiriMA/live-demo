/**
 * Auth utilities for managing tokens and authentication persistence
 * Designed to handle various token storage approaches and provide compatibility
 */

// Constants
const TOKEN_KEY = 'token';
const USER_KEY = 'currentUser';
const ADMIN_TOKEN_KEY = 'adminToken';
const ADMIN_USER_KEY = 'adminUser';

// Types
export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

/**
 * Get stored auth token from any available source
 * Checks multiple storage locations for maximum compatibility
 */
export function getStoredToken(): string | null {
  // First priority: Check standard token
  let token = localStorage.getItem(TOKEN_KEY);
  
  // Second priority: Check admin token
  if (!token) {
    token = localStorage.getItem(ADMIN_TOKEN_KEY);
  }
  
  // Return found token or null
  return token;
}

/**
 * Get stored user from any available source
 * Checks multiple storage locations for maximum compatibility
 */
export function getStoredUser(): AuthUser | null {
  try {
    // First priority: Check standard user 
    const userStr = localStorage.getItem(USER_KEY);
    
    if (userStr) {
      return JSON.parse(userStr);
    }
    
    // Second priority: Check admin user
    const adminUserStr = localStorage.getItem(ADMIN_USER_KEY);
    
    if (adminUserStr) {
      return JSON.parse(adminUserStr);
    }
    
    return null;
  } catch (e) {
    console.error('Error parsing stored user:', e);
    return null;
  }
}

/**
 * Store authentication data consistently across all storage mechanisms
 * Ensures maximum compatibility with different auth approaches
 */
export function storeAuthData(user: AuthUser, token: string): void {
  try {
    // Store token in both locations
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    
    // Store user in both locations
    const userStr = JSON.stringify(user);
    localStorage.setItem(USER_KEY, userStr);
    localStorage.setItem(ADMIN_USER_KEY, userStr);
    
    // Dispatch event for other components to detect auth change
    window.dispatchEvent(new Event('auth:login'));
  } catch (e) {
    console.error('Error storing auth data:', e);
  }
}

/**
 * Clear all authentication data from all storage mechanisms
 */
export function clearAuthData(): void {
  try {
    // Clear all tokens
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    
    // Clear all user data
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    
    // Clear any session storage as well
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    
    // Remove all cookies related to auth
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Dispatch event for other components to detect auth change
    window.dispatchEvent(new Event('auth:logout'));
  } catch (e) {
    console.error('Error clearing auth data:', e);
  }
}

/**
 * Check if the current user is authenticated
 */
export function isAuthenticated(): boolean {
  return getStoredToken() !== null && getStoredUser() !== null;
}

/**
 * Check if the current user is an admin
 */
export function isAdmin(): boolean {
  const user = getStoredUser();
  return user !== null && user.role === 'admin';
}

/**
 * Get authorization headers for API requests
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`
  };
}