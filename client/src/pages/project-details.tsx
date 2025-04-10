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
              
              {/* POS Bookstore Screenshots */}
              {(project.slug === 'pos-bookstore' || project.id === 1) && (
                <ImageGridGallery 
                  images={[
                    {
                      src: "/assets/images/screenshots/pos/inventory.svg",
                      alt: "POS Inventory Management",
                      caption: "Comprehensive inventory management for bookstore"
                    },
                    {
                      src: "/assets/images/screenshots/pos/sales-dashboard.svg",
                      alt: "POS Sales Dashboard",
                      caption: "Real-time sales tracking and analytics"
                    },
                    {
                      src: "/assets/images/screenshots/pos/transaction.svg",
                      alt: "POS Transaction Interface",
                      caption: "Streamlined checkout process for sales"
                    },
                    {
                      src: "/assets/images/screenshots/pos/categories.svg",
                      alt: "Book Categories Management",
                      caption: "Organize inventory with customizable categories"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* BI Dashboard Screenshots */}
              {(project.slug === 'bi-dashboard' || project.id === 4) && (
                <ImageGridGallery 
                  images={[
                    {
                      src: "/assets/images/screenshots/bi/dashboard.svg",
                      alt: "Business Intelligence Dashboard",
                      caption: "Interactive data visualization dashboard"
                    },
                    {
                      src: "/assets/images/screenshots/bi/reports.svg",
                      alt: "Custom Report Builder",
                      caption: "Create and manage custom reports"
                    },
                    {
                      src: "/assets/images/screenshots/bi/data-sources.svg",
                      alt: "Data Sources Management",
                      caption: "Connect to and manage multiple data sources"
                    },
                    {
                      src: "/assets/images/screenshots/bi/analytics.svg",
                      alt: "Advanced Analytics",
                      caption: "Perform in-depth data analysis with visualizations"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* English AI Tutor Screenshots */}
              {(project.slug === 'english-ai-tutor' || project.id === 8) && (
                <ImageGridGallery 
                  images={[
                    {
                      src: "/assets/images/screenshots/english-ai/conversation.svg",
                      alt: "AI Conversation Interface",
                      caption: "Natural language learning with AI tutor"
                    },
                    {
                      src: "/assets/images/screenshots/english-ai/vocabulary.svg",
                      alt: "Vocabulary Learning",
                      caption: "Expand vocabulary with interactive flashcards"
                    },
                    {
                      src: "/assets/images/screenshots/english-ai/grammar.svg",
                      alt: "Grammar Practice",
                      caption: "Interactive grammar lessons and exercises"
                    },
                    {
                      src: "/assets/images/screenshots/english-ai/lessons.svg",
                      alt: "Lesson Journey",
                      caption: "Progressive learning path with achievements"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* Beauty Salon Screenshots */}
              {(project.slug === 'beauty-salon' || project.id === 9) && (
                <ImageGridGallery 
                  images={[
                    {
                      src: "/assets/images/screenshots/beauty/booking.svg",
                      alt: "Beauty Salon Booking System",
                      caption: "Easy appointment scheduling for clients"
                    },
                    {
                      src: "/assets/images/screenshots/beauty/services.svg",
                      alt: "Beauty Services Catalog",
                      caption: "Browse available treatments and services"
                    },
                    {
                      src: "/assets/images/screenshots/beauty/gallery.svg",
                      alt: "Beauty Salon Gallery",
                      caption: "Showcase of previous client transformations"
                    },
                    {
                      src: "/assets/images/screenshots/beauty/stylists.svg",
                      alt: "Meet Our Stylists",
                      caption: "Professional stylist profiles with reviews"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* Reddit Clone Screenshots */}
              {(project.slug === 'reddit-clone' || project.id === 10) && (
                <ImageGridGallery 
                  images={[
                    {
                      src: "/assets/images/screenshots/reddit/feed.svg",
                      alt: "Reddit Clone Feed",
                      caption: "Community-driven content feed with voting"
                    },
                    {
                      src: "/assets/images/screenshots/reddit/post-detail.svg",
                      alt: "Post Detail View",
                      caption: "Nested comment system for discussions"
                    },
                    {
                      src: "/assets/images/screenshots/reddit/submit.svg",
                      alt: "Content Submission",
                      caption: "Create and submit posts to communities"
                    },
                    {
                      src: "/assets/images/screenshots/reddit/profile.svg",
                      alt: "User Profile",
                      caption: "Profile with posting history and karma"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* StatArb Trading Screenshots */}
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
              
              {/* Statistical Arbitrage Tech Stack */}
              {(project.slug === 'statistical-arbitrage' || project.id === 5) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Implementation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-md mb-2">Technology Stack</h4>
                      <TechStackGrid
                        technologies={[
                          { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                          { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                          { name: 'Python', icon: 'SiPython', type: 'backend', url: 'https://www.python.org' },
                          { name: 'FastAPI', icon: 'SiFastapi', type: 'backend', url: 'https://fastapi.tiangolo.com' },
                          { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                          { name: 'Redis', icon: 'SiRedis', type: 'database', url: 'https://redis.io' },
                          { name: 'Docker', icon: 'SiDocker', type: 'devops', url: 'https://www.docker.com' },
                          { name: 'NGINX', icon: 'SiNginx', type: 'devops', url: 'https://nginx.org' },
                          { name: 'Pandas', icon: 'SiPandas', type: 'tool', url: 'https://pandas.pydata.org' },
                          { name: 'NumPy', icon: 'SiNumpy', type: 'tool', url: 'https://numpy.org' },
                          { name: 'TradingView', icon: 'SiTradingview', type: 'tool', url: 'https://www.tradingview.com' },
                          { name: 'GitHub Actions', icon: 'SiGithubactions', type: 'devops', url: 'https://github.com/features/actions' }
                        ]}
                        grouped={true}
                        showLabels={true}
                        showLinks={true}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Deployment Architecture</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li>Frontend deployed on <span className="font-medium">Vercel</span> for global CDN distribution</li>
                          <li>Backend APIs containerized with <span className="font-medium">Docker</span> and hosted on <span className="font-medium">Oracle Cloud Infrastructure</span></li>
                          <li>Microservices architecture with dedicated containers for data fetching, analysis, and execution</li>
                          <li>NGINX as reverse proxy with SSL termination for secure communications</li>
                          <li>Redis for real-time data caching and pub/sub messaging between services</li>
                          <li>CI/CD pipeline with <span className="font-medium">GitHub Actions</span> for automated testing and deployment</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-700 mb-2">Correlation Analysis</h5>
                          <p className="text-sm text-gray-700">Advanced statistical models to identify correlated pairs for arbitrage opportunities.</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h5 className="font-medium text-purple-700 mb-2">Risk Management</h5>
                          <p className="text-sm text-gray-700">Dynamic position sizing and stop-loss mechanisms based on volatility metrics.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-md">
                          <h5 className="font-medium text-green-700 mb-2">Backtesting Engine</h5>
                          <p className="text-sm text-gray-700">Historical simulation with comprehensive performance analytics.</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-md">
                          <h5 className="font-medium text-amber-700 mb-2">Real-time Execution</h5>
                          <p className="text-sm text-gray-700">Low-latency order execution with exchange APIs and real-time market data.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Triangular Arbitrage Screenshots */}
              {(project.slug === 'triangular-arbitrage' || project.id === 6) && (
                <ImageGridGallery 
                  images={[
                    {
                      src: "/assets/images/screenshots/triarb/analysis.svg",
                      alt: "Triangular Arbitrage Analysis",
                      caption: "Visual analysis of arbitrage opportunities"
                    },
                    {
                      src: "/assets/images/screenshots/triarb/scanner.svg",
                      alt: "Market Scanner",
                      caption: "Real-time scanning for triangular opportunities"
                    },
                    {
                      src: "/assets/images/screenshots/triarb/execution.svg",
                      alt: "Trading Execution",
                      caption: "Automated trading execution interface"
                    },
                    {
                      src: "/assets/images/screenshots/triarb/history.svg",
                      alt: "Trade History",
                      caption: "Historical performance and analytics"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* Triangular Arbitrage Tech Stack */}
              {(project.slug === 'triangular-arbitrage' || project.id === 6) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Implementation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-md mb-2">Technology Stack</h4>
                      <TechStackGrid
                        technologies={[
                          { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                          { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                          { name: 'Go', icon: 'SiGo', type: 'backend', url: 'https://golang.org' },
                          { name: 'gRPC', icon: 'SiGooglecloud', type: 'backend', url: 'https://grpc.io' },
                          { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                          { name: 'InfluxDB', icon: 'SiInfluxdb', type: 'database', url: 'https://www.influxdata.com' },
                          { name: 'Docker', icon: 'SiDocker', type: 'devops', url: 'https://www.docker.com' },
                          { name: 'Kubernetes', icon: 'SiKubernetes', type: 'devops', url: 'https://kubernetes.io' },
                          { name: 'Grafana', icon: 'SiGrafana', type: 'tool', url: 'https://grafana.com' },
                          { name: 'Prometheus', icon: 'SiPrometheus', type: 'tool', url: 'https://prometheus.io' },
                          { name: 'WebSockets', icon: 'SiSocketdotio', type: 'backend', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
                          { name: 'GitHub Actions', icon: 'SiGithubactions', type: 'devops', url: 'https://github.com/features/actions' }
                        ]}
                        grouped={true}
                        showLabels={true}
                        showLinks={true}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Deployment Architecture</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li>High-performance core written in <span className="font-medium">Go</span> for maximum throughput and minimal latency</li>
                          <li>Microservices deployed on <span className="font-medium">Kubernetes</span> for horizontal scaling and resilience</li>
                          <li>Time-series market data stored in <span className="font-medium">InfluxDB</span> for efficient temporal querying</li>
                          <li>Real-time exchange connections via <span className="font-medium">WebSockets</span> with automatic failover</li>
                          <li>Advanced monitoring with <span className="font-medium">Prometheus</span> and <span className="font-medium">Grafana</span> dashboards</li>
                          <li>Frontend deployed as static assets via <span className="font-medium">CloudFront CDN</span> for global access</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">System Architecture</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-violet-50 p-4 rounded-md">
                          <h5 className="font-medium text-violet-700 mb-2">Market Data Collector</h5>
                          <p className="text-sm text-gray-700">Connects to 15+ exchanges to collect order book and ticker data at sub-second intervals.</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-700 mb-2">Opportunity Scanner</h5>
                          <p className="text-sm text-gray-700">Analyzes thousands of currency triplets to identify profitable triangular paths.</p>
                        </div>
                        <div className="bg-teal-50 p-4 rounded-md">
                          <h5 className="font-medium text-teal-700 mb-2">Execution Engine</h5>
                          <p className="text-sm text-gray-700">Places coordinated orders with nanosecond precision to capture arbitrage spread.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* dYdX Trading Interface Screenshots */}
              {(project.slug === 'dydx-interface' || project.id === 7) && (
                <ImageGridGallery 
                  images={[
                    {
                      src: "/assets/images/screenshots/dydx/trading.svg",
                      alt: "dYdX Trading Interface",
                      caption: "Professional crypto derivatives trading"
                    },
                    {
                      src: "/assets/images/placeholder-image.svg",
                      alt: "Advanced Order Types",
                      caption: "Support for various order types and strategies"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* For all other projects, show generic placeholder if no specific screenshots */}
              {!['fruit-store', 'marketing-agency', 'pos-bookstore', 'bi-dashboard', 'english-ai-tutor', 
                 'beauty-salon', 'reddit-clone', 'statistical-arbitrage', 'triangular-arbitrage', 'dydx-interface'].includes(project.slug || '') && 
               ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(project.id || 0) && (
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
              
              {/* Use TechStackGrid based on project type */}
              {/* Fruit Store Tech Stack */}
              {(project.slug === 'fruit-store' || project.id === 2) && (
                <TechStackGrid
                  technologies={[
                    { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                    { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                    { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                    { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                    { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                    { name: 'Tailwind CSS', icon: 'SiTailwindcss', type: 'frontend', url: 'https://tailwindcss.com' },
                    { name: 'Framer Motion', icon: 'SiFramer', type: 'frontend', url: 'https://www.framer.com/motion' },
                    { name: 'Stripe', icon: 'SiStripe', type: 'tool', url: 'https://stripe.com' }
                  ]}
                  grouped={true}
                  showLabels={true}
                  showLinks={true}
                />
              )}
              
              {/* Marketing Agency Tech Stack */}
              {(project.slug === 'marketing-agency' || project.id === 3) && (
                <TechStackGrid
                  technologies={[
                    { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                    { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                    { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                    { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                    { name: 'MongoDB', icon: 'SiMongodb', type: 'database', url: 'https://www.mongodb.com' },
                    { name: 'OpenAI', icon: 'SiOpenai', type: 'tool', url: 'https://openai.com' },
                    { name: 'Tailwind CSS', icon: 'SiTailwindcss', type: 'frontend', url: 'https://tailwindcss.com' },
                    { name: 'Framer Motion', icon: 'SiFramer', type: 'frontend', url: 'https://www.framer.com/motion' },
                    { name: 'Socket.io', icon: 'SiSocketdotio', type: 'backend', url: 'https://socket.io' }
                  ]}
                  grouped={true}
                  showLabels={true}
                  showLinks={true}
                />
              )}
              
              {/* POS Bookstore Tech Stack */}
              {(project.slug === 'pos-bookstore' || project.id === 1) && (
                <TechStackGrid
                  technologies={[
                    { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                    { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                    { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                    { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                    { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                    { name: 'Drizzle ORM', icon: 'SiPrisma', type: 'backend', url: 'https://orm.drizzle.team' },
                    { name: 'Tailwind CSS', icon: 'SiTailwindcss', type: 'frontend', url: 'https://tailwindcss.com' },
                    { name: 'Chart.js', icon: 'SiChartdotjs', type: 'frontend', url: 'https://www.chartjs.org' },
                    { name: 'React Query', icon: 'SiReactquery', type: 'frontend', url: 'https://tanstack.com/query' },
                    { name: 'Zod', icon: 'SiZod', type: 'tool', url: 'https://zod.dev' }
                  ]}
                  grouped={true}
                  showLabels={true}
                  showLinks={true}
                />
              )}
              
              {/* For all other projects, convert tags to tech items */}
              {!['fruit-store', 'marketing-agency', 'pos-bookstore'].includes(project.slug || '') && 
               ![1, 2, 3].includes(project.id || 0) && (
                <div className="grid grid-cols-3 gap-4">
                  {tags.map((tag: string, idx: number) => {
                    // Calculate tag color based on name
                    const tagHash = tag.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                    const hue = (tagHash % 360);
                    const lightness = 45 + (tagHash % 20);
                    
                    return (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx, duration: 0.4 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="flex flex-col items-center justify-center p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        style={{ 
                          backgroundColor: `hsla(${hue}, 85%, ${lightness}%, 0.1)`,
                          border: `1px solid hsla(${hue}, 85%, ${lightness}%, 0.3)`,
                          color: `hsl(${hue}, 85%, ${lightness}%)`
                        }}
                      >
                        <span className="text-xs font-medium">{tag}</span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
            
            {/* Future Development Roadmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold mb-4">Future Development</h3>
              <div className="space-y-4">
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
      <div className="w-full py-20 relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Back button skeleton */}
          <div className="inline-flex items-center mb-6">
            <AnimatedSkeleton className="h-4 w-24 rounded-md" animation="pulse" />
          </div>
          
          {/* Title and description skeletons */}
          <AnimatedSkeleton className="h-12 w-96 rounded-md mb-4" animation="pulse" />
          <AnimatedSkeleton className="h-8 w-full max-w-3xl rounded-md mb-6" animation="pulse" />
          <AnimatedSkeleton className="h-6 w-72 rounded-md mb-6" animation="pulse" />
          
          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[1, 2, 3, 4].map(i => (
              <AnimatedSkeleton 
                key={i} 
                className="h-6 w-20 rounded-full" 
                animation="pulse"
                delay={i * 0.1}
              />
            ))}
          </div>
          
          {/* Button skeleton */}
          <AnimatedSkeleton className="h-10 w-32 rounded-lg" animation="pulse" delay={0.5} />
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-6 w-40 mb-4"
                animation="combined"
                delay={0.6}
              />
              <div className="space-y-4">
                <AnimatedSkeleton 
                  className="h-4 w-full"
                  animation="combined"
                  delay={0.7}
                />
                <AnimatedSkeleton 
                  className="h-4 w-full"
                  animation="combined"
                  delay={0.8}
                />
                <AnimatedSkeleton 
                  className="h-4 w-3/4"
                  animation="combined"
                  delay={0.9}
                />
              </div>
            </div>
            
            {/* Features skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-6 w-40 mb-4"
                animation="combined"
                delay={1}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex">
                    <AnimatedSkeleton 
                      className="h-12 w-12 rounded-lg mr-4"
                      animation="combined"
                      delay={1 + i * 0.1}
                    />
                    <div className="space-y-2 flex-1">
                      <AnimatedSkeleton 
                        className="h-4 w-3/4"
                        animation="combined"
                        delay={1.1 + i * 0.1}
                      />
                      <AnimatedSkeleton 
                        className="h-3 w-full"
                        animation="combined"
                        delay={1.2 + i * 0.1}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Screenshots skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-6 w-40 mb-4"
                animation="combined"
                delay={1.5}
              />
              <AnimatedSkeleton 
                className="h-64 w-full rounded-lg mb-6"
                animation="combined"
                showProgress={true}
                delay={1.6}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatedSkeleton 
                  className="h-48 w-full rounded-lg"
                  animation="combined"
                  showProgress={true}
                  delay={1.8}
                />
                <AnimatedSkeleton 
                  className="h-48 w-full rounded-lg"
                  animation="combined"
                  showProgress={true}
                  delay={2}
                />
              </div>
            </div>
          </div>
          
          {/* Sidebar skeleton */}
          <div className="space-y-8">
            {/* Project details skeleton */}
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-6 w-40 mb-4"
                animation="combined"
                delay={2.1}
              />
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex">
                    <AnimatedSkeleton 
                      className="h-5 w-5 mr-3 mt-0.5"
                      animation="combined"
                      delay={2.1 + i * 0.1}
                    />
                    <div className="space-y-1">
                      <AnimatedSkeleton 
                        className="h-3 w-24"
                        animation="combined"
                        delay={2.2 + i * 0.1}
                      />
                      <AnimatedSkeleton 
                        className="h-4 w-40"
                        animation="combined"
                        delay={2.3 + i * 0.1}
                      />
                    </div>
                  </div>
                ))}
                
                <div className="pt-6 mt-4 border-t border-gray-200">
                  <AnimatedSkeleton 
                    className="h-10 w-full rounded-md"
                    animation="combined"
                    showProgress={true}
                    delay={2.3}
                  />
                </div>
              </div>
            </div>
            
            {/* Additional skeleton for tech stack */}
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
              <AnimatedSkeleton 
                className="h-6 w-40 mb-4"
                animation="combined"
                delay={2.4}
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
        </div>
      </div>
    </div>
  );
}