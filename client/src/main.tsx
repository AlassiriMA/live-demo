import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider } from 'react-helmet-async';
import { SeoMetaTags } from '@/components/site-settings/SeoMetaTags';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "./lib/queryClient";

// Register service worker for production builds only
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// Performance monitoring
if (import.meta.env.DEV) {
  // Add React DevTools performance measurement in development
  // Keep this import conditional to avoid including it in production
  import('react').then(React => {
    // @ts-ignore - Profiler types
    window.React = React;
  });
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <SeoMetaTags />
      <App />
    </HelmetProvider>
  </QueryClientProvider>
);
