import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutGrid, 
  Image, 
  Settings, 
  FileText, 
  Calendar,
  TrendingUp,
  Users,
  PlusCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Get activity logs
  const { 
    data: activityLogs = [], 
    isLoading: isLoadingLogs 
  } = useQuery({
    queryKey: ['/api/cms/logs'],
    enabled: !!user
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  const adminCards = [
    {
      title: 'Projects',
      icon: <LayoutGrid className="h-6 w-6 text-primary" />,
      description: 'Manage your portfolio projects',
      href: '/admin/projects',
      count: '7'
    },
    {
      title: 'Media Library',
      icon: <Image className="h-6 w-6 text-primary" />,
      description: 'Manage images and files',
      href: '/admin/media',
      count: '12'
    },
    {
      title: 'Blog Posts',
      icon: <FileText className="h-6 w-6 text-primary" />,
      description: 'Manage your blog content',
      href: '/admin/blog',
      count: '4'
    },
    {
      title: 'Settings',
      icon: <Settings className="h-6 w-6 text-primary" />,
      description: 'Configure site settings',
      href: '/admin/settings',
      count: ''
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-medium">{user.username}</span>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {adminCards.map((card) => (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                {card.count && (
                  <div className="text-2xl font-bold mb-2">{card.count}</div>
                )}
                <p className="text-sm text-muted-foreground">
                  {card.description}
                </p>
                <Button 
                  variant="link" 
                  className="px-0 mt-2" 
                  onClick={() => navigate(card.href)}
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions in the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <p>Loading activity logs...</p>
              ) : activityLogs.length > 0 ? (
                <div className="space-y-4">
                  {activityLogs.slice(0, 5).map((log: any) => (
                    <div key={log.id} className="flex items-start gap-2 pb-3 border-b last:border-0">
                      <div className="rounded-full bg-primary/10 p-2">
                        {log.actionType === 'create' ? (
                          <PlusCircle className="h-4 w-4 text-primary" />
                        ) : log.actionType === 'update' ? (
                          <TrendingUp className="h-4 w-4 text-primary" />
                        ) : (
                          <Users className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{log.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <span>{log.username}</span>
                          <span className="mx-1">•</span>
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(log.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No recent activity</p>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common admin tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                onClick={() => navigate('/admin/projects/new')}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Project
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/media/upload')}
              >
                <Image className="mr-2 h-4 w-4" />
                Upload Media
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/blog/new')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Create Blog Post
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Edit Site Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}