// Event tracking utilities for analytics
// These log to console in development and can be connected to analytics services

type TrackingEvent = 
  | 'calculator_started'
  | 'calculator_changed'
  | 'book_demo_clicked'
  | 'savings_guide_clicked'
  | 'mode_changed';

interface TrackingData {
  [key: string]: string | number | boolean;
}

export function trackEvent(event: TrackingEvent, data?: TrackingData) {
  // Log in development
  if (import.meta.env.DEV) {
    console.log(`[Tracking] ${event}`, data);
  }
  
  // Here you can add integrations with analytics services like:
  // - Google Analytics 4
  // - Mixpanel
  // - Amplitude
  // - Segment
  
  // Example for GA4 (if gtag is available):
  // if (typeof window.gtag === 'function') {
  //   window.gtag('event', event, data);
  // }
}

// Track once per session
const trackedOnce = new Set<string>();

export function trackEventOnce(event: TrackingEvent, data?: TrackingData) {
  if (trackedOnce.has(event)) return;
  trackedOnce.add(event);
  trackEvent(event, data);
}
