export type AppInfo = {
  id: string;
  name: string;
  description: string;
  style: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  imageUrl: string;
  tags: string[];
  route: string;
};

export const apps: AppInfo[] = [
  {
    id: "pos",
    name: "POS for Bookstores",
    description: "An elegant, intuitive POS system tailored for bookstores with barcode workflows and offline resilience.",
    style: "Neumorphism",
    primaryColor: "#6366F1",
    secondaryColor: "#818CF8",
    accentColor: "#4F46E5",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    tags: ["React", "TailwindCSS", "TypeScript"],
    route: "/pos"
  },
  {
    id: "fruits",
    name: "Fruits & Greens",
    description: "Lightweight and beautiful e-commerce built for eco-conscious shopping experiences.",
    style: "Clean & Organic",
    primaryColor: "#22C55E",
    secondaryColor: "#4ADE80",
    accentColor: "#16A34A",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e",
    tags: ["React", "Stripe", "SEO"],
    route: "/fruits"
  },
  {
    id: "marketing",
    name: "Marketing Manager",
    description: "A full-stack marketing showcase with flair, testimonials, and a funnel-ready design.",
    style: "Glassmorphism",
    primaryColor: "#EC4899",
    secondaryColor: "#F472B6",
    accentColor: "#DB2777",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    tags: ["Framer Motion", "Chatbot", "Analytics"],
    route: "/marketing"
  },
  {
    id: "statarb",
    name: "StatArb Bot",
    description: "A smart bot simulating mean-reverting strategies using z-score models and live data.",
    style: "Terminal",
    primaryColor: "#10B981",
    secondaryColor: "#34D399",
    accentColor: "#059669",
    imageUrl: "",
    tags: ["Trading", "Charts", "Algorithm"],
    route: "/statarb"
  },
  {
    id: "triarb",
    name: "TriArb Bot",
    description: "A high-frequency simulated trading bot that detects profit edges in triangle cycles.",
    style: "Cyberpunk",
    primaryColor: "#8B5CF6",
    secondaryColor: "#A78BFA",
    accentColor: "#7C3AED",
    imageUrl: "",
    tags: ["Arbitrage", "DeFi", "HFT"],
    route: "/triarb"
  },
  {
    id: "dydx",
    name: "DYDX Pairs Bot",
    description: "Simulates trading on DYDX's L2 network with cointegration-based entry and exit strategies.",
    style: "TradingView",
    primaryColor: "#F59E0B",
    secondaryColor: "#FBBF24",
    accentColor: "#D97706",
    imageUrl: "",
    tags: ["Cointegration", "Z-scores", "L2"],
    route: "/dydx"
  },
  {
    id: "bi",
    name: "BI Dashboard",
    description: "Make powerful dashboards easy for anyone. Upload CSVs, drag chart blocks, and export insights.",
    style: "Material",
    primaryColor: "#3B82F6",
    secondaryColor: "#60A5FA",
    accentColor: "#2563EB",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    tags: ["Charts", "Drag & Drop", "Data Viz"],
    route: "/bi"
  }
];
