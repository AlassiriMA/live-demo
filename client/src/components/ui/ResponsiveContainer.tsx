import { ReactNode, CSSProperties } from 'react';
import useViewport from '@/hooks/useViewport';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
  maxWidth?: {
    mobile?: string | number;
    tablet?: string | number;
    desktop?: string | number;
  };
  padding?: {
    mobile?: string | number;
    tablet?: string | number;
    desktop?: string | number;
  };
  margin?: {
    mobile?: string | number;
    tablet?: string | number;
    desktop?: string | number;
  };
}

/**
 * A responsive container component that:
 * - Adapts dimensions based on device size
 * - Supports custom padding and margin per breakpoint
 * - Can be rendered as any HTML element
 * - Maintains consistent spacing on all device sizes
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  style = {},
  as: Tag = 'div',
  maxWidth = {
    mobile: '100%',
    tablet: '90%',
    desktop: '1200px',
  },
  padding = {
    mobile: '1rem',
    tablet: '2rem',
    desktop: '2rem',
  },
  margin = {
    mobile: '0 auto',
    tablet: '0 auto',
    desktop: '0 auto',
  },
}) => {
  const { isMobile, isTablet } = useViewport();
  
  // Determine the current breakpoint
  const currentMaxWidth = isMobile 
    ? maxWidth.mobile 
    : isTablet 
      ? maxWidth.tablet 
      : maxWidth.desktop;
  
  const currentPadding = isMobile 
    ? padding.mobile 
    : isTablet 
      ? padding.tablet 
      : padding.desktop;
  
  const currentMargin = isMobile 
    ? margin.mobile 
    : isTablet 
      ? margin.tablet 
      : margin.desktop;
  
  // Combine styles
  const containerStyle: CSSProperties = {
    maxWidth: currentMaxWidth,
    padding: currentPadding,
    margin: currentMargin,
    ...style,
  };
  
  return (
    <Tag className={className} style={containerStyle}>
      {children}
    </Tag>
  );
};

export default ResponsiveContainer;