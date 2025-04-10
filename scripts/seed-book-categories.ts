import { db } from "../server/db";
import { bookCategories } from "../shared/schema";

async function seedBookCategories() {
  try {
    console.log("Starting to seed book categories...");
    
    // Check if book categories already exist
    const existingCategories = await db.select().from(bookCategories);
    
    if (existingCategories.length > 0) {
      console.log(`Found ${existingCategories.length} existing book categories. Skipping seed.`);
      return;
    }
    
    // Sample book category data
    const categoriesData = [
      {
        name: "Fiction",
        slug: "fiction",
        description: "Novels, short stories, and other creative literary works",
        parentId: null
      },
      {
        name: "Non-Fiction",
        slug: "non-fiction",
        description: "Informational and factual works based on real events",
        parentId: null
      },
      {
        name: "Science Fiction",
        slug: "science-fiction",
        description: "Fiction based on scientific facts and future possibilities",
        parentId: 1 // Child of Fiction
      },
      {
        name: "Fantasy",
        slug: "fantasy",
        description: "Fiction set in magical worlds with mythical creatures",
        parentId: 1 // Child of Fiction
      },
      {
        name: "Mystery",
        slug: "mystery",
        description: "Fiction centered around solving a crime or puzzle",
        parentId: 1 // Child of Fiction
      },
      {
        name: "Biography",
        slug: "biography",
        description: "Non-fiction accounts of individuals' lives",
        parentId: 2 // Child of Non-Fiction
      },
      {
        name: "History",
        slug: "history",
        description: "Non-fiction works about past events",
        parentId: 2 // Child of Non-Fiction
      },
      {
        name: "Science",
        slug: "science",
        description: "Non-fiction works about scientific discoveries and concepts",
        parentId: 2 // Child of Non-Fiction
      },
      {
        name: "Self-Help",
        slug: "self-help",
        description: "Non-fiction guides for personal improvement",
        parentId: 2 // Child of Non-Fiction
      },
      {
        name: "Business",
        slug: "business",
        description: "Non-fiction works on entrepreneurship, management, and economics",
        parentId: 2 // Child of Non-Fiction
      }
    ];
    
    // Insert book categories
    const insertResult = await db.insert(bookCategories).values(categoriesData);
    
    console.log(`Successfully seeded ${categoriesData.length} book categories.`);
    return { success: true, count: categoriesData.length };
    
  } catch (error) {
    console.error("Error seeding book categories:", error);
    return { success: false, error };
  }
}

// Execute the seed function
seedBookCategories()
  .then(result => {
    console.log("Book categories seeding complete:", result);
    process.exit(0);
  })
  .catch(error => {
    console.error("Book categories seeding failed:", error);
    process.exit(1);
  });