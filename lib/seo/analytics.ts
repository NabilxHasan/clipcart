/**
 * ClipCart SEO & Conversion Analytics Tracking Utility
 * Lightweight, privacy-friendly event dispatching supporting Google Analytics 4 (GA4) / GTM.
 */

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export type SeoConversionEvent =
  | 'register_click'
  | 'whatsapp_click'
  | 'campaign_calculator_use'
  | 'client_request_start'
  | 'client_request_submit'
  | 'campaign_brief_view'
  | 'language_switch';

export function trackConversion(
  event: SeoConversionEvent,
  params: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    event_category: 'SEO_Conversion',
    timestamp: new Date().toISOString(),
    ...params,
  };

  // 1. Google Analytics 4 (gtag.js)
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', event, eventPayload);
    } catch (e) {
      console.debug('[Analytics] gtag error:', e);
    }
  }

  // 2. Google Tag Manager dataLayer
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event,
      ...eventPayload,
    });
  }

  // 3. Custom DOM Event for internal telemetry
  try {
    const customEvent = new CustomEvent('clipcart_seo_event', {
      detail: { event, ...eventPayload },
    });
    window.dispatchEvent(customEvent);
  } catch {
    // Ignore in legacy environments
  }
}
