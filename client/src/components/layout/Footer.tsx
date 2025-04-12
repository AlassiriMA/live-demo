import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useSiteSettings, getSetting } from "@/hooks/use-site-settings";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker, HiDocumentDownload } from "react-icons/hi";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface FooterLink {
  text: string;
  url: string;
}

export default function Footer() {
  const { t } = useLanguage();
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
    <footer className="relative border-t border-gray-200 overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      
      <div className="container mx-auto px-4 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* About Column - Takes 4 columns on large screens */}
          <div className="lg:col-span-4">
            <h3 className="text-xl font-bold text-gray-800 mb-5 font-heading">{t('footer.aboutTitle') || "About This Portfolio"}</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              {t('footer.aboutContent') || "A showcase of 10 interactive demo applications built with modern technologies, featuring real database connections and comprehensive content management."}
            </p>
            <div className="flex space-x-5 footer-social">
              <a 
                href={getSetting<string>(socialSettings, "social.github", "#")} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="bg-white p-2.5 rounded-full shadow-sm text-gray-700 hover:text-primary hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaGithub size={18} />
              </a>
              <a 
                href={getSetting<string>(socialSettings, "social.linkedin", "#")} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="bg-white p-2.5 rounded-full shadow-sm text-gray-700 hover:text-primary hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaLinkedin size={18} />
              </a>
              <a 
                href={getSetting<string>(socialSettings, "social.twitter", "#")} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="bg-white p-2.5 rounded-full shadow-sm text-gray-700 hover:text-primary hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <FaTwitter size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links Column - Takes 3 columns on large screens */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-gray-800 mb-5 font-heading">{t('footer.quickLinksTitle') || "Quick Links"}</h3>
            <ul className="space-y-3 footer-links">
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
                      <Link href={link.url} className="text-gray-600 hover:text-primary transition-colors duration-300 group flex items-center">
                        <span className="absolute w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2"></span>
                        <span className="group-hover:translate-x-5 transition-transform duration-300">{link.text}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a 
                      href="/assets/documents/resume.pdf" 
                      download 
                      className="flex items-center text-primary hover:text-primary-dark transition-colors duration-300 font-medium"
                    >
                      <HiDocumentDownload className="mr-2" size={18} />
                      {t('footer.downloadCV') || "Download CV"}
                    </a>
                  </li>
                  <li>
                    <Link href="/admin" className="text-gray-600 hover:text-primary transition-colors duration-300 group flex items-center">
                      <span className="absolute w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300 opacity-0 group-hover:opacity-100 mr-0 group-hover:mr-2"></span>
                      <span className="group-hover:translate-x-5 transition-transform duration-300">{t('admin.dashboard') || "Admin Dashboard"}</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          {/* Contact Column - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-800 mb-5 font-heading">{t('footer.contactTitle') || "Contact"}</h3>
            <ul className="space-y-4 footer-contact">
              <li className="flex items-start">
                <span className="bg-white p-2 rounded-full shadow-sm text-primary mr-3 flex-shrink-0">
                  <HiMail size={16} />
                </span>
                {isLoading ? (
                  <div><Skeleton className="h-4 w-32" /></div>
                ) : (
                  <span className="text-gray-600 text-sm">{getSetting<string>(contactSettings, "contact.email", "")}</span>
                )}
              </li>
              <li className="flex items-start">
                <span className="bg-white p-2 rounded-full shadow-sm text-primary mr-3 flex-shrink-0">
                  <HiPhone size={16} />
                </span>
                {isLoading ? (
                  <div><Skeleton className="h-4 w-32" /></div>
                ) : (
                  <span className="text-gray-600 text-sm">{getSetting<string>(contactSettings, "contact.phone", "")}</span>
                )}
              </li>
              <li className="flex items-start">
                <span className="bg-white p-2 rounded-full shadow-sm text-primary mr-3 flex-shrink-0">
                  <HiLocationMarker size={16} />
                </span>
                {isLoading ? (
                  <div><Skeleton className="h-4 w-32" /></div>
                ) : (
                  <span className="text-gray-600 text-sm">{getSetting<string>(contactSettings, "contact.address", "")}</span>
                )}
              </li>
            </ul>
          </div>
          
          {/* Newsletter Column - Takes 3 columns on large screens */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-gray-800 mb-5 font-heading">{t('footer.newsletterTitle') || "Stay Updated"}</h3>
            <p className="text-gray-600 mb-5 text-sm">
              {t('footer.newsletterText') || "Subscribe to receive updates on new projects and features."}
            </p>
            <form className="relative">
              <input 
                type="email" 
                placeholder={t('footer.emailPlaceholder') || "Enter your email"} 
                className="w-full px-5 py-3 rounded-lg bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 pr-[105px]"
              />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1.5 bg-gradient-to-r from-primary to-primary-dark text-white font-medium py-1.5 px-4 rounded-md hover:shadow-md transition-all duration-300"
              >
                {t('footer.subscribe') || "Subscribe"}
              </button>
            </form>
          </div>
        </div>
        
        {/* Divider with elegant styling */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-white px-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          {isLoading ? (
            <Skeleton className="h-5 w-64 mb-4 md:mb-0" />
          ) : (
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              {getSetting<string>(footerSettings, "footer.copyright", "© 2025 All rights reserved.")}
            </p>
          )}
          <div className="flex space-x-8">
            <a href="/terms" className="text-gray-500 hover:text-primary text-sm transition-colors duration-300">{t('footer.terms') || "Terms & Conditions"}</a>
            <a href="/privacy" className="text-gray-500 hover:text-primary text-sm transition-colors duration-300">{t('footer.privacy') || "Privacy Policy"}</a>
            <a href="/sitemap" className="text-gray-500 hover:text-primary text-sm transition-colors duration-300">{t('footer.sitemap') || "Sitemap"}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}