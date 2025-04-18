import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { user, login, isLoading, error, clearError } = useAuth();
  const [, navigate] = useLocation();
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  
  // Check if we already have a user in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const hasToken = !!localStorage.getItem('token');
    
    if (storedUser && hasToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Found existing user in localStorage:', parsedUser);
        
        // If already on login page but have stored credentials, show message
        setAdminMessage('Found existing session. Redirecting to dashboard...');
        
        // Delayed navigation to dashboard
        setTimeout(() => {
          console.log('Navigating to dashboard with stored credentials');
          navigate('/admin/dashboard');
        }, 1000);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }, [navigate]);
  
  // Redirect to dashboard if login succeeds
  useEffect(() => {
    if (user) {
      console.log('User authenticated in useEffect:', user);
      setAdminMessage('Login successful! Redirecting to admin dashboard...');
      
      // Add a longer delay before redirect to ensure state is propagated
      // This is critical for production environment
      setTimeout(() => {
        console.log('Navigating to dashboard with user:', user);
        
        // First ensure localStorage has the user info as backup
        // Using constants to avoid typos and ensure consistency
        localStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role
        }));
        
        // Force event dispatch to notify any components listening for auth changes
        window.dispatchEvent(new Event('auth:refresh'));
        
        // Use a longer timeout for production to ensure proper state propagation
        setTimeout(() => {
          // Then navigate to admin dashboard
          console.log('Final navigation to dashboard');
          navigate('/admin/dashboard');
        }, 500);
      }, 1000);
    }
  }, [user, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.username, data.password);
      console.log('Login submission complete, user state:', user);
      
      // Set success message but don't navigate yet - the useEffect will handle it
      setAdminMessage('Login successful! Preparing admin dashboard...');
    } catch (error) {
      console.error('Login error:', error);
      // Error handling is done in the login function
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {adminMessage && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription>{adminMessage}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your admin username"
                        {...field}
                        onChange={(e) => {
                          clearError();
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your password"
                        {...field}
                        onChange={(e) => {
                          clearError();
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => navigate('/')}
          >
            Return to Site
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}