import { useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import SectionHeading from "@/components/ui/section-heading";
import AppCard from "@/components/ui/app-card";
import ContactForm from "@/components/ui/contact-form";
import { apps } from "@/lib/app-data";
import { Link } from "wouter";
import { motion } from "framer-motion";

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
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Smart Software<br />
                <span className="text-[#6366F1]">Smart Solutions</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                A showcase of 7 live business applications — each with unique UI styles, smart architecture, and modern features.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#apps" className="inline-block bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300">
                  Explore Apps
                </a>
                <a href="#about" className="inline-block bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300">
                  Learn More
                </a>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <motion.div 
                    className="app-card h-40 rounded-xl shadow-lg transform rotate-2 bg-white border-t-4 border-[#6366F1]"
                    whileHover={{ y: -5, rotate: 4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  ></motion.div>
                  <motion.div 
                    className="app-card h-40 rounded-xl shadow-lg transform -rotate-2 bg-white border-t-4 border-[#22C55E]"
                    whileHover={{ y: -5, rotate: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  ></motion.div>
                  <motion.div 
                    className="app-card h-40 rounded-xl shadow-lg transform -rotate-3 bg-white border-t-4 border-[#EC4899]"
                    whileHover={{ y: -5, rotate: -6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  ></motion.div>
                  <motion.div 
                    className="app-card h-40 rounded-xl shadow-lg transform rotate-3 bg-white border-t-4 border-[#10B981]"
                    whileHover={{ y: -5, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  ></motion.div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gray-200 rounded-full opacity-50 z-0"></div>
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#818CF8] rounded-full opacity-30 z-0"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Apps Section */}
      <section id="apps" className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Explore All Applications" 
            subtitle="Each application showcases different UI styles, technologies, and business solutions."
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AppCard app={app} index={index} />
              </motion.div>
            ))}
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
                This monorepo showcases 7 live applications that simulate production-ready tools in fintech, retail, commerce, and analytics.
              </p>
              <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                <h3 className="font-heading font-semibold text-lg text-gray-800 mb-4">Tech Stack</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 mr-2 text-[#6366F1]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    React + Vite + TailwindCSS
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 mr-2 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Express + Node.js
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 mr-2 text-[#EC4899]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    TypeScript + Vitest
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 mr-2 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Framer Motion + Shadcn/UI
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="md:w-2/3 md:pl-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#6366F1]/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-800">Responsive Design</h3>
                  </div>
                  <p className="text-gray-600">
                    All applications are built with a mobile-first approach, ensuring they work seamlessly across devices of all sizes.
                  </p>
                </div>
                
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-800">Performance Optimized</h3>
                  </div>
                  <p className="text-gray-600">
                    Carefully optimized for speed and efficiency, with lazy loading, code splitting, and modern best practices.
                  </p>
                </div>
                
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#EC4899]/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#EC4899]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-800">Accessibility</h3>
                  </div>
                  <p className="text-gray-600">
                    WCAG compliant with keyboard navigation, proper contrast ratios, and screenreader support.
                  </p>
                </div>
                
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-800">Modular Architecture</h3>
                  </div>
                  <p className="text-gray-600">
                    Built with a component-based architecture for maximum reusability and maintainability.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-heading font-semibold text-xl text-gray-800 mb-4">
                  Author
                </h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4">
                    <div className="w-full h-full bg-gradient-to-br from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white font-heading font-bold text-xl">
                      MA
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-lg text-gray-800">Mohammad Alassiri</h4>
                    <p className="text-gray-600">Smart software, smart solutions, crafted with care.</p>
                    <a href="https://alassiri.nl" target="_blank" rel="noopener noreferrer" className="text-sm text-[#6366F1] hover:text-[#4F46E5] transition-colors inline-flex items-center mt-1">
                      <span>alassiri.nl</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Get In Touch
            </h2>
            <p className="text-gray-600">
              Have questions about the portfolio or interested in working together? Reach out!
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </AppShell>
  );
}
