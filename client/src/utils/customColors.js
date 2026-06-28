const CUSTOM_COLORS_KEY = 'bloomspaceCustomColors';
const MAX_CUSTOM_COLORS = 5;

function getCustomColors() {
  try {
    const raw = JSON.parse(sessionStorage.getItem(CUSTOM_COLORS_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter(c => typeof c === 'string') : [];
  } catch {
    return [];
  }
}

// Most-recently-picked first, deduped, capped at MAX_CUSTOM_COLORS.
function addCustomColor(color) {
  const next = [color, ...getCustomColors().filter(c => c !== color)].slice(0, MAX_CUSTOM_COLORS);
  try {
    sessionStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(next));
  } catch {
    /* sessionStorage unavailable — custom colors just won't persist this tick */
  }
  return next;
}

export { MAX_CUSTOM_COLORS, getCustomColors, addCustomColor };
