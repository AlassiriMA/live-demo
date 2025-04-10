import { useState } from "react";
import { Link, useLocation } from "wouter";
import MobileMenu from "./MobileMenu";
import { useSiteSettings, getSetting } from "@/hooks/use-site-settings";
import { SiteAuthor } from "@/components/site-settings/HeroContent";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // Determine if we're on the main page or an app page
  const isAppPage = location !== "/" && location !== "/not-found";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="font-heading font-bold text-xl text-gray-800">
            <SiteAuthor />
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="nav-link text-gray-800 hover:text-gray-600 font-medium">
            Home
          </Link>
          {isAppPage ? (
            <Link href="/#apps" className="nav-link text-gray-800 hover:text-gray-600 font-medium">
              All Apps
            </Link>
          ) : (
            <a href="#apps" className="nav-link text-gray-800 hover:text-gray-600 font-medium">
              Apps
            </a>
          )}
          <Link href="/skills" className="nav-link text-gray-800 hover:text-gray-600 font-medium">
            Skills
          </Link>
          <Link href="/blog" className="nav-link text-gray-800 hover:text-gray-600 font-medium">
            Blog
          </Link>
          {isAppPage ? (
            <Link href="/#about" className="nav-link text-gray-800 hover:text-gray-600 font-medium">
              About
            </Link>
          ) : (
            <a href="#about" className="nav-link text-gray-800 hover:text-gray-600 font-medium">
              About
            </a>
          )}
          {isAppPage ? (
            <Link href="/#contact" className="nav-link text-gray-800 hover:text-gray-600 font-medium">
              Contact
            </Link>
          ) : (
            <a href="#contact" className="nav-link text-gray-800 hover:text-gray-600 font-medium">
              Contact
            </a>
          )}
        </nav>
        
        <button 
          className="md:hidden text-gray-800" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isAppPage={isAppPage} />
    </header>
  );
}
