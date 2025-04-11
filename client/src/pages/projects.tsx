import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ProjectsSection } from '@/components/site-settings/ProjectsSection';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';

export default function ProjectsPage() {
  const { settings } = useSiteSettings();
  const siteTitle = settings['site.title'] || 'Portfolio';
  const [, setLocation] = useLocation();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Helmet>
        <title>Projects | {siteTitle}</title>
        <meta name="description" content="Explore the full collection of projects showcasing my work and expertise." />
      </Helmet>
      
      <motion.div 
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex justify-start mb-8">
          <Button 
            onClick={() => setLocation('/')} 
            variant="outline"
            className="flex items-center"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 font-heading">
            My Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the full collection of applications and projects I've built, showcasing my technical skills and creative problem-solving.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <ProjectsSection />
        </motion.div>
        
        <motion.div variants={itemVariants} className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">
            Interested in working together?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects and opportunities. If you have a project in mind, let's talk about how we can bring it to life.
          </p>
          <Link 
            to="/marketing#contact-section" 
            className="inline-flex items-center px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
          >
            Get in Touch
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}