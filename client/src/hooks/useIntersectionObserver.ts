import { useState, useEffect, useRef, RefObject, MutableRefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  initialInView?: boolean;
}

/**
 * Custom hook that detects when an element enters the viewport using the Intersection Observer API
 * 
 * @param options Configuration options for the Intersection Observer
 * @returns A tuple containing [ref, isInView, entry] where:
 *   - ref: Ref to attach to the target element
 *   - isInView: Boolean indicating whether the element is in view
 *   - entry: The IntersectionObserverEntry for the most recent change
 */
function useIntersectionObserver<T extends Element>({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  once = false,
  initialInView = false,
}: IntersectionObserverOptions = {}): [
  RefObject<T>,
  boolean,
  IntersectionObserverEntry | null
] {
  const [isInView, setIsInView] = useState<boolean>(initialInView);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  
  // Use a ref to store the element we want to observe
  const ref = useRef<T>(null);
  
  // Use another ref to store whether we've already triggered for "once" mode
  const triggered = useRef<boolean>(false);
  
  useEffect(() => {
    // Get the element from our ref
    const element = ref.current;
    
    // If there's no element or we've already triggered in "once" mode, bail out
    if (!element || (once && triggered.current)) return;
    
    // Initialize the intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state with the latest entry
        const isVisible = entry.isIntersecting;
        setIsInView(isVisible);
        setEntry(entry);
        
        // If it's visible and we're in "once" mode, mark as triggered
        // and disconnect the observer (cleanup)
        if (isVisible && once) {
          triggered.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );
    
    // Start observing the element
    observer.observe(element);
    
    // Cleanup function to disconnect observer when component unmounts
    // or dependencies change
    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, once]);
  
  // Return the ref to attach to the element, plus visibility state
  return [ref, isInView, entry];
}

export default useIntersectionObserver;