import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import RichTextEditor from '@/components/ui/rich-text-editor';
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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Loader2, ChevronLeft } from 'lucide-react';

// Project creation validation schema
const projectSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  style: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF0000)').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF0000)').optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF0000)').optional(),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  route: z.string().min(1, 'Route is required').startsWith('/', 'Route must start with /'),
  published: z.boolean().default(false),
  detailedContent: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [detailedContent, setDetailedContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      style: '',
      primaryColor: '#000000',
      secondaryColor: '#000000',
      accentColor: '#000000',
      imageUrl: '',
      route: '',
      published: false,
      detailedContent: '',
      tags: [],
    },
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      return apiRequest('/api/cms/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/projects'] });
      toast({
        title: 'Project created',
        description: 'The project has been created successfully.',
      });
      navigate('/admin/projects');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create the project. Please try again.',
        variant: 'destructive',
      });
      console.error('Create error:', error);
    },
  });

  // Handle form submission
  const onSubmit = (data: ProjectFormValues) => {
    // Include the rich text content and tags
    createMutation.mutate({
      ...data,
      detailedContent,
      tags,
    });
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue('tags', newTags);
      setTagInput('');
    }
  };

  // Handle tag deletion
  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  // Handle slug generation from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-4"
            onClick={() => navigate('/admin/projects')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        </div>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="My Project"
                          onChange={(e) => {
                            field.onChange(e);
                            // Auto-generate slug if field is empty
                            if (!form.getValues('slug')) {
                              form.setValue('slug', generateSlug(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>The name of your project</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="my-project" />
                      </FormControl>
                      <FormDescription>
                        Used for URL identification (e.g., /projects/my-project)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brief Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="A short description of the project" />
                      </FormControl>
                      <FormDescription>
                        A concise summary that appears in listings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="/project-route" />
                      </FormControl>
                      <FormDescription>
                        The URL path for this project (e.g., /pos, /fruits)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style/Theme</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Neumorphism, Clean, Minimal, etc." />
                      </FormControl>
                      <FormDescription>The visual style of the project</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/image.jpg" />
                      </FormControl>
                      <FormDescription>A header or preview image for the project</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <div className="flex gap-2">
                          <div
                            className="w-8 h-8 rounded-md border"
                            style={{ backgroundColor: field.value }}
                          ></div>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary</FormLabel>
                        <div className="flex gap-2">
                          <div
                            className="w-8 h-8 rounded-md border"
                            style={{ backgroundColor: field.value }}
                          ></div>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accentColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accent</FormLabel>
                        <div className="flex gap-2">
                          <div
                            className="w-8 h-8 rounded-md border"
                            style={{ backgroundColor: field.value }}
                          ></div>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormLabel htmlFor="tags">Tags</FormLabel>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="w-4 h-4 rounded-full bg-muted-foreground/30 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormDescription>
                    Tags that describe the project (e.g., React, TypeScript, etc.)
                  </FormDescription>
                </div>

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Publish</FormLabel>
                        <FormDescription>
                          Make this project visible to visitors
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <FormLabel>Detailed Content</FormLabel>
              <RichTextEditor
                value={detailedContent}
                onChange={setDetailedContent}
                placeholder="Enter detailed description of the project..."
                minHeight="300px"
                className="mt-2"
              />
              <FormDescription className="mt-2">
                The complete, detailed description of your project
              </FormDescription>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/projects')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}