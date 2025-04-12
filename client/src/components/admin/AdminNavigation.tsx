import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAdminAuth } from './AdminAuthProvider';
import {
  LayoutDashboard,
  FileEdit,
  Settings,
  ImageIcon,
  ListIcon,
  BarChart3,
  Users,
  Home,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AdminNavigation() {
  const { logout } = useAdminAuth();
  const [location] = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: 'Projects',
      path: '/admin/projects/new',
      icon: <FileEdit className="h-5 w-5" />
    },
    {
      name: 'Media Library',
      path: '/admin/media',
      icon: <ImageIcon className="h-5 w-5" />
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />
    },
    {
      name: 'Activity Logs',
      path: '/admin/logs',
      icon: <ListIcon className="h-5 w-5" />
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users className="h-5 w-5" />
    }
  ];

  // Don't render anything during SSR to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm transition-transform duration-300 transform",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col p-6 h-full overflow-y-auto">
          <div className="mb-6">
            <h2 className="font-bold text-2xl mb-2">Admin Dashboard</h2>
            <p className="text-muted-foreground">Manage your portfolio site</p>
          </div>
          
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location === item.path
                      ? "bg-primary text-primary-foreground font-medium"
                      : "hover:bg-accent text-foreground/80 hover:text-foreground"
                  )}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </a>
              </Link>
            ))}
          </nav>
          
          <div className="pt-6 mt-6 border-t space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('/', '_blank')}
            >
              <Home className="mr-2 h-5 w-5" /> View Site
            </Button>
            
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={() => {
                setMobileNavOpen(false);
                logout();
              }}
            >
              <LogOut className="mr-2 h-5 w-5" /> Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 lg:w-72 lg:border-r lg:bg-background lg:pb-4">
        <div className="p-6 pb-2">
          <h2 className="font-bold text-2xl">Admin Dashboard</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your portfolio site</p>
        </div>
        
        <nav className="flex-1 px-3 py-2 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  location === item.path
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-accent text-foreground/80 hover:text-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
        
        <div className="px-3 pt-4 mt-2 border-t mx-6">
          <div className="space-y-3 px-1">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open('/', '_blank')}
            >
              <Home className="mr-2 h-5 w-5" /> View Site
            </Button>
            
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={logout}
            >
              <LogOut className="mr-2 h-5 w-5" /> Log Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}