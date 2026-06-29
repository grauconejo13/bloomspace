// Canonical public Bloomspace web app URL (Vercel-hosted frontend) — the one
// place to update if the deployed URL ever changes. This is NOT the API URL
// (see VITE_API_URL / flowerService.js), which points at the Render backend.
const PUBLIC_APP_URL = 'https://bloomspace-garden.vercel.app/';

// Same URL without the protocol/trailing slash, for display on the share card.
const PUBLIC_APP_DISPLAY_URL = PUBLIC_APP_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

// Absolute placeholder OG/Twitter preview image. The file itself does not exist yet —
// see SEO.jsx and index.html for what needs to be created at client/public/og-image.png.
const OG_IMAGE_URL = `${PUBLIC_APP_URL.replace(/\/$/, '')}/og-image.png`;

// Joins the public app URL with a route path (e.g. "/garden") for canonical/og:url tags.
function buildPublicUrl(path = '/') {
  const base = PUBLIC_APP_URL.replace(/\/$/, '');
  return path === '/' ? `${base}/` : `${base}${path}`;
}

export { PUBLIC_APP_URL, PUBLIC_APP_DISPLAY_URL, OG_IMAGE_URL, buildPublicUrl };
