import React, { ReactNode } from 'react';
import useViewport from '@/hooks/useViewport';

interface ResponsiveTextProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  baseSize?: number;
  mobileSize?: number;
  tabletSize?: number;
  desktopSize?: number;
  largeDesktopSize?: number;
  mobileLineHeight?: number;
  tabletLineHeight?: number;
  desktopLineHeight?: number;
  largeDesktopLineHeight?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

/**
 * A component that renders text with responsive font sizes
 * based on the current viewport width
 */
export function ResponsiveText({
  children,
  className = '',
  as: Component = 'p',
  baseSize = 16,
  mobileSize,
  tabletSize,
  desktopSize,
  largeDesktopSize,
  mobileLineHeight,
  tabletLineHeight,
  desktopLineHeight,
  largeDesktopLineHeight,
  fontWeight = 'normal'
}: ResponsiveTextProps) {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useViewport();
  
  // Determine font size based on viewport
  let fontSize = baseSize;
  if (isMobile && mobileSize !== undefined) {
    fontSize = mobileSize;
  } else if (isTablet && tabletSize !== undefined) {
    fontSize = tabletSize;
  } else if (isDesktop && desktopSize !== undefined) {
    fontSize = desktopSize;
  } else if (isLargeDesktop && largeDesktopSize !== undefined) {
    fontSize = largeDesktopSize;
  }
  
  // Determine line height based on viewport
  let lineHeight;
  if (isMobile && mobileLineHeight !== undefined) {
    lineHeight = mobileLineHeight;
  } else if (isTablet && tabletLineHeight !== undefined) {
    lineHeight = tabletLineHeight;
  } else if (isDesktop && desktopLineHeight !== undefined) {
    lineHeight = desktopLineHeight;
  } else if (isLargeDesktop && largeDesktopLineHeight !== undefined) {
    lineHeight = largeDesktopLineHeight;
  }
  
  // Map font weight to Tailwind classes
  const fontWeightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };
  
  // Combine styles
  const style: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    ...(lineHeight !== undefined ? { lineHeight } : {}),
  };
  
  // Combine classes
  const combinedClassName = `${fontWeightClasses[fontWeight]} ${className}`;
  
  return (
    <Component className={combinedClassName.trim()} style={style}>
      {children}
    </Component>
  );
}

/**
 * A simplified component that automatically sets responsive 
 * headings based on common typography patterns
 */
export function ResponsiveHeading({
  level = 1,
  children,
  className = '',
  as,
  fontWeight = 'bold'
}: {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
}) {
  // Default heading sizes based on level
  const sizeMap = {
    1: { mobile: 32, tablet: 36, desktop: 42, largeDesktop: 48 },
    2: { mobile: 28, tablet: 32, desktop: 36, largeDesktop: 40 },
    3: { mobile: 24, tablet: 26, desktop: 30, largeDesktop: 32 },
    4: { mobile: 20, tablet: 22, desktop: 24, largeDesktop: 26 },
    5: { mobile: 18, tablet: 20, desktop: 22, largeDesktop: 24 },
    6: { mobile: 16, tablet: 18, desktop: 20, largeDesktop: 22 }
  };
  
  // Line height based on level
  const lineHeightMap = {
    1: { mobile: 1.2, tablet: 1.2, desktop: 1.1, largeDesktop: 1.1 },
    2: { mobile: 1.2, tablet: 1.2, desktop: 1.2, largeDesktop: 1.2 },
    3: { mobile: 1.3, tablet: 1.3, desktop: 1.2, largeDesktop: 1.2 },
    4: { mobile: 1.3, tablet: 1.3, desktop: 1.3, largeDesktop: 1.3 },
    5: { mobile: 1.4, tablet: 1.3, desktop: 1.3, largeDesktop: 1.3 },
    6: { mobile: 1.4, tablet: 1.4, desktop: 1.3, largeDesktop: 1.3 }
  };
  
  // Heading element based on level
  const Component = as || `h${level}` as React.ElementType;
  
  return (
    <ResponsiveText
      as={Component}
      mobileSize={sizeMap[level].mobile}
      tabletSize={sizeMap[level].tablet}
      desktopSize={sizeMap[level].desktop}
      largeDesktopSize={sizeMap[level].largeDesktop}
      mobileLineHeight={lineHeightMap[level].mobile}
      tabletLineHeight={lineHeightMap[level].tablet}
      desktopLineHeight={lineHeightMap[level].desktop}
      largeDesktopLineHeight={lineHeightMap[level].largeDesktop}
      fontWeight={fontWeight}
      className={className}
    >
      {children}
    </ResponsiveText>
  );
}

export default ResponsiveText;