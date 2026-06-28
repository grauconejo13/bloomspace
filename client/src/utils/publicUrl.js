// Canonical public Bloomspace web app URL (Vercel-hosted frontend) — the one
// place to update if the deployed URL ever changes. This is NOT the API URL
// (see VITE_API_URL / flowerService.js), which points at the Render backend.
const PUBLIC_APP_URL = 'https://bloomspace-garden.vercel.app/';

// Same URL without the protocol/trailing slash, for display on the share card.
const PUBLIC_APP_DISPLAY_URL = PUBLIC_APP_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

export { PUBLIC_APP_URL, PUBLIC_APP_DISPLAY_URL };
