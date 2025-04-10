import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useSiteSettings, getSetting } from "@/hooks/use-site-settings";
import { Skeleton } from "@/components/ui/skeleton";

interface NavLink {
  text: string;
  url: string;
  isAnchor?: boolean;
}

interface NavigationLinksProps {
  isAppPage?: boolean;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export function NavigationLinks({ isAppPage = false, isMobile = false, onItemClick }: NavigationLinksProps) {
  const { settings, isLoading } = useSiteSettings("navigation");
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  
  useEffect(() => {
    if (!isLoading) {
      try {
        const links = getSetting<string>(settings, "navigation.links", "[]");
        const parsedLinks = typeof links === 'string' ? JSON.parse(links) : links;
        
        // Only update state if we actually have links
        if (Array.isArray(parsedLinks) && parsedLinks.length > 0) {
          setNavLinks(parsedLinks);
        } else {
          // Fallback to default links if empty or not an array
          setDefaultLinks();
        }
      } catch (error) {
        console.error("Error parsing navigation links:", error);
        setDefaultLinks();
      }
    }
  }, [settings, isLoading]);

  // Set up default navigation links as a fallback
  const setDefaultLinks = () => {
    setNavLinks([
      { text: "Home", url: "/" },
      { text: "Apps", url: "#apps", isAnchor: true },
      { text: "Projects", url: "/projects" },
      { text: "Skills", url: "/skills" },
      { text: "Blog", url: "/blog" },
      { text: "About", url: "#about", isAnchor: true },
      { text: "Contact", url: "#contact", isAnchor: true }
    ]);
  };

  // Show skeleton loaders while loading
  if (isLoading) {
    return (
      <>
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className={`${isMobile ? 'py-3' : ''}`}>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </>
    );
  }

  // If we somehow still don't have any links, use defaults
  if (!navLinks || navLinks.length === 0) {
    setDefaultLinks();
    return null; // Render nothing this render cycle
  }

  return (
    <>
      {navLinks.map((link, index) => {
        // For anchor links, we need to handle special cases when on app pages
        if (link.isAnchor) {
          if (isAppPage) {
            return (
              <Link 
                key={index}
                href={`/${link.url}`} 
                className={`nav-link relative ${isMobile ? 'block py-3 text-lg font-medium px-2' : ''} group font-medium overflow-hidden`}
                onClick={onItemClick}
              >
                <span className="relative z-10">
                  {link.text}
                  <span className="hidden lg:inline-block ml-1 text-primary/70 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/40 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>
            );
          } else {
            return (
              <a 
                key={index}
                href={link.url} 
                className={`nav-link relative ${isMobile ? 'block py-3 text-lg font-medium px-2' : ''} group font-medium overflow-hidden`}
                onClick={onItemClick}
              >
                <span className="relative z-10">
                  {link.text}
                  <span className="hidden lg:inline-block ml-1 text-primary/70 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/40 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </a>
            );
          }
        }
        
        // For normal links
        return (
          <Link 
            key={index}
            href={link.url} 
            className={`nav-link relative ${isMobile ? 'block py-3 text-lg font-medium px-2' : ''} group font-medium overflow-hidden`}
            onClick={onItemClick}
          >
            <span className="relative z-10">
              {link.text}
              <span className="hidden lg:inline-block ml-1 text-primary/70 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">→</span>
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/40 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
          </Link>
        );
      })}
    </>
  );
}