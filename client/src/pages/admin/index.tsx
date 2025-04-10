import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Project, ActivityLog } from '@/types/cms';
import { Loader2, ArrowRight, PenBox, Users, Image, Settings, Activity } from 'lucide-react';

export default function AdminDashboard() {
  // Query projects for stats
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['/api/cms/projects'],
    select: (data: { projects: Project[] }) => data.projects,
  });

  // Query recent activity logs
  const { data: activityLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['/api/cms/activity-logs'],
    select: (data: { logs: ActivityLog[] }) => data.logs,
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Projects"
            value={isLoadingProjects ? '...' : projects?.length.toString() || '0'}
            description="Manage your projects"
            icon={<PenBox className="h-5 w-5" />}
            href="/admin/projects"
          />
          <StatsCard
            title="Media Library"
            value={isLoadingProjects ? '...' : '0'}
            description="Manage your media files"
            icon={<Image className="h-5 w-5" />}
            href="/admin/media"
          />
          <StatsCard
            title="Users"
            value={isLoadingProjects ? '...' : '0'}
            description="Manage admin users"
            icon={<Users className="h-5 w-5" />}
            href="/admin/users"
          />
          <StatsCard
            title="Settings"
            value={isLoadingProjects ? '...' : '0'}
            description="Configure your site"
            icon={<Settings className="h-5 w-5" />}
            href="/admin/settings"
          />
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activities</CardTitle>
            <CardDescription>
              Latest actions performed in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingLogs ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : activityLogs && activityLogs.length > 0 ? (
              <div className="space-y-4">
                {activityLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}{' '}
                        {log.entityType} #{log.entityId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        By {log.userId} • {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No recent activities found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Projects Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Projects</CardTitle>
                <CardDescription>Manage your project content</CardDescription>
              </div>
              <Link href="/admin/projects">
                <Button size="sm">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingProjects ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.published ? '#16a34a' : '#d97706' }}
                      ></div>
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.slug}</p>
                      </div>
                    </div>
                    <Link href={`/admin/projects/${project.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No projects found</p>
                <Link href="/admin/projects/new">
                  <Button>Create Your First Project</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function StatsCard({ title, value, description, icon, href }: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full p-1 bg-secondary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Link href={href}>
          <Button variant="link" className="px-0 py-1 h-auto mt-2">
            View Details <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}