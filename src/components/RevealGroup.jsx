import React from 'react';
import { useInView } from '../hooks/useInView';

export const REVEAL_ITEM_CLASS = 'reveal-group-item';

/**
 * RevealGroup: Reusable scroll-triggered staggered reveal container for card collections.
 * - Single IntersectionObserver watches the whole group; child elements marked with
 *   the REVEAL_ITEM_CLASS class ("reveal me" children) fade in and move up sequentially
 *   from left to right with a small per-item stagger delay.
 * - Triggers once and stays visible (no hide/reveal loops on scroll up/down).
 * - Graceful fallback: content stays visible if JS or Observer is unsupported
 *   (hidden state is applied only after the observer is active).
 * - Movement and stagger are neutralized via CSS for prefers-reduced-motion and mobile.
 */
export const RevealGroup = ({
  children,
  className = '',
  stagger = 100, // ms delay between successive cards
  maxStaggerItems = 6, // cap so late cards in long lists don't wait too long
  threshold = 0.12,
  as: Tag = 'div',
  ...props
}) => {
  const [domRef, isVisible] = useInView({ threshold });

  return (
    <Tag
      ref={domRef}
      data-reveal-group={isVisible ? 'visible' : 'pending'}
      className={`reveal-group ${isVisible ? 'reveal-group-visible' : 'reveal-group-pending'} ${className}`}
      style={isVisible ? undefined : { contain: 'layout paint' }}
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        const childClassName = child.props.className || '';
        return React.cloneElement(child, {
          className: `${childClassName} ${REVEAL_ITEM_CLASS}`.trim(),
          style: {
            ...child.props.style,
            // Cap the stagger index so large grids reveal smoothly without long waits
            '--reveal-index': Math.min(index, maxStaggerItems),
            '--reveal-stagger': `${stagger}ms`,
          },
        });
      })}
    </Tag>
  );
};

export default RevealGroup;
