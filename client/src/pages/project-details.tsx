import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, ExternalLink, Layers, Code, Calendar, Tag, Star, Eye, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { apps } from "@/lib/app-data";

export default function ProjectDetailsPage() {
  // Get the project slug from URL
  const [, params] = useParams();
  const slug = params?.slug;
  const [, setLocation] = useLocation();
  
  // Fetch project details from API
  const { data, isLoading, error } = useQuery<{success: boolean, project: any}>({
    queryKey: ['/api/projects/slug/', slug],
    enabled: !!slug,
  });
  
  // Find matching app from local data for fallback
  const appData = apps.find(app => app.id === slug);
  
  // Handle loading state
  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  // Handle error state or not found
  if (error || !data?.project) {
    // If we have fallback app data, use it
    if (!appData) {
      return (
        <div className="container max-w-6xl mx-auto py-16 px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Project Not Found</h2>
            <p className="text-lg text-gray-600 mb-8">
              The project you're looking for doesn't exist or may have been moved.
            </p>
            <Button 
              onClick={() => setLocation('/projects')}
              className="rounded-lg"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      );
    }
  }
  
  // Use API data or fallback to app data
  const project = data?.project || {
    id: appData?.id,
    name: appData?.name,
    description: appData?.description,
    primaryColor: appData?.primaryColor,
    secondaryColor: appData?.secondaryColor,
    accentColor: appData?.accentColor,
    imageUrl: appData?.imageUrl,
    tags: appData?.tags.join(', '),
    route: appData?.route,
    detailedContent: 'Coming soon! This project details page is under construction.',
    features: [],
    status: 'Live',
    createdAt: new Date().toISOString(),
  };
  
  // Parse tags if they're a string
  const tags = typeof project.tags === 'string' 
    ? project.tags.split(',').map((tag: string) => tag.trim())
    : (Array.isArray(project.tags) ? project.tags : []);
    
  // Parse features if they're a JSON string
  let features = [];
  try {
    if (typeof project.features === 'string') {
      features = JSON.parse(project.features);
    } else if (Array.isArray(project.features)) {
      features = project.features;
    }
  } catch (e) {
    features = [];
  }
  
  // Format created date
  const formattedDate = project.createdAt 
    ? new Date(project.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  // Extract demo route
  const demoRoute = project.route || `/project/${slug}`;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero section */}
      <div 
        className="w-full py-16 relative overflow-hidden" 
        style={{ 
          backgroundColor: project.primaryColor || '#6366F1',
          color: '#ffffff'
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <Link href="/projects">
            <a className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Projects
            </a>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.name}</h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mb-6">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {tags.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 rounded-full text-sm font-medium" 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                asChild
                size="lg"
                style={{ 
                  backgroundColor: project.accentColor || 'white',
                  color: project.primaryColor,
                }}
                className="rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Link href={demoRoute}>
                  <span className="flex items-center">
                    Live Demo
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <div className="prose max-w-none">
                {project.detailedContent || (
                  <p className="text-gray-600">
                    This project provides a comprehensive demonstration of key concepts and technologies.
                    Explore the live demo to see it in action!
                  </p>
                )}
              </div>
            </motion.div>
            
            {features && features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm mb-8"
              >
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex">
                      <div 
                        className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg mr-4 text-white"
                        style={{ backgroundColor: project.secondaryColor || '#4F46E5' }}
                      >
                        <Layers className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {typeof feature === 'object' ? feature.title : `Feature ${idx + 1}`}
                        </h3>
                        <p className="text-gray-600">
                          {typeof feature === 'object' ? feature.description : feature}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Project image if available */}
            {project.imageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl p-6 shadow-sm mb-8"
              >
                <h2 className="text-2xl font-bold mb-4">Preview</h2>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={project.imageUrl} 
                    alt={`${project.name} preview`}
                    className="w-full object-cover"
                  />
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm mb-8"
            >
              <h3 className="text-lg font-bold mb-4">Project Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Created on</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Code className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Technologies</p>
                    <p className="font-medium">
                      {tags.length > 0 ? tags.join(', ') : 'Various technologies'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Eye className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{project.status || 'Live'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button 
                  asChild
                  className="w-full justify-center"
                  style={{ 
                    backgroundColor: project.accentColor || '#4F46E5',
                    color: 'white'
                  }}
                >
                  <Link href={demoRoute}>
                    <span className="flex items-center">
                      Visit Live Demo
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero skeleton */}
      <div className="w-full py-16 bg-indigo-600">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-6 h-5 w-24">
            <Skeleton className="h-full w-full bg-white/20" />
          </div>
          
          <div className="mb-4">
            <Skeleton className="h-12 w-3/4 md:w-1/2 bg-white/20" />
          </div>
          
          <div className="mb-6">
            <Skeleton className="h-6 w-full md:w-2/3 bg-white/20 mb-2" />
            <Skeleton className="h-6 w-full md:w-1/2 bg-white/20" />
          </div>
          
          <div className="flex gap-2 mb-8">
            <Skeleton className="h-8 w-20 rounded-full bg-white/20" />
            <Skeleton className="h-8 w-24 rounded-full bg-white/20" />
            <Skeleton className="h-8 w-16 rounded-full bg-white/20" />
          </div>
          
          <Skeleton className="h-12 w-32 rounded-lg bg-white/20" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <Skeleton className="h-8 w-40 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-3/4" />
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex">
                    <Skeleton className="h-10 w-10 rounded-lg mr-4" />
                    <div className="flex-grow">
                      <Skeleton className="h-5 w-full max-w-[120px] mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <Skeleton className="h-6 w-32 mb-4" />
              
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start">
                    <Skeleton className="h-5 w-5 mr-3" />
                    <div className="flex-grow">
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}