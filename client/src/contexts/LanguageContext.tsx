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
  'project.viewDetails': {
    en: 'View Details',
    nl: 'Bekijk Details',
  },
  'project.viewDemo': {
    en: 'View Demo',
    nl: 'Bekijk Demo',
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
  'contact.email': {
    en: 'Email',
    nl: 'E-mail',
  },
  'contact.message': {
    en: 'Message',
    nl: 'Bericht',
  },
  'contact.submit': {
    en: 'Send Message',
    nl: 'Verstuur Bericht',
  },
  'contact.success': {
    en: 'Message sent successfully!',
    nl: 'Bericht succesvol verzonden!',
  },
  
  // Footer
  'footer.copyright': {
    en: 'All Rights Reserved',
    nl: 'Alle Rechten Voorbehouden',
  },
  'footer.language': {
    en: 'Language',
    nl: 'Taal',
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