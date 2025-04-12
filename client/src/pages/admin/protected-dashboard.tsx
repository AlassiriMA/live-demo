import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';
import { RequireAdmin } from '@/components/admin/RequireAdmin';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { useQuery } from '@tanstack/react-query';
import { 
  PlusCircle, 
  PencilIcon, 
  Trash2, 
  LogIn, 
  LogOut, 
  FileIcon, 
  ImageIcon, 
  Settings, 
  ListIcon, 
  FileEdit, 
  BarChart3, 
  Users
} from 'lucide-react';

// Activity log interface
interface ActivityLog {
  id: number;
  action: string;
  itemType: string;
  itemId?: number;
  details?: string;
  timestamp: string;
  user?: {
    id: number;
    username: string;
  };
}

// Dashboard content component
function DashboardContent() {
  const { adminUser, logout } = useAdminAuth();
  const [, navigate] = useLocation();
  
  // Fetch important dashboard data
  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: () => fetch('/api/projects').then(res => res.json()).then(data => data.projects || []),
    enabled: !!adminUser,
  });
  
  const { data: media } = useQuery({
    queryKey: ['/api/cms/media'],
    queryFn: () => fetch('/api/cms/media').then(res => res.json()).then(data => data.mediaItems || []),
    enabled: !!adminUser,
  });

  const { data: settings } = useQuery({
    queryKey: ['/api/settings'],
    queryFn: () => fetch('/api/settings').then(res => res.json()).then(data => data.settings || {}),
    enabled: !!adminUser,
  });
  
  const { data: logs } = useQuery({
    queryKey: ['/api/activity-logs'],
    queryFn: () => fetch('/api/cms/activity-logs').then(res => res.json())
      .then(data => data.logs || [])
      .catch(() => []),
    enabled: !!adminUser,
  });

  // Calculate statistics
  const projectCount = projects?.length || 0;
  const mediaCount = media?.length || 0;
  const settingsCount = settings ? Object.keys(settings).length : 0;
  const logsCount = logs?.length || 0;
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
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
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg shadow border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">Total Projects</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{projectCount}</p>
          <div className="mt-2">
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-600 dark:text-blue-400"
              onClick={() => navigate('/admin/projects/new')}
            >
              Add New Project
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 rounded-lg shadow border border-purple-200 dark:border-purple-800">
          <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300">Media Files</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{mediaCount}</p>
          <div className="mt-2">
            <Button 
              variant="link" 
              className="p-0 h-auto text-purple-600 dark:text-purple-400"
              onClick={() => navigate('/admin/media')}
            >
              Manage Media
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 p-6 rounded-lg shadow border border-amber-200 dark:border-amber-800">
          <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300">Site Settings</h3>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{settingsCount}</p>
          <div className="mt-2">
            <Button 
              variant="link" 
              className="p-0 h-auto text-amber-600 dark:text-amber-400"
              onClick={() => navigate('/admin/settings')}
            >
              Edit Settings
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 p-6 rounded-lg shadow border border-emerald-200 dark:border-emerald-800">
          <h3 className="text-lg font-medium text-emerald-800 dark:text-emerald-300">Activity Logs</h3>
          <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{logsCount}</p>
          <div className="mt-2">
            <Button 
              variant="link" 
              className="p-0 h-auto text-emerald-600 dark:text-emerald-400"
              onClick={() => navigate('/admin/logs')}
            >
              View Logs
            </Button>
          </div>
        </div>
      </div>
      
      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card p-6 rounded-lg shadow border border-border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {logs && logs.length > 0 ? (
            <div className="space-y-4">
              {logs.slice(0, 5).map((log: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {log.action === 'create' && <PlusCircle className="w-5 h-5" />}
                    {log.action === 'update' && <PencilIcon className="w-5 h-5" />}
                    {log.action === 'delete' && <Trash2 className="w-5 h-5" />}
                    {log.action === 'login' && <LogIn className="w-5 h-5" />}
                    {log.action === 'logout' && <LogOut className="w-5 h-5" />}
                    {!['create', 'update', 'delete', 'login', 'logout'].includes(log.action) && <FileIcon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{log.user?.username || 'System'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {log.action.charAt(0).toUpperCase() + log.action.slice(1)} {log.itemType} 
                      {log.itemId ? ` #${log.itemId}` : ''}
                      {log.details ? `: ${log.details}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No recent activity found</p>
          )}
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Button 
              variant="default"
              className="w-full justify-start"
              onClick={() => navigate('/admin/projects/new')}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Project
            </Button>
            
            <Button 
              variant="default"
              className="w-full justify-start"
              onClick={() => navigate('/admin/media')}
            >
              <ImageIcon className="mr-2 h-4 w-4" /> Upload Media
            </Button>
            
            <Button 
              variant="default"
              className="w-full justify-start"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="mr-2 h-4 w-4" /> Edit Site Settings
            </Button>
            
            <Button 
              variant="default"
              className="w-full justify-start"
              onClick={() => navigate('/admin/logs')}
            >
              <ListIcon className="mr-2 h-4 w-4" /> View Activity Logs
            </Button>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow border border-border hover:border-primary/50 transition-colors">
          <div className="mb-4 rounded-full w-12 h-12 bg-gradient-to-tr from-blue-500 to-blue-600 text-white flex items-center justify-center">
            <FileEdit className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Content Management</h2>
          <p className="text-muted-foreground mb-4">Create, edit and manage your projects, blog posts and other content.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/projects/new')}
          >
            Manage Content
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border hover:border-primary/50 transition-colors">
          <div className="mb-4 rounded-full w-12 h-12 bg-gradient-to-tr from-purple-500 to-purple-600 text-white flex items-center justify-center">
            <ImageIcon className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Media Library</h2>
          <p className="text-muted-foreground mb-4">Upload and manage images, videos, and documents for your site.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/media')}
          >
            Media Library
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border hover:border-primary/50 transition-colors">
          <div className="mb-4 rounded-full w-12 h-12 bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center">
            <Settings className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Site Settings</h2>
          <p className="text-muted-foreground mb-4">Configure site-wide settings, SEO and appearance preferences.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/settings')}
          >
            Site Settings
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border hover:border-primary/50 transition-colors">
          <div className="mb-4 rounded-full w-12 h-12 bg-gradient-to-tr from-green-500 to-green-600 text-white flex items-center justify-center">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Analytics Dashboard</h2>
          <p className="text-muted-foreground mb-4">View site analytics, visitor statistics and performance metrics.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/analytics')}
          >
            View Analytics
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border hover:border-primary/50 transition-colors">
          <div className="mb-4 rounded-full w-12 h-12 bg-gradient-to-tr from-rose-500 to-rose-600 text-white flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-muted-foreground mb-4">Manage user accounts, roles, and permissions for the admin area.</p>
          <Button 
            className="w-full"
            onClick={() => navigate('/admin/users')}
          >
            Manage Users
          </Button>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow border border-border hover:border-primary/50 transition-colors">
          <div className="mb-4 rounded-full w-12 h-12 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white flex items-center justify-center">
            <ListIcon className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Activity Logs</h2>
          <p className="text-muted-foreground mb-4">Review admin activity, system logs and security events.</p>
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