import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop ensures immediate scroll to top on route change,
 * while preserving anchor/hash navigation (#section-id).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If navigating to an anchor hash (e.g. #curriculum or #roadmap-stages),
    // preserve intended anchor navigation instead of forcing the page to the top.
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      // If the target element isn't found immediately (e.g., rendering asynchronously),
      // avoid forcing top scroll so that hash navigation is not overridden.
      return;
    }

    // Reset scroll position immediately when navigating to another page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, hash]);

  return null;
}
