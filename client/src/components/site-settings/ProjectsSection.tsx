import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { apps } from "@/lib/app-data";

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
      // Generate slightly different pastel colors for each tag
      const hues = [342, 360, 280, 220, 180, 160];
      const hue = hues[idx % hues.length];
      
      return (
        <span 
          key={idx} 
          className="text-xs px-3 py-1 rounded-full text-white font-medium shadow-sm"
          style={{ 
            backgroundColor: `hsla(${hue}, 80%, 60%, 0.85)`,
            backdropFilter: 'blur(4px)',
            boxShadow: `0 2px 5px hsla(${hue}, 80%, 40%, 0.2)`
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
  const imageUrl = project.imageUrl || (matchingApp?.imageUrl || "");
  const slug = project.slug || matchingApp?.id || `project-${index}`;
  
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
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        style={{ 
          borderTopColor: primaryColor, 
          borderTopWidth: '4px',
          background: `linear-gradient(to bottom right, white, ${primaryColor}05)`
        }}
      >
        {/* Project Image - Show placeholder gradient background if image not available */}
        <Link href={detailRoute}>
          <div className="mb-4 overflow-hidden rounded-lg h-40 bg-gray-100 shadow-inner relative group cursor-pointer">
            {imageUrl ? (
              <>
                <img 
                  src={imageUrl} 
                  alt={`${name} preview`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    console.log("Image failed to load:", imageUrl);
                    // If image fails to load, replace with gradient background
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('image-fallback');
                  }}
                />
                {/* Add a debugging message */}
                <div className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-2 py-1 hidden">
                  {imageUrl}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                  <span className="text-white font-medium pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 px-4 py-1 rounded-full text-sm">
                    View Details
                  </span>
                </div>
              </>
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${primaryColor}40, ${primaryColor}90)`,
                }}
              >
                <div className="text-white text-center p-4">
                  <div className="text-3xl mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div className="font-medium">View Details</div>
                </div>
              </div>
            )}
          </div>
        </Link>
        
        <div className="flex items-center mb-4">
          <Link href={detailRoute}>
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 text-white cursor-pointer transform transition-transform hover:scale-110 hover:shadow-md"
              style={{ backgroundColor: primaryColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </Link>
          <Link href={detailRoute}>
            <h3 className="font-heading text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
              {name}
            </h3>
          </Link>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {description ? 
            (description.length > 120 ? 
              `${description.substring(0, 120)}...` : 
              description
            ) : 
            "No description available"
          }
        </p>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {renderTags()}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Details Link */}
            <Link 
              href={detailRoute} 
              className="inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            
            {/* Live Demo Link */}
            <Link 
              href={demoRoute} 
              className="inline-flex items-center text-sm font-medium px-3 py-1.5 rounded-md"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor
              }}
            >
              Demo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <Skeleton className="w-12 h-12 rounded-lg mr-4" />
            <Skeleton className="h-6 w-32" />
          </div>
          
          <div className="mb-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}