import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  FolderPlus, 
  ImageIcon, 
  Settings, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
    setLocation('/admin/login');
  };

  const navigationItems = [
    { icon: <LayoutDashboard className="mr-2 h-4 w-4" />, label: 'Dashboard', href: '/admin' },
    { icon: <FolderPlus className="mr-2 h-4 w-4" />, label: 'Projects', href: '/admin/projects' },
    { icon: <ImageIcon className="mr-2 h-4 w-4" />, label: 'Media', href: '/admin/media' },
    { icon: <Users className="mr-2 h-4 w-4" />, label: 'Users', href: '/admin/users' },
    { icon: <Settings className="mr-2 h-4 w-4" />, label: 'Settings', href: '/admin/settings' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile menu button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      )}

      {/* Sidebar */}
      <div 
        className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isMobile ? 'fixed z-40 shadow-xl' : 'relative'}
          transition-transform duration-300 ease-in-out
          w-64 h-screen bg-card border-r border-border flex flex-col
        `}
      >
        {/* Logo and title */}
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  {/* @ts-ignore - This is a valid pattern for wouter Link component */}
                  {({ isActive }: { isActive: boolean }) => (
                    <a
                      className={`
                        flex items-center p-2 rounded-md transition-colors
                        ${isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                        }
                      `}
                      onClick={() => isMobile && setIsSidebarOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info & logout */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{user.username}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
              {user.role}
            </span>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" /> 
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-end px-6">
          <div className="text-sm">
            Logged in as <span className="font-medium">{user.username}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border p-4 text-center text-sm text-muted-foreground">
          Content Management System &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}