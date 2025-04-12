import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import AuthCheck from '@/components/auth/AuthCheck';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Save, Trash, X, Plus, FileText, Image, Link } from 'lucide-react';
import { FadeInSection } from '@/components/performance';

// Validation schema for project form
const projectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(3).refine(s => /^[a-z0-9-]+$/.test(s), {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens'
  }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().optional(),
  imageUrl: z.string().url('Invalid URL').optional(),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published']),
  category: z.string().optional(),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  demoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const ProjectForm = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const isEditMode = !!id;

  // Fetch project data if in edit mode
  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ['/api/projects', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiRequest('GET', `/api/projects/${id}`);
      return response;
    },
    enabled: !!id,
  });

  const project = projectData?.project;

  // Initialize form with project data or default values
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      content: '',
      imageUrl: '',
      tags: '',
      status: 'draft',
      category: '',
      githubUrl: '',
      demoUrl: '',
    },
  });

  // Update form values when project data is loaded
  useEffect(() => {
    if (project) {
      // Convert stored comma-separated tags to string for the form
      const tagsString = Array.isArray(project.tags) 
        ? project.tags.join(', ') 
        : (typeof project.tags === 'string' ? project.tags : '');

      form.reset({
        name: project.name || '',
        slug: project.slug || '',
        description: project.description || '',
        content: project.content || '',
        imageUrl: project.imageUrl || '',
        tags: tagsString,
        status: project.status || 'draft',
        category: project.category || '',
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
      });
    }
  }, [project, form]);

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      // Convert tags from comma-separated string to array
      const tagsArray = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
        : [];

      const response = await apiRequest('POST', '/api/projects', {
        ...data,
        tags: tagsArray,
        published: data.status === 'published',
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      navigate('/admin/dashboard');
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to create project');
    },
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      if (!id) throw new Error('Project ID is required');

      // Convert tags from comma-separated string to array
      const tagsArray = data.tags 
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
        : [];

      const response = await apiRequest('PATCH', `/api/projects/${id}`, {
        ...data,
        tags: tagsArray,
        published: data.status === 'published',
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', id] });
      navigate('/admin/dashboard');
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to update project');
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error('Project ID is required');
      const response = await apiRequest('DELETE', `/api/projects/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      navigate('/admin/dashboard');
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to delete project');
    },
  });

  const onSubmit = (data: ProjectFormValues) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Generate slug from name
  const generateSlug = () => {
    const name = form.getValues('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      form.setValue('slug', slug);
    }
  };

  const isLoading = isLoadingProject || createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <AuthCheck requiredRole="admin">
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Project' : 'Create New Project'}</h1>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="links">Links</TabsTrigger>
                  </TabsList>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <TabsContent value="basic" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter project name" 
                                  {...field} 
                                  onChange={(e) => {
                                    field.onChange(e);
                                    if (!isEditMode && !form.getValues('slug')) {
                                      // Auto-generate slug on name change if slug is empty
                                      setTimeout(generateSlug, 500);
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex gap-2 items-end">
                          <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>URL Slug</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="project-url-slug" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Used in the URL: /project/your-slug
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={generateSlug} 
                            className="mb-2"
                          >
                            Generate
                          </Button>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Brief description of the project" 
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Web App, Mobile App" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tags</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="tag1, tag2, tag3" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Enter tags separated by commas
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      <TabsContent value="content" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Content</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Detailed content and description of the project" 
                                  className="min-h-[300px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                You can use Markdown for rich formatting
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      <TabsContent value="media" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Featured Image URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://example.com/image.jpg" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {form.getValues('imageUrl') && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-2">Preview:</p>
                            <div className="border rounded-md overflow-hidden w-full max-w-md">
                              <img 
                                src={form.getValues('imageUrl')} 
                                alt="Preview" 
                                className="w-full h-auto" 
                                onError={(e) => (e.target as HTMLImageElement).src = '/assets/images/placeholder-image.svg'}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Media Library</p>
                          <div className="text-center py-6 bg-gray-50 rounded-lg">
                            <p className="text-gray-500 text-sm">
                              Media upload functionality will be available in the next update
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="links" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="githubUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GitHub URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://github.com/username/repo" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="demoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Live Demo URL</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="https://demo.example.com" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate('/admin/dashboard')}
                          disabled={isLoading || isDeleting}
                        >
                          Cancel
                        </Button>
                        
                        {isEditMode && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                                deleteMutation.mutate();
                              }
                            }}
                            disabled={isLoading || isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                              </>
                            ) : (
                              <>
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </>
                            )}
                          </Button>
                        )}
                        
                        <Button
                          type="submit"
                          disabled={isLoading || isDeleting}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                              {isEditMode ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" /> 
                              {isEditMode ? 'Update Project' : 'Create Project'}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <FadeInSection>
              <Card>
                <CardHeader>
                  <CardTitle>Project Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <FormDescription>
                            {field.value === 'published' 
                              ? 'This project is visible to visitors' 
                              : 'This project is currently in draft mode'}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === 'published'}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? 'published' : 'draft');
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium">Project Navigation</h3>
                    <div className="mt-2 space-y-2">
                      {tabTriggers.map((tab) => (
                        <button
                          key={tab.value}
                          type="button"
                          onClick={() => setActiveTab(tab.value)}
                          className={`flex items-center w-full px-3 py-2 text-sm rounded-md text-left transition-colors
                            ${activeTab === tab.value 
                              ? 'bg-primary/10 text-primary' 
                              : 'hover:bg-gray-100'
                            }`}
                        >
                          <tab.icon className="mr-2 h-4 w-4" />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {isEditMode && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-sm font-medium mb-2">Preview</h3>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={!form.getValues('slug')}
                        onClick={() => window.open(`/project/${form.getValues('slug')}`, '_blank')}
                      >
                        View Project Page
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </div>
      </div>
    </AuthCheck>
  );
};

// Tab configuration
const tabTriggers = [
  { label: 'Basic Info', value: 'basic', icon: Plus },
  { label: 'Content', value: 'content', icon: FileText },
  { label: 'Media', value: 'media', icon: Image },
  { label: 'Links', value: 'links', icon: Link },
];

export default ProjectForm;