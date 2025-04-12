import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import AuthCheck from '@/components/auth/AuthCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, ArrowLeft, Image, File, Upload, Trash2, Copy, ExternalLink, 
  MoreHorizontal, Grid, List
} from 'lucide-react';
import { FadeInSection } from '@/components/performance';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface MediaItem {
  id: number;
  filename: string;
  fileType: string;
  url: string;
  size: number;
  uploadedBy: number;
  createdAt: string;
}

const MediaLibrary = () => {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  
  // Fetch media items
  const { data, isLoading } = useQuery({
    queryKey: ['/api/cms/media'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/cms/media');
      return response;
    },
  });
  
  const mediaItems: MediaItem[] = data?.mediaItems || [];
  
  // Delete media mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/cms/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/media'] });
      setSuccess('Media deleted successfully');
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error: any) => {
      setError(`Failed to delete media: ${error.message}`);
    },
  });
  
  // Upload media mutation (simulated for now)
  const uploadMutation = useMutation({
    mutationFn: async ({ file, data }: { file: File; data: any }) => {
      // In a real implementation, you would use FormData and multipart/form-data
      // This is a simplified version that just simulates success
      // but doesn't actually upload the file
      
      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 300);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Return a mock response
      return {
        success: true,
        mediaItem: {
          id: Math.floor(Math.random() * 1000),
          filename: file.name,
          fileType: file.type,
          url: previewUrl || '',
          size: file.size,
          uploadedBy: 1,
          createdAt: new Date().toISOString()
        }
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/cms/media'], (oldData: any) => {
        return {
          ...oldData,
          mediaItems: [...(oldData?.mediaItems || []), data.mediaItem]
        };
      });
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      setSuccess('Media uploaded successfully');
      setTimeout(() => setSuccess(null), 3000);
    },
    onError: (error: any) => {
      setError(`Failed to upload: ${error.message}`);
    },
  });
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };
  
  // Handle upload
  const handleUpload = () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    uploadMutation.mutate({ 
      file: selectedFile, 
      data: { name: selectedFile.name }
    });
  };
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard');
    setTimeout(() => setSuccess(null), 2000);
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Get icon for file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };
  
  // Handle delete confirmation
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this media item? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };
  
  return (
    <AuthCheck requiredRole="admin">
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Media Library</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Media
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Media</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">Select File</Label>
                    <Input 
                      id="file" 
                      type="file" 
                      onChange={handleFileChange}
                      accept="image/*,application/pdf"
                    />
                  </div>
                  
                  {previewUrl && (
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-[200px] max-w-full mx-auto"
                      />
                    </div>
                  )}
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setUploadDialogOpen(false)}
                      disabled={uploadMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpload} 
                      disabled={!selectedFile || uploadMutation.isPending}
                    >
                      {uploadMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Upload'
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                className="rounded-none px-2"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                className="rounded-none px-2"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Media Files</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {mediaItems.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No media items yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Upload files to use in your projects</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Your First File
                    </Button>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mediaItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="relative group border rounded-md overflow-hidden bg-gray-50"
                      >
                        <div className="aspect-square">
                          {item.fileType.startsWith('image/') ? (
                            <img
                              src={item.url}
                              alt={item.filename}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/assets/images/placeholder-image.svg';
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100">
                              <File className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => setSelectedMedia(item)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                        </div>
                        
                        <div className="p-2 text-xs truncate">{item.filename}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mediaItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {getFileIcon(item.fileType)}
                                <span className="truncate max-w-[200px]">{item.filename}</span>
                              </div>
                            </TableCell>
                            <TableCell>{item.fileType.split('/')[1]}</TableCell>
                            <TableCell>{formatFileSize(item.size)}</TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setSelectedMedia(item)}>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => copyToClipboard(item.url)}>
                                    Copy URL
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                                    Delete
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
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Media Details Dialog */}
        {selectedMedia && (
          <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{selectedMedia.filename}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedMedia.fileType.startsWith('image/') ? (
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.filename}
                      className="max-h-[300px] max-w-full mx-auto"
                    />
                  </div>
                ) : (
                  <div className="border rounded-md p-8 text-center">
                    <File className="h-16 w-16 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">{selectedMedia.fileType}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">File Type:</span>
                    <span className="text-sm">{selectedMedia.fileType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Size:</span>
                    <span className="text-sm">{formatFileSize(selectedMedia.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Uploaded:</span>
                    <span className="text-sm">{new Date(selectedMedia.createdAt).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">URL:</span>
                    <Input
                      value={selectedMedia.url}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedMedia.url)}
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(selectedMedia.id);
                      setSelectedMedia(null);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedMedia.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AuthCheck>
  );
};

export default MediaLibrary;