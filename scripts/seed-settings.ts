import { db } from "../server/db";
import { siteSettings } from "../shared/schema";

async function seedSettings() {
  try {
    console.log("Starting to seed site settings...");
    
    // Check if settings already exist
    const existingSettings = await db.select().from(siteSettings);
    
    if (existingSettings.length > 0) {
      console.log(`Found ${existingSettings.length} existing settings. Skipping seed.`);
      return;
    }
    
    // Sample settings data - group by categories
    const settingsData = [
      // Site Information
      {
        key: "site.title",
        value: "Mohammad Alassiri's Portfolio",
        category: "site-info",
        updatedBy: 5 // admin user ID
      },
      {
        key: "site.description",
        value: "A portfolio showcasing 10 interactive demo applications across different industries and technologies.",
        category: "site-info",
        updatedBy: 5
      },
      {
        key: "site.keywords",
        value: ["portfolio", "developer", "full-stack", "react", "node.js", "javascript", "typescript"],
        category: "site-info",
        updatedBy: 5
      },
      {
        key: "site.author",
        value: "Mohammad Alassiri",
        category: "site-info",
        updatedBy: 5
      },
      
      // Contact Information
      {
        key: "contact.email",
        value: "contact@example.com",
        category: "contact",
        updatedBy: 5
      },
      {
        key: "contact.phone",
        value: "+1234567890",
        category: "contact",
        updatedBy: 5
      },
      {
        key: "contact.address",
        value: "Amsterdam, Netherlands",
        category: "contact",
        updatedBy: 5
      },
      
      // Social Media
      {
        key: "social.github",
        value: "https://github.com/yourusername",
        category: "social",
        updatedBy: 5
      },
      {
        key: "social.linkedin",
        value: "https://linkedin.com/in/yourusername",
        category: "social",
        updatedBy: 5
      },
      {
        key: "social.twitter",
        value: "https://twitter.com/yourusername",
        category: "social",
        updatedBy: 5
      },
      
      // Theme Settings
      {
        key: "theme.primaryColor",
        value: "#6366F1",
        category: "theme",
        updatedBy: 5
      },
      {
        key: "theme.secondaryColor",
        value: "#EC4899",
        category: "theme",
        updatedBy: 5
      },
      {
        key: "theme.fontPrimary",
        value: "Inter, sans-serif",
        category: "theme",
        updatedBy: 5
      },
      {
        key: "theme.fontSecondary",
        value: "Poppins, sans-serif",
        category: "theme",
        updatedBy: 5
      },
      
      // Hero Section
      {
        key: "hero.title",
        value: "Welcome to My Journey in Tech and Creativity",
        category: "homepage",
        updatedBy: 5
      },
      {
        key: "hero.subtitle",
        value: "Explore a collection of innovative web applications showcasing my skills across different domains",
        category: "homepage",
        updatedBy: 5
      },
      {
        key: "hero.cta",
        value: "Explore Projects",
        category: "homepage",
        updatedBy: 5
      },
      
      // About Section
      {
        key: "about.title",
        value: "About Me",
        category: "homepage",
        updatedBy: 5
      },
      {
        key: "about.content",
        value: "For me, coding is like solving a giant puzzle — and I love every piece of it. It's about turning ideas into reality and using creativity to make things work. Each of these projects is a reflection of my drive to learn, explore, and create solutions that make life easier or more exciting.",
        category: "homepage",
        updatedBy: 5
      },
      {
        key: "about.skills",
        value: ["JavaScript", "TypeScript", "React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Framer Motion", "Web3"],
        category: "homepage",
        updatedBy: 5
      }
    ];
    
    // Insert settings
    const insertResult = await db.insert(siteSettings).values(settingsData);
    
    console.log(`Successfully seeded ${settingsData.length} site settings.`);
    return { success: true, count: settingsData.length };
    
  } catch (error) {
    console.error("Error seeding site settings:", error);
    return { success: false, error };
  }
}

// Execute the seed function
seedSettings()
  .then(result => {
    console.log("Site settings seeding complete:", result);
    process.exit(0);
  })
  .catch(error => {
    console.error("Site settings seeding failed:", error);
    process.exit(1);
  });