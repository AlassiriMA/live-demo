import { motion } from 'framer-motion';
import * as SiIcons from 'react-icons/si';
import { FaDatabase, FaServer, FaMobile, FaDesktop, FaGlobe, FaLaptopCode } from 'react-icons/fa';
import { SiJavascript, SiPython, SiReact, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiTailwindcss, SiTypescript, SiNextdotjs } from 'react-icons/si';
import { FaDocker, FaAws } from 'react-icons/fa';
import { TbApi, TbBrandVite } from 'react-icons/tb';
import { BsGearFill } from 'react-icons/bs';

interface TechStackItem {
  name: string;
  icon: string;
  type?: 'frontend' | 'backend' | 'database' | 'devops' | 'tool' | 'language';
  url?: string;
}

interface TechStackGridProps {
  technologies: TechStackItem[];
  grouped?: boolean;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLinks?: boolean;
}

// Type guard function to check if an icon exists in SiIcons
const hasSiIcon = (iconName: string): iconName is keyof typeof SiIcons => {
  return iconName in SiIcons;
};

// Get the appropriate icon component based on tech name
const getTechIcon = (tech: TechStackItem) => {
  // Check if the icon is provided and exists in SiIcons
  if (tech.icon && hasSiIcon(tech.icon)) {
    const IconComponent = SiIcons[tech.icon];
    return <IconComponent className="h-full w-full" />;
  }

  // Fallback based on tech name (case insensitive)
  const lowerTechName = tech.name.toLowerCase();

  // Common technologies
  if (lowerTechName.includes('react')) return <SiReact />;
  if (lowerTechName.includes('node')) return <SiNodedotjs />;
  if (lowerTechName.includes('express')) return <SiExpress />;
  if (lowerTechName.includes('mongodb')) return <SiMongodb />;
  if (lowerTechName.includes('postgres')) return <SiPostgresql />;
  if (lowerTechName.includes('tailwind')) return <SiTailwindcss />;
  if (lowerTechName.includes('typescript')) return <SiTypescript />;
  if (lowerTechName.includes('javascript')) return <SiJavascript />;
  if (lowerTechName.includes('python')) return <SiPython />;
  if (lowerTechName.includes('next')) return <SiNextdotjs />;
  if (lowerTechName.includes('docker')) return <FaDocker />;
  if (lowerTechName.includes('aws')) return <FaAws />;
  if (lowerTechName.includes('api')) return <TbApi />;
  if (lowerTechName.includes('vite')) return <TbBrandVite />;

  // Fallback icon based on type
  switch (tech.type) {
    case 'frontend':
      return <FaDesktop />;
    case 'backend':
      return <FaServer />;
    case 'database':
      return <FaDatabase />;
    case 'devops':
      return <FaLaptopCode />;
    case 'language':
      return <FaGlobe />;
    case 'tool':
    default:
      return <BsGearFill />;
  }
};

// Get color based on tech type
const getTechColor = (tech: TechStackItem) => {
  const type = tech.type || 'tool';
  
  switch (type) {
    case 'frontend':
      return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    case 'backend':
      return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
    case 'database':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
    case 'devops':
      return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' };
    case 'language':
      return { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' };
    case 'tool':
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
  }
};

// Main component
export function TechStackGrid({
  technologies,
  grouped = false,
  showLabels = true,
  size = 'medium',
  showLinks = false,
}: TechStackGridProps) {
  // Size mapping
  const sizeClasses = {
    small: { container: 'p-2', icon: 'h-5 w-5', text: 'text-xs' },
    medium: { container: 'p-3', icon: 'h-6 w-6', text: 'text-sm' },
    large: { container: 'p-4', icon: 'h-8 w-8', text: 'text-base' },
  };

  // Early return if no technologies
  if (!technologies || technologies.length === 0) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center text-gray-500">
        No technologies specified
      </div>
    );
  }

  // Helper function to create tech item
  const renderTechItem = (tech: TechStackItem, index: number) => {
    const colors = getTechColor(tech);
    const iconComponent = getTechIcon(tech);
    
    const content = (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`flex flex-col items-center justify-center rounded-lg border ${colors.border} ${colors.bg} ${sizeClasses[size].container} hover:shadow-md transition-all duration-300 gap-2`}
        style={{ minWidth: showLabels ? '80px' : '60px' }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className={`${colors.text} ${sizeClasses[size].icon}`}>
          {iconComponent}
        </div>
        {showLabels && (
          <span className={`${colors.text} font-medium text-center truncate max-w-full ${sizeClasses[size].text}`}>
            {tech.name}
          </span>
        )}
      </motion.div>
    );

    // If URL is provided and links should be shown, wrap in anchor tag
    if (tech.url && showLinks) {
      return (
        <a
          key={`${tech.name}-${index}`}
          href={tech.url}
          target="_blank"
          rel="noopener noreferrer"
          className="outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
        >
          {content}
        </a>
      );
    }

    return <div key={`${tech.name}-${index}`}>{content}</div>;
  };

  // Group technologies by type if grouped is true
  if (grouped) {
    const groupedTech: Record<string, TechStackItem[]> = {};
    
    // Group technologies by type
    technologies.forEach(tech => {
      const type = tech.type || 'other';
      if (!groupedTech[type]) {
        groupedTech[type] = [];
      }
      groupedTech[type].push(tech);
    });

    // Get human-readable group names
    const getGroupTitle = (type: string) => {
      switch (type) {
        case 'frontend': return 'Frontend';
        case 'backend': return 'Backend';
        case 'database': return 'Database';
        case 'devops': return 'DevOps';
        case 'language': return 'Languages';
        case 'tool': return 'Tools';
        default: return 'Other';
      }
    };

    // Render grouped tech stack
    return (
      <div className="space-y-6">
        {Object.entries(groupedTech).map(([type, techs]) => (
          <div key={type} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">{getGroupTitle(type)}</h3>
            <div className="flex flex-wrap gap-3">
              {techs.map((tech, index) => renderTechItem(tech, index))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render flat tech stack
  return (
    <div className="flex flex-wrap gap-3">
      {technologies.map((tech, index) => renderTechItem(tech, index))}
    </div>
  );
}