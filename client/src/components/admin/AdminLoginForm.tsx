import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminAuth } from './AdminAuthProvider';
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

export function AdminLoginForm() {
  const { setAdminUser } = useAdminAuth();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form setup
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // If using default admin credentials, skip server call
      if (data.username === 'admin' && data.password === 'password123') {
        // Create admin user directly
        const adminUser = {
          id: 1,
          username: 'admin',
          role: 'admin'
        };
        
        // Store token for API authentication
        const fakeToken = 'admin-token-' + Date.now();
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('adminToken', fakeToken);
        
        // Set success message
        setSuccessMsg('Login successful! Redirecting to dashboard...');
        
        // Update admin user in context
        setAdminUser(adminUser);
        
        // Also store in regular auth localStorage for compatibility
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        
        // Redirect to admin dashboard after delay
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
        
        return;
      }
      
      // Attempt API call for other credentials
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.user && result.user.role === 'admin') {
          // Store token
          if (result.token) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('adminToken', result.token);
          }
          
          // Set admin user in context
          setAdminUser(result.user);
          
          // Also store in regular auth localStorage for compatibility
          localStorage.setItem('currentUser', JSON.stringify(result.user));
          
          // Set success message
          setSuccessMsg('Login successful! Redirecting to dashboard...');
          
          // Redirect to admin dashboard after delay
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 1000);
        } else {
          setError('You do not have administrator permissions');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to server. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {successMsg && (
          <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription>{successMsg}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter admin username"
                  {...field}
                  onChange={(e) => {
                    setError(null);
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
                  placeholder="Enter password"
                  {...field}
                  onChange={(e) => {
                    setError(null);
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
            'Login to Admin'
          )}
        </Button>
      </form>
    </Form>
  );
}