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
                className={`nav-link ${isMobile ? 'block py-3' : ''}`}
                onClick={onItemClick}
              >
                {link.text}
              </Link>
            );
          } else {
            return (
              <a 
                key={index}
                href={link.url} 
                className={`nav-link ${isMobile ? 'block py-3' : ''}`}
                onClick={onItemClick}
              >
                {link.text}
              </a>
            );
          }
        }
        
        // For normal links
        return (
          <Link 
            key={index}
            href={link.url} 
            className={`nav-link ${isMobile ? 'block py-3' : ''}`}
            onClick={onItemClick}
          >
            {link.text}
          </Link>
        );
      })}
    </>
  );
}