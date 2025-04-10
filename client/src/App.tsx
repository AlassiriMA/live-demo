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

// Import app detail pages
import PosDetail from "@/pages/app-details/PosDetail";
import FruitsDetail from "@/pages/app-details/FruitsDetail";

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
      
      {/* App detail routes */}
      <Route path="/app-details/pos" component={PosDetail} />
      <Route path="/app-details/fruits" component={FruitsDetail} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
