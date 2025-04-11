export { default as ResourcePreloader } from './ResourcePreloader';
export { default as LazyImage } from '../ui/LazyImage';
export { default as ResponsiveImage } from '../ui/ResponsiveImage';
export { default as ResponsiveText } from '../ui/ResponsiveText';
export { default as ResponsiveContainer } from '../ui/ResponsiveContainer';
export { default as FadeInSection } from '../ui/FadeInSection';
export { default as NetworkStatusNotification } from '../layout/NetworkStatusNotification';
export { default as ScrollToTop } from '../layout/ScrollToTop';
export { default as OptimizedProjectCard } from '../projects/OptimizedProjectCard';
export { default as OptimizedProjectGrid } from '../projects/OptimizedProjectGrid';

// Also export the hooks
export { default as useIntersectionObserver } from '../../hooks/useIntersectionObserver';
export { default as useViewport } from '../../hooks/useViewport';
export { default as useOptimizedImages } from '../../hooks/useOptimizedImages';

// And the utilities
export * from '../../lib/performanceUtils';
export * from '../../lib/networkUtils';
export * from '../../lib/preloadUtils';