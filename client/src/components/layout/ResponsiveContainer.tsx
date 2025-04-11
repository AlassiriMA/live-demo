import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centerContent?: boolean;
  as?: React.ElementType;
}

/**
 * A responsive container component that:
 * - Sets proper max-width constraints based on screen size
 * - Handles consistent padding across screen sizes
 * - Optionally centers its content
 * - Can render as any HTML element or component
 */
export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'lg',
  padding = 'md',
  centerContent = false,
  as: Component = 'div'
}: ResponsiveContainerProps) {
  // Map max-width options to Tailwind classes
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
    none: ''
  };

  // Map padding options to Tailwind classes
  const paddingClasses = {
    none: '',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 md:px-8',
    lg: 'px-4 sm:px-8 md:px-12 lg:px-16'
  };

  // Combine classes based on props
  const containerClasses = `
    w-full
    ${maxWidthClasses[maxWidth]}
    ${paddingClasses[padding]}
    ${centerContent ? 'mx-auto' : ''}
    ${className}
  `;

  return (
    <Component className={containerClasses.trim()}>
      {children}
    </Component>
  );
}

export default ResponsiveContainer;