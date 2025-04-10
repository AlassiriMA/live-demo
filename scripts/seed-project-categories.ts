import { db } from "../server/db";
import { projectCategories } from "../shared/schema";

async function seedProjectCategories() {
  try {
    console.log("Starting to seed project categories...");
    
    // Check if project categories already exist
    const existingCategories = await db.select().from(projectCategories);
    
    if (existingCategories.length > 0) {
      console.log(`Found ${existingCategories.length} existing project categories. Skipping seed.`);
      return;
    }
    
    // Sample project category data
    const categoriesData = [
      {
        name: "Web Applications",
        slug: "web-applications",
        description: "Interactive web applications with modern frontend and backend technologies"
      },
      {
        name: "E-commerce",
        slug: "e-commerce",
        description: "Online shopping platforms and marketplace applications"
      },
      {
        name: "Finance",
        slug: "finance",
        description: "Trading tools, financial dashboards, and investment applications"
      },
      {
        name: "Education",
        slug: "education",
        description: "Learning platforms and educational technology applications"
      },
      {
        name: "Business",
        slug: "business",
        description: "Business tools, CRMs, and enterprise applications"
      },
      {
        name: "Portfolio",
        slug: "portfolio",
        description: "Showcase and personal portfolio projects"
      }
    ];
    
    // Insert project categories
    const insertResult = await db.insert(projectCategories).values(categoriesData);
    
    console.log(`Successfully seeded ${categoriesData.length} project categories.`);
    return { success: true, count: categoriesData.length };
    
  } catch (error) {
    console.error("Error seeding project categories:", error);
    return { success: false, error };
  }
}

// Execute the seed function
seedProjectCategories()
  .then(result => {
    console.log("Project categories seeding complete:", result);
    process.exit(0);
  })
  .catch(error => {
    console.error("Project categories seeding failed:", error);
    process.exit(1);
  });