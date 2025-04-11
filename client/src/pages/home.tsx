import { useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import SectionHeading from "@/components/ui/section-heading";
import AppCard from "@/components/ui/app-card";
import ContactForm from "@/components/ui/contact-form";
import TechIconsGrid from "@/components/ui/tech-icons-grid";
import { Button } from "@/components/ui/button";
import { apps } from "@/lib/app-data";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  HeroTitle, 
  HeroSubtitle, 
  HeroCtaText, 
  AboutTitle, 
  AboutContent, 
  ContactEmail,
  ContactPhone,
  ContactAddress
} from "@/components/site-settings/HeroContent";
import { ProjectsSection } from "@/components/site-settings/ProjectsSection";

export default function Home() {
  // Add smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href') || '';
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80,
            behavior: 'smooth'
          });
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <AppShell>
      {/* Modern Hero Section with enhanced visuals and animations */}
      <section className="py-24 md:pt-32 md:pb-28 overflow-hidden relative">
        {/* Background layer with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-indigo-50 z-0"></div>
        
        {/* Background pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        
        {/* Accent colors and blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Top right color accent */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-primary/30 to-indigo-100 opacity-30 blur-3xl"></div>
          
          {/* Bottom left color accent */}
          <div className="absolute bottom-0 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-100 to-blue-100/50 opacity-30 blur-3xl"></div>
          
          {/* Animated orbs */}
          <motion.div 
            className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-indigo-200/30 to-purple-200/30 opacity-30 blur-3xl"
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          ></motion.div>
          
          <motion.div 
            className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-200/20 to-indigo-200/20 opacity-30 blur-3xl"
            animate={{ 
              y: [0, 20, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 1
            }}
          ></motion.div>
        </div>
        
        {/* Main content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left content column */}
            <div className="lg:w-1/2 mb-16 lg:mb-0 lg:pr-10">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary mr-2"></span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Full-Stack Developer
                  </span>
                </div>
              </motion.div>
              
              {/* Main title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 relative">
                    <HeroTitle />
                    
                    {/* Underline decoration */}
                    <motion.svg
                      className="absolute left-0 -bottom-2 w-full h-3 text-indigo-200 opacity-80"
                      viewBox="0 0 358 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                    >
                      <path
                        d="M2 8C50.6667 3.33333 299.4 -3.8 356 8"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </motion.svg>
                  </span>
                </h1>
              </motion.div>
              
              {/* Subtitle */}
              <motion.div 
                className="text-lg md:text-xl text-gray-700 mb-6 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <HeroSubtitle />
              </motion.div>
              
              {/* Description */}
              <motion.div 
                className="text-base text-gray-600 mb-8 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AboutContent />
              </motion.div>
              
              {/* Action buttons with enhanced design */}
              <motion.div 
                className="flex flex-wrap gap-5 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <a 
                  href="#apps" 
                  className="relative inline-flex items-center justify-center overflow-hidden group"
                >
                  <div className="absolute inset-0 w-full h-full -mt-1 rounded-lg bg-gradient-to-br from-primary to-indigo-600 opacity-80 group-hover:opacity-100 blur-sm transition-all duration-500 group-hover:blur"></div>
                  <span 
                    className="relative inline-flex items-center gap-2 bg-white dark:bg-gray-900 text-primary border border-indigo-200 hover:border-indigo-300 font-semibold py-3 px-8 rounded-lg shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <HeroCtaText />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </a>
                
                <a 
                  href="#about" 
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-primary font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </motion.div>
              
              {/* Enhanced stats/metrics bar */}
              <motion.div 
                className="flex flex-wrap gap-8 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur-sm p-3 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">10+</div>
                    <div className="text-sm text-gray-500">Live Projects</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur-sm p-3 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">15+</div>
                    <div className="text-sm text-gray-500">Technologies</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 rounded-xl bg-white/80 backdrop-blur-sm p-3 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">Full-Stack</div>
                    <div className="text-sm text-gray-500">Development</div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Right column with project cards showcase */}
            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* 3D-like stacked cards effect */}
              <div className="relative">
                {/* Card stack with perspective */}
                <div className="perspective-1000">
                  <div className="grid grid-cols-2 gap-6">
                    {apps.slice(0, 4).map((app, index) => (
                      <Link key={index} href={`/project/${app.id}`}>
                        <motion.div 
                          className="relative h-56 rounded-2xl shadow-xl overflow-hidden bg-white group cursor-pointer transform-gpu"
                          style={{ 
                            transformStyle: 'preserve-3d',
                            transform: `rotate${index % 2 ? 'X' : 'Y'}(${index % 2 ? 3 : -3}deg) rotate(${index % 2 ? 1 : -1}deg)`
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            rotate: 0,
                            rotateX: 0,
                            rotateY: 0,
                            z: 30,
                            transition: { duration: 0.5, type: "spring", stiffness: 300 }
                          }}
                        >
                          {/* Top colored bar */}
                          <div 
                            className="absolute top-0 inset-x-0 h-1.5 z-20"
                            style={{ 
                              background: `linear-gradient(to right, ${app.primaryColor || '#6366F1'}, ${app.secondaryColor || '#818cf8'})`
                            }}
                          />
                          
                          {/* Card background and image */}
                          <div className="absolute inset-0 overflow-hidden">
                            {app.imageUrl ? (
                              <>
                                <img 
                                  src={app.imageUrl} 
                                  alt={app.name}
                                  className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 transition-opacity group-hover:opacity-80"></div>
                              </>
                            ) : (
                              <div 
                                className="absolute inset-0 w-full h-full flex items-center justify-center"
                                style={{ 
                                  background: `linear-gradient(135deg, ${app.primaryColor || '#6366F1'}40, ${app.secondaryColor || '#818cf8'}90)`,
                                }}
                              >
                                <svg 
                                  className="h-16 w-16 text-white/60" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* Text content */}
                          <div className="absolute inset-0 p-5 z-10 flex flex-col justify-end">
                            <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-4">
                              <h3 className="text-xl font-bold font-heading text-white mb-1 drop-shadow-sm">
                                {app.name}
                              </h3>
                              <div className="h-0.5 w-12 bg-primary mb-3 transform origin-left scale-0 transition-all duration-300 group-hover:scale-100"></div>
                              <div className="flex gap-2 mb-3 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                {app.tags.slice(0, 2).map((tag, idx) => (
                                  <span 
                                    key={idx} 
                                    className="text-xs px-2 py-1 rounded-full text-white font-medium backdrop-blur-md"
                                    style={{ 
                                      backgroundColor: `${app.primaryColor || '#6366F1'}80`,
                                      backdropFilter: 'blur(4px)'
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-white/80 opacity-0 transform translate-y-2 transition-all duration-300 delay-75 group-hover:opacity-100 group-hover:translate-y-0">
                                <span>View Project</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-10 right-0 w-40 h-40 bg-gradient-to-tl from-indigo-100 to-transparent opacity-70 z-0 blur-3xl rounded-full"></div>
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-100 to-transparent opacity-70 z-0 blur-3xl rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Apps Section */}
      <section id="apps" className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Explore My Projects" 
            subtitle="Each project is a story — showcasing the work I've done and what makes it unique."
            centered
          />

          <ProjectsSection />
        </div>
      </section>
      
      {/* Skills Section with moving icons - moved after projects as requested */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <TechIconsGrid />
          </motion.div>
        </div>
      </section>

      {/* Marketing Section */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-purple-50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute -top-20 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 opacity-20 filter blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-20 filter blur-3xl"></div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 mb-10 lg:mb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                Transform Your Business<br />
                <span className="text-[#EC4899]">With Digital Marketing</span>
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                Experience our AI-powered marketing platform with data-driven strategies, engaging content, and conversion-focused campaigns.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/marketing">
                  <a className="bg-[#EC4899] hover:bg-[#DB2777] text-white px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center">
                    Explore Marketing Platform
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </Link>
              </div>
              
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Advanced Analytics</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="font-medium">AI Chatbot</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Email Campaigns</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <span className="font-medium">SEO Optimization</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="glass-bg p-8 rounded-3xl shadow-lg">
                <div className="relative h-64 mb-4 overflow-hidden rounded-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#EC4899]/20 to-purple-500/20 backdrop-blur-sm rounded-xl -z-10"></div>
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Chatbot</h3>
                      <p className="text-gray-700">Chat with our intelligent marketing assistant for instant insights and service information.</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">Lead Generation</span>
                      <div className="text-[#EC4899] font-bold">+43%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#EC4899] h-2 rounded-full w-5/12"></div>
                    </div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">Conversion Rate</span>
                      <div className="text-[#EC4899] font-bold">24.5%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#EC4899] h-2 rounded-full w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start">
            <div className="md:w-1/3 mb-8 md:mb-0">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                About The Portfolio
              </h2>
              <div className="w-20 h-1 bg-[#6366F1] mb-6"></div>
              <p className="text-gray-600 mb-6">
                This comprehensive portfolio showcases 10 professional live demo applications spanning fintech, retail, education, marketing, beauty, social media, and analytics. Each application features modern UI/UX, real database connections, and full-stack functionality.
              </p>
              <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                <h3 className="font-heading font-semibold text-lg text-gray-800 mb-4">Tech Stack</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 mr-2 text-[#6366F1]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    React + TypeScript + TailwindCSS
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 mr-2 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Express + PostgreSQL + Drizzle ORM
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 mr-2 text-[#EC4899]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Docker + NGINX + CI/CD Pipeline
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 mr-2 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Framer Motion + Shadcn/UI + GSAP
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 mr-2 text-[#0EA5E9]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    JWT Authentication + Content Management
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="md:w-2/3 md:pl-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#6366F1]/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-800">Advanced UI/UX</h3>
                  </div>
                  <p className="text-gray-600">
                    All applications feature modern UI/UX with beautiful animations, responsive design, and intuitive interactions across all device sizes.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-800">Database Integration</h3>
                  </div>
                  <p className="text-gray-600">
                    Full PostgreSQL database integration with Drizzle ORM, ensuring persistent data storage, complex queries, and robust data relationships.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#EC4899]/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-800">Admin Dashboard</h3>
                  </div>
                  <p className="text-gray-600">
                    Comprehensive content management with an admin dashboard for real-time updates, CRUD operations, and user management via JWT authentication.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-800">Deployment Ready</h3>
                  </div>
                  <p className="text-gray-600">
                    Complete deployment infrastructure with Docker containerization, NGINX configuration, health monitoring, and CI/CD pipeline for Oracle VPS.
                  </p>
                </motion.div>
              </div>
              

            </div>
          </div>
        </div>
      </section>
      
      {/* About Me and Contact Section (Combined in one row) */}
      <section id="about-me" className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* About Me Column */}
            <div className="lg:w-1/2">
              <motion.div 
                className="h-full bg-white p-6 rounded-xl shadow-md border border-gray-100"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                    <img 
                      src="/assets/images/profile.jpeg" 
                      alt="Mohammad Alassiri" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white font-heading font-bold text-2xl">
                            MA
                          </div>
                        `;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading text-2xl font-bold mb-3 text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#EC4899]">
                      About Me
                    </h2>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center md:text-left">Mohammad A. Alassiri</h3>
                    <p className="text-gray-700 font-medium text-center md:text-left text-sm">Full-Stack Developer, Problem Solver, Entrepreneur</p>
                    <p className="text-gray-600 mt-3 text-sm">
                      For me, coding is like solving a puzzle — turning ideas into reality with creativity. I build applications that are functional, beautiful and intuitive.
                    </p>
                    <p className="text-gray-600 mt-2 text-sm">
                      I'm passionate about pushing boundaries and constantly evolving as a developer. When I'm building, I'm crafting experiences that matter.
                    </p>
                    <div className="mt-4 flex items-center space-x-3 justify-center md:justify-start">
                      <a 
                        href="https://alassiri.nl" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300 inline-flex items-center text-sm"
                      >
                        <span>Visit Website</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Let's Connect Column */}
            <div id="contact" className="lg:w-1/2">
              <motion.div 
                className="h-full bg-white p-6 rounded-xl shadow-md border border-gray-100"
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading text-2xl font-bold mb-3 text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Let's Connect
                </h2>
                <p className="text-gray-700 mb-4 text-sm">
                  Feel free to reach out if you'd like to collaborate, chat about a project, or just want to say hi. 
                  I'm always open to learning new things and collaborating on cool ideas.
                </p>
                
                <div className="mb-6 space-y-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                      <a href="tel:+31610979730" className="text-gray-800 font-medium">+316 1097 9730</a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email Address</p>
                      <a href="mailto:me@alassiri.nl" className="text-gray-800 font-medium">me@alassiri.nl</a>
                    </div>
                  </div>
                </div>
                
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
