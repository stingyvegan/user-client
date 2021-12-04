export function trackPageView(locationPathName: string) {
  const { ga } = window;
  if (typeof ga !== 'function') console.error('ga not set');
  if (typeof ga !== 'function') return;
  ga('set', 'page', locationPathName);
  ga('send', 'pageview');
}

export function initialise() {
  const { ga } = window;
  if (typeof ga !== 'function') console.error('ga not set');
  if (typeof ga !== 'function') return;
  ga('create', window.env.GOOGLE_ANALYTICS_ID, 'auto');
}
