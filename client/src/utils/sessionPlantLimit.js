const STORAGE_KEY = 'bloomspaceSessionPlantCount';
const MAX_PLANTS_PER_SESSION = 3;

function getPlantCount() {
  try {
    const count = Number(sessionStorage.getItem(STORAGE_KEY));
    return Number.isFinite(count) && count > 0 ? count : 0;
  } catch {
    return 0;
  }
}

function incrementPlantCount() {
  const next = getPlantCount() + 1;
  try {
    sessionStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    /* sessionStorage unavailable — limit just won't persist across reloads */
  }
  return next;
}

function hasReachedPlantLimit(count) {
  return count >= MAX_PLANTS_PER_SESSION;
}

export { MAX_PLANTS_PER_SESSION, getPlantCount, incrementPlantCount, hasReachedPlantLimit };
