import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';
import { RequireAdmin } from '@/components/admin/RequireAdmin';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';

// Dashboard content component
function DashboardContent() {
  const { adminUser, logout } = useAdminAuth();
  const [, navigate] = useLocation();
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {adminUser?.username}!</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/')}>
            View Site
          </Button>
          <Button variant="destructive" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <h2 className="text-xl font-semibold mb-4">Content Management</h2>
          <p className="text-muted-foreground mb-4">Manage your site's content, pages, and media.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/content')}
          >
            Manage Content
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-muted-foreground mb-4">Manage users, roles, and permissions.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/users')}
          >
            Manage Users
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <h2 className="text-xl font-semibold mb-4">Media Library</h2>
          <p className="text-muted-foreground mb-4">Upload and manage images, videos, and documents.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/media')}
          >
            Media Library
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <p className="text-muted-foreground mb-4">Configure site settings and preferences.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/settings')}
          >
            Site Settings
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <p className="text-muted-foreground mb-4">View site analytics and reports.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/analytics')}
          >
            View Analytics
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>
          <p className="text-muted-foreground mb-4">Review admin activity and system logs.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/logs')}
          >
            View Logs
          </Button>
        </div>
      </div>
    </div>
  );
}

// Protected dashboard wrapper
export default function ProtectedDashboard() {
  return (
    <AdminAuthProvider>
      <RequireAdmin>
        <DashboardContent />
      </RequireAdmin>
    </AdminAuthProvider>
  );
}