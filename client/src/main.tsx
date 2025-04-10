import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider } from 'react-helmet-async';
import { SeoMetaTags } from '@/components/site-settings/SeoMetaTags';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <SeoMetaTags />
      <App />
    </HelmetProvider>
  </QueryClientProvider>
);
