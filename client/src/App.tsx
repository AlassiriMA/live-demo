import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import POS from "@/pages/pos";
import Fruits from "@/pages/fruits";
import Marketing from "@/pages/marketing";
import StatArb from "@/pages/statarb";
import TriArb from "@/pages/triarb";
import DYDX from "@/pages/dydx";
import BI from "@/pages/bi";

// Import additional pages
import Skills from "@/pages/skills";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog/[id]";
import Sitemap from "@/pages/sitemap";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";

// Import app detail pages
import PosDetail from "@/pages/app-details/PosDetail";
import FruitsDetail from "@/pages/app-details/FruitsDetail";

// Import admin pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/index";
import ProjectsPage from "@/pages/admin/projects/index";
import NewProjectPage from "@/pages/admin/projects/new";

// Import auth provider
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
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
      
      {/* Portfolio information pages */}
      <Route path="/skills" component={Skills} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/sitemap" component={Sitemap} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      
      {/* App detail routes */}
      <Route path="/app-details/pos" component={PosDetail} />
      <Route path="/app-details/fruits" component={FruitsDetail} />
      
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/projects" component={ProjectsPage} />
      <Route path="/admin/projects/new" component={NewProjectPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
