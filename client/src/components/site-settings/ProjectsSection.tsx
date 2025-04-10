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
    tags?: string;
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
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-700">No projects available yet</h3>
        <p className="text-gray-500 mt-2">Check back soon for exciting projects!</p>
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
  // Find a matching app from our app data or use default values
  const appInfo = apps.find(app => app.id === project.slug) || {
    id: project.id?.toString() || "0",
    name: project.name || "Project",
    description: project.description || "",
    route: project.route || `/project/${project.slug}`,
    primaryColor: project.primaryColor || "#6366F1",
    secondaryColor: project.secondaryColor || "#A5B4FC",
    style: project.style || "Modern",
    accentColor: project.accentColor || "#4F46E5",
    imageUrl: project.imageUrl || "",
    tags: project.tags ? project.tags.split(',').map((tag: string) => tag.trim()) : []
  };

  // Get actual route to use - prefer route from project if available, then from app info
  const demoRoute = project.route || appInfo.route;
  const imageUrl = project.imageUrl || appInfo.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="flex flex-col h-full"
    >
      <div 
        className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
        style={{ borderTopColor: appInfo.primaryColor, borderTopWidth: '4px' }}
      >
        {/* Project Image - Show if available */}
        {imageUrl && (
          <div className="mb-4 overflow-hidden rounded-lg h-40 bg-gray-100">
            <img 
              src={imageUrl} 
              alt={`${project.name} preview`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        
        <div className="flex items-center mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 text-white"
            style={{ backgroundColor: appInfo.primaryColor }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-heading text-lg font-semibold text-gray-800">
            {project.name}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {project.description ? 
            (project.description.length > 120 ? 
              `${project.description.substring(0, 120)}...` : 
              project.description
            ) : 
            "No description available"
          }
        </p>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {project.tags && project.tags.split(',').slice(0, 3).map((tag: string, idx: number) => (
              <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {tag.trim()}
              </span>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Details Link */}
            <Link 
              href={`/project/${project.slug}`} 
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            
            {/* Live Demo Link */}
            <Link 
              href={demoRoute} 
              className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Demo
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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