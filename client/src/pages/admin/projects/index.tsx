import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import AdminLayout from '@/components/layout/AdminLayout';
import { Project } from '@/types/cms';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Loader2, MoreHorizontal, PlusCircle, Eye, Pencil, Trash2, EyeOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function ProjectsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Fetch projects
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/cms/projects'],
    select: (data: { success: boolean; projects: Project[] }) => data.projects,
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/cms/projects/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/projects'] });
      toast({
        title: 'Project deleted',
        description: 'The project has been permanently deleted.',
      });
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete the project. Please try again.',
        variant: 'destructive',
      });
      console.error('Delete error:', error);
    },
  });

  // Toggle publish status mutation
  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: number; published: boolean }) => {
      return apiRequest(`/api/cms/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/projects'] });
      toast({
        title: 'Status updated',
        description: 'The project status has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update project status.',
        variant: 'destructive',
      });
      console.error('Toggle publish error:', error);
    },
  });

  // Handle delete confirmation
  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete.id);
    }
  };

  // Handle toggle publish status
  const handleTogglePublish = (project: Project) => {
    togglePublishMutation.mutate({
      id: project.id,
      published: !project.published,
    });
  };

  // Filter projects by search term
  const filteredProjects = data
    ? data.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <Link href="/admin/projects/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <div className="max-w-sm">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-destructive">Error loading projects. Please try again.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col h-40 items-center justify-center text-center">
            <p className="text-muted-foreground mb-4">No projects found</p>
            <Link href="/admin/projects/new">
              <Button>Create Your First Project</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.slug}</TableCell>
                    <TableCell>
                      <Badge
                        variant={project.published ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(project.updatedAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleTogglePublish(project)}
                            disabled={togglePublishMutation.isPending}
                          >
                            {project.published ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" /> Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" /> Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/projects/${project.id}`)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(project)}
                            className="text-destructive focus:text-destructive"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the project "
                {projectToDelete?.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}