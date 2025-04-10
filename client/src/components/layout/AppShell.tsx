import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import { Loader2 } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [loading, setLoading] = useState(true);

  // Simulate brief page loading for smooth transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Initialize scroll reveal animation on load
    const initScrollReveal = () => {
      const revealElements = document.querySelectorAll('.reveal');
      
      const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach((element) => {
          const elementTop = element.getBoundingClientRect().top;
          if (elementTop < windowHeight - 100) {
            element.classList.add('active');
          }
        });
      };
      
      // Initial check on page load
      revealOnScroll();
      
      // Add scroll event listener
      window.addEventListener('scroll', revealOnScroll);
      
      // Cleanup
      return () => window.removeEventListener('scroll', revealOnScroll);
    };

    // Run after component mounts
    const scrollReveal = initScrollReveal();
    
    return () => {
      clearTimeout(timer);
      if (scrollReveal) scrollReveal();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow flex items-center justify-center"
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="absolute inset-0 h-full w-full animate-pulse-subtle opacity-30 rounded-full blur-md bg-primary" />
            </div>
          </motion.div>
        ) : (
          <motion.main 
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.22, 1, 0.36, 1]  // Custom cubic bezier for smooth animation
            }}
            className="flex-grow animate-fadeIn"
          >
            {children}
          </motion.main>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
