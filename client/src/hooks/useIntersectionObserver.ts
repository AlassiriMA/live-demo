import { useState, useEffect, useRef, RefObject } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

/**
 * A hook that observes when an element enters the viewport
 * 
 * @param options IntersectionObserver options plus 'once' to disconnect after first intersection
 * @returns [ref, isIntersecting, entry] tuple with ref to attach to the element
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>({
  root = null,
  rootMargin = '0px',
  threshold = 0,
  once = false
}: IntersectionObserverOptions = {}): [RefObject<T>, boolean, IntersectionObserverEntry | null] {
  const ref = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Save observer reference to disconnect later
    let observer: IntersectionObserver;
    
    // Create the observer instance
    const observerCallback: IntersectionObserverCallback = (entries, obs) => {
      entries.forEach(entry => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);
        
        // If configured to observe only once and the element is visible, disconnect
        if (once && entry.isIntersecting) {
          obs.disconnect();
        }
      });
    };

    observer = new IntersectionObserver(observerCallback, {
      root,
      rootMargin,
      threshold
    });

    // Start observing
    observer.observe(node);

    // Clean up observer on unmount
    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, once]);

  return [ref, isIntersecting, entry];
}

export default useIntersectionObserver;