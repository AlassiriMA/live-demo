import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useSiteSettings, getSetting } from "@/hooks/use-site-settings";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker, HiDocumentDownload } from "react-icons/hi";
import { Skeleton } from "@/components/ui/skeleton";

interface FooterLink {
  text: string;
  url: string;
}

export default function Footer() {
  const { settings: footerSettings, isLoading: isFooterLoading } = useSiteSettings("footer");
  const { settings: contactSettings, isLoading: isContactLoading } = useSiteSettings("contact");
  const { settings: socialSettings, isLoading: isSocialLoading } = useSiteSettings("social");

  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  
  useEffect(() => {
    if (!isFooterLoading) {
      try {
        const links = getSetting<string>(footerSettings, "footer.links", "[]");
        setFooterLinks(typeof links === 'string' ? JSON.parse(links) : links);
      } catch (error) {
        console.error("Error parsing footer links:", error);
        setFooterLinks([]);
      }
    }
  }, [footerSettings, isFooterLoading]);

  const isLoading = isFooterLoading || isContactLoading || isSocialLoading;
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">About This Portfolio</h3>
            <p className="text-gray-600 mb-4 text-sm">
              A showcase of 10 interactive demo applications built with modern technologies, 
              featuring real database connections and comprehensive content management.
            </p>
            <div className="flex space-x-4 footer-social">
              <a 
                href={getSetting<string>(socialSettings, "social.github", "#")} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub size={22} />
              </a>
              <a 
                href={getSetting<string>(socialSettings, "social.linkedin", "#")} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={22} />
              </a>
              <a 
                href={getSetting<string>(socialSettings, "social.twitter", "#")} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter size={22} />
              </a>
            </div>
          </div>
          
          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2 footer-links">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => (
                  <li key={i} className="flex items-center">
                    <div><Skeleton className="h-4 w-24" /></div>
                  </li>
                ))
              ) : (
                <>
                  {footerLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.url}>
                        {link.text}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a 
                      href="/assets/documents/resume.pdf" 
                      download 
                      className="flex items-center text-[#6366F1] hover:text-[#4F46E5] transition-colors"
                    >
                      <HiDocumentDownload className="mr-1" size={18} />
                      Download CV
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-3 footer-contact">
              <li>
                <HiMail className="mr-2 text-gray-500" size={18} />
                {isLoading ? (
                  <div><Skeleton className="h-4 w-32" /></div>
                ) : (
                  <span>{getSetting<string>(contactSettings, "contact.email", "")}</span>
                )}
              </li>
              <li>
                <HiPhone className="mr-2 text-gray-500" size={18} />
                {isLoading ? (
                  <div><Skeleton className="h-4 w-32" /></div>
                ) : (
                  <span>{getSetting<string>(contactSettings, "contact.phone", "")}</span>
                )}
              </li>
              <li>
                <HiLocationMarker className="mr-2 text-gray-500" size={18} />
                {isLoading ? (
                  <div><Skeleton className="h-4 w-32" /></div>
                ) : (
                  <span>{getSetting<string>(contactSettings, "contact.address", "")}</span>
                )}
              </li>
            </ul>
          </div>
          
          {/* Newsletter Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Subscribe to receive updates on new projects and features.
            </p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
              />
              <button 
                type="submit" 
                className="bg-[#6366F1] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#4F46E5] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          {isLoading ? (
            <Skeleton className="h-4 w-64 mb-4 md:mb-0" />
          ) : (
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              {getSetting<string>(footerSettings, "footer.copyright", "© 2025 All rights reserved.")}
            </p>
          )}
          <div className="flex space-x-6">
            <a href="/terms" className="text-gray-600 hover:text-[#6366F1] text-sm transition-colors">Terms & Conditions</a>
            <a href="/privacy" className="text-gray-600 hover:text-[#6366F1] text-sm transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}