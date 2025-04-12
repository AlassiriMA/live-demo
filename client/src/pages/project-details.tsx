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
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import AppShell from "@/components/layout/AppShell";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProjectDetailsPage() {
  // Get the project slug from URL
  const [match, params] = useRoute<{ slug: string }>("/project/:slug");
  const slug = params?.slug;
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  
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
              <h2 className="text-3xl font-bold mb-4">{t('projects.notFound') || "Project Not Found"}</h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('projects.doesNotExist') || "The project you're looking for doesn't exist or may have been moved."}
              </p>
              <Button 
                onClick={() => setLocation('/projects')}
                className="rounded-lg"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t('projects.backToProjects') || "Back to Projects"}
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
              {t('projects.backToProjects') || "Back to Projects"}
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
                      {t('projects.liveDemo') || "Live Demo"}
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
                <h2 className="text-2xl font-bold mb-4">{t('projects.overview') || "Overview"}</h2>
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
                      {t('projects.defaultDescription') || 
                        "This project provides a comprehensive demonstration of key concepts and technologies. Explore the live demo to see it in action!"}
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
                  <h2 className="text-2xl font-bold mb-4">{t('projects.keyFeatures') || "Key Features"}</h2>
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
                <h2 className="text-2xl font-bold mb-4">{t('projects.appScreenshots') || "App Screenshots"}</h2>
                
                {/* Main Project Screenshot - featured screenshot from each project */}
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                  {project.slug === 'pos' && (
                    <ImageWithFallback 
                      src="/assets/images/screenshots/pos/inventory.svg" 
                      alt={`${project.name} inventory management`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'fruits' && (
                    <ImageWithFallback 
                      src="/assets/images/screenshots/fruit/product-catalog.svg" 
                      alt={`${project.name} product catalog`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'marketing' && (
                    <ImageWithFallback 
                      src="/assets/images/screenshots/marketing/services.svg" 
                      alt={`${project.name} services page`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'bi' && (
                    <ImageWithFallback 
                      src="/assets/images/screenshots/bi/dashboard.svg" 
                      alt={`${project.name} dashboard`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'statarb' && (
                    <ImageWithFallback 
                      src="/assets/images/screenshots/statarb/dashboard.svg" 
                      alt={`${project.name} dashboard`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'triarb' && (
                    <ImageWithFallback 
                      src="/assets/images/screenshots/triarb/scanner.svg" 
                      alt={`${project.name} opportunity scanner`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'dydx' && (
                    <ImageWithFallback 
                      src="/assets/images/screenshots/dydx/trading.svg" 
                      alt={`${project.name} trading interface`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'english-ai' && (
                    <ImageWithFallback 
                      src="/assets/images/screenshots/english-ai/conversation.svg" 
                      alt={`${project.name} conversation interface`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'beauty' && (
                    <ImageWithFallback 
                      src="/assets/images/screenshots/beauty/services.svg" 
                      alt={`${project.name} services page`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {project.slug === 'reddit' && (
                    <ImageWithFallback 
                      src="/assets/images/screenshots/reddit/home.svg" 
                      alt={`${project.name} home page`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                  
                  {/* Fallback to project.imageUrl if no specific screenshot is available */}
                  {!['pos', 'fruits', 'marketing', 'bi', 
                     'statarb', 'triarb', 'dydx',
                     'english-ai', 'beauty', 'reddit'].includes(project.slug || '') && project.imageUrl && (
                    <ImageWithFallback 
                      src={project.imageUrl} 
                      alt={`${project.name} preview`}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  )}
                </div>
                
                {/* POS System Screenshots */}
                {(project.slug === 'pos' || project.id === 1) && (
                  <ImageGridGallery 
                    images={[
                      {
                        src: "/assets/images/screenshots/pos/sales-dashboard.svg",
                        alt: "POS Dashboard",
                        caption: "Sales dashboard with real-time analytics"
                      },
                      {
                        src: "/assets/images/screenshots/pos/inventory.svg",
                        alt: "Inventory Management",
                        caption: "Book inventory with categorization and search"
                      },
                      {
                        src: "/assets/images/screenshots/pos/transaction.svg",
                        alt: "Transaction Processing",
                        caption: "Fast and efficient checkout process"
                      },
                      {
                        src: "/assets/images/screenshots/pos/categories.svg",
                        alt: "Book Categories",
                        caption: "Organize inventory by customizable categories"
                      },
                      {
                        src: "/assets/images/screenshots/pos/checkout.svg",
                        alt: "Customer Checkout",
                        caption: "Customer-focused checkout interface"
                      },
                      {
                        src: "/assets/images/screenshots/pos/reports.svg",
                        alt: "Sales Reports",
                        caption: "Comprehensive sales analytics and reporting"
                      }
                    ]}
                    aspectRatio="wide"
                    columns={3}
                    lightboxEnabled={true}
                  />
                )}
                
                {/* English AI Tutor Screenshots */}
                {(project.slug === 'english-ai' || project.id === 8) && (
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
                
                {/* Beauty & Hair Salon Screenshots */}
                {(project.slug === 'beauty' || project.id === 9) && (
                  <ImageGridGallery 
                    images={[
                      {
                        src: "/assets/images/screenshots/beauty/services.svg",
                        alt: "Beauty Services",
                        caption: "Browse our comprehensive range of beauty services"
                      },
                      {
                        src: "/assets/images/screenshots/beauty/booking.svg",
                        alt: "Appointment Booking",
                        caption: "Easy appointment scheduling with real-time availability"
                      },
                      {
                        src: "/assets/images/screenshots/beauty/stylists.svg",
                        alt: "Our Stylists",
                        caption: "Meet our experienced team of beauty professionals"
                      },
                      {
                        src: "/assets/images/screenshots/beauty/gallery.svg",
                        alt: "Before & After Gallery",
                        caption: "Showcase of our transformative beauty treatments"
                      },
                      {
                        src: "/assets/images/screenshots/beauty/treatments.svg",
                        alt: "Treatment Details",
                        caption: "Detailed information about our specialized treatments"
                      },
                      {
                        src: "/assets/images/screenshots/beauty/store.svg",
                        alt: "Product Store",
                        caption: "Shop our curated selection of premium beauty products"
                      }
                    ]}
                    aspectRatio="wide"
                    columns={3}
                    lightboxEnabled={true}
                  />
                )}

                {/* dYdX Trading Interface Screenshots */}
                {(project.slug === 'dydx' || project.id === 7) && (
                  <ImageGridGallery 
                    images={[
                      {
                        src: "/assets/images/screenshots/dydx/trading.svg",
                        alt: "Trading Interface",
                        caption: "Advanced trading interface with order books and charts"
                      },
                      {
                        src: "/assets/images/screenshots/dydx/orders.svg",
                        alt: "Order Management",
                        caption: "Track and manage open and historical orders"
                      },
                      {
                        src: "/assets/images/screenshots/dydx/portfolio.svg",
                        alt: "Portfolio Overview",
                        caption: "Real-time portfolio balance and position tracking"
                      },
                      {
                        src: "/assets/images/screenshots/dydx/analytics.svg",
                        alt: "Trade Analytics",
                        caption: "Performance metrics and trading analytics"
                      }
                    ]}
                    aspectRatio="wide"
                    columns={2}
                    lightboxEnabled={true}
                  />
                )}
                
                {/* StatArb Screenshots */}
                {(project.slug === 'statarb' || project.id === 5) && (
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
                
                {/* TriArb Screenshots */}
                {(project.slug === 'triarb' || project.id === 6) && (
                  <ImageGridGallery 
                    images={[
                      {
                        src: "/assets/images/screenshots/triarb/scanner.svg",
                        alt: "Triangular Arbitrage Scanner",
                        caption: "Real-time opportunity detection across exchanges"
                      },
                      {
                        src: "/assets/images/screenshots/triarb/execution.svg",
                        alt: "Trade Execution Interface",
                        caption: "Automated execution of arbitrage opportunities"
                      },
                      {
                        src: "/assets/images/screenshots/triarb/history.svg",
                        alt: "Trade History",
                        caption: "Historical performance and completed trades"
                      },
                      {
                        src: "/assets/images/screenshots/triarb/analysis.svg",
                        alt: "Market Analysis",
                        caption: "Cross-exchange price differential analysis"
                      }
                    ]}
                    aspectRatio="wide"
                    columns={2}
                    lightboxEnabled={true}
                  />
                )}
                
                {/* Fruit Store Screenshots */}
                {(project.slug === 'fruits' || project.id === 2) && (
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
                
                {/* BI Dashboard Screenshots */}
                {(project.slug === 'bi' || project.id === 4) && (
                  <ImageGridGallery 
                    images={[
                      {
                        src: "/assets/images/screenshots/bi/dashboard.svg",
                        alt: "BI Dashboard",
                        caption: "Main dashboard with key performance indicators"
                      },
                      {
                        src: "/assets/images/screenshots/bi/analytics.svg",
                        alt: "Data Analytics",
                        caption: "Advanced analytics with interactive visualizations"
                      },
                      {
                        src: "/assets/images/screenshots/bi/reports.svg",
                        alt: "Custom Reports",
                        caption: "Customizable reporting with export options"
                      },
                      {
                        src: "/assets/images/screenshots/bi/data-sources.svg",
                        alt: "Data Sources",
                        caption: "Configure and manage multiple data sources"
                      }
                    ]}
                    aspectRatio="wide"
                    columns={2}
                    lightboxEnabled={true}
                  />
                )}
                
                {/* Marketing Agency Screenshots */}
                {(project.slug === 'marketing' || project.id === 3) && (
                  <ImageGridGallery 
                    images={[
                      {
                        src: "/assets/images/screenshots/marketing/services.svg",
                        alt: "Marketing Services",
                        caption: "Comprehensive marketing services with detailed descriptions"
                      },
                      {
                        src: "/assets/images/screenshots/marketing/portfolio.svg",
                        alt: "Marketing Portfolio",
                        caption: "Case studies and portfolio of successful marketing campaigns"
                      },
                      {
                        src: "/assets/images/screenshots/marketing/chatbot.svg",
                        alt: "AI Chatbot",
                        caption: "Interactive AI-powered marketing assistant"
                      }
                    ]}
                    aspectRatio="wide"
                    columns={3}
                    lightboxEnabled={true}
                  />
                )}
                
                {/* Reddit Clone Screenshots */}
                {(project.slug === 'reddit' || project.id === 10) && (
                  <ImageGridGallery 
                    images={[
                      {
                        src: "/assets/images/screenshots/reddit/home.svg",
                        alt: "ThreadVerse Home Feed",
                        caption: "Personalized home feed with trending content"
                      },
                      {
                        src: "/assets/images/screenshots/reddit/feed.svg",
                        alt: "Community Feed",
                        caption: "Topic-based community content stream"
                      },
                      {
                        src: "/assets/images/screenshots/reddit/post-detail.svg",
                        alt: "Post Detail View",
                        caption: "Detailed post view with nested comment threads"
                      },
                      {
                        src: "/assets/images/screenshots/reddit/comments.svg",
                        alt: "Comment System",
                        caption: "Rich comment system with voting and awards"
                      },
                      {
                        src: "/assets/images/screenshots/reddit/create.svg",
                        alt: "Create Post",
                        caption: "Multi-format content creation experience"
                      },
                      {
                        src: "/assets/images/screenshots/reddit/profile.svg",
                        alt: "User Profile",
                        caption: "Customizable user profiles with activity history"
                      },
                      {
                        src: "/assets/images/screenshots/reddit/thread.svg",
                        alt: "Thread View",
                        caption: "Focused thread view for deep conversations"
                      },
                      {
                        src: "/assets/images/screenshots/reddit/submit.svg",
                        alt: "Content Submission",
                        caption: "Advanced content submission with formatting tools"
                      }
                    ]}
                    aspectRatio="wide"
                    columns={3}
                    lightboxEnabled={true}
                  />
                )}
              </motion.div>
              
              {/* Technology Stack Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-sm mb-8"
              >
                <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
                {project.slug === 'pos' && (
                  <TechStackGrid 
                    technologies={[
                      { name: "React", icon: "SiReact", type: "frontend" },
                      { name: "TypeScript", icon: "SiTypescript", type: "language" },
                      { name: "Tailwind CSS", icon: "SiTailwindcss", type: "frontend" },
                      { name: "Express", icon: "SiExpress", type: "backend" },
                      { name: "PostgreSQL", icon: "SiPostgresql", type: "database" },
                      { name: "Drizzle ORM", icon: "SiPrisma", type: "backend" }
                    ]}
                    grouped={true}
                    showLabels={true}
                    size="medium"
                  />
                )}
                
                {project.slug === 'fruits' && (
                  <TechStackGrid 
                    technologies={[
                      { name: "React", icon: "SiReact", type: "frontend" },
                      { name: "TypeScript", icon: "SiTypescript", type: "language" },
                      { name: "Tailwind CSS", icon: "SiTailwindcss", type: "frontend" },
                      { name: "Express", icon: "SiExpress", type: "backend" },
                      { name: "PostgreSQL", icon: "SiPostgresql", type: "database" },
                      { name: "Framer Motion", icon: "SiFramer", type: "frontend" }
                    ]}
                    grouped={true}
                    showLabels={true}
                    size="medium"
                  />
                )}
                
                {project.slug === 'marketing' && (
                  <TechStackGrid 
                    technologies={[
                      { name: "React", icon: "SiReact", type: "frontend" },
                      { name: "TypeScript", icon: "SiTypescript", type: "language" },
                      { name: "Tailwind CSS", icon: "SiTailwindcss", type: "frontend" },
                      { name: "Express", icon: "SiExpress", type: "backend" },
                      { name: "OpenAI API", icon: "SiOpenai", type: "backend" },
                      { name: "PostgreSQL", icon: "SiPostgresql", type: "database" }
                    ]}
                    grouped={true}
                    showLabels={true}
                    size="medium"
                  />
                )}
                
                {project.slug === 'bi' && (
                  <TechStackGrid 
                    technologies={[
                      { name: "React", icon: "SiReact", type: "frontend" },
                      { name: "TypeScript", icon: "SiTypescript", type: "language" },
                      { name: "Recharts", icon: "SiD3Dotjs", type: "frontend" },
                      { name: "Express", icon: "SiExpress", type: "backend" },
                      { name: "PostgreSQL", icon: "SiPostgresql", type: "database" },
                      { name: "Drizzle ORM", icon: "SiPrisma", type: "backend" }
                    ]}
                    grouped={true}
                    showLabels={true}
                    size="medium"
                  />
                )}
                
                {project.slug === 'statarb' && (
                  <TechStackGrid 
                    technologies={[
                      { name: "React", icon: "SiReact", type: "frontend" },
                      { name: "TypeScript", icon: "SiTypescript", type: "language" },
                      { name: "Tailwind CSS", icon: "SiTailwindcss", type: "frontend" },
                      { name: "Express", icon: "SiExpress", type: "backend" },
                      { name: "WebSockets", icon: "SiSocketdotio", type: "backend" },
                      { name: "Recharts", icon: "SiD3Dotjs", type: "frontend" }
                    ]}
                    grouped={true}
                    showLabels={true}
                    size="medium"
                  />
                )}
                
                {project.slug === 'triarb' && (
                  <TechStackGrid 
                    technologies={[
                      { name: "React", icon: "SiReact", type: "frontend" },
                      { name: "TypeScript", icon: "SiTypescript", type: "language" },
                      { name: "Tailwind CSS", icon: "SiTailwindcss", type: "frontend" },
                      { name: "Express", icon: "SiExpress", type: "backend" },
                      { name: "WebSockets", icon: "SiSocketdotio", type: "backend" },
                      { name: "PostgreSQL", icon: "SiPostgresql", type: "database" }
                    ]}
                    grouped={true}
                    showLabels={true}
                    size="medium"
                  />
                )}
                
                {project.slug === 'dydx' && (
                  <TechStackGrid 
                    technologies={[
                      { name: "React", icon: "SiReact", type: "frontend" },
                      { name: "TypeScript", icon: "SiTypescript", type: "language" },
                      { name: "Tailwind CSS", icon: "SiTailwindcss", type: "frontend" },
                      { name: "Express", icon: "SiExpress", type: "backend" },
                      { name: "Drizzle ORM", icon: "SiPrisma", type: "backend" },
                      { name: "Web3.js", icon: "SiEthereum", type: "backend" }
                    ]}
                    grouped={true}
                    showLabels={true}
                    size="medium"
                  />
                )}
                
                {project.slug === 'english-ai' && (
                  <TechStackGrid 
                    technologies={[
                      { name: "React", icon: "SiReact", type: "frontend" },
                      { name: "TypeScript", icon: "SiTypescript", type: "language" },
                      { name: "Tailwind CSS", icon: "SiTailwindcss", type: "frontend" },
                      { name: "Express", icon: "SiExpress", type: "backend" },
                      { name: "OpenAI API", icon: "SiOpenai", type: "backend" },
                      { name: "PostgreSQL", icon: "SiPostgresql", type: "database" }
                    ]}
                    grouped={true}
                    showLabels={true}
                    size="medium"
                  />
                )}
                
                {project.slug === 'beauty' && (
                  <TechStackGrid 
                    technologies={[
                      { name: "React", icon: "SiReact", type: "frontend" },
                      { name: "TypeScript", icon: "SiTypescript", type: "language" },
                      { name: "Tailwind CSS", icon: "SiTailwindcss", type: "frontend" },
                      { name: "Express", icon: "SiExpress", type: "backend" },
                      { name: "PostgreSQL", icon: "SiPostgresql", type: "database" },
                      { name: "Framer Motion", icon: "SiFramer", type: "frontend" }
                    ]}
                    grouped={true}
                    showLabels={true}
                    size="medium"
                  />
                )}
                
                {project.slug === 'reddit' && (
                  <TechStackGrid 
                    technologies={[
                      { name: "React", icon: "SiReact", type: "frontend" },
                      { name: "TypeScript", icon: "SiTypescript", type: "language" },
                      { name: "Tailwind CSS", icon: "SiTailwindcss", type: "frontend" },
                      { name: "Express", icon: "SiExpress", type: "backend" },
                      { name: "PostgreSQL", icon: "SiPostgresql", type: "database" },
                      { name: "JWT Auth", icon: "SiJsonwebtokens", type: "backend" }
                    ]}
                    grouped={true}
                    showLabels={true}
                    size="medium"
                  />
                )}
              </motion.div>
              
              {/* Implementation Details Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-sm mb-8"
              >
                <h2 className="text-2xl font-bold mb-4">Implementation Details</h2>
                <div className="prose max-w-none">
                  {project.slug === 'pos' && (
                    <div className="space-y-4">
                      <p>
                        This Point of Sale (POS) system for bookstores provides comprehensive inventory management, sales tracking, and reporting functionality. It's built with scalability in mind to support businesses of all sizes.
                      </p>
                      <h3>Key Implementation Features:</h3>
                      <ul>
                        <li>Real-time inventory management with automatic stock updates</li>
                        <li>Barcode scanning for quick product lookup via ISBN</li>
                        <li>Secure transaction processing with receipt generation</li>
                        <li>Advanced reporting and analytics dashboard</li>
                        <li>User authentication with role-based access controls</li>
                      </ul>
                    </div>
                  )}
                  
                  {project.slug === 'fruits' && (
                    <div className="space-y-4">
                      <p>
                        This fruit e-commerce store showcases responsive design principles with a focus on user experience. The implementation prioritizes performance and accessibility.
                      </p>
                      <h3>Key Implementation Features:</h3>
                      <ul>
                        <li>Responsive product catalog with filtering and sorting options</li>
                        <li>Shopping cart with persistent state management</li>
                        <li>Checkout process with form validation</li>
                        <li>Order management system with status tracking</li>
                        <li>Customer account management</li>
                      </ul>
                    </div>
                  )}
                  
                  {project.slug === 'marketing' && (
                    <div className="space-y-4">
                      <p>
                        This marketing agency website integrates modern AI technologies to provide an enhanced user experience. The implementation focuses on engagement and lead generation.
                      </p>
                      <h3>Key Implementation Features:</h3>
                      <ul>
                        <li>AI-powered chatbot for instant visitor assistance</li>
                        <li>Dynamic testimonials carousel with star ratings</li>
                        <li>Animated service cards with interactive hover effects</li>
                        <li>Lead capture forms with validation and database storage</li>
                        <li>Real-time metrics display showing agency performance</li>
                      </ul>
                    </div>
                  )}
                  
                  {project.slug === 'bi' && (
                    <div className="space-y-4">
                      <p>
                        This Business Intelligence dashboard presents complex data in an intuitive and actionable format. The implementation emphasizes data visualization and analysis capabilities.
                      </p>
                      <h3>Key Implementation Features:</h3>
                      <ul>
                        <li>Interactive charts and graphs with real-time data updates</li>
                        <li>Customizable dashboard layouts with drag-and-drop widgets</li>
                        <li>Advanced filtering and data segmentation tools</li>
                        <li>Export functionality for reports in multiple formats</li>
                        <li>Data trend analysis with predictive insights</li>
                      </ul>
                    </div>
                  )}
                  
                  {project.slug === 'statarb' && (
                    <div className="space-y-4">
                      <p>
                        This Statistical Arbitrage tool uses advanced algorithms to identify trading opportunities. The implementation focuses on real-time data processing and visualization.
                      </p>
                      <h3>Key Implementation Features:</h3>
                      <ul>
                        <li>Real-time market data integration via WebSockets</li>
                        <li>Statistical analysis of price correlations between security pairs</li>
                        <li>Interactive charts with technical indicators</li>
                        <li>Strategy backtesting module with performance metrics</li>
                        <li>Automated pair selection based on cointegration tests</li>
                      </ul>
                    </div>
                  )}
                  
                  {project.slug === 'triarb' && (
                    <div className="space-y-4">
                      <p>
                        This Triangular Arbitrage scanner identifies price discrepancies across cryptocurrency exchanges. The implementation prioritizes speed and accuracy for real-time trading opportunities.
                      </p>
                      <h3>Key Implementation Features:</h3>
                      <ul>
                        <li>Multi-exchange API integration with rate limiting management</li>
                        <li>High-performance calculation engine for rapid opportunity detection</li>
                        <li>Real-time opportunity visualization with profit calculation</li>
                        <li>Configurable filters for minimum profit threshold and risk parameters</li>
                        <li>Historical opportunity logging and analysis</li>
                      </ul>
                    </div>
                  )}
                  
                  {project.slug === 'dydx' && (
                    <div className="space-y-4">
                      <p>
                        This dYdX trading interface provides a professional trading experience for decentralized finance. The implementation focuses on security and performance.
                      </p>
                      <h3>Key Implementation Features:</h3>
                      <ul>
                        <li>Secure wallet connection with multiple provider options</li>
                        <li>Advanced order types including limit, stop, and trailing stop orders</li>
                        <li>Customizable trading view with technical analysis tools</li>
                        <li>Portfolio management with position tracking</li>
                        <li>Risk management tools including liquidation price calculations</li>
                      </ul>
                    </div>
                  )}
                  
                  {project.slug === 'english-ai' && (
                    <div className="space-y-4">
                      <p>
                        This English AI tutoring application uses natural language processing to help users improve their language skills. The implementation emphasizes conversational interactions and personalized learning.
                      </p>
                      <h3>Key Implementation Features:</h3>
                      <ul>
                        <li>AI-powered conversation practice with contextual feedback</li>
                        <li>Grammar and vocabulary assessment tools</li>
                        <li>Personalized learning path based on user progress</li>
                        <li>Interactive pronunciation exercises with voice recognition</li>
                        <li>Progress tracking and performance analytics</li>
                      </ul>
                    </div>
                  )}
                  
                  {project.slug === 'beauty' && (
                    <div className="space-y-4">
                      <p>
                        This Beauty & Hair Salon website combines elegant design with practical functionality. The implementation focuses on showcasing services and streamlining appointment booking.
                      </p>
                      <h3>Key Implementation Features:</h3>
                      <ul>
                        <li>Interactive service catalog with detailed descriptions</li>
                        <li>Online appointment booking system with availability checking</li>
                        <li>Staff profiles with expertise and availability</li>
                        <li>Customer testimonials and before/after gallery</li>
                        <li>Integrated contact form with service inquiry options</li>
                      </ul>
                    </div>
                  )}
                  
                  {project.slug === 'reddit' && (
                    <div className="space-y-4">
                      <p>
                        This Reddit-style content platform enables community-driven discussions and content sharing. The implementation prioritizes user engagement and content discovery.
                      </p>
                      <h3>Key Implementation Features:</h3>
                      <ul>
                        <li>Community creation and management tools</li>
                        <li>Content submission with rich text formatting</li>
                        <li>Voting system with real-time score updates</li>
                        <li>Nested comment threads with collapse/expand functionality</li>
                        <li>User profile pages with activity history</li>
                      </ul>
                    </div>
                  )}
                </div>
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