import { db } from "../server/db";
import { projects } from "../shared/schema";

async function seedProjects() {
  try {
    console.log("Starting to seed projects...");
    
    // Check if projects already exist
    const existingProjects = await db.select().from(projects);
    
    if (existingProjects.length > 0) {
      console.log(`Found ${existingProjects.length} existing projects. Skipping seed.`);
      return;
    }
    
    // Sample project data
    const projectsData = [
      {
        slug: "pos-bookstore",
        name: "Bookstore POS System",
        description: "A point-of-sale system for managing book inventory, sales, and reporting for bookstores.",
        style: "professional",
        primaryColor: "#4F46E5",
        secondaryColor: "#818CF8",
        accentColor: "#C7D2FE",
        imageUrl: "/assets/images/projects/pos-bookstore.jpg",
        tags: "React,Express,PostgreSQL,Tailwind CSS",
        route: "/pos",
        published: true,
        detailedContent: "This POS system is designed specifically for bookstores, providing inventory management, sales tracking, and reporting capabilities. It features a clean, intuitive interface for cashiers and administrators with different permission levels.",
        features: [
          {
            title: "Inventory Management",
            description: "Track books by ISBN, author, category, and stock level"
          },
          {
            title: "Sales Processing",
            description: "Fast checkout with barcode scanning and multiple payment methods"
          },
          {
            title: "Reporting",
            description: "Generate sales reports, inventory status, and bestseller lists"
          }
        ]
      },
      {
        slug: "fruit-store",
        name: "Organic Fruit Store",
        description: "An e-commerce platform for ordering fresh, organic fruits with real-time inventory tracking.",
        style: "vibrant",
        primaryColor: "#10B981",
        secondaryColor: "#34D399",
        accentColor: "#D1FAE5",
        imageUrl: "/assets/images/projects/fruit-store.jpg",
        tags: "React,Express,PostgreSQL,Framer Motion",
        route: "/fruits",
        published: true,
        detailedContent: "This organic fruit store allows customers to browse and purchase fresh, organic fruits. The application includes features like real-time inventory tracking, seasonal specials, and nutritional information for each product.",
        features: [
          {
            title: "Product Catalog",
            description: "Browse fruits by category, season, and organic certification"
          },
          {
            title: "Shopping Cart",
            description: "Add items to cart with quantity controls and price calculation"
          },
          {
            title: "Checkout Process",
            description: "Secure checkout with multiple payment options and delivery scheduling"
          }
        ]
      },
      {
        slug: "marketing-agency",
        name: "Digital Marketing Agency",
        description: "A showcase website for a digital marketing agency with service details, portfolio, and lead generation forms.",
        style: "modern",
        primaryColor: "#EC4899",
        secondaryColor: "#F472B6",
        accentColor: "#FCE7F3",
        imageUrl: "/assets/images/projects/marketing-agency.jpg",
        tags: "React,Tailwind CSS,Express,Framer Motion",
        route: "/marketing",
        published: true,
        detailedContent: "This marketing agency website showcases services, past projects, and client testimonials. It includes interactive elements to engage visitors and convert them into leads through strategically placed contact forms and calls-to-action.",
        features: [
          {
            title: "Service Showcase",
            description: "Detailed presentation of marketing services with case studies"
          },
          {
            title: "Client Testimonials",
            description: "Real client feedback with company information and ratings"
          },
          {
            title: "Lead Generation",
            description: "Smart forms that capture potential client information for follow-up"
          }
        ]
      },
      {
        slug: "bi-dashboard",
        name: "Business Intelligence Dashboard",
        description: "An interactive dashboard for visualizing and analyzing business data with customizable widgets and reports.",
        style: "professional",
        primaryColor: "#0284C7",
        secondaryColor: "#38BDF8",
        accentColor: "#BAE6FD",
        imageUrl: "/assets/images/projects/bi-dashboard.jpg",
        tags: "React,D3.js,Express,PostgreSQL",
        route: "/bi",
        published: true,
        detailedContent: "This BI dashboard provides powerful data visualization and analysis tools for business metrics. Users can create custom dashboards with various chart types, data filters, and export options to make informed business decisions.",
        features: [
          {
            title: "Custom Dashboards",
            description: "Create personalized views with drag-and-drop widget placement"
          },
          {
            title: "Data Visualization",
            description: "Multiple chart types including bar, line, pie, and scatter plots"
          },
          {
            title: "Data Export",
            description: "Export reports and visualizations in PDF, CSV, and Excel formats"
          }
        ]
      },
      {
        slug: "statistical-arbitrage",
        name: "Statistical Arbitrage Trading Tool",
        description: "A financial tool for identifying and executing statistical arbitrage opportunities in the financial markets.",
        style: "minimalist",
        primaryColor: "#4F46E5",
        secondaryColor: "#818CF8",
        accentColor: "#C7D2FE",
        imageUrl: "/assets/images/projects/statistical-arbitrage.jpg",
        tags: "React,D3.js,Express,WebSockets",
        route: "/statarb",
        published: true,
        detailedContent: "This statistical arbitrage tool helps traders identify and capitalize on price discrepancies between related financial instruments. It includes correlation analysis, pair selection, and signal generation for optimal trade execution.",
        features: [
          {
            title: "Pair Selection",
            description: "Identify correlated pairs with historical price analysis"
          },
          {
            title: "Signal Generation",
            description: "Calculate z-scores and generate entry/exit signals"
          },
          {
            title: "Backtesting",
            description: "Test strategies against historical data with performance metrics"
          }
        ]
      },
      {
        slug: "triangular-arbitrage",
        name: "Triangular Arbitrage Scanner",
        description: "A tool for detecting and analyzing triangular arbitrage opportunities across cryptocurrency exchanges.",
        style: "dark",
        primaryColor: "#7C3AED",
        secondaryColor: "#A78BFA",
        accentColor: "#EDE9FE",
        imageUrl: "/assets/images/projects/triangular-arbitrage.jpg",
        tags: "React,WebSockets,Express,Cryptocurrency",
        route: "/triarb",
        published: true,
        detailedContent: "This triangular arbitrage scanner continuously monitors cryptocurrency exchange rates to identify profitable trading opportunities across three or more currency pairs. It calculates potential profits, factoring in exchange fees and execution time.",
        features: [
          {
            title: "Real-time Scanning",
            description: "Monitor exchange rates across multiple platforms simultaneously"
          },
          {
            title: "Opportunity Detection",
            description: "Calculate potential profits with fee and slippage considerations"
          },
          {
            title: "Execution Assistant",
            description: "Step-by-step guidance for executing identified opportunities"
          }
        ]
      },
      {
        slug: "dydx-trading",
        name: "dYdX Trading Interface",
        description: "A custom trading interface for the dYdX decentralized exchange with advanced order types and portfolio management.",
        style: "modern",
        primaryColor: "#171717",
        secondaryColor: "#404040",
        accentColor: "#A3A3A3",
        imageUrl: "/assets/images/projects/dydx-trading.jpg",
        tags: "React,Web3.js,Ethereum,WebSockets",
        route: "/dydx",
        published: true,
        detailedContent: "This trading interface for dYdX decentralized exchange offers advanced trading features, portfolio tracking, and order management. It connects directly to users' wallets for secure, non-custodial trading of perpetual contracts.",
        features: [
          {
            title: "Advanced Order Types",
            description: "Place limit, stop, and trailing stop orders with precision"
          },
          {
            title: "Portfolio Analytics",
            description: "Track performance, exposure, and realized/unrealized PnL"
          },
          {
            title: "Risk Management",
            description: "Set stop losses and take profits with position sizing calculator"
          }
        ]
      },
      {
        slug: "english-ai-tutor",
        name: "AI English Language Tutor",
        description: "An educational app using AI to provide personalized English language tutoring with speech recognition and feedback.",
        style: "friendly",
        primaryColor: "#0EA5E9",
        secondaryColor: "#38BDF8",
        accentColor: "#BAE6FD",
        imageUrl: "/assets/images/projects/english-ai-tutor.jpg",
        tags: "React,Speech Recognition,AI,Express",
        route: "/english-ai",
        published: true,
        detailedContent: "This AI-powered English language tutor provides personalized learning experiences for students at all proficiency levels. It uses speech recognition and natural language processing to offer real-time feedback on pronunciation, grammar, and vocabulary.",
        features: [
          {
            title: "Speech Recognition",
            description: "Real-time pronunciation feedback with accent detection"
          },
          {
            title: "Grammar Assistance",
            description: "Identify and explain grammar errors with correction suggestions"
          },
          {
            title: "Vocabulary Building",
            description: "Contextual vocabulary exercises with spaced repetition system"
          }
        ]
      },
      {
        slug: "beauty-salon",
        name: "Beauty and Hair Salon",
        description: "A website for a beauty salon featuring service listings, online booking, and customer testimonials.",
        style: "elegant",
        primaryColor: "#DB2777",
        secondaryColor: "#F472B6",
        accentColor: "#FCE7F3",
        imageUrl: "/assets/images/projects/beauty-salon.jpg",
        tags: "React,Tailwind CSS,Express,PostgreSQL",
        route: "/beauty",
        published: true,
        detailedContent: "This beauty salon website showcases services, stylist profiles, and before/after galleries. It includes an appointment booking system, client testimonials, and promotional offers to attract and retain customers.",
        features: [
          {
            title: "Service Catalog",
            description: "Detailed service listings with pricing and duration information"
          },
          {
            title: "Online Booking",
            description: "Schedule appointments with specific stylists and services"
          },
          {
            title: "Before & After Gallery",
            description: "Visual showcase of transformation results for various services"
          }
        ]
      },
      {
        slug: "reddit-clone",
        name: "Community Forum (Reddit Clone)",
        description: "A community discussion platform with subreddits, post voting, and commenting functionality similar to Reddit.",
        style: "classic",
        primaryColor: "#EF4444",
        secondaryColor: "#F87171",
        accentColor: "#FEE2E2",
        imageUrl: "/assets/images/projects/reddit-clone.jpg",
        tags: "React,Express,PostgreSQL,WebSockets",
        route: "/reddit",
        published: true,
        detailedContent: "This community forum allows users to create and join topic-specific communities, share content, and engage in discussions. It includes features like post voting, nested comments, and content moderation tools similar to Reddit.",
        features: [
          {
            title: "Community Creation",
            description: "Create and customize topic-focused communities with rules"
          },
          {
            title: "Content Sharing",
            description: "Post links, text, images, and videos with rich formatting"
          },
          {
            title: "Voting System",
            description: "Upvote/downvote content with popularity ranking algorithms"
          }
        ]
      }
    ];
    
    // Insert projects
    const insertResult = await db.insert(projects).values(projectsData);
    
    console.log(`Successfully seeded ${projectsData.length} projects.`);
    return { success: true, count: projectsData.length };
    
  } catch (error) {
    console.error("Error seeding projects:", error);
    return { success: false, error };
  }
}

// Execute the seed function
seedProjects()
  .then(result => {
    console.log("Projects seeding complete:", result);
    process.exit(0);
  })
  .catch(error => {
    console.error("Projects seeding failed:", error);
    process.exit(1);
  });