import { db } from "../server/db";
import { siteSettings } from "../shared/schema";
import { eq } from "drizzle-orm";

export type SeedSetting = {
  key: string;
  value: any;
  category: string;
  description: string;
};

async function seedSettings() {
  console.log("🌱 Seeding site settings...");

  const defaultSettings: SeedSetting[] = [
    // Homepage - Hero Section
    {
      key: "hero.title",
      value: "Welcome to My Journey in Tech and Creativity",
      category: "homepage",
      description: "Main headline for the homepage hero section"
    },
    {
      key: "hero.subtitle",
      value: "Explore a collection of 10 innovative web applications showcasing my skills across different domains",
      category: "homepage",
      description: "Subtitle text for the homepage hero section"
    },
    {
      key: "hero.cta",
      value: "Explore Projects",
      category: "homepage",
      description: "Call-to-action button text in the hero section"
    },
    
    // About Section
    {
      key: "about.title",
      value: "About Me",
      category: "homepage",
      description: "Title for the about section"
    },
    {
      key: "about.content",
      value: "For me, coding is like solving a giant puzzle — and I love every piece of it. It's about turning ideas into reality and using creativity to make things work. Each of these projects is a reflection of my drive to learn, explore, and create solutions.",
      category: "homepage",
      description: "Main content for the about section"
    },
    
    // Site Information
    {
      key: "site.title",
      value: "Mohammad Alassiri's Portfolio",
      category: "site-info",
      description: "Website title used in metadata and browser tab"
    },
    {
      key: "site.description",
      value: "A showcase of innovative web applications built with modern technologies",
      category: "site-info",
      description: "Website description used in metadata"
    },
    {
      key: "site.author",
      value: "Mohammad Alassiri",
      category: "site-info",
      description: "Author name for the website"
    },
    {
      key: "site.keywords",
      value: "portfolio, web development, react, nodejs, fullstack, projects",
      category: "site-info",
      description: "Keywords for search engine optimization"
    },

    // Contact Information
    {
      key: "contact.email",
      value: "contact@example.com",
      category: "contact",
      description: "Contact email address"
    },
    {
      key: "contact.phone",
      value: "+1234567890",
      category: "contact",
      description: "Contact phone number"
    },
    {
      key: "contact.address",
      value: "Amsterdam, Netherlands",
      category: "contact",
      description: "Physical address or location"
    },
    
    // Social Media Links
    {
      key: "social.github",
      value: "https://github.com/yourusername",
      category: "social",
      description: "GitHub profile URL"
    },
    {
      key: "social.linkedin",
      value: "https://linkedin.com/in/yourusername",
      category: "social",
      description: "LinkedIn profile URL"
    },
    {
      key: "social.twitter",
      value: "https://twitter.com/yourusername",
      category: "social",
      description: "Twitter profile URL"
    },
    
    // Footer Content
    {
      key: "footer.copyright",
      value: "© 2025 Mohammad Alassiri. All rights reserved.",
      category: "footer",
      description: "Copyright text in the footer"
    },
    {
      key: "footer.links",
      value: JSON.stringify([
        { text: "Home", url: "/" },
        { text: "Projects", url: "#apps" },
        { text: "About", url: "#about" },
        { text: "Contact", url: "#contact" }
      ]),
      category: "footer",
      description: "JSON array of footer navigation links"
    },
    
    // Theme Settings
    {
      key: "theme.primaryColor",
      value: "#6366F1",
      category: "theme",
      description: "Primary color for the website"
    },
    {
      key: "theme.secondaryColor",
      value: "#EC4899",
      category: "theme",
      description: "Secondary color for the website"
    },
    {
      key: "theme.fontPrimary",
      value: "'Inter', sans-serif",
      category: "theme",
      description: "Primary font family"
    }
  ];

  for (const setting of defaultSettings) {
    // Check if setting already exists
    const existingSetting = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.key, setting.key))
      .limit(1);

    if (existingSetting.length === 0) {
      // Setting doesn't exist, insert it
      await db.insert(siteSettings).values({
        key: setting.key,
        value: setting.value,
        category: setting.category,
        description: setting.description,
        createdBy: 5, // Admin user ID
        updatedBy: 5 // Admin user ID
      });
      console.log(`Created setting: ${setting.key}`);
    } else {
      console.log(`Setting already exists: ${setting.key}`);
    }
  }

  console.log("✅ Site settings seeding completed.");
}

// Run the function
seedSettings()
  .then(() => {
    console.log("Settings seeding completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding settings:", error);
    process.exit(1);
  });

export { seedSettings };