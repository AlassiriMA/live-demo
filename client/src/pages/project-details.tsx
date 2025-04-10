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
              
              {/* Main Project Screenshot - using app screenshots instead of card image */}
              <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                {project.slug === 'pos-bookstore' && (
                  <img 
                    src="/assets/images/screenshots/pos/overview.svg" 
                    alt={`${project.name} overview`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                {project.slug === 'fruit-store' && (
                  <img 
                    src="/assets/images/screenshots/fruits/storefront.svg" 
                    alt={`${project.name} storefront`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                {project.slug === 'marketing-agency' && (
                  <img 
                    src="/assets/images/screenshots/marketing/homepage.svg" 
                    alt={`${project.name} homepage`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                {project.slug === 'bi-dashboard' && (
                  <img 
                    src="/assets/images/screenshots/bi/overview.svg" 
                    alt={`${project.name} overview`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                {project.slug === 'statistical-arbitrage' && (
                  <img 
                    src="/assets/images/screenshots/statarb/overview.svg" 
                    alt={`${project.name} overview`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                {project.slug === 'triangular-arbitrage' && (
                  <img 
                    src="/assets/images/screenshots/triarb/overview.svg" 
                    alt={`${project.name} overview`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                {project.slug === 'dydx-trading' && (
                  <img 
                    src="/assets/images/screenshots/dydx/overview.svg" 
                    alt={`${project.name} overview`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                {project.slug === 'english-ai-tutor' && (
                  <img 
                    src="/assets/images/screenshots/english-ai/overview.svg" 
                    alt={`${project.name} overview`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                {project.slug === 'beauty-salon' && (
                  <img 
                    src="/assets/images/screenshots/beauty/overview.svg" 
                    alt={`${project.name} overview`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                {project.slug === 'reddit-clone' && (
                  <img 
                    src="/assets/images/screenshots/reddit/overview.svg" 
                    alt={`${project.name} overview`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
                
                {/* Fallback to project.imageUrl if no specific screenshot is available */}
                {!['pos-bookstore', 'fruit-store', 'marketing-agency', 'bi-dashboard', 
                   'statistical-arbitrage', 'triangular-arbitrage', 'dydx-trading', 
                   'english-ai-tutor', 'beauty-salon', 'reddit-clone'].includes(project.slug || '') && project.imageUrl && (
                  <img 
                    src={project.imageUrl} 
                    alt={`${project.name} preview`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
              </div>
              
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
              
              {/* Fruit Store Tech Stack */}
              {(project.slug === 'fruit-store' || project.id === 2) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Implementation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-md mb-2">Technology Stack</h4>
                      <TechStackGrid
                        technologies={[
                          { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                          { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                          { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                          { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                          { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                          { name: 'Stripe', icon: 'SiStripe', type: 'tool', url: 'https://stripe.com' },
                          { name: 'Framer Motion', icon: 'SiFramer', type: 'frontend', url: 'https://www.framer.com/motion' },
                          { name: 'TailwindCSS', icon: 'SiTailwindcss', type: 'frontend', url: 'https://tailwindcss.com' },
                          { name: 'Redux Toolkit', icon: 'SiRedux', type: 'frontend', url: 'https://redux-toolkit.js.org' },
                          { name: 'Docker', icon: 'SiDocker', type: 'devops', url: 'https://www.docker.com' },
                          { name: 'Zod', icon: 'SiZotero', type: 'tool', url: 'https://zod.dev' },
                          { name: 'Mapbox', icon: 'SiMapbox', type: 'tool', url: 'https://www.mapbox.com' }
                        ]}
                        grouped={true}
                        showLabels={true}
                        showLinks={true}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">E-Commerce Features</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li><span className="font-medium">Product management system</span> with seasonal inventory and advanced categorization</li>
                          <li><span className="font-medium">Dynamic pricing</span> based on freshness, seasonality, and market demand</li>
                          <li><span className="font-medium">Secure payment processing</span> via Stripe with multiple payment methods</li>
                          <li><span className="font-medium">Delivery scheduling</span> with real-time tracking and delivery windows</li>
                          <li><span className="font-medium">Customer account management</span> with purchase history and favorite items</li>
                          <li><span className="font-medium">Subscription boxes</span> for regular delivery of seasonal fruit selections</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">User Experience Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-md">
                          <h5 className="font-medium text-green-700 mb-2">Product Presentation</h5>
                          <p className="text-sm text-gray-700">Interactive 3D fruit visualization with nutritional information and origin details.</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-md">
                          <h5 className="font-medium text-yellow-700 mb-2">Recipe Suggestions</h5>
                          <p className="text-sm text-gray-700">AI-powered recipe recommendations based on selected fruits with customizable preferences.</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-md">
                          <h5 className="font-medium text-red-700 mb-2">Freshness Guarantee</h5>
                          <p className="text-sm text-gray-700">Real-time freshness tracking with satisfaction guarantee and automatic refunds if needed.</p>
                        </div>
                        <div className="bg-lime-50 p-4 rounded-md">
                          <h5 className="font-medium text-lime-700 mb-2">Farm Connections</h5>
                          <p className="text-sm text-gray-700">Direct connection to source farms with stories and sustainable farming practices.</p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-md">
                          <h5 className="font-medium text-emerald-700 mb-2">Eco Packaging</h5>
                          <p className="text-sm text-gray-700">Customizable eco-friendly packaging options with carbon footprint tracking.</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-md">
                          <h5 className="font-medium text-orange-700 mb-2">Loyalty Program</h5>
                          <p className="text-sm text-gray-700">Points-based rewards system with seasonal challenges and exclusive discounts.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Technical Implementation</h4>
                      <div className="bg-indigo-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-indigo-900 mb-2">Frontend Architecture</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              <li>Component-based architecture with Atomic Design principles</li>
                              <li>Global state management with Redux Toolkit and RTK Query</li>
                              <li>Responsive design with mobile-first approach</li>
                              <li>Advanced animations using Framer Motion for micro-interactions</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-indigo-900 mb-2">Backend Services</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              <li>RESTful API with comprehensive documentation</li>
                              <li>Real-time inventory updates with WebSockets</li>
                              <li>Automated email notifications for order status</li>
                              <li>Caching layer for product catalog with Redis</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                      src: "/assets/images/screenshots/marketing/services.svg",
                      alt: "Agency Services",
                      caption: "Comprehensive marketing service offerings"
                    },
                    {
                      src: "/assets/images/screenshots/marketing/portfolio.svg",
                      alt: "Client Portfolio",
                      caption: "Showcase of successful marketing campaigns"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={3}
                  lightboxEnabled={true}
                />
              )}
              
              {/* Marketing Agency Tech Stack */}
              {(project.slug === 'marketing-agency' || project.id === 3) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Implementation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-md mb-2">Technology Stack</h4>
                      <TechStackGrid
                        technologies={[
                          { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                          { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                          { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                          { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                          { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                          { name: 'OpenAI API', icon: 'SiOpenai', type: 'tool', url: 'https://openai.com/api' },
                          { name: 'Framer Motion', icon: 'SiFramer', type: 'frontend', url: 'https://www.framer.com/motion' },
                          { name: 'Tailwind CSS', icon: 'SiTailwindcss', type: 'frontend', url: 'https://tailwindcss.com' },
                          { name: 'SendGrid', icon: 'SiMailgun', type: 'tool', url: 'https://sendgrid.com' },
                          { name: 'Twilio', icon: 'SiTwilio', type: 'tool', url: 'https://www.twilio.com' },
                          { name: 'Google Analytics', icon: 'SiGoogleanalytics', type: 'tool', url: 'https://analytics.google.com' },
                          { name: 'HubSpot', icon: 'SiHubspot', type: 'tool', url: 'https://www.hubspot.com' }
                        ]}
                        grouped={true}
                        showLabels={true}
                        showLinks={true}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">AI-Powered Marketing Features</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li><span className="font-medium">Intelligent Chatbot</span> built with OpenAI GPT for personalized lead qualification</li>
                          <li><span className="font-medium">Automated content generation</span> for social media, blogs, and email campaigns</li>
                          <li><span className="font-medium">Predictive analytics</span> for campaign performance forecasting</li>
                          <li><span className="font-medium">Customer segmentation</span> with ML-based behavioral analysis</li>
                          <li><span className="font-medium">Voice and sentiment analysis</span> for customer feedback processing</li>
                          <li><span className="font-medium">Multi-channel attribution modeling</span> with advanced analytics integration</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Agency Platform Modules</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h5 className="font-medium text-purple-700 mb-2">Campaign Management</h5>
                          <p className="text-sm text-gray-700">End-to-end campaign planning, execution, and performance tracking across channels.</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-700 mb-2">Client Portal</h5>
                          <p className="text-sm text-gray-700">Branded client dashboards with real-time reporting and approval workflows.</p>
                        </div>
                        <div className="bg-pink-50 p-4 rounded-md">
                          <h5 className="font-medium text-pink-700 mb-2">Social Media Suite</h5>
                          <p className="text-sm text-gray-700">Content scheduling, engagement monitoring, and performance analytics across platforms.</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-md">
                          <h5 className="font-medium text-amber-700 mb-2">Email Marketing</h5>
                          <p className="text-sm text-gray-700">Automated campaigns with A/B testing, personalization, and engagement tracking.</p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-md">
                          <h5 className="font-medium text-emerald-700 mb-2">SEO Tools</h5>
                          <p className="text-sm text-gray-700">Keyword research, on-page optimization suggestions, and ranking monitoring.</p>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-md">
                          <h5 className="font-medium text-indigo-700 mb-2">Asset Management</h5>
                          <p className="text-sm text-gray-700">Centralized digital asset library with version control and usage analytics.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">UI/UX Design Highlights</h4>
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-purple-900 mb-2">Visual Design</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              <li>Glassmorphic UI elements with subtle backdrop blur effects</li>
                              <li>Dynamic color scheme adaptation based on client branding</li>
                              <li>Micro-interactions with subtle animation cues</li>
                              <li>Custom icon system with consistent visual language</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-blue-900 mb-2">User Experience</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              <li>Intuitive drag-and-drop interfaces for content creation</li>
                              <li>Progressive disclosure of complex features</li>
                              <li>Contextual help system with AI-powered suggestions</li>
                              <li>Personalized dashboards based on user role and behavior</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                    },
                    {
                      src: "/assets/images/screenshots/pos/reports.svg",
                      alt: "Sales Reports",
                      caption: "Detailed reporting and business insights"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={3}
                  lightboxEnabled={true}
                />
              )}
              
              {/* POS Bookstore Tech Stack */}
              {(project.slug === 'pos-bookstore' || project.id === 1) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Implementation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-md mb-2">Technology Stack</h4>
                      <TechStackGrid
                        technologies={[
                          { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                          { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                          { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                          { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                          { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                          { name: 'Drizzle ORM', icon: 'SiPrisma', type: 'backend', url: 'https://orm.drizzle.team' },
                          { name: 'Tailwind CSS', icon: 'SiTailwindcss', type: 'frontend', url: 'https://tailwindcss.com' },
                          { name: 'Recharts', icon: 'SiD3Dotjs', type: 'frontend', url: 'https://recharts.org' },
                          { name: 'Docker', icon: 'SiDocker', type: 'devops', url: 'https://www.docker.com' },
                          { name: 'Zod', icon: 'SiZotero', type: 'tool', url: 'https://zod.dev' },
                          { name: 'JWT', icon: 'SiJsonwebtokens', type: 'tool', url: 'https://jwt.io' },
                          { name: 'Socket.io', icon: 'SiSocketdotio', type: 'backend', url: 'https://socket.io' }
                        ]}
                        grouped={true}
                        showLabels={true}
                        showLinks={true}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">POS Core Features</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li><span className="font-medium">Real-time inventory management</span> with low stock alerts and automatic reordering</li>
                          <li><span className="font-medium">Barcode scanning</span> integration for quick product lookup and checkout</li>
                          <li><span className="font-medium">Multi-payment method</span> processing including credit cards, cash, and mobile payments</li>
                          <li>Comprehensive <span className="font-medium">reporting dashboard</span> with sales analytics and trend visualization</li>
                          <li><span className="font-medium">Customer database</span> with purchase history and loyalty program integration</li>
                          <li><span className="font-medium">Role-based access control</span> for staff with different permission levels</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Bookstore-Specific Modules</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-700 mb-2">ISBN Integration</h5>
                          <p className="text-sm text-gray-700">Automated book data retrieval using ISBN lookup with publisher database integration.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-md">
                          <h5 className="font-medium text-green-700 mb-2">Genre Management</h5>
                          <p className="text-sm text-gray-700">Hierarchical category system with nested genres and cross-referencing capabilities.</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-md">
                          <h5 className="font-medium text-amber-700 mb-2">Author Tracking</h5>
                          <p className="text-sm text-gray-700">Author database with biographical information and associated titles for recommendations.</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h5 className="font-medium text-purple-700 mb-2">Special Orders</h5>
                          <p className="text-sm text-gray-700">Customer special order system with publisher integration and email notifications.</p>
                        </div>
                        <div className="bg-rose-50 p-4 rounded-md">
                          <h5 className="font-medium text-rose-700 mb-2">Events Calendar</h5>
                          <p className="text-sm text-gray-700">Book readings, signings, and special event management with ticketing features.</p>
                        </div>
                        <div className="bg-teal-50 p-4 rounded-md">
                          <h5 className="font-medium text-teal-700 mb-2">Used Book Trading</h5>
                          <p className="text-sm text-gray-700">Buy-back system for used books with condition grading and dynamic pricing.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Architecture Highlights</h4>
                      <div className="bg-indigo-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-indigo-900 mb-2">Backend Structure</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              <li>RESTful API with comprehensive endpoints for all POS operations</li>
                              <li>Transaction processing with ACID compliance for data integrity</li>
                              <li>Real-time synchronization between multiple POS terminals</li>
                              <li>Scheduled tasks for end-of-day reporting and backups</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-indigo-900 mb-2">Frontend Design</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              <li>Responsive design optimized for both desktop and tablet interfaces</li>
                              <li>Offline mode with transaction queueing during connectivity issues</li>
                              <li>Dark mode for reduced eye strain during long shifts</li>
                              <li>Keyboard shortcuts and touch-optimized controls for fast operation</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
              
              {/* BI Dashboard Tech Stack */}
              {(project.slug === 'bi-dashboard' || project.id === 4) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Implementation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-md mb-2">Technology Stack</h4>
                      <TechStackGrid
                        technologies={[
                          { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                          { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                          { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                          { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                          { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                          { name: 'D3.js', icon: 'SiD3Dotjs', type: 'frontend', url: 'https://d3js.org' },
                          { name: 'Recharts', icon: 'SiD3Dotjs', type: 'frontend', url: 'https://recharts.org' },
                          { name: 'ApexCharts', icon: 'SiApache', type: 'frontend', url: 'https://apexcharts.com' },
                          { name: 'GraphQL', icon: 'SiGraphql', type: 'backend', url: 'https://graphql.org' },
                          { name: 'Apollo', icon: 'SiApollographql', type: 'backend', url: 'https://www.apollographql.com' },
                          { name: 'Redis', icon: 'SiRedis', type: 'database', url: 'https://redis.io' },
                          { name: 'Docker', icon: 'SiDocker', type: 'devops', url: 'https://www.docker.com' }
                        ]}
                        grouped={true}
                        showLabels={true}
                        showLinks={true}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Data Visualization Features</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li><span className="font-medium">Interactive dashboards</span> with real-time data refresh capabilities</li>
                          <li><span className="font-medium">Advanced chart types</span> including heatmaps, network graphs, and Sankey diagrams</li>
                          <li><span className="font-medium">Dynamic filtering</span> with cross-chart interactions and synchronized views</li>
                          <li><span className="font-medium">Drill-down exploration</span> with hierarchical data navigation</li>
                          <li><span className="font-medium">Custom visualization builder</span> with drag-and-drop interface</li>
                          <li><span className="font-medium">Geospatial analytics</span> with custom map overlays and region-based insights</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Data Integration Modules</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-700 mb-2">Data Connectors</h5>
                          <p className="text-sm text-gray-700">Plug-and-play connectors for database systems, APIs, and file-based sources with automatic schema detection.</p>
                        </div>
                        <div className="bg-teal-50 p-4 rounded-md">
                          <h5 className="font-medium text-teal-700 mb-2">ETL Pipeline</h5>
                          <p className="text-sm text-gray-700">Configurable extraction, transformation, and loading workflows with scheduling and monitoring.</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-md">
                          <h5 className="font-medium text-amber-700 mb-2">Data Cleansing</h5>
                          <p className="text-sm text-gray-700">Automated data quality checks with outlier detection, missing value handling, and consistency validation.</p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-md">
                          <h5 className="font-medium text-emerald-700 mb-2">Data Modeling</h5>
                          <p className="text-sm text-gray-700">Visual data model designer with relationship mapping and dimensional modeling support.</p>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-md">
                          <h5 className="font-medium text-indigo-700 mb-2">Real-time Feeds</h5>
                          <p className="text-sm text-gray-700">WebSocket-based streaming data integration for live dashboards and alerts.</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h5 className="font-medium text-purple-700 mb-2">Data Catalog</h5>
                          <p className="text-sm text-gray-700">Searchable metadata repository with data lineage tracking and business glossary.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Advanced Analytics</h4>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-blue-900 mb-2">Statistical Analysis</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              <li>Descriptive statistics with distribution analysis</li>
                              <li>Correlation and regression modeling</li>
                              <li>Time series forecasting with seasonal decomposition</li>
                              <li>Anomaly detection with configurable thresholds</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-purple-900 mb-2">Machine Learning</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              <li>Automated ML model training for classification and regression</li>
                              <li>Clustering and segmentation with visualization</li>
                              <li>Natural language processing for text analytics</li>
                              <li>Model performance monitoring and retraining</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                      src: "/assets/images/screenshots/english-ai/lessons.svg",
                      alt: "Lesson Library",
                      caption: "Comprehensive course catalog with progress tracking"
                    },
                    {
                      src: "/assets/images/screenshots/english-ai/grammar.svg",
                      alt: "Grammar Practice",
                      caption: "Interactive grammar lessons and exercises"
                    },
                    {
                      src: "/assets/images/screenshots/english-ai/analytics.svg",
                      alt: "Learning Analytics",
                      caption: "Detailed progress tracking and skill analysis"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* English AI Tutor Tech Stack */}
              {(project.slug === 'english-ai-tutor' || project.id === 8) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Implementation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-md mb-2">Technology Stack</h4>
                      <TechStackGrid
                        technologies={[
                          { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                          { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                          { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                          { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                          { name: 'MongoDB', icon: 'SiMongodb', type: 'database', url: 'https://www.mongodb.com' },
                          { name: 'OpenAI API', icon: 'SiOpenai', type: 'tool', url: 'https://openai.com/api' },
                          { name: 'Framer Motion', icon: 'SiFramer', type: 'frontend', url: 'https://www.framer.com/motion' },
                          { name: 'TensorFlow.js', icon: 'SiTensorflow', type: 'tool', url: 'https://www.tensorflow.org/js' },
                          { name: 'D3.js', icon: 'SiD3Dotjs', type: 'frontend', url: 'https://d3js.org' },
                          { name: 'Firebase', icon: 'SiFirebase', type: 'tool', url: 'https://firebase.google.com' },
                          { name: 'WebSpeech API', icon: 'SiGooglecloud', type: 'tool', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API' }
                        ]}
                        grouped={true}
                        showLabels={true}
                        showLinks={true}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">AI Integration</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li>Integration with <span className="font-medium">OpenAI GPT-4</span> for natural language understanding and generation</li>
                          <li>Custom fine-tuned model for <span className="font-medium">educational English language</span> training</li>
                          <li>Voice recognition and speech synthesis using <span className="font-medium">WebSpeech API</span> for pronunciation practice</li>
                          <li>Local <span className="font-medium">TensorFlow.js</span> models for offline pronunciation assessment</li>
                          <li>Adaptive learning algorithms that personalize content based on student performance</li>
                          <li>Sentiment analysis to gauge student confidence and adjust teaching approach</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Educational Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-50 p-4 rounded-md">
                          <h5 className="font-medium text-emerald-700 mb-2">Conversation Practice</h5>
                          <p className="text-sm text-gray-700">Adaptive AI conversations tailored to learner level with contextual corrections.</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-700 mb-2">Grammar Analysis</h5>
                          <p className="text-sm text-gray-700">Real-time grammar feedback with explanations and personalized exercises.</p>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-md">
                          <h5 className="font-medium text-amber-700 mb-2">Vocabulary Builder</h5>
                          <p className="text-sm text-gray-700">Spaced repetition system with contextual examples and visual associations.</p>
                        </div>
                        <div className="bg-violet-50 p-4 rounded-md">
                          <h5 className="font-medium text-violet-700 mb-2">Pronunciation Coaching</h5>
                          <p className="text-sm text-gray-700">Audio analysis with visual feedback on pronunciation accuracy and intonation.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Learning Analytics</h4>
                      <div className="bg-indigo-50 p-4 rounded-md">
                        <p className="text-sm text-gray-700 mb-3">
                          Comprehensive tracking and visualization of student progress with actionable insights:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li>Proficiency heat maps highlighting strengths and areas for improvement</li>
                          <li>Error pattern recognition to identify recurring challenges</li>
                          <li>Vocabulary retention metrics with optimal review scheduling</li>
                          <li>Speaking confidence and fluency scoring with historical trends</li>
                          <li>Learning pace analysis with personalized goal recommendations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
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
                    },
                    {
                      src: "/assets/images/screenshots/beauty/treatments.svg",
                      alt: "Luxury Treatments",
                      caption: "Premium beauty services with detailed descriptions"
                    },
                    {
                      src: "/assets/images/screenshots/beauty/store.svg",
                      alt: "Online Store",
                      caption: "Shop professional beauty products with ease"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={3}
                  lightboxEnabled={true}
                />
              )}
              
              {/* Beauty Salon Tech Stack */}
              {(project.slug === 'beauty-salon' || project.id === 9) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Implementation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-md mb-2">Technology Stack</h4>
                      <TechStackGrid
                        technologies={[
                          { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                          { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                          { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                          { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                          { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                          { name: 'Stripe', icon: 'SiStripe', type: 'tool', url: 'https://stripe.com' },
                          { name: 'SendGrid', icon: 'SiMailgun', type: 'tool', url: 'https://sendgrid.com' },
                          { name: 'Tailwind CSS', icon: 'SiTailwindcss', type: 'frontend', url: 'https://tailwindcss.com' },
                          { name: 'Framer Motion', icon: 'SiFramer', type: 'frontend', url: 'https://www.framer.com/motion' },
                          { name: 'Cloudinary', icon: 'SiCloudinary', type: 'tool', url: 'https://cloudinary.com' },
                          { name: 'Docker', icon: 'SiDocker', type: 'devops', url: 'https://www.docker.com' }
                        ]}
                        grouped={true}
                        showLabels={true}
                        showLinks={true}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Booking System</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li>Advanced scheduling system with <span className="font-medium">real-time availability</span> updates</li>
                          <li>Staff-specific availability with customizable working hours and breaks</li>
                          <li>Multi-service bookings with appropriate time blocking and dependencies</li>
                          <li>Automated email and SMS reminders via <span className="font-medium">SendGrid</span> integration</li>
                          <li>Secure payment processing with <span className="font-medium">Stripe</span> for deposits and full payments</li>
                          <li>Cancellation and rescheduling with configurable policies and refund rules</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Client Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-rose-50 p-4 rounded-md">
                          <h5 className="font-medium text-rose-700 mb-2">User Profiles</h5>
                          <p className="text-sm text-gray-700">Personalized accounts with appointment history, favorite services, and stylists.</p>
                        </div>
                        <div className="bg-fuchsia-50 p-4 rounded-md">
                          <h5 className="font-medium text-fuchsia-700 mb-2">Service Gallery</h5>
                          <p className="text-sm text-gray-700">Image-rich catalog of services with pricing, duration, and detailed descriptions.</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h5 className="font-medium text-purple-700 mb-2">Virtual Consultations</h5>
                          <p className="text-sm text-gray-700">Video consultations with stylists for pre-appointment planning and advice.</p>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-md">
                          <h5 className="font-medium text-indigo-700 mb-2">Loyalty Program</h5>
                          <p className="text-sm text-gray-700">Points system with rewards, referral bonuses, and tier-based benefits.</p>
                        </div>
                        <div className="bg-sky-50 p-4 rounded-md">
                          <h5 className="font-medium text-sky-700 mb-2">Online Store</h5>
                          <p className="text-sm text-gray-700">E-commerce platform for beauty products with stylist recommendations.</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-700 mb-2">Review System</h5>
                          <p className="text-sm text-gray-700">Verified customer reviews with photo uploads and stylist responses.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Management Dashboard</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Stylist Management</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              <li>Staff profiles and expertise tracking</li>
                              <li>Performance metrics and client satisfaction</li>
                              <li>Commission calculations and reporting</li>
                              <li>Shift scheduling and availability management</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Business Analytics</h5>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                              <li>Revenue tracking by service, stylist, and time period</li>
                              <li>Client retention and acquisition metrics</li>
                              <li>Inventory management and low-stock alerts</li>
                              <li>Forecasting and trend analysis</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Reddit Clone Screenshots */}
              {(project.slug === 'reddit-clone' || project.id === 10) && (
                <ImageGridGallery 
                  images={[
                    {
                      src: "/assets/images/screenshots/reddit/home.svg",
                      alt: "Reddit Clone Home",
                      caption: "Community-driven content feed with voting"
                    },
                    {
                      src: "/assets/images/screenshots/reddit/thread.svg",
                      alt: "Post Thread",
                      caption: "Nested comment system for discussions"
                    },
                    {
                      src: "/assets/images/screenshots/reddit/profile.svg",
                      alt: "User Profile",
                      caption: "Profile with posting history and karma"
                    },
                    {
                      src: "/assets/images/screenshots/reddit/create.svg",
                      alt: "Create Community",
                      caption: "Build your own discussion forums"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* Reddit Clone Tech Stack */}
              {(project.slug === 'reddit-clone' || project.id === 10) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Implementation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-md mb-2">Technology Stack</h4>
                      <TechStackGrid
                        technologies={[
                          { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                          { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                          { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                          { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                          { name: 'MongoDB', icon: 'SiMongodb', type: 'database', url: 'https://www.mongodb.com' },
                          { name: 'Redis', icon: 'SiRedis', type: 'database', url: 'https://redis.io' },
                          { name: 'Socket.io', icon: 'SiSocketdotio', type: 'backend', url: 'https://socket.io' },
                          { name: 'AWS S3', icon: 'SiAmazons3', type: 'tool', url: 'https://aws.amazon.com/s3' },
                          { name: 'Tailwind CSS', icon: 'SiTailwindcss', type: 'frontend', url: 'https://tailwindcss.com' },
                          { name: 'Docker', icon: 'SiDocker', type: 'devops', url: 'https://www.docker.com' },
                          { name: 'GitHub Actions', icon: 'SiGithubactions', type: 'devops', url: 'https://github.com/features/actions' },
                          { name: 'Jest', icon: 'SiJest', type: 'tool', url: 'https://jestjs.io' }
                        ]}
                        grouped={true}
                        showLabels={true}
                        showLinks={true}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Architecture Overview</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li>Full-stack MERN application with <span className="font-medium">TypeScript</span> for type safety</li>
                          <li>RESTful API design with <span className="font-medium">Express.js</span> for content and user management</li>
                          <li>Real-time notifications and updates using <span className="font-medium">Socket.io</span></li>
                          <li>Efficient data caching with <span className="font-medium">Redis</span> for high-traffic endpoints</li>
                          <li>Optimized MongoDB schemas with indexes for fast content retrieval</li>
                          <li><span className="font-medium">AWS S3</span> integration for media uploads with direct browser upload capability</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-orange-50 p-4 rounded-md">
                          <h5 className="font-medium text-orange-700 mb-2">Community System</h5>
                          <p className="text-sm text-gray-700">Create and join communities with customizable rules and moderation tools.</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-700 mb-2">Voting System</h5>
                          <p className="text-sm text-gray-700">Upvote/downvote functionality with karma tracking and trending content algorithms.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-md">
                          <h5 className="font-medium text-green-700 mb-2">Rich Media</h5>
                          <p className="text-sm text-gray-700">Support for images, videos, links, and text posts with markdown formatting.</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h5 className="font-medium text-purple-700 mb-2">Threaded Comments</h5>
                          <p className="text-sm text-gray-700">Nested comment system with infinite depth and collapsible threads.</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-md">
                          <h5 className="font-medium text-yellow-700 mb-2">User Profiles</h5>
                          <p className="text-sm text-gray-700">Comprehensive profiles with activity history, karma breakdown, and customization.</p>
                        </div>
                        <div className="bg-pink-50 p-4 rounded-md">
                          <h5 className="font-medium text-pink-700 mb-2">Moderation Tools</h5>
                          <p className="text-sm text-gray-700">Reporting system, content filtering, and moderator action logs.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                          { name: 'Python', icon: 'SiPython', type: 'language', url: 'https://www.python.org' },
                          { name: 'FastAPI', icon: 'SiFastapi', type: 'backend', url: 'https://fastapi.tiangolo.com' },
                          { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                          { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                          { name: 'Redis', icon: 'SiRedis', type: 'database', url: 'https://redis.io' },
                          { name: 'TensorFlow', icon: 'SiTensorflow', type: 'tool', url: 'https://www.tensorflow.org' },
                          { name: 'NumPy', icon: 'SiNumpy', type: 'tool', url: 'https://numpy.org' },
                          { name: 'pandas', icon: 'SiPandas', type: 'tool', url: 'https://pandas.pydata.org' },
                          { name: 'Plotly', icon: 'SiPlotly', type: 'frontend', url: 'https://plotly.com/javascript/' },
                          { name: 'Docker', icon: 'SiDocker', type: 'devops', url: 'https://www.docker.com' }
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
                      src: "/assets/images/screenshots/dydx/orders.svg",
                      alt: "Order Management",
                      caption: "View and manage open and closed orders"
                    },
                    {
                      src: "/assets/images/screenshots/dydx/portfolio.svg",
                      alt: "Portfolio Management",
                      caption: "Comprehensive portfolio and position tracking"
                    },
                    {
                      src: "/assets/images/screenshots/dydx/analytics.svg",
                      alt: "Performance Analytics",
                      caption: "Detailed trading performance metrics and insights"
                    }
                  ]}
                  aspectRatio="wide"
                  columns={2}
                  lightboxEnabled={true}
                />
              )}
              
              {/* dYdX Trading Interface Tech Stack */}
              {(project.slug === 'dydx-interface' || project.id === 7) && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-bold mb-4">Implementation Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-md mb-2">Technology Stack</h4>
                      <TechStackGrid
                        technologies={[
                          { name: 'React', icon: 'SiReact', type: 'frontend', url: 'https://reactjs.org' },
                          { name: 'TypeScript', icon: 'SiTypescript', type: 'language', url: 'https://www.typescriptlang.org' },
                          { name: 'Node.js', icon: 'SiNodedotjs', type: 'backend', url: 'https://nodejs.org' },
                          { name: 'Express', icon: 'SiExpress', type: 'backend', url: 'https://expressjs.com' },
                          { name: 'PostgreSQL', icon: 'SiPostgresql', type: 'database', url: 'https://www.postgresql.org' },
                          { name: 'Redis', icon: 'SiRedis', type: 'database', url: 'https://redis.io' },
                          { name: 'Ethers.js', icon: 'SiEthereum', type: 'tool', url: 'https://docs.ethers.io/' },
                          { name: 'WebSockets', icon: 'SiSocketdotio', type: 'backend', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
                          { name: 'TradingView', icon: 'SiTradingview', type: 'tool', url: 'https://www.tradingview.com' },
                          { name: 'Docker', icon: 'SiDocker', type: 'devops', url: 'https://www.docker.com' },
                          { name: 'GitHub Actions', icon: 'SiGithubactions', type: 'devops', url: 'https://github.com/features/actions' },
                          { name: 'AWS', icon: 'SiAmazonaws', type: 'devops', url: 'https://aws.amazon.com' }
                        ]}
                        grouped={true}
                        showLabels={true}
                        showLinks={true}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Web3 Integration</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li>Seamless connection to <span className="font-medium">MetaMask</span> and other Web3 wallets using <span className="font-medium">ethers.js</span></li>
                          <li>Direct interaction with <span className="font-medium">dYdX's smart contracts</span> for on-chain operations</li>
                          <li>Support for both Layer 1 and Layer 2 trading via <span className="font-medium">StarkEx</span> integration</li>
                          <li>Real-time market data streaming through <span className="font-medium">WebSockets</span> for minimal latency</li>
                          <li>Advanced rendering of trading charts using the <span className="font-medium">TradingView Charting Library</span></li>
                          <li>Secure credential management with client-side encryption</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Key Trading Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-indigo-50 p-4 rounded-md">
                          <h5 className="font-medium text-indigo-700 mb-2">Advanced Order Types</h5>
                          <p className="text-sm text-gray-700">Supports limit, market, stop, stop-limit, trailing stop, and conditional orders.</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-md">
                          <h5 className="font-medium text-blue-700 mb-2">Portfolio Management</h5>
                          <p className="text-sm text-gray-700">Real-time position tracking, P&L calculation, and collateral management.</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-md">
                          <h5 className="font-medium text-purple-700 mb-2">Risk Controls</h5>
                          <p className="text-sm text-gray-700">Liquidation protection, position size limits, and customizable margin alerts.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-md mb-2">Security Considerations</h4>
                      <div className="bg-amber-50 p-4 rounded-md">
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          <li><span className="font-medium">Hardware security module (HSM)</span> integration for secure key management</li>
                          <li>Multi-signature authorization for large withdrawals</li>
                          <li>Protection against front-running and sandwich attacks</li>
                          <li>Comprehensive rate limiting and DDoS protection</li>
                          <li>Regular security audits by leading blockchain security firms</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
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