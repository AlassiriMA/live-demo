import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { AlertCircle, FileText, Image, Settings, Users, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FadeInSection } from '@/components/performance';
import AuthCheck from '@/components/auth/AuthCheck';

/**
 * Admin Dashboard with overview of site content and quick actions
 */
const Dashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch projects data
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
    enabled: !!user,
  });
  
  // Fetch media data
  const { data: mediaData, isLoading: mediaLoading } = useQuery({
    queryKey: ['/api/cms/media'],
    enabled: !!user,
  });
  
  // Fetch settings data
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/settings'],
    enabled: !!user,
  });

  // Auth check is now handled by AuthCheck component
  
  const projects = projectsData?.projects || [];
  const publishedProjects = projects.filter((p: any) => p.status === 'published');
  const draftProjects = projects.filter((p: any) => p.status === 'draft');
  
  const mediaItems = mediaData?.mediaItems || [];
  const settings = settingsData?.settings || {};
  
  // Calculate total settings by category
  const settingsCount: Record<string, number> = {};
  Object.keys(settings).forEach(key => {
    const category = key.split('.')[0];
    settingsCount[category] = (settingsCount[category] || 0) + 1;
  });

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <FadeInSection>
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {user.username}! Manage your content from here.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button asChild variant="default">
              <Link href="/admin/projects/new">New Project</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/media/upload">Upload Media</Link>
            </Button>
          </div>
        </div>
      </FadeInSection>
      
      <FadeInSection delay={0.1}>
        <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{projects.length || 0}</div>
                  <p className="text-sm text-gray-500">
                    {publishedProjects.length} published, {draftProjects.length} drafts
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/admin/projects">View all projects</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Image className="mr-2 h-5 w-5 text-primary" />
                    Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mediaItems.length || 0}</div>
                  <p className="text-sm text-gray-500">Images, documents & files</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/admin/media">Manage media</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Settings className="mr-2 h-5 w-5 text-primary" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Object.keys(settings).length || 0}</div>
                  <p className="text-sm text-gray-500">Site configuration values</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/admin/settings">Manage settings</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1</div>
                  <p className="text-sm text-gray-500">Admin accounts</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/admin/users">Manage users</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-auto py-4 px-6 flex flex-col items-center justify-center">
                  <Link href="/admin/projects/new">
                    <FileText className="h-6 w-6 mb-2" />
                    <span>Create New Project</span>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-auto py-4 px-6 flex flex-col items-center justify-center">
                  <Link href="/admin/media/upload">
                    <Image className="h-6 w-6 mb-2" />
                    <span>Upload Media</span>
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="h-auto py-4 px-6 flex flex-col items-center justify-center">
                  <Link href="/admin/settings/edit">
                    <Settings className="h-6 w-6 mb-2" />
                    <span>Edit Site Settings</span>
                  </Link>
                </Button>
              </div>
            </div>
            
            <Alert className="mt-8 bg-primary/5 border-primary/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Welcome to your dashboard</AlertTitle>
              <AlertDescription>
                This is the control center for your portfolio site. From here, you can manage all your content, 
                media files, and site settings. Use the tabs above to navigate between different sections.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="projects">
            <h2 className="text-xl font-bold mb-4">Projects Management</h2>
            <p className="mb-4">Create, edit, and manage your portfolio projects from here.</p>
            
            <div className="flex justify-end mb-4">
              <Button asChild>
                <Link href="/admin/projects/new">New Project</Link>
              </Button>
            </div>
            
            {projectsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project: any) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-2">
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>
                        {project.status === 'published' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Draft
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild variant="ghost" size="sm" className="mr-2">
                        <Link href={`/admin/projects/edit/${project.id}`}>Edit</Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/project/${project.slug}`}>View</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new project</p>
                <Button asChild className="mt-4">
                  <Link href="/admin/projects/new">Create Project</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="media">
            <h2 className="text-xl font-bold mb-4">Media Library</h2>
            <p className="mb-4">Upload and manage images, documents, and other media files.</p>
            
            <div className="flex justify-end mb-4">
              <Button asChild>
                <Link href="/admin/media/upload">Upload Media</Link>
              </Button>
            </div>
            
            {mediaLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading media...</p>
              </div>
            ) : mediaItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaItems.map((item: any) => (
                  <div key={item.id} className="relative group rounded-lg overflow-hidden bg-gray-100">
                    <div className="aspect-square">
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="mr-2">View</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No media items</h3>
                <p className="mt-1 text-sm text-gray-500">Upload images and other media files</p>
                <Button asChild className="mt-4">
                  <Link href="/admin/media/upload">Upload Media</Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <h2 className="text-xl font-bold mb-4">Site Settings</h2>
            <p className="mb-4">Manage global site settings and configurations.</p>
            
            {settingsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading settings...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {Object.keys(settingsCount).map((category) => (
                    <Card key={category}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg capitalize">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{settingsCount[category]}</div>
                        <p className="text-sm text-gray-500">configuration values</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button asChild variant="ghost" size="sm" className="w-full">
                          <Link href={`/admin/settings/${category}`}>Edit {category} settings</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                <Button asChild className="w-full">
                  <Link href="/admin/settings">Manage All Settings</Link>
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </FadeInSection>
      
      <FadeInSection delay={0.2}>
        <div className="mt-12 border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-500">
            This will show recent content changes and system activities.
          </p>
          
          <div className="mt-4 p-6 bg-gray-50 rounded-lg text-center">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Activity logging coming soon</h3>
            <p className="text-sm text-gray-500 mt-2">
              This feature will track changes to content, settings, and user actions.
            </p>
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

// Wrap Dashboard component with AuthCheck for protected access
const ProtectedDashboard = () => (
  <AuthCheck requiredRole="admin">
    <Dashboard />
  </AuthCheck>
);

export default ProtectedDashboard;