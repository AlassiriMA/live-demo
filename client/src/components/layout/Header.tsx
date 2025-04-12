import { useState } from "react";
import { Link, useLocation } from "wouter";
import MobileMenu from "./MobileMenu";
import { useSiteSettings, getSetting } from "@/hooks/use-site-settings";
import { SiteAuthor } from "@/components/site-settings/HeroContent";
import { NavigationLinks } from "@/components/site-settings/NavigationLinks";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { t } = useLanguage();

  // Determine if we're on the main page or an app page
  const isAppPage = location !== "/" && location !== "/not-found";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-md bg-opacity-95">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 opacity-90"
        style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative transition-all">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-white relative z-10 transition-transform group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-heading font-bold text-xl text-white transition-all duration-300 group-hover:text-primary/90">
            <SiteAuthor />
          </span>
        </Link>
        
        <nav className="hidden md:flex md:items-center md:space-x-7 header-nav">
          <NavigationLinks isAppPage={isAppPage} />
          <div className="flex items-center ml-3">
            <LanguageSwitcher />
          </div>
        </nav>
        
        <div className="flex items-center">
          <div className="md:hidden mr-2">
            <LanguageSwitcher />
          </div>
          <button 
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors duration-200" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} isAppPage={isAppPage} />
    </header>
  );
}
