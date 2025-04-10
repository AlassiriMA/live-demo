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
    route: "/english-ai",
    detailedContent: "English AI Teacher is an innovative language learning platform that harnesses the power of artificial intelligence to create personalized, adaptive learning experiences for English language learners at all proficiency levels. The application combines cutting-edge natural language processing with proven language acquisition methodologies to deliver an engaging and effective learning environment.\n\nUnlike traditional language learning apps that follow rigid, predefined paths, English AI Teacher dynamically adjusts to each learner's strengths, weaknesses, and learning style. The AI analyzes the user's responses, pronunciation, grammar usage, and vocabulary knowledge to create a customized curriculum that evolves as the user progresses.\n\nThe platform offers a variety of interactive learning activities, including conversational practice with AI tutors, pronunciation assessment, grammar exercises, vocabulary building, and reading comprehension. Each activity is designed to simulate real-world language use scenarios, helping learners develop practical communication skills they can immediately apply in their daily lives.",
    features: [
      {
        title: "AI Conversation Partner",
        description: "Practice speaking English with a sophisticated AI that responds naturally, corrects errors, and adjusts language complexity based on your proficiency level."
      },
      {
        title: "Personalized Learning Path",
        description: "Experience a curriculum that automatically adapts to your strengths, weaknesses, and learning pace, focusing on areas that need improvement."
      },
      {
        title: "Pronunciation Feedback",
        description: "Receive detailed feedback on your pronunciation with visual waveform comparisons and specific guidance on improving problematic sounds and intonation."
      },
      {
        title: "Grammar Analysis",
        description: "Get instant grammar corrections with clear explanations of rules and patterns, helping you understand not just what was wrong but why."
      },
      {
        title: "Vocabulary Builder",
        description: "Expand your vocabulary through contextual learning, spaced repetition, and personalized word lists based on your interests and career goals."
      },
      {
        title: "Progress Analytics",
        description: "Track your improvement over time with comprehensive analytics on speaking fluency, grammar accuracy, vocabulary range, and overall proficiency."
      }
    ],
    technologies: [
      "React", "TypeScript", "TailwindCSS", "OpenAI API", 
      "Express.js", "PostgreSQL", "Drizzle ORM", "Web Speech API", 
      "JWT Authentication", "WebSockets", "Framer Motion"
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8",
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d"
    ]
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
    route: "/beauty",
    detailedContent: "Glow & Style is a sophisticated digital platform designed for premium hair salons and beauty centers that want to elevate their online presence and streamline client management. The application combines stunning aesthetic design with powerful functionality to create an engaging experience that reflects the luxury and attention to detail that clients expect from high-end beauty establishments.\n\nThe platform features an elegant, visually rich interface that showcases the salon's services, styling portfolio, and professional team through immersive galleries and thoughtfully designed presentation sections. The responsive design ensures a seamless experience across all devices, allowing clients to browse and book appointments whether they're at home or on the go.\n\nAt the heart of the application is an advanced booking system that allows clients to schedule appointments based on service type, preferred stylist, and availability. The intuitive calendar interface makes it easy for clients to find convenient time slots, while the backend system manages staff scheduling, room allocation, and equipment needs to maximize operational efficiency.",
    features: [
      {
        title: "Smart Appointment Booking",
        description: "Allow clients to book appointments 24/7 with an intuitive calendar interface that shows real-time availability based on service duration and staff schedules."
      },
      {
        title: "Service Portfolio Showcase",
        description: "Display your range of beauty services with stunning visuals, detailed descriptions, pricing information, and recommended complementary treatments."
      },
      {
        title: "Stylist Profiles & Availability",
        description: "Highlight your professional team with detailed profiles showcasing their specialties, experience, certifications, and portfolio of previous work."
      },
      {
        title: "Client Management System",
        description: "Track client history, preferences, and personal notes to deliver personalized service recommendations and maintain long-term client relationships."
      },
      {
        title: "Before & After Gallery",
        description: "Showcase transformational results with an interactive before-and-after gallery that helps potential clients visualize the quality of your services."
      },
      {
        title: "Automated Reminders",
        description: "Reduce no-shows with automated SMS and email appointment reminders that include preparation instructions and salon policies."
      }
    ],
    technologies: [
      "React", "TypeScript", "TailwindCSS", "Framer Motion", 
      "Express.js", "PostgreSQL", "Drizzle ORM", "JWT Authentication", 
      "Cloudinary Integration", "Twilio API", "Google Calendar API"
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035",
      "https://images.unsplash.com/photo-1470259078422-826894b933aa"
    ]
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
    route: "/reddit",
    detailedContent: "ThreadVerse is a robust community-driven content sharing platform designed for meaningful discussions and content discovery. Drawing inspiration from popular social news aggregation services, this application provides a modern, user-friendly interface where users can share content, participate in discussions, and build communities around shared interests.\n\nThe platform is structured around thematic communities called 'forums' where users can post content relevant to that forum's topic. The intuitive content ranking system allows the most valuable contributions to rise to the top through user voting, ensuring quality content receives the visibility it deserves while less relevant content naturally falls lower in the feed.\n\nThreadVerse supports rich media content including text posts, images, videos, and links, with automatic preview generation for shared URLs. The sophisticated comment system enables nested conversations with collapsible threads, making it easy to follow complex discussions and reply to specific points within larger conversations.",
    features: [
      {
        title: "Community Forums",
        description: "Create and join topic-based communities with customizable rules, appearance settings, and moderation tools for community organizers."
      },
      {
        title: "Content Voting System",
        description: "Democratize content curation with user-powered upvoting and downvoting that determines post visibility and trending status."
      },
      {
        title: "Rich Media Support",
        description: "Share diverse content types including text posts, images, videos, links, and polls with automatic link previews and embedded content."
      },
      {
        title: "Nested Comment Threads",
        description: "Engage in organized discussions with multi-level nested comments, threading, and collapsible conversation branches for improved readability."
      },
      {
        title: "User Profiles & Reputation",
        description: "Build personal profiles with contribution history, karma points reflecting community standing, and customizable avatars and banners."
      },
      {
        title: "Content Discovery Tools",
        description: "Discover relevant content through personalized feeds, trending sections, and smart recommendations based on interests and activity."
      }
    ],
    technologies: [
      "React", "TypeScript", "TailwindCSS", "Express.js", 
      "PostgreSQL", "Drizzle ORM", "JWT Authentication", 
      "WebSockets", "Redis Cache", "Cloudinary", "Markdown Parser"
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1542744094-3a31f272c490",
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6"
    ]
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
    imageUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
    tags: ["Arbitrage", "DeFi", "HFT"],
    route: "/triarb",
    detailedContent: "TriArb Bot is a sophisticated triangular arbitrage simulator designed for cryptocurrency markets that identifies and tracks profit opportunities across three-currency trading cycles. Built with high-frequency trading principles in mind, this platform monitors price discrepancies across multiple exchanges in real-time and detects profitable trading paths that begin and end with the same currency.\n\nThe application uses advanced algorithms to continuously scan thousands of potential triangular combinations, calculating transaction costs, slippage, and exchange fees to determine the true profitability of each potential arbitrage opportunity. The intuitive dashboard displays profitable triangular paths with clear visualizations of the exact sequence of trades needed to capture the arbitrage opportunity.\n\nWhile operating as a simulation for educational purposes, the platform incorporates realistic trading mechanics including order book depth analysis, execution timing, and risk management strategies. Users can adjust sensitivity parameters, minimum profit thresholds, and trading pair preferences to customize the arbitrage detection according to their risk appetite and trading strategy.",
    features: [
      {
        title: "Real-time Market Scanner",
        description: "Monitor thousands of triangular arbitrage combinations across multiple exchanges simultaneously with millisecond updates on price changes."
      },
      {
        title: "Profit Path Visualization",
        description: "View complete trading cycles with interactive flowcharts showing each step in the arbitrage path, including exact conversion rates and profit calculations."
      },
      {
        title: "Fee-Adjusted Calculations",
        description: "Account for all trading fees, gas costs (for DeFi), and slippage in profit calculations to ensure displayed opportunities represent realistic outcomes."
      },
      {
        title: "Historical Opportunity Analysis",
        description: "Review past arbitrage opportunities with detailed statistics on frequency, duration, and profitability to optimize detection parameters."
      },
      {
        title: "Exchange Connectivity",
        description: "Connect to multiple cryptocurrency exchanges via API to access real market data and simulate how arbitrage opportunities would play out in live conditions."
      },
      {
        title: "Customizable Alerts",
        description: "Set up notifications for profitable opportunities based on minimum profit thresholds, specific currency pairs, or exchanges of interest."
      }
    ],
    technologies: [
      "React", "TypeScript", "TailwindCSS", "Express.js", 
      "PostgreSQL", "Drizzle ORM", "WebSockets", "D3.js", 
      "Redux", "Cryptocurrency Exchange APIs", "JWT Authentication"
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71"
    ]
  },
  {
    id: "dydx",
    name: "DYDX Pairs Bot",
    description: "Simulates trading on DYDX's L2 network with cointegration-based entry and exit strategies.",
    style: "TradingView",
    primaryColor: "#F59E0B",
    secondaryColor: "#FBBF24",
    accentColor: "#D97706",
    imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d",
    tags: ["Cointegration", "Z-scores", "L2"],
    route: "/dydx",
    detailedContent: "The DYDX Pairs Bot is an advanced statistical arbitrage simulator focusing on pairs trading strategies across perpetual contracts on the dYdX decentralized exchange. This application leverages sophisticated mathematical techniques to identify cointegrated cryptocurrency pairs and capitalize on temporary price divergences between assets that historically move together.\n\nThe platform implements a complete statistical pairs trading workflow, starting with pair selection through cointegration testing, followed by z-score calculation to determine entry and exit points, and finishing with simulated order execution and position management. The application computes Augmented Dickey-Fuller tests, Johansen tests, and Engle-Granger methodologies to scientifically validate cointegration relationships between crypto assets.\n\nThe interactive dashboard presents real-time spread visualizations with dynamic z-score bands that indicate optimal trade entry and exit zones. Advanced users can customize strategy parameters including lookback periods, z-score thresholds, position sizing rules, and risk management constraints to fine-tune the trading approach to their specific preferences.",
    features: [
      {
        title: "Cointegration Testing Suite",
        description: "Apply rigorous statistical tests including Augmented Dickey-Fuller, Johansen, and Engle-Granger methodologies to identify truly cointegrated asset pairs."
      },
      {
        title: "Dynamic Z-Score Analysis",
        description: "Visualize mean-reversion opportunities with real-time z-score calculations that highlight statistically significant deviations in pair spreads."
      },
      {
        title: "Spread Visualization Tools",
        description: "Monitor pair relationships through interactive spread charts with support for various normalization methods and custom timeframe selection."
      },
      {
        title: "Position Sizing Calculator",
        description: "Determine optimal position ratios for each side of the pair based on price volatility, hedge ratios, and available margin allocation."
      },
      {
        title: "Risk Management System",
        description: "Implement comprehensive risk controls including maximum position limits, stop-loss levels, and correlation breakdowns alerts."
      },
      {
        title: "Performance Analytics",
        description: "Track simulated trading performance with detailed metrics on profit/loss, Sharpe ratio, maximum drawdown, and win rate across different market conditions."
      }
    ],
    technologies: [
      "React", "TypeScript", "TailwindCSS", "Express.js", 
      "PostgreSQL", "Drizzle ORM", "WebSockets", "TradingView Lightweight Charts", 
      "dYdX API Integration", "Simple-Statistics", "JWT Authentication"
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1642790551116-18e150f248e5",
      "https://images.unsplash.com/photo-1642790490564-3bbc7c4cbde4"
    ]
  },
  {
    id: "statarb",
    name: "StatArb Bot",
    description: "A smart bot simulating mean-reverting strategies using z-score models and live data.",
    style: "Terminal",
    primaryColor: "#10B981",
    secondaryColor: "#34D399",
    accentColor: "#059669",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
    tags: ["Trading", "Charts", "Algorithm"],
    route: "/statarb",
    detailedContent: "StatArb Bot is a sophisticated statistical arbitrage platform designed for simulating mean-reversion trading strategies across equity markets. This application applies rigorous statistical methods to identify temporary market inefficiencies where asset prices deviate from their historical statistical relationships, providing opportunities for profit when they revert to their expected states.\n\nThe platform implements multiple statistical models, including z-score calculations, Bollinger Bands, and machine learning algorithms, to detect when assets are trading significantly above or below their historical means. These signals are then used to generate automated trading recommendations based on the assumption that prices will eventually revert to statistically expected levels.\n\nThe application features a comprehensive backtesting environment where users can evaluate strategy performance across different market conditions, optimize parameters, and analyze risk metrics. The intuitive dashboard displays real-time market data, strategy signals, and performance metrics, allowing users to monitor active strategies and make informed adjustments.",
    features: [
      {
        title: "Multi-Asset Analysis",
        description: "Analyze thousands of stocks simultaneously to identify mean-reversion opportunities across different sectors, market caps, and trading venues."
      },
      {
        title: "Statistical Model Selection",
        description: "Choose from multiple statistical approaches including z-score, Bollinger Bands, and machine learning algorithms to detect reversion opportunities."
      },
      {
        title: "Advanced Backtesting Engine",
        description: "Test strategies against historical data with detailed performance metrics, transaction costs, slippage simulation, and market impact models."
      },
      {
        title: "Risk Management Tools",
        description: "Implement sophisticated risk controls including position limits, volatility-based sizing, correlation analysis, and automated stop-loss mechanisms."
      },
      {
        title: "Portfolio Construction",
        description: "Build diversified portfolios of mean-reverting strategies with optimization for maximum Sharpe ratio, minimum drawdown, or custom objectives."
      },
      {
        title: "Performance Analytics",
        description: "Track and analyze strategy performance with comprehensive metrics including risk-adjusted returns, drawdowns, win/loss ratios, and factor exposures."
      }
    ],
    technologies: [
      "React", "TypeScript", "TailwindCSS", "Express.js", 
      "PostgreSQL", "Drizzle ORM", "D3.js", "WebSockets", 
      "TensorFlow.js", "Financial Data APIs", "JWT Authentication"
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
      "https://images.unsplash.com/photo-1535320903710-d993d3d77d29"
    ]
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
