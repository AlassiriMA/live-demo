import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet, HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Helmet>
      <title>Alassiri Portfolio - Live Demo Apps</title>
      <meta name="description" content="A showcase of 7 live business applications — each with unique UI styles, smart architecture, and modern features." />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    </Helmet>
    <App />
  </HelmetProvider>
);
