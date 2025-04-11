import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

interface FadeInSectionProps {
  children: ReactNode;
  threshold?: number;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  rootMargin?: string;
  once?: boolean;
  style?: React.CSSProperties;
}

/**
 * A component that fades in its children when scrolled into view
 * For performance optimization, animations only trigger when the component enters the viewport
 */
const FadeInSection = ({
  children,
  threshold = 0.1,
  delay = 0,
  duration = 0.6,
  className = '',
  direction = 'up',
  distance = 30,
  rootMargin = '0px',
  once = true,
  style,
}: FadeInSectionProps) => {
  // Use intersection observer to detect when component is in viewport
  const [ref, isInView] = useIntersectionObserver({
    threshold,
    rootMargin,
    once,
  });
  
  // Determine initial position based on direction
  let initialPosition = {};
  switch (direction) {
    case 'up':
      initialPosition = { y: distance };
      break;
    case 'down':
      initialPosition = { y: -distance };
      break;
    case 'left':
      initialPosition = { x: distance };
      break;
    case 'right':
      initialPosition = { x: -distance };
      break;
    case 'none':
    default:
      initialPosition = {}; // No movement, just fade
  }
  
  // Animation variants
  const variants = {
    hidden: {
      opacity: 0,
      ...initialPosition,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom easing for natural feel
      },
    },
  };
  
  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;