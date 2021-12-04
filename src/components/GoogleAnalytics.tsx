import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { trackPageView, initialise } from '../services/google_analytics.service';

export default function GoogleAnalytics() {

  const location = useLocation();

  useEffect(() => {
    initialise();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}
