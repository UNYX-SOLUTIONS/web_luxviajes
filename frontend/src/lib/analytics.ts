/**
 * Track events with Google Analytics
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, string | number | boolean>,
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

/**
 * Track WhatsApp lead click from web
 */
export const trackWhatsAppClick = () => {
  trackEvent("whatsapp_click", {
    source: "web_hero",
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track phone call click from web
 */
export const trackPhoneClick = () => {
  trackEvent("phone_click", {
    source: "web_hero",
    timestamp: new Date().toISOString(),
  });
};

// Type augmentation for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      config?: Record<string, string | number | boolean>,
    ) => void;
  }
}
