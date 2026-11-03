import React from 'react';
import { useInView } from '../hooks/useInView';

/**
 * AnimatedSection: Reusable scroll-triggered viewport reveal container.
 * - Uses the shared useInView Intersection Observer hook (triggers once, stays revealed).
 * - Graceful fallback: Content remains visible if JS or Observer is unsupported.
 * - Respects prefers-reduced-motion: content shows immediately without movement.
 */
export const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  direction = 'up', // 'up' | 'none'
  threshold = 0.1,
  ...props
}) => {
  const [domRef, isVisible] = useInView({ threshold });

  const transitionStyle = {
    transitionDuration: '700ms',
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
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

