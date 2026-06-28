const STORAGE_KEY = 'bloomspacePlantTimestamps';
const MAX_PLANTS_PER_WINDOW = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000;

// Reads, expires anything older than the 24h window, and persists the pruned
// list back — so old timestamps never accumulate and a slot frees up the
// moment a plant ages out, without needing a separate cleanup job.
function getPlantTimestamps() {
  let timestamps;
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    timestamps = Array.isArray(raw) ? raw.filter(t => typeof t === 'number' && Number.isFinite(t)) : [];
  } catch {
    timestamps = [];
  }

  const cutoff = Date.now() - WINDOW_MS;
  const active = timestamps.filter(t => t > cutoff);

  if (active.length !== timestamps.length) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
    } catch {
      /* localStorage unavailable — pruning just won't persist this tick */
    }
  }

  return active;
}

function recordPlantTimestamp() {
  const next = [...getPlantTimestamps(), Date.now()];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* localStorage unavailable — limit just won't persist across reloads */
  }
  return next;
}

function hasReachedPlantLimit(timestamps) {
  return timestamps.length >= MAX_PLANTS_PER_WINDOW;
}

export { MAX_PLANTS_PER_WINDOW, WINDOW_MS, getPlantTimestamps, recordPlantTimestamp, hasReachedPlantLimit };
