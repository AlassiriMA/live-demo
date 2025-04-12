import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define supported languages
export type Language = 'en' | 'nl';

// Translation dictionary type
type TranslationDict = {
  [key: string]: {
    en: string;
    nl: string;
  };
};

// Translation dictionary
const translationData: TranslationDict = {
  // Navigation
  'nav.home': {
    en: 'Home',
    nl: 'Home',
  },
  'nav.apps': {
    en: 'Apps',
    nl: 'Apps',
  },
  'nav.marketing': {
    en: 'Marketing',
    nl: 'Marketing',
  },
  'nav.projects': {
    en: 'Projects',
    nl: 'Projecten',
  },
  'nav.skills': {
    en: 'Skills',
    nl: 'Vaardigheden',
  },
  'nav.about': {
    en: 'About',
    nl: 'Over',
  },
  'nav.contact': {
    en: 'Contact',
    nl: 'Contact',
  },
  
  // Homepage
  'home.hero.title': {
    en: 'Welcome to My Journey in Tech and Creativity',
    nl: 'Welkom bij Mijn Reis in Technologie en Creativiteit',
  },
  'home.hero.subtitle': {
    en: 'Innovative solutions through design and development',
    nl: 'Innovatieve oplossingen door ontwerp en ontwikkeling',
  },
  'home.hero.cta': {
    en: 'Explore Projects',
    nl: 'Verken Projecten',
  },
  'home.about.title': {
    en: 'About Me',
    nl: 'Over Mij',
  },
  'home.about.content': {
    en: "For me, coding is like solving a giant puzzle — and I love every piece of it. It's about turning ideas into reality and using creativity to make things work. Each of these projects is a reflection of my drive to learn, explore, and create solutions.",
    nl: "Voor mij is programmeren als het oplossen van een gigantische puzzel — en ik hou van elk stukje ervan. Het gaat erom ideeën om te zetten in realiteit en creativiteit te gebruiken om dingen te laten werken. Elk van deze projecten is een weerspiegeling van mijn drive om te leren, te ontdekken en oplossingen te creëren."
  },
  'home.projects.title': {
    en: 'Featured Projects',
    nl: 'Uitgelichte Projecten',
  },
  'home.projects.viewAll': {
    en: 'View All Projects',
    nl: 'Bekijk Alle Projecten',
  },
  'home.skills.title': {
    en: 'My Skills',
    nl: 'Mijn Vaardigheden',
  },
  'home.skills.subtitle': {
    en: 'The modern tools and frameworks I use to build robust, scalable, and performant applications.',
    nl: 'De moderne tools en frameworks die ik gebruik om robuuste, schaalbare en performante applicaties te bouwen.',
  },
  'home.contact.title': {
    en: 'Get In Touch',
    nl: 'Neem Contact Op',
  },
  
  // Projects
  'projects.title': {
    en: 'My Projects',
    nl: 'Mijn Projecten',
  },
  'projects.subtitle': {
    en: 'A collection of my work and accomplishments',
    nl: 'Een verzameling van mijn werk en prestaties',
  },
  'projects.pageDescription': {
    en: 'Explore the full collection of applications and projects I\'ve built, showcasing my technical skills and creative problem-solving.',
    nl: 'Ontdek de volledige collectie van applicaties en projecten die ik heb gemaakt, met een showcase van mijn technische vaardigheden en creatieve probleemoplossing.',
  },
  'projects.collaborationTitle': {
    en: 'Interested in working together?',
    nl: 'Interesse in samenwerking?',
  },
  'projects.collaborationText': {
    en: 'I\'m always open to discussing new projects and opportunities. If you have a project in mind, let\'s talk about how we can bring it to life.',
    nl: 'Ik sta altijd open voor het bespreken van nieuwe projecten en mogelijkheden. Als je een project in gedachten hebt, laten we dan praten over hoe we het tot leven kunnen brengen.',
  },
  'projects.getInTouch': {
    en: 'Get in Touch',
    nl: 'Neem Contact Op',
  },
  'project.viewDetails': {
    en: 'View Details',
    nl: 'Bekijk Details',
  },
  'project.viewDemo': {
    en: 'View Demo',
    nl: 'Bekijk Demo',
  },
  'project.noDescription': {
    en: 'No description available',
    nl: 'Geen beschrijving beschikbaar',
  },
  
  // Project Details
  'projects.notFound': {
    en: 'Project Not Found',
    nl: 'Project Niet Gevonden',
  },
  'projects.doesNotExist': {
    en: 'The project you\'re looking for doesn\'t exist or may have been moved.',
    nl: 'Het project dat je zoekt bestaat niet of is mogelijk verplaatst.',
  },
  'projects.backToProjects': {
    en: 'Back to Projects',
    nl: 'Terug naar Projecten',
  },
  'projects.liveDemo': {
    en: 'Live Demo',
    nl: 'Live Demo',
  },
  'projects.overview': {
    en: 'Overview',
    nl: 'Overzicht',
  },
  'projects.keyFeatures': {
    en: 'Key Features',
    nl: 'Belangrijkste Functies',
  },
  'projects.appScreenshots': {
    en: 'App Screenshots',
    nl: 'App Schermafbeeldingen',
  },
  'projects.defaultDescription': {
    en: 'This project provides a comprehensive demonstration of key concepts and technologies. Explore the live demo to see it in action!',
    nl: 'Dit project biedt een uitgebreide demonstratie van belangrijke concepten en technologieën. Bekijk de live demo om het in actie te zien!',
  },
  
  // Skills
  'skills.title': {
    en: 'Skills & Expertise',
    nl: 'Vaardigheden & Expertise',
  },
  'skills.frontend': {
    en: 'Frontend Development',
    nl: 'Frontend Ontwikkeling',
  },
  'skills.backend': {
    en: 'Backend Development',
    nl: 'Backend Ontwikkeling',
  },
  'skills.database': {
    en: 'Database Management',
    nl: 'Database Beheer',
  },
  'skills.design': {
    en: 'UI/UX Design',
    nl: 'UI/UX Ontwerp',
  },
  
  // Contact
  'contact.title': {
    en: 'Contact Me',
    nl: 'Neem Contact Op',
  },
  'contact.name': {
    en: 'Name',
    nl: 'Naam',
  },
  'contact.namePlaceholder': {
    en: 'Your name',
    nl: 'Uw naam',
  },
  'contact.email': {
    en: 'Email',
    nl: 'E-mail',
  },
  'contact.emailPlaceholder': {
    en: 'Your email',
    nl: 'Uw e-mailadres',
  },
  'contact.subject': {
    en: 'Subject',
    nl: 'Onderwerp',
  },
  'contact.subjectPlaceholder': {
    en: 'Your subject',
    nl: 'Uw onderwerp',
  },
  'contact.message': {
    en: 'Message',
    nl: 'Bericht',
  },
  'contact.messagePlaceholder': {
    en: 'Your message',
    nl: 'Uw bericht',
  },
  'contact.submit': {
    en: 'Send Message',
    nl: 'Verstuur Bericht',
  },
  'contact.sending': {
    en: 'Sending...',
    nl: 'Verzenden...',
  },
  'contact.successTitle': {
    en: 'Message Sent!',
    nl: 'Bericht Verzonden!',
  },
  'contact.successMessage': {
    en: 'Thank you for your message. We\'ll get back to you soon.',
    nl: 'Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.',
  },
  'contact.sendAnother': {
    en: 'Send Another Message',
    nl: 'Stuur Nog Een Bericht',
  },
  'contact.errorTitle': {
    en: 'Error',
    nl: 'Fout',
  },
  'contact.errorMessage': {
    en: 'Something went wrong. Please try again.',
    nl: 'Er is iets misgegaan. Probeer het opnieuw.',
  },
  
  // Footer
  'footer.aboutTitle': {
    en: 'About This Portfolio',
    nl: 'Over Deze Portfolio',
  },
  'footer.aboutContent': {
    en: 'A showcase of 10 interactive demo applications built with modern technologies, featuring real database connections and comprehensive content management.',
    nl: 'Een showcase van 10 interactieve demo-applicaties gebouwd met moderne technologieën, met echte databaseverbindingen en uitgebreid contentbeheer.',
  },
  'footer.quickLinksTitle': {
    en: 'Quick Links',
    nl: 'Snelle Links',
  },
  'footer.downloadCV': {
    en: 'Download CV',
    nl: 'CV Downloaden',
  },
  'footer.contactTitle': {
    en: 'Contact',
    nl: 'Contact',
  },
  'footer.newsletterTitle': {
    en: 'Stay Updated',
    nl: 'Blijf op de Hoogte',
  },
  'footer.newsletterText': {
    en: 'Subscribe to receive updates on new projects and features.',
    nl: 'Abonneer je om updates te ontvangen over nieuwe projecten en functies.',
  },
  'footer.emailPlaceholder': {
    en: 'Enter your email',
    nl: 'Voer je e-mailadres in',
  },
  'footer.subscribe': {
    en: 'Subscribe',
    nl: 'Abonneren',
  },
  'footer.copyright': {
    en: 'All Rights Reserved',
    nl: 'Alle Rechten Voorbehouden',
  },
  'footer.language': {
    en: 'Language',
    nl: 'Taal',
  },
  'footer.terms': {
    en: 'Terms & Conditions',
    nl: 'Algemene Voorwaarden',
  },
  'footer.privacy': {
    en: 'Privacy Policy',
    nl: 'Privacybeleid',
  },
  'footer.sitemap': {
    en: 'Sitemap',
    nl: 'Sitemap',
  },
  
  // Common UI elements
  'ui.loading': {
    en: 'Loading...',
    nl: 'Laden...',
  },
  'ui.error': {
    en: 'An error occurred',
    nl: 'Er is een fout opgetreden',
  },
  'ui.back': {
    en: 'Back',
    nl: 'Terug',
  },
  'ui.next': {
    en: 'Next',
    nl: 'Volgende',
  },
  'ui.previous': {
    en: 'Previous',
    nl: 'Vorige',
  },
  'ui.readMore': {
    en: 'Read More',
    nl: 'Lees Meer',
  },
  'ui.viewAll': {
    en: 'View All',
    nl: 'Bekijk Alles',
  },
  'ui.backToHome': {
    en: 'Back to Home',
    nl: 'Terug naar Home',
  },
  
  // Admin
  'admin.dashboard': {
    en: 'Admin Dashboard',
    nl: 'Admin Dashboard',
  },
  'admin.login': {
    en: 'Admin Login',
    nl: 'Admin Inloggen',
  },
  'admin.welcome': {
    en: 'Welcome,',
    nl: 'Welkom,',
  },
  'admin.logout': {
    en: 'Logout',
    nl: 'Uitloggen',
  },
  'admin.projects': {
    en: 'Manage Projects',
    nl: 'Projecten Beheren',
  },
  'admin.media': {
    en: 'Media Library',
    nl: 'Mediabibliotheek',
  },
  'admin.settings': {
    en: 'Settings',
    nl: 'Instellingen',
  },
  'admin.activity': {
    en: 'Activity Logs',
    nl: 'Activiteitenlogboek',
  },
  'admin.createProject': {
    en: 'Create New Project',
    nl: 'Nieuw Project Aanmaken',
  },
  'admin.editProject': {
    en: 'Edit Project',
    nl: 'Project Bewerken',
  },
  'admin.deleteProject': {
    en: 'Delete Project',
    nl: 'Project Verwijderen',
  },
  'admin.uploadMedia': {
    en: 'Upload Media',
    nl: 'Media Uploaden',
  },
  'admin.save': {
    en: 'Save',
    nl: 'Opslaan',
  },
  'admin.cancel': {
    en: 'Cancel',
    nl: 'Annuleren',
  },
  
  // Auth
  'auth.username': {
    en: 'Username',
    nl: 'Gebruikersnaam',
  },
  'auth.password': {
    en: 'Password',
    nl: 'Wachtwoord',
  },
  'auth.login': {
    en: 'Login',
    nl: 'Inloggen',
  },
  'auth.logout': {
    en: 'Logout',
    nl: 'Uitloggen',
  },
  'auth.loginSuccess': {
    en: 'Login successful! Redirecting...',
    nl: 'Succesvol ingelogd! Doorsturen...',
  },
};

// Context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create context with default English language
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

// Props for the provider
interface LanguageProviderProps {
  children: ReactNode;
}

// Language provider component
export function LanguageProvider({ children }: LanguageProviderProps) {
  // Initialize with browser language preference, defaulting to English
  const [language, setLanguage] = useState<Language>('en');

  // Detect browser language on mount
  useEffect(() => {
    const detectLanguage = () => {
      // Get preferred language from browser
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      
      // Check if it's a supported language
      if (browserLang === 'nl') {
        setLanguage('nl');
      } else {
        setLanguage('en');
      }
      
      // Save to localStorage for persistence
      localStorage.setItem('preferredLanguage', browserLang === 'nl' ? 'nl' : 'en');
    };
    
    // First check localStorage for saved preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'nl')) {
      setLanguage(savedLanguage as Language);
    } else {
      detectLanguage();
    }
  }, []);
  
  // Translation function
  const t = (key: string): string => {
    if (!translationData[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translationData[key][language] || translationData[key]['en'] || key;
  };
  
  // Context value
  const value = {
    language,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
    },
    t,
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}