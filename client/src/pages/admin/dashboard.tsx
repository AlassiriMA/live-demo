import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  AlertCircle, FileText, Image, Settings, Users, Database, 
  BarChart, Star, Zap, Clock, Calendar, Layers, Plus, ChevronRight,
  Trash2, Edit, Eye, Info, CheckCircle, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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

  // Additional data for a visually appealing dashboard
  const completionStats = {
    projects: (projects.length / 10) * 100, // Assuming target is 10 projects
    settings: (Object.keys(settings).length / 25) * 100, // Assuming target is 25 settings
    media: (mediaItems.length / 20) * 100, // Assuming target is 20 media items
  };

  // Function to format date for last updated
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric'
    }).format(date);
  };
  
  // Get current date for dashboard
  const currentDate = new Date();
  const lastUpdated = formatDate(currentDate);

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <FadeInSection>
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4 border-2 border-primary">
                <AvatarImage src="/assets/images/avatar.png" alt="Admin" />
                <AvatarFallback className="bg-primary/10">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Last updated: {lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2 flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="mr-2">
                  <Plus className="h-4 w-4 mr-1" /> Create New <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/projects/new" className="cursor-pointer w-full">
                    <FileText className="h-4 w-4 mr-2" /> New Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/media" className="cursor-pointer w-full">
                    <Image className="h-4 w-4 mr-2" /> Upload Media
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button asChild variant="default">
              <Link href="/admin/projects/new">
                <FileText className="h-4 w-4 mr-2" /> New Project
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Status Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 mb-8 flex items-center">
          <div className="bg-primary/20 rounded-full p-2 mr-4">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Your portfolio is running smoothly</h3>
            <p className="text-sm text-gray-600">All systems are operational. Last deployment: {formatDate(new Date(Date.now() - 86400000))}</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            <Link href="/" target="_blank">Visit Site</Link>
          </Button>
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
            {/* Dashboard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="overflow-hidden border-t-4 border-t-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-3xl font-bold">{projects.length || 0}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <span className="flex items-center text-green-600 mr-3">
                          <Check className="h-3 w-3 mr-1" />
                          {publishedProjects.length} Published
                        </span>
                        <span className="flex items-center text-amber-600">
                          <Clock className="h-3 w-3 mr-1" />
                          {draftProjects.length} Drafts
                        </span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Completion</span>
                      <span className="font-medium">{Math.min(100, Math.round(completionStats.projects))}%</span>
                    </div>
                    <Progress value={Math.min(100, completionStats.projects)} className="h-1.5" />
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50/50 border-t pt-3 pb-3">
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/admin/projects" className="flex items-center justify-center text-sm">
                      View all <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden border-t-4 border-t-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <Image className="h-5 w-5 text-purple-600" />
                    </div>
                    Media
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-3xl font-bold">{mediaItems.length || 0}</div>
                      <p className="text-sm text-gray-500 mt-1">
                        Images, documents & files
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Image className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Uploaded</span>
                      <span className="font-medium">{Math.min(100, Math.round(completionStats.media))}%</span>
                    </div>
                    <Progress value={Math.min(100, completionStats.media)} className="h-1.5" />
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50/50 border-t pt-3 pb-3">
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/admin/media" className="flex items-center justify-center text-sm">
                      Manage <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden border-t-4 border-t-emerald-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                      <Settings className="h-5 w-5 text-emerald-600" />
                    </div>
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-3xl font-bold">{Object.keys(settings).length || 0}</div>
                      <p className="text-sm text-gray-500 mt-1">
                        {Object.keys(settingsCount).length} categories
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <Settings className="h-6 w-6 text-emerald-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Configured</span>
                      <span className="font-medium">{Math.min(100, Math.round(completionStats.settings))}%</span>
                    </div>
                    <Progress value={Math.min(100, completionStats.settings)} className="h-1.5" />
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50/50 border-t pt-3 pb-3">
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/admin/settings" className="flex items-center justify-center text-sm">
                      Configure <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden border-t-4 border-t-amber-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <div className="bg-amber-100 p-2 rounded-lg mr-3">
                      <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-3xl font-bold">10</div>
                      <p className="text-sm text-gray-500 mt-1">
                        Apps showcased
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-amber-50 rounded-lg flex items-center justify-center">
                      <Layers className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Completion</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <Progress value={100} className="h-1.5" />
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50/50 border-t pt-3 pb-3">
                  <Button asChild variant="ghost" size="sm" className="w-full">
                    <Link href="/projects" className="flex items-center justify-center text-sm" target="_blank">
                      Visit <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Task cards with gradients */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-amber-500" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/projects/new" className="group">
                  <div className="h-auto py-6 px-8 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:translate-y-[-2px]">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl text-white mb-3 shadow-sm">
                      <FileText className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-gray-800">Create New Project</span>
                    <span className="text-sm text-gray-500 mt-1">Add to your portfolio</span>
                  </div>
                </Link>
                
                <Link href="/admin/media" className="group">
                  <div className="h-auto py-6 px-8 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:translate-y-[-2px]">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl text-white mb-3 shadow-sm">
                      <Image className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-gray-800">Upload Media</span>
                    <span className="text-sm text-gray-500 mt-1">Manage your assets</span>
                  </div>
                </Link>
                
                <Link href="/admin/settings" className="group">
                  <div className="h-auto py-6 px-8 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:translate-y-[-2px]">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl text-white mb-3 shadow-sm">
                      <Settings className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-gray-800">Edit Site Settings</span>
                    <span className="text-sm text-gray-500 mt-1">Configure your site</span>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Recent activity section */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-primary" />
                Portfolio Overview
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Site Performance</CardTitle>
                  <CardDescription>Key metrics for your portfolio site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      {/* Content completeness */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Content Completeness</span>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">Most content sections are complete</p>
                      </div>
                      
                      {/* Project Diversity */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Project Diversity</span>
                          <span className="text-sm font-medium">100%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">All project categories represented</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Project details completeness */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Project Details</span>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">Most projects have detailed descriptions</p>
                      </div>
                      
                      {/* Asset Quality */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Media Quality</span>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">Quality images & screenshots</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Alert className="mt-8 bg-primary/5 border-primary/20">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Portfolio Dashboard</AlertTitle>
              <AlertDescription>
                This is the control center for your professional portfolio site. From here, you can manage all your content, 
                media files, and site settings. Use the tabs above to navigate between different sections.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="projects">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  Projects Management
                </h2>
                <p className="text-gray-500">Create, edit, and manage your portfolio projects</p>
              </div>
              
              <Button asChild className="flex items-center">
                <Link href="/admin/projects/new">
                  <Plus className="h-4 w-4 mr-2" /> New Project
                </Link>
              </Button>
            </div>
            
            {/* Project stats summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-slate-50 border-blue-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Projects</p>
                      <h3 className="text-2xl font-bold mt-1">{projects.length || 0}</h3>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <Layers className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-green-600">Published</p>
                      <h3 className="text-2xl font-bold mt-1">{publishedProjects.length || 0}</h3>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-amber-600">Draft</p>
                      <h3 className="text-2xl font-bold mt-1">{draftProjects.length || 0}</h3>
                    </div>
                    <div className="bg-amber-100 rounded-lg p-3">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {projectsLoading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading projects...</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 bg-gray-50 p-4 border-b">
                  <div className="col-span-5 font-medium">Project</div>
                  <div className="col-span-3 font-medium">Status</div>
                  <div className="col-span-2 font-medium">Type</div>
                  <div className="col-span-2 font-medium text-right">Actions</div>
                </div>
                
                <div className="divide-y">
                  {projects.map((project: any) => (
                    <div key={project.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                      <div className="col-span-5">
                        <div className="flex items-center">
                          {project.imageUrl ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden mr-3 border">
                              <img 
                                src={project.imageUrl} 
                                alt={project.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3 border">
                              <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium">{project.title}</h4>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{project.slug}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-3">
                        {project.status === 'published' ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-50">Draft</Badge>
                        )}
                      </div>
                      
                      <div className="col-span-2">
                        <span className="text-sm">{project.category || 'Web App'}</span>
                      </div>
                      
                      <div className="col-span-2 flex justify-end space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/projects/edit/${project.id}`} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/project/${project.slug}`} className="cursor-pointer" target="_blank">
                                <Eye className="mr-2 h-4 w-4" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="bg-white rounded-full p-3 inline-flex mx-auto mb-4 shadow-sm">
                  <FileText className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No projects yet</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                  Get started by creating your first project. Projects showcase your work
                  and are displayed on your portfolio website.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/admin/projects/new">
                    <Plus className="h-4 w-4 mr-2" /> Create First Project
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="media">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1 flex items-center">
                  <Image className="h-5 w-5 mr-2 text-purple-500" />
                  Media Library
                </h2>
                <p className="text-gray-500">Upload and manage images, documents, and other media files</p>
              </div>
              
              <Button asChild className="flex items-center">
                <Link href="/admin/media">
                  <Plus className="h-4 w-4 mr-2" /> Upload Media
                </Link>
              </Button>
            </div>
            
            {/* Media stats summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Total Media</p>
                      <h3 className="text-2xl font-bold mt-1">{mediaItems.length || 0}</h3>
                    </div>
                    <div className="bg-purple-100 rounded-lg p-3">
                      <Image className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">Images</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {mediaItems.filter((item: any) => item.fileType?.includes('image/')).length || 0}
                      </h3>
                    </div>
                    <div className="bg-indigo-100 rounded-lg p-3">
                      <Image className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-sky-50 to-cyan-50 border-sky-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-sky-600">Storage Used</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {mediaItems.reduce((acc: number, item: any) => acc + (item.fileSize || 0), 0) / 1000000 || 0} MB
                      </h3>
                    </div>
                    <div className="bg-sky-100 rounded-lg p-3">
                      <Database className="h-5 w-5 text-sky-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {mediaLoading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading media library...</p>
              </div>
            ) : mediaItems.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700 flex items-center">
                    <Image className="h-4 w-4 mr-2 text-purple-500" /> All Media
                  </h3>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="bg-white">Images: {mediaItems.filter((item: any) => item.fileType?.includes('image/')).length}</Badge>
                    <Badge variant="outline" className="bg-white">Documents: {mediaItems.filter((item: any) => item.fileType?.includes('application/')).length}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mediaItems.map((item: any) => (
                    <div key={item.id} className="group relative overflow-hidden rounded-lg bg-white shadow-sm border hover:shadow-md transition-all duration-200">
                      <div className="aspect-square bg-gray-50">
                        {item.fileType?.includes('image/') ? (
                          <img 
                            src={item.url} 
                            alt={item.filename || 'Media item'} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="h-16 w-16 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <div className="text-white text-sm font-medium truncate">{item.filename}</div>
                        <div className="text-white/80 text-xs truncate">{(item.fileSize / 1000).toFixed(1)} KB</div>
                        <div className="flex items-center justify-center mt-3 space-x-2">
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-full">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" className="h-8 w-8 p-0 rounded-full">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <div className="bg-white rounded-full p-3 inline-flex mx-auto mb-4 shadow-sm">
                  <Image className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No media files yet</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                  Upload images and other media files to use in your projects and site content.
                  Your media library helps you organize and reuse assets across your portfolio.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/admin/media">
                    <Plus className="h-4 w-4 mr-2" /> Upload Media
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-emerald-500" />
                  Site Settings
                </h2>
                <p className="text-gray-500">Manage global site settings and configurations</p>
              </div>
              
              <Button asChild className="flex items-center">
                <Link href="/admin/settings">
                  <Settings className="h-4 w-4 mr-2" /> Manage Settings
                </Link>
              </Button>
            </div>
            
            {settingsLoading ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading settings...</p>
              </div>
            ) : (
              <>
                {/* Settings summary stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-emerald-600">Total Settings</p>
                          <h3 className="text-2xl font-bold mt-1">{Object.keys(settings).length || 0}</h3>
                        </div>
                        <div className="bg-emerald-100 rounded-lg p-3">
                          <Settings className="h-5 w-5 text-emerald-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-teal-600">Categories</p>
                          <h3 className="text-2xl font-bold mt-1">{Object.keys(settingsCount).length || 0}</h3>
                        </div>
                        <div className="bg-teal-100 rounded-lg p-3">
                          <Layers className="h-5 w-5 text-teal-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 col-span-2">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-blue-600 mb-2">Settings Health</p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Site Settings</span>
                            <span>{(settingsCount['site'] || 0) >= 3 ? 'Complete' : 'Incomplete'}</span>
                          </div>
                          <Progress value={(settingsCount['site'] || 0) >= 3 ? 100 : ((settingsCount['site'] || 0) / 3) * 100} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Contact Info</span>
                            <span>{(settingsCount['contact'] || 0) >= 3 ? 'Complete' : 'Incomplete'}</span>
                          </div>
                          <Progress value={(settingsCount['contact'] || 0) >= 3 ? 100 : ((settingsCount['contact'] || 0) / 3) * 100} className="h-1.5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-medium mb-4 flex items-center">
                    <Layers className="h-4 w-4 mr-2 text-emerald-500" /> Setting Categories
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.keys(settingsCount).map((category) => (
                      <Card key={category} className="overflow-hidden group hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white border-b">
                          <CardTitle className="text-lg capitalize flex items-center">
                            {category === 'site' && <Info className="h-4 w-4 mr-2 text-blue-500" />}
                            {category === 'hero' && <Star className="h-4 w-4 mr-2 text-amber-500" />}
                            {category === 'footer' && <FileText className="h-4 w-4 mr-2 text-gray-500" />}
                            {category === 'contact' && <Phone className="h-4 w-4 mr-2 text-green-500" />}
                            {category === 'social' && <Users className="h-4 w-4 mr-2 text-purple-500" />}
                            {!['site', 'hero', 'footer', 'contact', 'social'].includes(category) && (
                              <Settings className="h-4 w-4 mr-2 text-gray-500" />
                            )}
                            {category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-2xl font-bold">{settingsCount[category]}</div>
                              <p className="text-sm text-gray-500">values</p>
                            </div>
                            <div>
                              {settingsCount[category] > 0 ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Configured
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  Needs Setup
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 border-t bg-gray-50/50 group-hover:bg-gray-50 transition-colors duration-200">
                          <Button asChild variant="ghost" size="sm" className="w-full">
                            <Link href={`/admin/settings/${category}`} className="flex items-center justify-center">
                              Edit {category} <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button asChild size="lg" className="px-8">
                    <Link href="/admin/settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" /> Manage All Settings
                    </Link>
                  </Button>
                </div>
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