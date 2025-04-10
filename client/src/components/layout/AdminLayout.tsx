import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  LayoutGrid,
  Image as ImageIcon,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavigationItem {
  href: string;
  label: string;
  icon: JSX.Element;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const handleLogout = async () => {
    await logout();
    // Redirect will be handled in the auth hook
  };

  // Navigation items
  const navigationItems: NavigationItem[] = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      href: '/admin/projects',
      label: 'Projects',
      icon: <LayoutGrid className="mr-2 h-4 w-4" />,
    },
    {
      href: '/admin/media',
      label: 'Media Library',
      icon: <ImageIcon className="mr-2 h-4 w-4" />,
    },
    {
      href: '/admin/blog',
      label: 'Blog Posts',
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ];

  // If no user, we shouldn't render the layout
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-card shadow-lg transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'lg:hidden' : 'lg:translate-x-0 lg:static lg:z-auto'}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-4">
          <span className="text-xl font-semibold">Admin Dashboard</span>
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