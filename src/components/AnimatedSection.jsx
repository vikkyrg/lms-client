import React, { useEffect, useRef, useState } from 'react';

/**
 * AnimatedSection: Reusable scroll-triggered viewport reveal container.
 * - Uses Intersection Observer with threshold & rootMargin.
 * - Graceful fallback: Content remains visible if JS or Observer is unsupported.
 * - Stays visible once revealed (unobserves to prevent jarring loops).
 */
export const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  direction = 'up', // 'up' | 'none'
  threshold = 0.1,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
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
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentEl = domRef.current;
    if (currentEl) observer.observe(currentEl);

    return () => {
      if (currentEl) observer.unobserve(currentEl);
      observer.disconnect();
    };
  }, [threshold]);

  const transitionStyle = {
    transitionDuration: '600ms',
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
  };

  const transformClass =
    direction === 'up'
      ? isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-6'
      : isVisible
      ? 'opacity-100'
      : 'opacity-0';

  return (
    <div
      ref={domRef}
      style={transitionStyle}
      className={`transition-all ${transformClass} will-change-transform ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;

