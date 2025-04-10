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
  detailedContent?: string;
  features?: { title: string; description: string }[];
  technologies?: string[];
  screenshots?: string[];
};

export const apps: AppInfo[] = [
  {
    id: "english-ai",
    name: "English AI Teacher",
    description: "Interactive AI-powered platform for learning English with personalized lessons and real-time feedback.",
    style: "Futuristic",
    primaryColor: "#14B8A6",
    secondaryColor: "#5EEAD4",
    accentColor: "#0D9488",
    imageUrl: "https://images.unsplash.com/photo-1605711285791-0219e80e43a3",
    tags: ["AI", "Education", "Interactive"],
    route: "/english-ai"
  },
  {
    id: "beauty",
    name: "Glow & Style",
    description: "Premium hair and beauty center website with appointment booking and personalized treatment plans.",
    style: "Elegant",
    primaryColor: "#F472B6",
    secondaryColor: "#FB7185",
    accentColor: "#E11D48",
    imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937",
    tags: ["Booking", "Services", "Gallery"],
    route: "/beauty"
  },
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
    route: "/pos",
    detailedContent: "The Bookstore POS System is a comprehensive point-of-sale solution designed specifically for bookstores of all sizes. Built with modern technology and a focus on user experience, this application streamlines inventory management, sales processing, and customer relationship management in a single, intuitive interface.\n\nThe system features a responsive design that works seamlessly across desktop terminals, tablets, and mobile devices, allowing staff to process transactions anywhere in the store. With offline capabilities, the POS continues to function during internet outages, automatically syncing data when connectivity is restored.\n\nThe barcode scanning functionality enables quick product lookups, while the intuitive search system allows staff to find books by title, author, ISBN, or keywords in seconds. The system also integrates with popular payment processors to accept various payment methods, including credit cards, mobile payments, and gift cards.",
    features: [
      {
        title: "Barcode Scanning",
        description: "Instantly scan book barcodes for quick lookups and efficient checkout processing with support for ISBN and custom store barcodes."
      },
      {
        title: "Inventory Management",
        description: "Track stock levels in real-time, receive low inventory alerts, and manage purchase orders with automated reordering suggestions."
      },
      {
        title: "Customer Database",
        description: "Store customer information securely, track purchase history, and implement loyalty programs with personalized recommendations."
      },
      {
        title: "Sales Analytics",
        description: "Generate comprehensive reports on sales trends, bestselling titles, and staff performance to optimize business operations."
      },
      {
        title: "Multiple Payment Options",
        description: "Process various payment methods including credit cards, mobile payments, gift cards, and store credit with customizable tax rates."
      },
      {
        title: "Offline Functionality",
        description: "Continue processing sales during internet outages with automatic data synchronization when connectivity is restored."
      }
    ],
    technologies: [
      "React", "TypeScript", "TailwindCSS", "Express.js", 
      "PostgreSQL", "Drizzle ORM", "JWT Authentication", 
      "Framer Motion", "PDF Generation", "Barcode Scanner API"
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1589998059171-988d887df646",
      "https://images.unsplash.com/photo-1606143704394-4dd04f867054"
    ]
  },
  {
    id: "reddit",
    name: "ThreadVerse",
    description: "Community-driven content sharing platform with upvoting system, user profiles, and nested comments.",
    style: "Social",
    primaryColor: "#F97316",
    secondaryColor: "#FB923C",
    accentColor: "#EA580C",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
    tags: ["Community", "Posts", "Threads"],
    route: "/reddit"
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
    route: "/fruits",
    detailedContent: "Fruits & Greens is a modern e-commerce platform specifically designed for organic produce sellers, farmers markets, and eco-conscious retailers. The application combines beautiful, nature-inspired design with powerful e-commerce functionality to create an immersive shopping experience that resonates with environmentally conscious consumers.\n\nThe platform features a responsive design optimized for both desktop and mobile devices, ensuring customers can shop conveniently from anywhere. The intuitive product categorization system makes it easy for shoppers to browse by fruit type, season, origin, or dietary preferences like vegan and gluten-free.\n\nWith a focus on transparency, each product listing includes detailed information about farming practices, nutritional content, and environmental impact. The platform also highlights local and seasonal products to encourage sustainable purchasing decisions and reduce carbon footprint from long-distance shipping.",
    features: [
      {
        title: "Seasonal Collections",
        description: "Automatically showcase seasonal produce with customized storefronts that update based on availability and harvest times."
      },
      {
        title: "Farm-to-Table Transparency",
        description: "Display detailed product origins with farm information, growing practices, harvest dates, and food miles for conscious consumers."
      },
      {
        title: "Subscription Boxes",
        description: "Enable customers to subscribe to weekly or monthly organic produce boxes with flexible customization options."
      },
      {
        title: "Streamlined Checkout",
        description: "Implement an optimized checkout flow with saved addresses, preferred payment methods, and delivery time selection."
      },
      {
        title: "Delivery Zone Mapping",
        description: "Define delivery areas with interactive maps, custom pricing tiers, and availability schedules for local distribution."
      },
      {
        title: "Nutritional Information",
        description: "Provide comprehensive nutritional data, allergen alerts, and dietary categorization (vegan, gluten-free, etc.) for all products."
      }
    ],
    technologies: [
      "React", "TypeScript", "TailwindCSS", "Express.js", 
      "PostgreSQL", "Drizzle ORM", "Stripe Payment Integration", 
      "JWT Authentication", "Next.js", "Mapbox Integration"
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c",
      "https://images.unsplash.com/photo-1607305387299-a3d9611cd469"
    ]
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
    route: "/marketing",
    detailedContent: "Marketing Manager is a sophisticated platform designed to showcase modern digital marketing capabilities while serving as a complete solution for marketing agencies and professionals. The application features stunning visual design with glassmorphism effects, subtle animations, and micro-interactions that create an engaging and memorable user experience.\n\nThe platform includes a comprehensive suite of tools for lead generation, customer relationship management, campaign analytics, and content scheduling. The AI-powered chatbot provides instant responses to visitor inquiries, qualifying leads and gathering important customer data before seamlessly transitioning to human agents when necessary.\n\nWith a focus on conversion optimization, the application incorporates proven marketing funnel strategies, from attention-grabbing hero sections to compelling calls-to-action, testimonial showcases, and frictionless lead capture forms. The analytics dashboard offers real-time insights into visitor behavior, campaign performance, and conversion metrics.",
    features: [
      {
        title: "Interactive Showcase",
        description: "Present your services with captivating animations, parallax effects, and interactive elements that highlight your unique value proposition."
      },
      {
        title: "Lead Generation System",
        description: "Capture and qualify leads through strategic multi-step forms with progressive disclosure and conditional logic for higher conversion rates."
      },
      {
        title: "AI-Powered Chatbot",
        description: "Engage visitors 24/7 with an intelligent chatbot that answers FAQs, qualifies leads, and schedules appointments with human team members."
      },
      {
        title: "Testimonial Management",
        description: "Showcase client success stories with a visually stunning testimonial gallery featuring ratings, photos, and detailed case studies."
      },
      {
        title: "Campaign Analytics",
        description: "Track and analyze marketing performance with detailed reports on traffic sources, conversion rates, customer journey, and ROI metrics."
      },
      {
        title: "Content Calendar",
        description: "Plan and schedule marketing content across multiple channels with visual timeline, team collaboration tools, and automated publishing."
      }
    ],
    technologies: [
      "React", "TypeScript", "TailwindCSS", "Framer Motion", 
      "Express.js", "PostgreSQL", "Drizzle ORM", "JWT Authentication", 
      "Chart.js", "OpenAI API Integration", "WebSockets"
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0"
    ]
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
    id: "bi",
    name: "BI Dashboard",
    description: "Make powerful dashboards easy for anyone. Upload CSVs, drag chart blocks, and export insights.",
    style: "Material",
    primaryColor: "#3B82F6",
    secondaryColor: "#60A5FA",
    accentColor: "#2563EB",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    tags: ["Charts", "Drag & Drop", "Data Viz"],
    route: "/bi",
    detailedContent: "The BI Dashboard is a powerful yet intuitive business intelligence platform designed to democratize data analysis for businesses of all sizes. Unlike traditional BI tools that require specialized knowledge, this application features a user-friendly interface with drag-and-drop functionality that enables anyone to create professional-grade dashboards and reports.\n\nThe platform allows users to connect to various data sources, including databases, spreadsheets, and cloud services, or simply upload CSV files directly. The smart data processing engine automatically detects data types, relationships, and potential visualization opportunities, suggesting optimal chart types based on the data structure.\n\nWith the interactive dashboard builder, users can arrange multiple visualization components on a canvas, apply filters, and set up drill-down capabilities for deeper analysis. Real-time collaboration features enable team members to work on dashboards simultaneously, making data-driven decision making a truly collaborative process.",
    features: [
      {
        title: "Drag-and-Drop Dashboard Builder",
        description: "Create beautiful, interactive dashboards without coding using an intuitive drag-and-drop interface with customizable layouts and themes."
      },
      {
        title: "Smart Data Connectors",
        description: "Connect to multiple data sources including SQL databases, Excel/CSV files, Google Sheets, and popular SaaS platforms with automated schema detection."
      },
      {
        title: "AI-Powered Insights",
        description: "Discover hidden trends and anomalies with AI-driven data analysis that automatically highlights important patterns and correlations."
      },
      {
        title: "Interactive Visualizations",
        description: "Create dynamic charts, graphs, and data tables with interactive elements like tooltips, drill-downs, and cross-filtering capabilities."
      },
      {
        title: "Scheduled Reports",
        description: "Set up automated report generation and distribution via email or team collaboration platforms based on custom schedules and triggers."
      },
      {
        title: "Cross-Device Accessibility",
        description: "Access dashboards from any device with responsive design that automatically adjusts to different screen sizes without losing functionality."
      }
    ],
    technologies: [
      "React", "TypeScript", "D3.js", "ReCharts", "Express.js", 
      "PostgreSQL", "Drizzle ORM", "React DnD", "CSV Parser", 
      "JWT Authentication", "WebSockets", "PDF Generation"
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1543286386-2e659306cd6c",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    ]
  }
];
