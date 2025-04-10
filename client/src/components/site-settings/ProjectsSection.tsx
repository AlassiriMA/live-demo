import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { apps } from "@/lib/app-data";

export function ProjectsSection() {
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
    
    // Display app-based projects as a fallback when API fails
    const appProjects = apps.map((app, i) => {
      // First create a partial object with the correct types
      const project: Partial<Project> = {
        id: i + 1,
        name: app.name,
        slug: app.id,
        description: app.description,
        style: app.style,
        primaryColor: app.primaryColor,
        secondaryColor: app.secondaryColor,
        accentColor: app.accentColor,
        imageUrl: app.imageUrl,
        categoryId: 1,
        tags: app.tags.join(', '),
        route: app.route,
        published: true,
        featured: i < 3,
        sortOrder: i,
        detailedContent: app.description,
        metaTitle: app.name,
        metaDescription: app.description,
        features: [],
        screenshots: [],
        status: "published",
        createdBy: null,
        updatedBy: null,
        // Use proper Date objects for date fields
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Type assertion after creating partial object
      return project as Project;
    });
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {appProjects.map((project, index) => (
          <ProjectCard 
            key={index} 
            project={project} 
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

function ProjectCard({ project, index }: { project: Project, index: number }) {
  // Find a matching app from our app data or use default values
  const appInfo = apps.find(app => app.id === project.slug) || {
    id: project.id.toString(),
    name: project.name || "Project",
    description: project.description || "",
    route: `/project/${project.slug}`,
    primaryColor: "#6366F1",
    secondaryColor: "#A5B4FC",
    style: "Modern",
    accentColor: "#4F46E5",
    imageUrl: "",
    tags: project.tags ? project.tags.split(',').map(tag => tag.trim()) : []
  };

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
          
          <Link 
            href={`/project/${project.slug}`} 
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
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