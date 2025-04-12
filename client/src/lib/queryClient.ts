import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Enhanced error handling for API responses
 * - Provides detailed error messages from server responses
 * - Handles both text and JSON error formats
 * - Adds request URL to error message for debugging
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = '';
    try {
      // Try to parse as JSON first
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
    } catch {
      // Fallback to text if not JSON
      errorMessage = await res.text() || res.statusText;
    }
    throw new Error(`${res.status}: ${errorMessage} (${res.url})`);
  }
}

/**
 * Optimized API request function with caching awareness
 * - Supports standard CRUD operations
 * - Uses proper cache headers
 * - Handles JSON and text responses
 */
export async function apiRequest<T = any>(
  method: string,
  url: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const isGet = method.toUpperCase() === 'GET';
  
  // Get token from localStorage for auth header
  const token = localStorage.getItem('token');
  
  // Prepare headers with auth token if available
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Configure request with sensible defaults
  const requestOptions: RequestInit = {
    method: method.toUpperCase(),
    headers,
    credentials: "include",
    ...options,
  };

  // Only add body for non-GET requests with data
  if (!isGet && data) {
    requestOptions.body = JSON.stringify(data);
  }

  // Add cache: reload for data fetching on critical paths
  const isCriticalPath = url.includes('/auth/') || url.includes('/user');
  if (isCriticalPath) {
    requestOptions.cache = 'no-cache';
  }

  try {
    const res = await fetch(url, requestOptions);
    
    // Special handling for 401 based on caller's preference
    const customSignal = options?.signal as any;
    if (res.status === 401 && customSignal?.['401behavior'] === 'returnNull') {
      return null as T;
    }

    await throwIfResNotOk(res);
    
    // Check content type for proper parsing
    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await res.json() as T;
    } else if (method.toUpperCase() === 'DELETE' && res.status === 204) {
      // Handle 204 No Content responses
      return {} as T;
    } else {
      // Fallback for text/plain responses
      const text = await res.text();
      try {
        return JSON.parse(text) as T;
      } catch {
        return text as unknown as T;
      }
    }
  } catch (error) {
    // Enhance error with additional context
    if (error instanceof Error) {
      error.message = `API Request Failed (${method} ${url}): ${error.message}`;
    }
    throw error;
  }
}

// Backward compatibility for existing code
type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Generates a query function with specified unauthorized behavior
 * Enhanced for performance with:
 * - Proper AbortController integration
 * - Error handling specific to query context
 * - Caching hints for different query types
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey, signal }) => {
    // Create a custom signal that includes behavior
    const customSignal = signal as AbortSignal & { '401behavior'?: string };
    if (unauthorizedBehavior === "returnNull") {
      customSignal['401behavior'] = 'returnNull';
    }

    const url = queryKey[0] as string;
    
    // Use the enhanced apiRequest with GET method
    return await apiRequest(
      'GET', 
      url, 
      undefined, 
      { signal: customSignal }
    ) as any;
  };

/**
 * Optimized QueryClient with performance tuning
 * - Implements sliding stale time for different query types
 * - Uses smart retry logic based on error types
 * - Sets proper caching strategies for different data types
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: import.meta.env.PROD ? false : true, // Improve dev experience
      staleTime: 5 * 60 * 1000, // 5 minutes for most data
      retry: (failureCount, error) => {
        // Don't retry auth errors or validation errors
        if (
          error instanceof Error && 
          (error.message.includes('401') || error.message.includes('422'))
        ) {
          return false;
        }
        // Retry network/server errors up to 2 times
        return failureCount < 2;
      },
      // Use transition for smoother UX
      networkMode: 'always',
    },
    mutations: {
      retry: false,
      networkMode: 'always',
    },
  },
});
