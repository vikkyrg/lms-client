import { useEffect, useRef, useState } from 'react';

/**
 * useInView: Lightweight Intersection Observer hook for scroll-triggered reveals.
 * - Triggers once when the element enters the viewport, then stops observing.
 * - Graceful fallback: reports visible immediately if IntersectionObserver is unsupported.
 * - Respects the user's prefers-reduced-motion setting (content shows instantly).
 */
export const useInView = ({ threshold = 0.12, rootMargin = '0px 0px -40px 0px' } = {}) => {
  const domRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Already revealed — nothing left to observe
    if (isVisible) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold, rootMargin }
    );

    const currentEl = domRef.current;
    if (currentEl) observer.observe(currentEl);

    return () => {
      if (currentEl) observer.unobserve(currentEl);
      observer.disconnect();
    };
  }, [threshold, rootMargin, isVisible]);

  return [domRef, isVisible];
};

export default useInView;
