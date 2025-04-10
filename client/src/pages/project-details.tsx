import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  ChevronLeft, ExternalLink, Download, Layers, Code, Calendar, Clock, 
  Tag, Star, Eye, ArrowUpRight, Zap, Share2, CheckCircle 
} from "lucide-react";
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
import AppShell from "@/components/layout/AppShell";

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
    return (
      <AppShell>
        <ProjectDetailsSkeleton />
      </AppShell>
    );
  }

  // Handle error state or not found
  if (error || !data?.project) {
    // If we have fallback app data, use it
    if (!appData) {
      return (
        <AppShell>
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
        </AppShell>
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
    <AppShell>
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
                  const tagHash = tag.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
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
                        ? feature.title.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 360
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
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
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
                
                {/* Main Project Screenshot - featured screenshot from each project */}
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                  {project.slug === 'pos-bookstore' && (
                    <img 
                      src="/assets/images/screenshots/pos/inventory.svg" 
                      alt={`${project.name} inventory management`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'fruit-store' && (
                    <img 
                      src="/assets/images/screenshots/fruit/product-catalog.svg" 
                      alt={`${project.name} product catalog`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'marketing-agency' && (
                    <img 
                      src="/assets/images/screenshots/marketing/services.svg" 
                      alt={`${project.name} services page`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'bi-dashboard' && (
                    <img 
                      src="/assets/images/screenshots/bi/dashboard.svg" 
                      alt={`${project.name} dashboard`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'statistical-arbitrage' && (
                    <img 
                      src="/assets/images/screenshots/statarb/dashboard.svg" 
                      alt={`${project.name} dashboard`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'triangular-arbitrage' && (
                    <img 
                      src="/assets/images/screenshots/triarb/scanner.svg" 
                      alt={`${project.name} opportunity scanner`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {(project.slug === 'dydx-trading' || project.slug === 'dydx-interface') && (
                    <img 
                      src="/assets/images/screenshots/dydx/trading.svg" 
                      alt={`${project.name} trading interface`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'english-ai-tutor' && (
                    <img 
                      src="/assets/images/screenshots/english-ai/conversation.svg" 
                      alt={`${project.name} conversation interface`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'beauty-salon' && (
                    <img 
                      src="/assets/images/screenshots/beauty/services.svg" 
                      alt={`${project.name} services page`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'reddit-clone' && (
                    <img 
                      src="/assets/images/screenshots/reddit/home.svg" 
                      alt={`${project.name} home page`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {/* Fallback to project.imageUrl if no specific screenshot is available */}
                  {!['pos-bookstore', 'fruit-store', 'marketing-agency', 'bi-dashboard', 
                     'statistical-arbitrage', 'triangular-arbitrage', 'dydx-trading', 'dydx-interface',
                     'english-ai-tutor', 'beauty-salon', 'reddit-clone'].includes(project.slug || '') && project.imageUrl && (
                    <img 
                      src={project.imageUrl} 
                      alt={`${project.name} preview`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                </div>
                
                {/* English AI Tutor Screenshots */}
                {(project.slug === 'english-ai-tutor' || project.id === 8) && (
                  <ImageGridGallery 
                    images={[
                      {
                        src: "/assets/images/screenshots/english-ai/conversation.svg",
                        alt: "AI English Conversation",
                        caption: "Practice conversations with AI-powered language tutor"
                      },
                      {
                        src: "/assets/images/screenshots/english-ai/vocabulary.svg",
                        alt: "Vocabulary Builder",
                        caption: "Custom vocabulary lists with pronunciation and examples"
                      }
                    ]}
                    aspectRatio="wide"
                    columns={2}
                    lightboxEnabled={true}
                  />
                )}

                {/* StatArb Screenshots */}
                {(project.slug === 'statistical-arbitrage' || project.id === 5) && (
                  <ImageGridGallery 
                    images={[
                      {
                        src: "/assets/images/screenshots/statarb/dashboard.svg",
                        alt: "Statistical Arbitrage Dashboard",
                        caption: "Real-time portfolio performance tracking"
                      },
                      {
                        src: "/assets/images/screenshots/statarb/pairs.svg",
                        alt: "Pair Selection Tool",
                        caption: "Advanced pair selection with statistical analysis"
                      },
                      {
                        src: "/assets/images/screenshots/statarb/analytics.svg",
                        alt: "Trading Analytics",
                        caption: "In-depth performance and risk analytics"
                      },
                      {
                        src: "/assets/images/screenshots/statarb/settings.svg",
                        alt: "Strategy Configuration",
                        caption: "Customizable parameters for trading strategies"
                      }
                    ]}
                    aspectRatio="wide"
                    columns={2}
                    lightboxEnabled={true}
                  />
                )}
                
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
                      },
                      {
                        src: "/assets/images/screenshots/fruit/checkout.svg",
                        alt: "Checkout Process",
                        caption: "Secure and streamlined checkout experience"
                      },
                      {
                        src: "/assets/images/screenshots/fruit/order-tracking.svg",
                        alt: "Order Tracking",
                        caption: "Real-time tracking of your fresh fruit orders"
                      }
                    ]}
                    aspectRatio="wide"
                    columns={2}
                    lightboxEnabled={true}
                  />
                )}
              </motion.div>
            </div>
            
            {/* Sidebar column */}
            <div className="lg:col-span-1 space-y-8">
              {/* Project details card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold mb-4">Project Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Released</p>
                      <p className="text-sm">{formattedDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Code className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Tech Stack</p>
                      <p className="text-sm">React, Node.js, Express, PostgreSQL</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Star className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {project.status || 'Live'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <hr className="my-4 border-gray-200" />
                
                <h3 className="font-medium text-gray-700 mb-2">Share</h3>
                <div className="flex space-x-2">
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <Share2 className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ProjectDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero skeleton */}
      <div className="w-full py-20 relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="inline-block mb-6">
            <AnimatedSkeleton 
              className="h-4 w-24"
              animation="combined"
              delay={0.0}
            />
          </div>
          
          <AnimatedSkeleton 
            className="h-12 w-64 mb-4"
            animation="combined"
            delay={0.1}
          />
          <AnimatedSkeleton 
            className="h-6 w-full max-w-3xl mb-6"
            animation="combined"
            delay={0.2}
          />
          <AnimatedSkeleton 
            className="h-4 w-32 mb-8"
            animation="combined"
            delay={0.3}
          />
          <AnimatedSkeleton 
            className="h-10 w-32 rounded-lg"
            animation="combined"
            delay={0.4}
          />
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-8 w-32 mb-4"
                animation="combined"
                delay={0.5}
              />
              <AnimatedSkeleton 
                className="h-4 w-full mb-2"
                animation="combined"
                delay={0.6}
              />
              <AnimatedSkeleton 
                className="h-4 w-full mb-2"
                animation="combined"
                delay={0.7}
              />
              <AnimatedSkeleton 
                className="h-4 w-3/4 mb-2"
                animation="combined"
                delay={0.8}
              />
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-8 w-32 mb-4"
                animation="combined"
                delay={0.9}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex p-4 border rounded-xl">
                    <AnimatedSkeleton 
                      className="h-12 w-12 rounded-lg mr-4"
                      animation="combined"
                      delay={1.0 + i * 0.1}
                    />
                    <div className="flex-1">
                      <AnimatedSkeleton 
                        className="h-5 w-32 mb-2"
                        animation="combined"
                        delay={1.1 + i * 0.1}
                      />
                      <AnimatedSkeleton 
                        className="h-4 w-full mb-1"
                        animation="combined"
                        delay={1.2 + i * 0.1}
                      />
                      <AnimatedSkeleton 
                        className="h-4 w-2/3"
                        animation="combined"
                        delay={1.3 + i * 0.1}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-8 w-40 mb-4"
                animation="combined"
                delay={1.8}
              />
              <AnimatedSkeleton 
                className="h-64 w-full mb-6 rounded-lg"
                animation="combined"
                delay={1.9}
              />
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <AnimatedSkeleton 
                    key={i}
                    className="h-16 rounded-lg"
                    animation="combined"
                    delay={2.4 + i * 0.05}
                  />
                ))}
              </div>
            </div>
            
            {/* Additional skeleton for related projects */}
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-6 w-40 mb-4"
                animation="combined"
                delay={2.7}
              />
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="flex items-center">
                    <AnimatedSkeleton 
                      className="h-8 w-8 rounded-full mr-3"
                      animation="combined"
                      delay={2.7 + i * 0.1}
                    />
                    <div className="space-y-1 flex-1">
                      <AnimatedSkeleton 
                        className="h-3 w-32"
                        animation="combined"
                        delay={2.8 + i * 0.1}
                      />
                      <AnimatedSkeleton 
                        className="h-2 w-24"
                        animation="combined"
                        delay={2.9 + i * 0.1}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar column skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-6 w-32 mb-4"
                animation="combined"
                delay={3.0}
              />
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center">
                    <AnimatedSkeleton 
                      className="h-8 w-8 rounded-full mr-3"
                      animation="combined"
                      delay={3.1 + i * 0.1}
                    />
                    <div className="space-y-1 flex-1">
                      <AnimatedSkeleton 
                        className="h-3 w-24"
                        animation="combined"
                        delay={3.2 + i * 0.1}
                      />
                      <AnimatedSkeleton 
                        className="h-2 w-32"
                        animation="combined"
                        delay={3.3 + i * 0.1}
                      />
                    </div>
                  </div>
                ))}
                <hr className="my-4 border-gray-200" />
                <AnimatedSkeleton 
                  className="h-3 w-20 mb-2"
                  animation="combined"
                  delay={3.4}
                />
                <div className="flex space-x-2">
                  <AnimatedSkeleton 
                    className="h-8 w-8 rounded-full"
                    animation="combined"
                    delay={3.5}
                  />
                  <AnimatedSkeleton 
                    className="h-8 w-8 rounded-full"
                    animation="combined"
                    delay={3.6}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}