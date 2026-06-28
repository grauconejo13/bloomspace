const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const ANALYTICS_URL = `${BASE_URL}/api/analytics`;
const SESSION_ID_KEY = 'bloomspaceAnalyticsSessionId';

// photo_uploaded and support_clicked are reserved for features that don't exist yet
// (no photo upload, no support link/button in the app) — not fired anywhere today.
const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  GARDEN_VIEW: 'garden_view',
  FLOWER_CREATED: 'flower_created',
  FLOWER_SHARED: 'flower_shared',
  SHARE_DOWNLOADED: 'share_downloaded',
  SUPPORT_CLICKED: 'support_clicked',
  PHOTO_UPLOADED: 'photo_uploaded',
};

function getOrCreateSessionId() {
  try {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return null;
  }
}

// Fire-and-forget: never throws, never awaited by callers, never blocks the UI.
function trackEvent(eventName, metadata = {}) {
  try {
    const payload = {
      event_name: eventName,
      page: typeof window !== 'undefined' ? window.location.pathname : null,
      metadata,
      session_id: getOrCreateSessionId(),
    };

    fetch(ANALYTICS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never break the app */
  }
}

export { trackEvent, ANALYTICS_EVENTS };
