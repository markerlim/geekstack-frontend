export function detectDeviceFromUserAgent(userAgent: string | undefined): "mobile" | "tablet" | "desktop" {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  if (/ipad|tablet/i.test(ua)) return "tablet";
  return "desktop";
}
