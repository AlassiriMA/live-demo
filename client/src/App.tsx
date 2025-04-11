import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy, useEffect } from "react";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { AuthProvider } from "@/hooks/use-auth";
import ResourcePreloader from "@/components/performance/ResourcePreloader";
import NetworkStatusNotification from "@/components/layout/NetworkStatusNotification";
import { preloadImages } from "@/lib/preloadUtils";

// Only import the homepage and essential components directly
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";

// Lazy load all other page components with optimized loading
const POS = lazy(() => import("@/pages/pos"));
const Fruits = lazy(() => import("@/pages/fruits"));
const Marketing = lazy(() => import("@/pages/marketing"));
const StatArb = lazy(() => import("@/pages/statarb"));
const TriArb = lazy(() => import("@/pages/triarb"));
const DYDX = lazy(() => import("@/pages/dydx"));
const BI = lazy(() => import("@/pages/bi"));
const EnglishAI = lazy(() => import("@/pages/english-ai"));
const Beauty = lazy(() => import("@/pages/beauty"));
const Reddit = lazy(() => import("@/pages/reddit"));
const Skills = lazy(() => import("@/pages/skills"));
const Projects = lazy(() => import("@/pages/projects"));
const ProjectDetails = lazy(() => import("@/pages/project-details"));
const Sitemap = lazy(() => import("@/pages/sitemap"));
const Terms = lazy(() => import("@/pages/terms"));
const Privacy = lazy(() => import("@/pages/privacy"));
const PosDetail = lazy(() => import("@/pages/app-details/PosDetail"));
const FruitsDetail = lazy(() => import("@/pages/app-details/FruitsDetail"));

// Enhanced loading spinner with fade-in animation
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 animate-pulse">Loading...</p>
    </div>
  </div>
);

// Critical resources to preload for better performance
const criticalResources = {
  images: [
    '/assets/images/fallback-image.svg',
    '/assets/images/placeholder-image.svg',
    '/assets/logo.svg',
  ],
  routes: [
    '/projects',
    '/skills',
  ],
  apiEndpoints: [
    '/api/settings',
    '/api/projects/published',
  ],
  origins: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ]
};

// Router with intelligent preloading
function Router() {
  const [location] = useLocation();
  
  // Preload resources for upcoming likely routes
  useEffect(() => {
    // Preload based on current location
    const projectRouteMatch = location.match(/^\/project\/([^/]+)$/);
    
    if (location === '/') {
      // On homepage, preload projects page assets
      preloadImages(['/assets/images/projects-banner.jpg'], 'low');
    } else if (location === '/projects') {
      // On projects page, preload first few project details
      // This helps with quick navigation to project details
      preloadImages([
        '/assets/images/screenshots/pos/thumbnail.jpg',
        '/assets/images/screenshots/fruits/thumbnail.jpg',
      ], 'low');
    } else if (projectRouteMatch) {
      // On project details, preload demo page for that project
      const projectSlug = projectRouteMatch[1];
      if (projectSlug === 'pos-system') {
        preloadImages(['/assets/images/screenshots/pos/demo.jpg'], 'low');
      }
    }
  }, [location]);
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        
        {/* Main app routes */}
        <Route path="/pos" component={POS} />
        <Route path="/fruits" component={Fruits} />
        <Route path="/marketing" component={Marketing} />
        <Route path="/statarb" component={StatArb} />
        <Route path="/triarb" component={TriArb} />
        <Route path="/dydx" component={DYDX} />
        <Route path="/bi" component={BI} />
        <Route path="/english-ai" component={EnglishAI} />
        <Route path="/beauty" component={Beauty} />
        <Route path="/reddit" component={Reddit} />
        
        {/* Portfolio information pages */}
        <Route path="/skills" component={Skills} />
        <Route path="/projects" component={Projects} />
        <Route path="/project/:slug" component={ProjectDetails} />
        <Route path="/sitemap" component={Sitemap} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        
        {/* App detail routes */}
        <Route path="/app-details/pos" component={PosDetail} />
        <Route path="/app-details/fruits" component={FruitsDetail} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// Main App with performance optimizations
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Preload critical resources */}
        <ResourcePreloader
          images={criticalResources.images}
          routes={criticalResources.routes}
          apiEndpoints={criticalResources.apiEndpoints}
          origins={criticalResources.origins}
        />
        
        {/* Core app components */}
        <ScrollToTop />
        <Router />
        <Toaster />
        <NetworkStatusNotification />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
