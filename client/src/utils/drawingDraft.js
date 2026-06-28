const DRAFT_KEY = 'bloomspaceDraft';

function getDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    return {
      strokes: Array.isArray(parsed.strokes) ? parsed.strokes : [],
      color: typeof parsed.color === 'string' ? parsed.color : undefined,
      strokeSize: typeof parsed.strokeSize === 'number' ? parsed.strokeSize : undefined,
      message: typeof parsed.message === 'string' ? parsed.message : '',
    };
  } catch {
    return null;
  }
}

function saveDraft({ strokes, color, strokeSize, message }) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ strokes, color, strokeSize, message }));
  } catch {
    /* localStorage unavailable or full — autosave just won't persist this tick */
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

export { getDraft, saveDraft, clearDraft };
