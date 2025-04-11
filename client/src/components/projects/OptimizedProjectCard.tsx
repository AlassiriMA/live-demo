import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LazyImage from '@/components/ui/LazyImage';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

// Using any for now since we don't want to import from schema
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

interface OptimizedProjectCardProps {
  project: Project;
  index: number;
  showViewButton?: boolean;
  showLiveButton?: boolean;
  showGithubButton?: boolean;
  isCompact?: boolean;
}

/**
 * An optimized project card component that:
 * - Lazy loads the project image with proper loading states
 * - Shows animation only when the card enters the viewport
 * - Has hover effects that work well on both desktop and mobile
 * - Adapts layout based on screen size
 * - Provides visual feedback on interactive elements
 */
export function OptimizedProjectCard({
  project,
  index,
  showViewButton = true,
  showLiveButton = true,
  showGithubButton = true,
  isCompact = false
}: OptimizedProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ref, isInView] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    once: true
  });

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <div 
        className={`bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 h-full flex flex-col
          hover:shadow-xl border border-gray-100 
          ${isHovered ? 'ring-2 ring-primary/20' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Project image with optimized loading */}
        <Link href={`/project/${project.slug}`} className="block relative overflow-hidden">
          <div className="aspect-video overflow-hidden bg-gray-100">
            <LazyImage
              src={project.image || '/assets/images/placeholder-image.svg'}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ 
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                aspectRatio: '16/9'
              }}
            />
          </div>
          
          {/* Overlay for hover effect */}
          <div 
            className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Link>
        
        {/* Content section */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Category badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {project.categories?.map((category, i) => (
              <Badge 
                key={i} 
                variant="outline" 
                className="bg-primary/5 text-xs font-medium"
              >
                {category}
              </Badge>
            ))}
          </div>
          
          {/* Title and description */}
          <Link href={`/project/${project.slug}`}>
            <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
              {project.title}
            </h3>
          </Link>
          
          {!isCompact && (
            <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
              {project.description}
            </p>
          )}
          
          {/* Action buttons */}
          <div className="mt-auto pt-4 flex flex-wrap gap-3">
            {showViewButton && (
              <Button
                asChild
                variant="default"
                size="sm"
                className="flex-1"
              >
                <Link href={`/project/${project.slug}`}>
                  View Project
                </Link>
              </Button>
            )}
            
            {showLiveButton && project.liveUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(project.liveUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" /> 
                Live Demo
              </Button>
            )}
            
            {showGithubButton && project.githubUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(project.githubUrl, '_blank')}
              >
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Code
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default OptimizedProjectCard;