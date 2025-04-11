import { useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  as?: React.ElementType;
}

/**
 * A component that fades in its children when they enter the viewport
 * Uses IntersectionObserver for performance
 */
export function FadeInSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.5,
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
  as: Component = 'div'
}: FadeInSectionProps) {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold,
    rootMargin,
    once
  });
  
  // Determine which direction the animation should come from
  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { y: 0, x: 40 },
    right: { y: 0, x: -40 },
    none: { y: 0, x: 0 }
  };
  
  // Animation variants
  const variants = {
    hidden: {
      opacity: 0,
      y: directionOffset[direction].y,
      x: directionOffset[direction].x
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isIntersecting ? 'visible' : 'hidden'}
      variants={variants}
    >
      {typeof Component === 'string' ? (
        <Component className={className}>{children}</Component>
      ) : (
        <Component>{children}</Component>
      )}
    </motion.div>
  );
}

export default FadeInSection;