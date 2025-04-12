import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';

export default function DirectAdminLogin() {
  const [, navigate] = useLocation();

  return (
    <AdminAuthProvider>
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminLoginForm />
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
    </AdminAuthProvider>
  );
}