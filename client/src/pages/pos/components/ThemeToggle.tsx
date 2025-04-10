import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if user has already set a theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("pos-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark-pos");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark-pos");
      localStorage.setItem("pos-theme", "light");
    } else {
      document.documentElement.classList.add("dark-pos");
      localStorage.setItem("pos-theme", "dark");
    }
    
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-700 relative ${className}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{ x: isDarkMode ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isDarkMode ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3 w-3 text-[#6366F1]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
            />
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3 w-3 text-[#F59E0B]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
        )}
      </motion.div>
    </button>
  );
}