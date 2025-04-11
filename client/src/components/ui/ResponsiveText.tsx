import { ReactNode } from 'react';
import useViewport from '@/hooks/useViewport';

interface ResponsiveTextProps {
  children: ReactNode;
  textMobile?: ReactNode;
  textTablet?: ReactNode;
  textDesktop?: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  truncate?: boolean;
  lines?: { 
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

/**
 * A component for responsive text that:
 * - Changes content based on screen size
 * - Allows for different truncation on different devices
 * - Renders with appropriate semantic HTML tag
 * - Can be styled with custom classes
 */
const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  textMobile,
  textTablet,
  textDesktop,
  className = '',
  as: Tag = 'p',
  truncate = false,
  lines = {},
}) => {
  const { isMobile, isTablet, isDesktop } = useViewport();
  
  // Determine which text to show based on viewport
  const textToShow = 
    (isMobile && textMobile !== undefined) ? textMobile :
    (isTablet && textTablet !== undefined) ? textTablet :
    (isDesktop && textDesktop !== undefined) ? textDesktop :
    children;
  
  // Determine line clamping based on viewport
  const lineClamp = 
    isMobile && lines.mobile ? `line-clamp-${lines.mobile}` :
    isTablet && lines.tablet ? `line-clamp-${lines.tablet}` :
    isDesktop && lines.desktop ? `line-clamp-${lines.desktop}` :
    '';
  
  // Calculate classes
  const textClasses = [
    className,
    truncate ? 'truncate' : '',
    lineClamp,
  ].filter(Boolean).join(' ');
  
  return (
    <Tag className={textClasses}>
      {textToShow}
    </Tag>
  );
};

export default ResponsiveText;