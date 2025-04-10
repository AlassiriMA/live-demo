import { Helmet } from 'react-helmet-async';
import { useSiteSettings, getSetting } from '@/hooks/use-site-settings';

interface SeoMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  pagePath?: string;
}

export function SeoMetaTags({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  pagePath = ''
}: SeoMetaTagsProps) {
  const { settings: seoSettings, isLoading } = useSiteSettings('seo');
  
  if (isLoading) {
    return null;
  }
  
  const siteTitle = getSetting<string>(seoSettings, 'seo.title', 'Alassiri Portfolio - Live Demo Apps');
  const siteDescription = getSetting<string>(seoSettings, 'seo.description', 'A showcase of 10 live business applications — each with unique UI styles, smart architecture, and modern features.');
  const siteKeywords = getSetting<string>(seoSettings, 'seo.keywords', 'portfolio, web development, full stack, react, nodejs, applications');
  const siteImage = getSetting<string>(seoSettings, 'seo.image', '');
  const siteUrl = getSetting<string>(seoSettings, 'seo.url', '');
  
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const pageDescription = description || siteDescription;
  const pageKeywords = keywords || siteKeywords;
  const pageImage = ogImage || siteImage;
  const pageUrl = pagePath ? `${siteUrl}${pagePath}` : siteUrl;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={ogType} />
      {pageUrl && <meta property="og:url" content={pageUrl} />}
      {pageImage && <meta property="og:image" content={pageImage} />}
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {pageImage && <meta name="twitter:image" content={pageImage} />}
      
      {/* Fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    </Helmet>
  );
}