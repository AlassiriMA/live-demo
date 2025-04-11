// Map project slugs to their corresponding SVG images
export const projectImageMap: Record<string, string> = {
  "pos": "/images/projects/pos-bookstore.svg",
  "fruits": "/images/projects/fruit-store.svg",
  "marketing": "/images/projects/marketing-agency.svg",
  "bi": "/images/projects/bi-dashboard.svg", 
  "statarb": "/images/projects/statarb.svg",
  "triarb": "/images/projects/triarb.svg",
  "dydx": "/images/projects/dydx-trading.svg",
  "english-ai": "/images/projects/english-ai.svg",
  "beauty": "/images/projects/beauty-salon.svg",
  "reddit": "/images/projects/reddit-clone.svg"
};

/**
 * Get the appropriate image URL for a project based on slug
 * @param slug The project slug
 * @param fallbackImageUrl Optional fallback image URL if no matching SVG found
 * @returns The image URL to use
 */
export function getProjectImage(slug: string, fallbackImageUrl?: string): string {
  // If we have a matching SVG, use it
  if (slug && projectImageMap[slug]) {
    return projectImageMap[slug];
  }
  
  // Otherwise use the fallback or a default placeholder
  return fallbackImageUrl || '/images/placeholder-project.svg';
}