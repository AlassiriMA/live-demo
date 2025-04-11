import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OptimizedProjectCard from './OptimizedProjectCard';
import { Button } from '@/components/ui/button';
import { debounce } from '@/lib/performanceUtils';
import useViewport from '@/hooks/useViewport';

// Project interface for TypeScript type safety
interface Project {
  id: number;
  slug: string;
  title: string;
  description?: string;
  categories?: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
}

interface OptimizedProjectGridProps {
  projects: Project[];
  categories?: string[];
  initialCategory?: string;
  showFilters?: boolean;
  showLoadMore?: boolean;
  initialLimit?: number;
  className?: string;
  showViewButton?: boolean;
  showLiveButton?: boolean;
  showGithubButton?: boolean;
}

/**
 * An optimized grid of project cards with:
 * - Filtering functionality
 * - Load more button for paginated loading
 * - Smooth transitions between filters
 * - Responsive grid layout
 * - Performance optimizations for large project collections
 */
export function OptimizedProjectGrid({
  projects = [],
  categories = [],
  initialCategory = 'All',
  showFilters = true,
  showLoadMore = true,
  initialLimit = 6,
  className = '',
  showViewButton = true,
  showLiveButton = true,
  showGithubButton = true,
}: OptimizedProjectGridProps) {
  // Calculate unique categories if not provided
  const allCategories = categories.length > 0 
    ? ['All', ...categories] 
    : ['All', ...Array.from(new Set(projects.flatMap(p => p.categories || []))).sort()];
    
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const [displayCount, setDisplayCount] = useState(initialLimit);
  const { isMobile } = useViewport();
  
  // Filter projects based on active category and display count
  useEffect(() => {
    const filteredProjects = activeCategory === 'All'
      ? projects
      : projects.filter(project => 
          project.categories?.includes(activeCategory)
        );
        
    setVisibleProjects(filteredProjects.slice(0, displayCount));
  }, [activeCategory, displayCount, projects]);
  
  // Handle filter change with debounce for performance
  const handleCategoryChange = debounce((category: string) => {
    setActiveCategory(category);
    setDisplayCount(initialLimit);
    
    // Scroll to top of grid when filter changes (with smooth scrolling)
    const gridElement = document.getElementById('projects-grid');
    if (gridElement) {
      const offset = gridElement.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, 300);
  
  // Load more projects
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + initialLimit);
  };
  
  // Whether to show load more button
  const canLoadMore = activeCategory === 'All'
    ? visibleProjects.length < projects.length
    : visibleProjects.length < projects.filter(p => p.categories?.includes(activeCategory)).length;
    
  // Determine number of grid columns based on viewport
  const gridCols = isMobile ? 1 : 3;
  
  return (
    <div className={className}>
      {/* Category filters */}
      {showFilters && allCategories.length > 1 && (
        <div className="mb-8 overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {allCategories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {/* Projects grid */}
      <div 
        id="projects-grid"
        className={`grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridCols}`}
      >
        <AnimatePresence mode="wait">
          {visibleProjects.map((project, index) => (
            <OptimizedProjectCard
              key={project.id}
              project={project}
              index={index}
              showViewButton={showViewButton}
              showLiveButton={showLiveButton}
              showGithubButton={showGithubButton}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* No results message */}
      {visibleProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-gray-50 rounded-lg mt-6"
        >
          <h3 className="text-lg font-medium text-gray-800 mb-2">No projects found</h3>
          <p className="text-gray-600">
            No projects match the selected filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => handleCategoryChange('All')}
            className="mt-4"
          >
            View all projects
          </Button>
        </motion.div>
      )}
      
      {/* Load more button */}
      {showLoadMore && canLoadMore && visibleProjects.length > 0 && (
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            className="px-8"
          >
            Load More Projects
          </Button>
        </div>
      )}
    </div>
  );
}

export default OptimizedProjectGrid;