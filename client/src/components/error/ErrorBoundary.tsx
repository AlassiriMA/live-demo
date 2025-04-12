import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component to catch and handle errors in the component tree
 * Improved for production with detailed logging and recovery options
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error: error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Store crash info in localStorage for debugging later
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        time: new Date().toISOString()
      };
      
      // Store in local storage for later inspection
      const currentCrashes = JSON.parse(localStorage.getItem('app_crashes') || '[]');
      currentCrashes.push(errorData);
      // Limit to 5 most recent crashes
      if (currentCrashes.length > 5) {
        currentCrashes.shift();
      }
      localStorage.setItem('app_crashes', JSON.stringify(currentCrashes));
    } catch (e) {
      // Ignore storage errors
    }
  }

  handleReset = (): void => {
    // Clear any cached state that might be causing the error
    try {
      const keysToKeep = ['token', 'currentUser', 'adminUser', 'adminToken', 'preferredLanguage'];
      const keysToRemove: string[] = [];
      
      // Find all localStorage keys that aren't in our keep list
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !keysToKeep.includes(key)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove the problematic keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Clear session storage completely
      sessionStorage.clear();
      
      // Reset error state
      this.setState({ 
        hasError: false, 
        error: null, 
        errorInfo: null 
      });
      
      // Reload the page to get a fresh state
      window.location.href = '/';
    } catch (e) {
      console.error('Failed to reset application:', e);
      // Force reload as last resort
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Check if a custom fallback was provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
          <div className="w-full max-w-md p-8 rounded-xl bg-white shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-4">Something went wrong</h1>
            
            <p className="text-gray-600 mb-6 text-center">
              We've encountered an unexpected error. Please try refreshing the page or resetting the application.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
              
              <Button 
                onClick={this.handleReset}
                className="w-full"
              >
                Reset Application
              </Button>
              
              <Button 
                variant="link"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
            
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mt-6 p-4 bg-gray-100 rounded overflow-auto text-xs">
                <p className="font-mono text-red-600">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-gray-800 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;