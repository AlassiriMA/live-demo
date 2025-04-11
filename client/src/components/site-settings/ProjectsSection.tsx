import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedSkeleton } from "@/components/ui/animated-skeleton";
import { apps } from "@/lib/app-data";
import { getProjectImage } from "@/lib/project-images";

export function ProjectsSection() {
  // Define simplified Project type for display purposes only
  type DisplayProject = {
    id: number;
    name: string;
    slug: string;
    description: string;
    primaryColor?: string | null;
    secondaryColor?: string | null;
    accentColor?: string | null;
    imageUrl?: string | null;
    tags?: string | string[];
    route?: string;
    published?: boolean;
    featured?: boolean;
  };

  const { data, isLoading, error } = useQuery<{success: boolean, projects: Project[]}>({
    queryKey: ['/api/projects/published'],
    refetchOnWindowFocus: false,
  });
  
  const projects = data?.projects || [];

  if (isLoading) {
    return <ProjectsSkeletonGrid />;
  }

  if (error) {
    console.error("Error loading projects:", error);
    
    // Use simplified project type for fallback display
    const appProjects: DisplayProject[] = apps.map((app, i) => ({
      id: i + 1,
      name: app.name,
      slug: app.id,
      description: app.description,
      primaryColor: app.primaryColor,
      secondaryColor: app.secondaryColor,
      accentColor: app.accentColor,
      imageUrl: app.imageUrl,
      tags: app.tags.join(', '),
      route: app.route,
      published: true,
      featured: i < 3
    }));
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {appProjects.map((project, index) => (
          <ProjectCard 
            key={index} 
            project={project as any} 
            index={index} 
          />
        ))}
      </div>
    );
  }

  if (!projects?.length) {
    // Use simplified project type for fallback display
    const appProjects: DisplayProject[] = apps.map((app, i) => ({
      id: i + 1,
      name: app.name,
      slug: app.id,
      description: app.description,
      primaryColor: app.primaryColor,
      secondaryColor: app.secondaryColor,
      accentColor: app.accentColor,
      imageUrl: app.imageUrl,
      tags: app.tags.join(', '),
      route: app.route,
      published: true,
      featured: i < 3
    }));
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {appProjects.map((project, index) => (
          <ProjectCard 
            key={index} 
            project={project as any} 
            index={index} 
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {projects.map((project, index) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          index={index} 
        />
      ))}
    </div>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  // Get matching app data if available
  const matchingApp = apps.find(app => app.id === project.slug);
  
  // Prepare tag display based on the type of tags (string or array)
  const renderTags = () => {
    let tagsToRender: string[] = [];
    
    // If project has tags as string (from database)
    if (project.tags && typeof project.tags === 'string') {
      tagsToRender = project.tags.split(',').map((t: string) => t.trim()).slice(0, 3);
    } 
    // If project has tags as array
    else if (project.tags && Array.isArray(project.tags)) {
      tagsToRender = project.tags.slice(0, 3);
    } 
    // Fallback to app data tags if available
    else if (matchingApp && Array.isArray(matchingApp.tags)) {
      tagsToRender = matchingApp.tags.slice(0, 3);
    }
    
    return tagsToRender.map((tag, idx) => {
      // Create a consistent but varied hash color based on tag content
      const tagHash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hue = (tagHash % 360);
      
      return (
        <span 
          key={idx} 
          className="text-xs px-3 py-1 rounded-full font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          style={{ 
            backgroundColor: `hsla(${hue}, 85%, 95%, 1)`,
            backdropFilter: 'blur(4px)',
            color: `hsl(${hue}, 70%, 40%)`,
            border: `1px solid hsla(${hue}, 70%, 70%, 0.3)`,
            boxShadow: `0 2px 5px hsla(${hue}, 60%, 50%, 0.1)`
          }}
        >
          {tag}
        </span>
      );
    });
  };
  
  // Get values with fallbacks
  const name = project.name || (matchingApp?.name || "Project");
  const description = project.description || (matchingApp?.description || "");
  const primaryColor = project.primaryColor || (matchingApp?.primaryColor || "#6366F1");
  const secondaryColor = project.secondaryColor || (matchingApp?.secondaryColor || "#4F46E5");
  const accentColor = project.accentColor || (matchingApp?.accentColor || "#818cf8");
  const slug = project.slug || matchingApp?.id || `project-${index}`;
  
  // Try to get the SVG image first, then fall back to the URL in the project or app data
  const imageUrl = getProjectImage(slug, project.imageUrl || (matchingApp?.imageUrl || ""));
  
  // The detail route should always go to the project details page
  const detailRoute = `/project/${slug}`;
  
  // The demo route is for the actual application
  const demoRoute = project.route || (matchingApp?.route || `/project/${slug}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col h-full"
    >
      <div 
        className="group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full hover:shadow-xl transition-all duration-500 hover:translate-y-[-5px]"
        style={{ 
          boxShadow: `0 10px 40px -12px ${primaryColor}30`
        }}
      >
        {/* Accent top border with gradient */}
        <div 
          className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl z-10 overflow-hidden"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, ${accentColor})`
          }}
        />
        
        {/* Project Image - Show placeholder gradient background if image not available */}
        <Link href={detailRoute}>
          <div className="overflow-hidden rounded-t-2xl h-48 relative group cursor-pointer">
            {imageUrl ? (
              <>
                <img 
                  src={imageUrl} 
                  alt={`${name} preview`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:saturate-[1.15]"
                  onError={(e) => {
                    console.log("Image failed to load:", imageUrl);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('image-fallback');
                  }}
                />
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 opacity-70 group-hover:opacity-90 transition-all duration-300 flex items-end p-4"
                >
                  <span className="text-white font-medium px-4 py-2 rounded-full text-sm bg-black/50 backdrop-blur-md opacity-70 group-hover:opacity-100 transition-all duration-500 transform scale-95 group-hover:scale-100">
                    View Project Details
                  </span>
                </div>
              </>
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}50, ${secondaryColor}80)`,
                }}
              >
                <div className="text-white text-center p-4">
                  <div className="text-3xl mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="font-medium text-white/90">View Details</div>
                </div>
              </div>
            )}
          </div>
        </Link>
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start mb-3">
            <Link href={detailRoute} className="mr-4">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md transform transition-all group-hover:scale-110 group-hover:rotate-3 duration-500"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 4px 10px -2px ${primaryColor}50`,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </Link>
            <Link href={detailRoute}>
              <h3 className="font-heading text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-300 leading-tight">
                {name}
              </h3>
            </Link>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed mb-5 flex-grow">
            {description ? 
              (description.length > 110 ? 
                `${description.substring(0, 110)}...` : 
                description
              ) : 
              "No description available"
            }
          </p>
          
          <div className="flex flex-wrap gap-2 mb-5">
            {renderTags()}
          </div>
          
          <div className="mt-auto flex items-center gap-3 pt-1">
            {/* Details Link */}
            <Link 
              href={detailRoute} 
              className="inline-flex items-center text-sm font-medium px-4 py-2 rounded-md bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            
            {/* Live Demo Link */}
            <Link 
              href={demoRoute} 
              className="flex-1 inline-flex items-center justify-center text-sm font-medium px-4 py-2 rounded-md shadow-sm transition-all duration-200"
              style={{
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                color: 'white',
                boxShadow: `0 4px 10px -3px ${primaryColor}40`
              }}
            >
              Live Demo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectsSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {Array(6).fill(0).map((_, i) => (
        <div 
          key={i} 
          className="relative bg-white/90 rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full overflow-hidden"
        >
          {/* Top colored border */}
          <div className="absolute top-0 inset-x-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 z-10" />
          
          {/* Wrapper with shimmer effect */}
          <AnimatedSkeleton 
            animation="combined" 
            className="absolute inset-0"
            delay={i * 0.1}
            showProgress={true}
          />
          
          {/* Image placeholder */}
          <AnimatedSkeleton
            size="custom"
            animation="shimmer"
            className="w-full h-48 rounded-t-2xl"
            delay={i * 0.15}
          />
          
          <div className="p-6 flex-1 flex flex-col">
            {/* Title and icon area */}
            <div className="flex items-start mb-3">
              <AnimatedSkeleton
                size="custom"
                animation="pulse"
                className="w-10 h-10 rounded-lg mr-4"
                delay={i * 0.2}
              />
              <AnimatedSkeleton
                size="md" 
                width="8rem"
                animation="pulse"
                delay={i * 0.2}
              />
            </div>
            
            {/* Description lines */}
            <div className="mb-5">
              <AnimatedSkeleton
                size="sm"
                fullWidth
                className="mb-2"
                animation="wave"
                delay={i * 0.25}
              />
              <AnimatedSkeleton
                size="sm"
                fullWidth
                className="mb-2"
                animation="wave"
                delay={i * 0.3}
              />
              <AnimatedSkeleton
                size="sm"
                width="75%"
                animation="wave"
                delay={i * 0.35}
              />
            </div>
            
            {/* Tags */}
            <div className="flex gap-2 mb-5">
              <AnimatedSkeleton
                size="sm"
                rounded="full"
                width="4rem"
                animation="pulse"
                delay={i * 0.4}
              />
              <AnimatedSkeleton
                size="sm"
                rounded="full"
                width="4rem"
                animation="pulse"
                delay={i * 0.45}
              />
              <AnimatedSkeleton
                size="sm"
                rounded="full"
                width="4rem"
                animation="pulse"
                delay={i * 0.5}
              />
            </div>
            
            {/* Action buttons */}
            <div className="mt-auto flex items-center gap-3 pt-1">
              <AnimatedSkeleton
                size="md"
                width="5rem"
                animation="pulse"
                className="rounded-md"
                delay={i * 0.55}
              />
              <AnimatedSkeleton
                size="md"
                fullWidth
                animation="pulse"
                className="rounded-md"
                delay={i * 0.6}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}