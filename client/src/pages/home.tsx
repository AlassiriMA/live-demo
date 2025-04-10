import { useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import SectionHeading from "@/components/ui/section-heading";
import AppCard from "@/components/ui/app-card";
import ContactForm from "@/components/ui/contact-form";
import TechIconsGrid from "@/components/ui/tech-icons-grid";
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
      {/* Enhanced Hero Section with better visual and animations */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-indigo-50 overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-100 opacity-50"></div>
          <div className="absolute top-1/3 -left-12 w-64 h-64 rounded-full bg-purple-100 opacity-40"></div>
          <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-full bg-blue-100 opacity-30"></div>
          
          {/* Animated gradient circles */}
          <motion.div 
            className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-200 to-indigo-300 opacity-20 blur-xl"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
          <motion.div 
            className="absolute top-20 right-10 w-64 h-64 rounded-full bg-gradient-to-r from-purple-200 to-indigo-200 opacity-20 blur-xl"
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, -10, 0]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          ></motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 mb-16 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="px-4 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700 inline-block mb-4">
                  Full-Stack Developer
                </span>
              </motion.div>
              
              <motion.h1 
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  <HeroTitle />
                </span>
              </motion.h1>
              
              <motion.div 
                className="text-lg md:text-xl text-gray-700 mb-6 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <HeroSubtitle />
              </motion.div>
              
              <motion.div 
                className="text-lg text-gray-600 mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <AboutContent />
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <a 
                  href="#apps" 
                  className="inline-block bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-8 rounded-lg shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <HeroCtaText />
                </a>
                <a 
                  href="#about-me" 
                  className="inline-block bg-white hover:bg-gray-50 text-indigo-700 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl border border-indigo-100 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Learn More
                </a>
              </motion.div>
              
              {/* Social proof indicators */}
              <motion.div 
                className="mt-10 flex items-center space-x-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-indigo-700">10+</span>
                  <span className="text-sm text-gray-600">Projects</span>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-indigo-700">15+</span>
                  <span className="text-sm text-gray-600">Technologies</span>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-indigo-700">Full-Stack</span>
                  <span className="text-sm text-gray-600">Development</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right column with project cards showcase */}
            <motion.div 
              className="md:w-1/2 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative">
                {/* Main grid of project cards */}
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {apps.slice(0, 4).map((app, index) => (
                    <Link key={index} href={`/project/${app.id}`}>
                      <motion.div 
                        className="app-card h-48 rounded-xl shadow-xl group relative overflow-hidden"
                        style={{ 
                          transform: `rotate(${index % 2 === 0 ? 2 : -2}deg)`,
                          borderTopWidth: '4px', 
                          borderTopColor: app.primaryColor || '#6366F1',
                          background: `linear-gradient(to bottom right, white, ${app.primaryColor || '#6366F1'}15)`
                        }}
                        whileHover={{ 
                          y: -10, 
                          rotate: index % 2 === 0 ? 4 : -4,
                          transition: { type: "spring", stiffness: 300 }
                        }}
                      >
                        {/* Image overlay with fading gradient */}
                        {app.imageUrl && (
                          <div className="absolute inset-0 w-full h-full">
                            <img 
                              src={app.imageUrl} 
                              alt={app.name}
                              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent"></div>
                          </div>
                        )}
                        
                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{app.name}</h3>
                          <div className="flex gap-2 mb-2">
                            {app.tags.slice(0, 2).map((tag, idx) => (
                              <span 
                                key={idx} 
                                className="text-xs px-2 py-1 rounded-full text-white font-medium"
                                style={{ backgroundColor: app.primaryColor || '#6366F1' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full opacity-80 z-0 blur-md"></div>
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-purple-200 rounded-full opacity-60 z-0 blur-md"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Skills Section with moving icons */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <SectionHeading
              title="Technology Expertise"
              subtitle="A glimpse at the diverse set of technologies I work with"
              centered
            />
            <TechIconsGrid />
          </motion.div>
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
                    <div className="w-full h-full bg-gradient-to-br from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white font-heading font-bold text-2xl">
                      MA
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-heading text-2xl font-bold mb-3 text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#EC4899]">
                      About Me
                    </h2>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center md:text-left">Mohammad Alassiri</h3>
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
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
