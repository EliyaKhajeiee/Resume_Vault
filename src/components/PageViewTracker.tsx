import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Send page view to Google Analytics whenever the route changes
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-ZGJG3FXMFZ', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null; // This component doesn't render anything
};
