import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronLeft, ExternalLink, Download, Layers, Code, Calendar, Clock, Tag, Star, Eye, ArrowUpRight, Zap, Share2, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedSkeleton } from "@/components/ui/animated-skeleton";
import { Button } from "@/components/ui/button";
import { apps } from "@/lib/app-data";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { ImageGridGallery } from '@/components/ui/image-grid-gallery';
import { TechStackGrid } from '@/components/ui/tech-stack-grid';

export default function ProjectDetailsPage() {
  // Get the project slug from URL
  const [match, params] = useRoute<{ slug: string }>("/project/:slug");
  const slug = params?.slug;
  const [, setLocation] = useLocation();
  
  // Fetch project details from API
  const { data, isLoading, error } = useQuery<{success: boolean, project: any}>({
    queryKey: [`/api/projects/slug/${slug}`],
    enabled: !!slug,
    retry: 1,
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
  
  // Define types for project data
  type FeatureItem = {
    title: string;
    description: string;
  };

  // Parse tags if they're a string
  const tags = typeof project.tags === 'string' 
    ? project.tags.split(',').map((tag: string) => tag.trim())
    : (Array.isArray(project.tags) ? project.tags : []);
    
  // Parse features if they're a JSON string
  let features: Array<FeatureItem | string> = [];
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
        className="w-full py-20 relative overflow-hidden bg-gradient-to-br" 
        style={{ 
          backgroundImage: `linear-gradient(135deg, ${project.primaryColor || '#6366F1'}, ${project.secondaryColor || '#4F46E5'})`,
          color: '#ffffff'
        }}
      >
        {/* Animated Particles Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)' }}></div>
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
        
        {/* Animated highlight shape */}
        <div 
          className="absolute top-0 -right-40 h-full w-96 rotate-12 transform opacity-20 blur-3xl"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${project.accentColor || '#818cf8'})`,
            animation: 'pulse 8s infinite'
          }}
        ></div>
        
        {/* Keyframes are defined in the CSS */}
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <button 
            onClick={() => setLocation('/projects')} 
            className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors cursor-pointer"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Projects
          </button>
          
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
              {tags.map((tag: string, idx: number) => {
                // Create a tag-specific color based on the tag content for consistency
                const tagHash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const hue = (tagHash % 360);
                
                return (
                  <span 
                    key={idx} 
                    className="px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md" 
                    style={{ 
                      backgroundColor: `hsla(${hue}, 85%, 85%, 0.25)`,
                      backdropFilter: 'blur(8px)',
                      color: `hsl(${hue}, 70%, 25%)`,
                      border: `1px solid hsla(${hue}, 70%, 70%, 0.3)`,
                      boxShadow: `0 2px 5px hsla(${hue}, 60%, 50%, 0.1)`
                    }}
                  >
                    {tag}
                  </span>
                );
              })}
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
                {project.detailedContent ? (
                  <div className="markdown-content">
                    <ReactMarkdown 
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    >
                      {project.detailedContent}
                    </ReactMarkdown>
                  </div>
                ) : (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.map((feature: FeatureItem | string, idx: number) => {
                    // Calculate a feature-specific hue based on its index or content
                    const featureHue = typeof feature === 'object' 
                      ? feature.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
                      : (idx * 60) % 360;
                    
                    // Generate complementary colors
                    const bgColor = `hsla(${featureHue}, 85%, 96%, 1)`;
                    const iconBgColor = project.secondaryColor || `hsl(${featureHue}, 70%, 55%)`;
                    const borderColor = `hsla(${featureHue}, 70%, 85%, 1)`;
                    
                    return (
                      <motion.div 
                        key={idx} 
                        className="flex p-4 rounded-xl border transition-all duration-300 hover:shadow-md group"
                        style={{ borderColor, backgroundColor: bgColor }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx, duration: 0.4 }}
                        whileHover={{ y: -5 }}
                      >
                        <div 
                          className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg mr-4 text-white shadow-sm group-hover:shadow-md transition-all duration-300"
                          style={{ backgroundColor: iconBgColor }}
                        >
                          {idx % 3 === 0 ? (
                            <Layers className="h-6 w-6" />
                          ) : idx % 3 === 1 ? (
                            <Zap className="h-6 w-6" />
                          ) : (
                            <CheckCircle className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {typeof feature === 'object' ? feature.title : `Feature ${idx + 1}`}
                          </h3>
                          <p className="text-gray-600">
                            {typeof feature === 'object' ? feature.description : feature}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            
            {/* App Screenshots Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">App Screenshots</h2>
              
              {/* Main Project Image first as a showcase */}
              {project.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                  <img 
                    src={project.imageUrl} 
                    alt={`${project.name} preview`}
                    className="w-full object-contain"
                  />
                </div>
              )}
              
              {/* Use our ImageGridGallery component for screenshots */}
              {/* Fruit Store Screenshots */}
              {(project.slug === 'fruit-store' || project.id === 2) && (
                <ImageGridGallery 
                  images={[
                    {
                      src: "/assets/images/screenshots/fruit/product-catalog.svg",
                      alt: "Fruit Store Product Catalog",
                      caption: "Browse our selection of fresh fruits with filtering options"
                    },
                    {
                      src: "/assets/images/screenshots/fruit/shopping-cart.svg",
                      alt: "Fruit Store Shopping Cart",
                      caption: "Review your cart and checkout"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* Marketing Agency Screenshots */}
              {(project.slug === 'marketing-agency' || project.id === 3) && (
                <ImageGridGallery 
                  images={[
                    {
                      src: "/assets/images/screenshots/marketing/chatbot.svg",
                      alt: "Marketing Chatbot",
                      caption: "AI-powered chatbot for lead generation"
                    },
                    {
                      src: "/assets/images/placeholder-image.svg",
                      alt: "Marketing Analytics Dashboard",
                      caption: "Comprehensive analytics tracking"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* For all other projects, show generic placeholder if no specific screenshots */}
              {!['fruit-store', 'marketing-agency'].includes(project.slug || '') && 
                ![2, 3].includes(project.id || 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="h-48 bg-gradient-to-br p-4 flex items-center justify-center" 
                         style={{ 
                           backgroundImage: `linear-gradient(135deg, ${project.primaryColor || '#6366F1'}50, ${project.secondaryColor || '#4F46E5'}90)`,
                         }}>
                      <div className="text-white text-center">
                        <div className="text-lg font-medium mb-2">User Interface</div>
                        <p className="text-white/70 text-sm">Interactive dashboard with data visualization</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50">
                      <p className="font-medium text-gray-700">Main Dashboard</p>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="h-48 bg-gradient-to-br p-4 flex items-center justify-center" 
                         style={{ 
                           backgroundImage: `linear-gradient(135deg, ${project.secondaryColor || '#4F46E5'}50, ${project.primaryColor || '#6366F1'}90)`,
                         }}>
                      <div className="text-white text-center">
                        <div className="text-lg font-medium mb-2">Reports & Analytics</div>
                        <p className="text-white/70 text-sm">Comprehensive data analysis tools</p>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50">
                      <p className="font-medium text-gray-700">Analytics Module</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
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
            
            {/* Technology Stack Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm mb-8"
            >
              <h3 className="text-lg font-bold mb-4">Technology Stack</h3>
              
              <div className="space-y-4">
                {/* Extract tech icons from tags */}
                <div className="grid grid-cols-3 gap-4">
                  {tags.map((tag, idx) => {
                    // Calculate tag color based on name
                    const tagHash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                    const hue = (tagHash % 360);
                    const lightness = 45 + (tagHash % 20);
                    
                    // Assign an icon based on the technology
                    let icon = null;
                    if (tag.toLowerCase().includes('react')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9.861a2.139 2.139 0 1 0 0 4.278 2.139 2.139 0 1 0 0-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95zm12.675 7.305l-.133-.469a23.357 23.357 0 0 0-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 0 0 1.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 0 1-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 0 0-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 0 0-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 0 1 3.233-.501 24.847 24.847 0 0 1 2.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zm9.589 20.362c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 0 0 2.421-2.968l.135-.193.234-.02a23.63 23.63 0 0 0 3.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 0 1-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 0 1-3.234.501 24.674 24.674 0 0 1-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 0 0-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 0 0-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0 1 14.75 7.24zM7.206 22.677A2.38 2.38 0 0 1 6 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.134.193a23.596 23.596 0 0 0 2.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 0 1-2.052-2.545 24.976 24.976 0 0 1-3.233-.501zm5.984.628c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 0 1-1.35-2.122 30.354 30.354 0 0 1-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 0 1 1.166-2.228c.414-.716.869-1.43 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 0 1 5.033 0l.234.02.134.193a30.006 30.006 0 0 1 2.517 4.35l.101.213-.101.213a29.6 29.6 0 0 1-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 0 0 2.196-3.798 28.585 28.585 0 0 0-2.197-3.798 29.031 29.031 0 0 0-4.394 0 28.477 28.477 0 0 0-2.197 3.798 29.114 29.114 0 0 0 2.197 3.798z"/></svg>;
                    } else if (tag.toLowerCase().includes('node')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.985c-.275 0-.532-.074-.772-.202l-2.439-1.448c-.365-.203-.182-.277-.072-.314.496-.165.588-.201 1.101-.493.056-.027.129-.016.185.021l1.87 1.12c.074.036.166.036.221 0l7.319-4.237c.074-.036.11-.11.11-.202V7.768c0-.091-.036-.165-.11-.201l-7.319-4.219c-.073-.037-.165-.037-.221 0L4.552 7.566c-.073.036-.11.129-.11.201v8.457c0 .073.037.166.11.202l2 1.157c1.082.548 1.762-.095 1.762-.735V8.502c0-.124.095-.221.221-.221h.936c.117 0 .221.097.221.221v8.347c0 1.449-.788 2.294-2.164 2.294-.422 0-.752 0-1.688-.46l-1.925-1.099a1.55 1.55 0 0 1-.771-1.34V7.786c0-.55.293-1.064.771-1.339l7.316-4.237a1.637 1.637 0 0 1 1.544 0l7.317 4.237c.479.274.771.789.771 1.339v8.458c0 .549-.293 1.063-.771 1.34l-7.317 4.236c-.241.11-.516.165-.773.165zm2.256-5.816c-3.21 0-3.87-1.468-3.87-2.714 0-.117.094-.221.22-.221h.954c.11 0 .201.082.201.183.147.971.568 1.449 2.514 1.449 1.54 0 2.202-.35 2.202-1.175 0-.477-.185-.825-2.587-1.063-1.999-.188-3.241-.643-3.241-2.239 0-1.485 1.247-2.366 3.339-2.366 2.347 0 3.503.809 3.649 2.568a.21.21 0 0 1-.062.165.226.226 0 0 1-.158.056h-.953a.211.211 0 0 1-.202-.164c-.221-1.012-.789-1.34-2.275-1.34-1.687 0-1.872.587-1.872 1.028 0 .533.237.699 2.514.99 2.256.292 3.32.707 3.32 2.294-.033 1.615-1.339 2.531-3.679 2.531z"/></svg>;
                    } else if (tag.toLowerCase().includes('typescript') || tag.toLowerCase().includes('ts')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M0 12v12h24V0H0v12zm19.341-.956c.61.152 1.074.423 1.501.865.221.236.549.666.575.77.008.03-1.036.73-1.668 1.123-.023.015-.115-.084-.217-.236-.31-.45-.633-.644-1.128-.678-.728-.05-1.196.331-1.192.967a.88.88 0 0 0 .102.45c.16.331.458.53 1.39.933 1.719.74 2.454 1.227 2.911 1.92.51.773.625 2.008.278 2.926-.38.998-1.325 1.676-2.655 1.9-.411.073-1.386.062-1.828-.018-.964-.172-1.878-.648-2.442-1.273-.221-.243-.652-.88-.625-.925.011-.016.11-.077.22-.141.108-.061.511-.294.892-.515l.69-.4.145.214c.202.308.643.731.91.872.766.404 1.817.347 2.335-.118a.883.883 0 0 0 .313-.72c0-.278-.035-.4-.18-.61-.186-.266-.567-.49-1.649-.96-1.238-.533-1.771-.864-2.259-1.39a3.165 3.165 0 0 1-.659-1.2c-.091-.339-.114-1.189-.042-1.531.255-1.197 1.158-2.03 2.461-2.278.423-.08 1.406-.05 1.821.053zm-5.634 1.002l.008.983H10.59v8.876H8.38v-8.876H5.258v-.964c0-.534.011-.98.026-.99.012-.016 1.913-.024 4.217-.02l4.195.012z"/></svg>;
                    } else if (tag.toLowerCase().includes('javascript') || tag.toLowerCase().includes('js')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>;
                    } else if (tag.toLowerCase().includes('python')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M14.31.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.83l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.23l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.24l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05 1.07.13zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09-.33.22zM21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01.21.03zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08-.33.23z"/></svg>;
                    } else if (tag.toLowerCase().includes('angular')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M9.931 12.645h4.138l-2.07-4.908m0-7.737L.68 3.982l1.726 14.771L12 24l9.596-5.242L23.32 3.984 11.999.001zm7.064 18.31h-2.638l-1.422-3.503H8.996l-1.422 3.504h-2.64L12 2.65z"/></svg>;
                    } else if (tag.toLowerCase().includes('vue')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M24 1.61h-9.94L12 5.16 9.94 1.61H0l12 20.78zm-18.77 3.22h3.45L12 12.39l3.32-7.56h3.45L12 21.38z"/></svg>;
                    } else if (tag.toLowerCase().includes('tailwind')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>;
                    } else if (tag.toLowerCase().includes('express')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M24 18.588a1.529 1.529 0 0 1-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 0 1-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 0 1 1.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 0 1 1.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 0 0 0 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 0 0 2.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 0 1-2.589 3.957 6.272 6.272 0 0 1-7.306-.933c-1.292-1.316-1.802-2.932-1.759-4.686h20.383l.01-.673c.206-2.67-.62-5.084-2.342-7.04-1.388-1.56-3.06-2.364-4.99-2.775-2.383-.511-4.58.03-6.57 1.297-2.346 1.496-3.734 3.704-4.136 6.46-.064.44-.21.87-.34 1.297-.035.12-.076.232-.076.36zm1.275-.068h9.95c-.102-3.272-2.146-5.557-5.022-5.516-3.058.04-4.95 2.303-4.928 5.516z"/></svg>;
                    } else if (tag.toLowerCase().includes('postgres') || tag.toLowerCase().includes('postgresql')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3407-2.3483.1134-2.6677-.0191 1.326-2.0469 2.421-4.5304 3.0938-6.7256.6462-2.111.7553-3.8323.3076-4.8449-.9348-2.1109-3.2293-3.1678-6.2059-2.8935-1.1979.1108-2.5549.5515-3.1986.9947-.0075-.0093-.0184-.0122-.0264-.0215-.4984-.5335-1.1329-.8196-1.9797-.8907-1.0511-.0881-2.0733.1323-2.8423.614-.5252.3285-.9212.7485-1.3396 1.4258-.2516.4061-.4984.9322-.7924 1.6677-.1249.3136-.4402 1.212-.4519 1.2451-.2706.7666-.474 1.0972-.89 1.5106-.5082.5069-.9039.5136-1.2059.5136-.0563 0-.1126 0-.1654-.0024a.729.729 0 0 0-.1323.0141.5205.5205 0 0 0-.478.5372c0 .0305.0037.0623.0112.094.0399.1538.1576.2764.3102.3229.9137.2859 1.829.4183 2.7241.3946.8069-.214 1.5614-.1477 2.2424-.375.8667-.289 1.4998-.7823 2.0099-1.5647.346-.529.6769-1.2126 1.1051-2.2815.0961-.2397.39-1.0413.4015-1.0767.1924-.5658.3522-.814.5101-.9924.1456-.1632.2897-.2436.4623-.2553.1399-.69.2491.0046.3499.0398.1519.0563.2718.1672.3326.3056.0633.1443.0656.3349.0071.5953-.1383.6226-.0961 1.1818.1342 1.7622.1798.4482.4998.8055.8901 1.0007-.8313 2.4757-1.4027 5.5765-1.494 8.3753-.087.4271-.0645.8505.0673 1.2515.1329.4009.3718.7409.689.976a.5237.5237 0 0 0 .3536.1359h.0188a.5229.5229 0 0 0 .485-.3446c.2216-.591.6539-1.0788 1.028-1.5589.0324-.414.0632-.0809.0944-.1211.4449-.5795.8088-1.1796 1.153-1.8967l.0846-.1754c.0916-.1882.1729-.3551.2468-.5069.6791-1.3921 1.0429-3.025 1.0429-4.6867 0-.2247-.0037-.4482-.0133-.6739.7549-.4198 1.4538-.9855 2.0871-1.6866a10.8098 10.8098 0 0 0 1.971-2.9083c.1924.1239.4169.254.6649.3892.3946.2142.842.4578 1.2878.689 1.5178.7859 3.0539 1.2431 4.5659 1.3552.3375.025.6679.0375.9915.0375 2.1436 0 3.9688-.5458 5.1458-1.5389.0494-.04.0981-.0793.1455-.1175a.5334.5334 0 0 0 .142-.178zm-14.5306-6.8453c-.352.2296-.7343.3688-1.1379.4129a5.956 5.956 0 0 1-.6511.0375c-.3946 0-.7693-.0329-1.1168-.0987-.7781-.1477-1.4981-.488-2.0123-.9548.0339-.0799.0682-.1599.1038-.2436.6997-1.6651 1.2953-2.9263 2.5104-3.3428.1921-.0661.3985-.0947.6176-.0947.56 0 1.1879.2025 1.8089.585.7864.4858 1.4607 1.1639 1.9026 1.9143.4411.7501.6435 1.5304.5698 2.1954-.3781.078-.8238.2306-1.495.5098zm5.2123 12.7381a5.6481 5.6481 0 0 1-.9491-.7511 5.6066 5.6066 0 0 1-.6729-.8669c-.3232-.5189-.5349-1.0884-.6448-1.6768a6.8468 6.8468 0 0 1-.0749-1.6839c.1013-2.8227.7807-5.9139 1.6277-8.3373.0451.0068.0906.0103.1394.0103.0781 0 .1536-.0089.2284-.0239.527-.1114.9766-.4772 1.2634-.9982.3122-.5682.3931-1.2417.24-2.0028.5305-.39 1.2665-.5934 2.1429-.5934.2146 0 .4349.0107.6501.0307 1.9689.1903 3.2551 1.0272 3.3788 2.2036.0389.3713-.0677 1.119-.5808 2.0897-.5983 1.1315-1.5118 2.3858-2.5763 3.5324-.4807.5172-1.0031 1.0245-1.5528 1.5011-.9368.8125-1.8222 1.5799-2.4666 2.3429-.6767.8023-1.2884 1.9143-1.7241 3.1279l-.0586.1659c-.2991.8258-.6314 1.7443-1.1625 2.1406z"/></svg>;
                    } else if (tag.toLowerCase().includes('mongodb')) { 
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0 1 11.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 0 0 3.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/></svg>;
                    } else if (tag.toLowerCase().includes('mysql')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 0 0-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 0 0-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.83-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.337.41.83.615 1.48.615.272 0 .528-.043.765-.13l1.4.712.31-.61zM15.5 17.588c-.225-.36-.337-.94-.337-1.736 0-1.393.424-2.09 1.27-2.09.443 0 .77.167.977.5.224.362.336.936.336 1.723 0 1.404-.424 2.108-1.27 2.108-.445 0-.77-.167-.978-.5zm-1.658-.425c0 .47-.172.856-.516 1.156-.344.3-.803.45-1.384.45-.543 0-1.064-.172-1.573-.515l.237-.476c.438.22.833.328 1.19.328.332 0 .593-.073.783-.22a.754.754 0 0 0 .3-.615c0-.33-.23-.61-.648-.845-.388-.213-1.163-.657-1.163-.657-.422-.307-.632-.636-.632-1.177 0-.45.157-.81.47-1.085.315-.278.72-.415 1.22-.415.512 0 .98.136 1.4.41l-.213.476a2.726 2.726 0 0 0-1.064-.23c-.283 0-.502.068-.654.206a.685.685 0 0 0-.248.524c0 .328.234.61.666.85.393.215 1.187.67 1.187.67.433.305.648.63.648 1.168zm9.382-5.852c-.535-.014-.95.04-1.297.188-.1.04-.26.04-.274.167.055.053.063.14.11.214.08.134.218.313.346.407.14.11.28.216.427.31.26.16.555.255.81.416.145.094.293.213.44.313.073.05.12.14.214.172v-.02c-.046-.06-.06-.147-.105-.214-.067-.067-.134-.127-.2-.193a3.223 3.223 0 0 0-.695-.675c-.214-.146-.682-.35-.77-.595l-.013-.014c.146-.013.32-.066.46-.106.227-.06.435-.047.67-.106.106-.027.213-.06.32-.094v-.06c-.12-.12-.21-.283-.334-.395a8.867 8.867 0 0 0-1.104-.823c-.21-.134-.476-.22-.697-.334-.08-.04-.214-.06-.26-.127-.12-.146-.19-.34-.275-.514a17.69 17.69 0 0 1-.547-1.163c-.12-.262-.193-.523-.34-.763-.69-1.137-1.437-1.826-2.586-2.5-.247-.14-.543-.2-.856-.274-.167-.008-.334-.02-.5-.027-.11-.047-.216-.174-.31-.235-.38-.24-1.364-.76-1.644-.072-.18.434.267.862.422 1.082.115.153.26.328.34.5.047.116.06.235.107.356.106.294.207.622.347.897.073.14.153.287.247.413.054.073.146.107.167.227-.094.136-.1.334-.154.5-.24.757-.146 1.693.194 2.25.107.166.362.534.703.393.3-.12.234-.5.32-.835.02-.08.007-.133.048-.187v.015c.094.188.188.367.274.555.206.328.566.668.867.895.16.12.287.328.487.402v-.02h-.015c-.043-.058-.1-.086-.154-.133a3.445 3.445 0 0 1-.35-.4 8.76 8.76 0 0 1-.747-1.218c-.11-.21-.202-.436-.29-.643-.04-.08-.04-.2-.107-.24-.1.146-.247.273-.32.453-.127.288-.14.642-.188 1.01-.027.007-.014 0-.027.014-.214-.052-.287-.274-.367-.46-.2-.475-.233-1.238-.06-1.785.047-.14.247-.582.167-.716-.042-.127-.174-.2-.247-.303a2.478 2.478 0 0 1-.24-.427c-.16-.374-.24-.788-.414-1.162-.08-.173-.22-.354-.334-.513-.127-.18-.267-.307-.368-.52-.033-.073-.08-.194-.027-.274.014-.054.042-.075.094-.09.088-.072.335.022.422.062.247.1.455.194.662.334.094.066.195.193.315.226h.14c.214.047.455.014.655.073.355.114.675.28.962.46a5.953 5.953 0 0 1 2.085 2.286c.08.154.115.295.188.455.14.33.313.663.455.982.14.315.275.636.476.897.1.14.502.213.682.286.133.06.34.115.46.188.23.14.454.3.67.454.11.076.443.243.463.378z"/></svg>;
                    } else if (tag.toLowerCase().includes('firebase')) {
                      icon = <svg className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z"/></svg>;
                    } else {
                      // Generic code icon for other technologies
                      icon = <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
                    }
                    
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * idx }}
                        className="flex flex-col items-center justify-center p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        style={{ 
                          backgroundColor: `hsla(${hue}, 85%, ${lightness}%, 0.1)`,
                          border: `1px solid hsla(${hue}, 85%, ${lightness}%, 0.3)`,
                          color: `hsl(${hue}, 85%, ${lightness}%)`
                        }}
                      >
                        {icon}
                        <span className="text-xs font-medium">{tag}</span>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Project Time Estimate */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Development Time Estimate</h4>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Design</span>
                      <span className="text-xs font-medium text-gray-800">2-3 weeks</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mb-3">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Development</span>
                      <span className="text-xs font-medium text-gray-800">4-6 weeks</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full mb-3">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Testing</span>
                      <span className="text-xs font-medium text-gray-800">1-2 weeks</span>
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full">
                      <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                </div>
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
      {/* Hero skeleton with gradient background and progress indicator */}
      <div className="w-full py-20 bg-gradient-to-br from-indigo-600 to-indigo-700 relative overflow-hidden">
        {/* Global loading progress bar */}
        <AnimatedSkeleton 
          className="absolute top-0 left-0 h-1 z-50 bg-blue-300"
          animation="progress"
          fullWidth
          showProgress={true}
        />
        
        {/* Skeleton background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)' }}></div>
        </div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          {/* Back button */}
          <div className="mb-6 h-5 w-24">
            <AnimatedSkeleton 
              className="h-full w-full bg-white/20"
              animation="shimmer"
              delay={0.1}
            />
          </div>
          
          {/* Title */}
          <div className="mb-4">
            <AnimatedSkeleton 
              className="h-12 w-3/4 md:w-1/2 bg-white/20"
              animation="shimmer"
              delay={0.2}
            />
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <AnimatedSkeleton 
              className="h-6 w-full md:w-2/3 bg-white/20 mb-2"
              animation="shimmer"
              delay={0.3}
            />
            <AnimatedSkeleton 
              className="h-6 w-full md:w-1/2 bg-white/20"
              animation="shimmer"
              delay={0.4}
            />
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <AnimatedSkeleton 
                key={i} 
                className="h-8 w-20 md:w-24 rounded-full bg-white/20"
                animation="pulse"
                delay={0.2 + (i * 0.1)}
              />
            ))}
          </div>
          
          {/* Button */}
          <AnimatedSkeleton 
            className="h-12 w-32 rounded-lg bg-white/30"
            animation="pulse"
            delay={0.8}
          />
        </div>
      </div>
      
      {/* Content skeleton with improved visuals */}
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Overview section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8 relative overflow-hidden">
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <AnimatedSkeleton 
                className="h-8 w-40 mb-4"
                animation="wave"
                delay={0.4}
              />
              
              <AnimatedSkeleton 
                className="h-5 w-full mb-2"
                animation="wave"
                delay={0.5}
              />
              <AnimatedSkeleton 
                className="h-5 w-full mb-2"
                animation="wave"
                delay={0.6}
              />
              <AnimatedSkeleton 
                className="h-5 w-full mb-2"
                animation="wave"
                delay={0.7}
              />
              <AnimatedSkeleton 
                className="h-5 w-full mb-2"
                animation="wave"
                delay={0.8}
              />
              <AnimatedSkeleton 
                className="h-5 w-3/4"
                animation="wave"
                delay={0.9}
              />
            </div>
            
            {/* Features section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8 relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-8 w-40 mb-4"
                animation="wave"
                delay={1.0}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div 
                    key={i} 
                    className="flex p-4 rounded-xl border border-gray-100 relative overflow-hidden" 
                    style={{ backgroundColor: `hsla(${i * 60}, 85%, 96%, 1)` }}
                  >
                    <AnimatedSkeleton 
                      className="h-12 w-12 rounded-lg mr-4"
                      animation="pulse"
                      delay={1.0 + (i * 0.1)}
                      style={{ backgroundColor: `hsla(${i * 60}, 70%, 85%, 1)` }}
                    />
                    
                    <div className="flex-grow">
                      <AnimatedSkeleton 
                        className="h-5 w-full max-w-[120px] mb-2"
                        animation="pulse"
                        delay={1.1 + (i * 0.1)}
                      />
                      <AnimatedSkeleton 
                        className="h-4 w-full mb-1"
                        animation="pulse"
                        delay={1.2 + (i * 0.1)}
                      />
                      <AnimatedSkeleton 
                        className="h-4 w-4/5"
                        animation="pulse"
                        delay={1.3 + (i * 0.1)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Preview section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8 relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-8 w-40 mb-4"
                animation="combined"
                delay={1.5}
              />
              
              <div className="rounded-lg overflow-hidden border border-gray-200 h-64">
                <AnimatedSkeleton 
                  className="h-full w-full"
                  animation="combined"
                  showProgress={true}
                  delay={1.6}
                />
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8 relative overflow-hidden">
              <AnimatedSkeleton 
                className="absolute inset-0 opacity-30"
                animation="shimmer"
                delay={1.7}
              />
              
              <AnimatedSkeleton 
                className="h-6 w-32 mb-4"
                animation="wave"
                delay={1.7}
              />
              
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start">
                    <AnimatedSkeleton 
                      className="h-5 w-5 rounded-md mr-3"
                      animation="pulse"
                      delay={1.8 + (i * 0.1)}
                    />
                    <div className="flex-grow">
                      <AnimatedSkeleton 
                        className="h-4 w-20 mb-1"
                        animation="pulse"
                        delay={1.9 + (i * 0.1)}
                      />
                      <AnimatedSkeleton 
                        className="h-5 w-full"
                        animation="pulse"
                        delay={2.0 + (i * 0.1)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <AnimatedSkeleton 
                  className="h-10 w-full rounded-md"
                  animation="combined"
                  showProgress={true}
                  delay={2.3}
                />
              </div>
            </div>
            
            {/* Additional skeleton for related projects */}
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-6 w-40 mb-4"
                animation="combined"
                delay={2.4}
              />
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center">
                    <AnimatedSkeleton 
                      className="h-14 w-14 rounded-md mr-3"
                      animation="pulse"
                      delay={2.5 + (i * 0.1)}
                    />
                    <div className="flex-grow">
                      <AnimatedSkeleton 
                        className="h-5 w-3/4 mb-1"
                        animation="pulse"
                        delay={2.6 + (i * 0.1)}
                      />
                      <AnimatedSkeleton 
                        className="h-4 w-1/2"
                        animation="pulse"
                        delay={2.7 + (i * 0.1)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}