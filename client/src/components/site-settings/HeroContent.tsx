import { useSiteSettings, getSetting } from "@/hooks/use-site-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroTitle() {
  const { settings, isLoading } = useSiteSettings("homepage");
  const { t } = useLanguage();
  
  if (isLoading) {
    return <Skeleton className="h-12 w-full" />;
  }
  
  // Use language translation with fallback to database setting
  return <>{t('home.hero.title') || getSetting<string>(settings, "hero.title", "Welcome to My Journey in Tech and Creativity")}</>;
}

export function HeroSubtitle() {
  const { settings, isLoading } = useSiteSettings("homepage");
  
  if (isLoading) {
    return <Skeleton className="h-6 w-full" />;
  }
  
  return <>{getSetting<string>(settings, "hero.subtitle", "Explore a collection of innovative web applications showcasing my skills across different domains")}</>;
}

export function HeroCtaText() {
  const { settings, isLoading } = useSiteSettings("homepage");
  
  if (isLoading) {
    return <Skeleton className="h-5 w-24" />;
  }
  
  return <>{getSetting<string>(settings, "hero.cta", "Explore Projects")}</>;
}

export function AboutTitle() {
  const { settings, isLoading } = useSiteSettings("homepage");
  
  if (isLoading) {
    return <Skeleton className="h-8 w-32" />;
  }
  
  return <>{getSetting<string>(settings, "about.title", "About Me")}</>;
}

export function AboutContent() {
  const { settings, isLoading } = useSiteSettings("homepage");
  
  if (isLoading) {
    return (
      <div className="inline-block w-full">
        <Skeleton className="h-4 w-full my-2" />
        <Skeleton className="h-4 w-full my-2" />
        <Skeleton className="h-4 w-3/4 my-2" />
      </div>
    );
  }
  
  return <>{getSetting<string>(settings, "about.content", "For me, coding is like solving a giant puzzle — and I love every piece of it. It's about turning ideas into reality and using creativity to make things work. Each of these projects is a reflection of my drive to learn, explore, and create solutions.")}</>;
}

export function SiteTitle() {
  const { settings, isLoading } = useSiteSettings("site-info");
  
  if (isLoading) {
    return <Skeleton className="h-6 w-40" />;
  }
  
  return <>{getSetting<string>(settings, "site.title", "Mohammad Alassiri's Portfolio")}</>;
}

export function SiteAuthor() {
  const { settings, isLoading } = useSiteSettings("site-info");
  
  if (isLoading) {
    return <Skeleton className="h-5 w-32" />;
  }
  
  return <>{getSetting<string>(settings, "site.author", "Mohammad A. Alassiri")}</>;
}

export function ContactEmail() {
  const { settings, isLoading } = useSiteSettings("contact");
  
  if (isLoading) {
    return <Skeleton className="h-5 w-32 inline-block" />;
  }
  
  return <>{getSetting<string>(settings, "contact.email", "contact@example.com")}</>;
}

export function ContactPhone() {
  const { settings, isLoading } = useSiteSettings("contact");
  
  if (isLoading) {
    return <Skeleton className="h-5 w-32 inline-block" />;
  }
  
  return <>{getSetting<string>(settings, "contact.phone", "+1234567890")}</>;
}

export function ContactAddress() {
  const { settings, isLoading } = useSiteSettings("contact");
  
  if (isLoading) {
    return <Skeleton className="h-5 w-32 inline-block" />;
  }
  
  return <>{getSetting<string>(settings, "contact.address", "Amsterdam, Netherlands")}</>;
}