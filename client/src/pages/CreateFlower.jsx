import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faRotateRight, faTrashCan, faPalette, faPen, faEraser } from '@fortawesome/free-solid-svg-icons';
import DrawingCanvas from '../components/DrawingCanvas';
import PlantConfirmModal from '../components/PlantConfirmModal';
import ResumeDraftModal from '../components/ResumeDraftModal';
import ShareBloomButton from '../components/ShareBloomButton';
import SEO from '../components/SEO';
import { plantFlower } from '../services/flowerService';
import { getPlantTimestamps, recordPlantTimestamp, hasReachedPlantLimit } from '../utils/plantLimit';
import { trackEvent, ANALYTICS_EVENTS } from '../utils/analytics';
import { getCustomColors, addCustomColor } from '../utils/customColors';
import { getDraft, saveDraft, clearDraft } from '../utils/drawingDraft';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const AUTOSAVE_INTERVAL_MS = 3000;

const PRESET_COLORS = [
  { label: 'Moss',     value: '#2d4a2c' },
  { label: 'Sage',     value: '#7aab78' },
  { label: 'Lavender', value: '#c4b5d4' },
  { label: 'Petal',    value: '#f2c8b0' },
  { label: 'Mist',     value: '#b8d8e8' },
  { label: 'Bloom',    value: '#f5bfbf' },
];

function CreateFlower() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [color, setColor]           = useState('#2d4a2c');
  const [strokeSize, setStrokeSize] = useState(4);
  const [message, setMessage]       = useState('');
  const [gardenerName, setGardenerName] = useState('');
  const [location, setLocation]     = useState('');
  const [error, setError]           = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [plantedFlower, setPlantedFlower] = useState(null);
  const [plantTimestamps, setPlantTimestamps] = useState(() => getPlantTimestamps());
  const limitReached = hasReachedPlantLimit(plantTimestamps);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const clientPlantIdRef = useRef(null);
  const [eraser, setEraser] = useState(false);
  const [customColors, setCustomColors] = useState(() => getCustomColors());
  const [pendingDraft] = useState(() => getDraft());
  const [showResumePrompt, setShowResumePrompt] = useState(() => !!pendingDraft);
  const showResumePromptRef = useRef(showResumePrompt);
  const autosaveIntervalRef = useRef(null);
  const draftStateRef = useRef({ message, color, strokeSize });

  useEffect(() => {
    showResumePromptRef.current = showResumePrompt;
  }, [showResumePrompt]);

  useEffect(() => {
    draftStateRef.current = { message, color, strokeSize };
  }, [message, color, strokeSize]);

  useEffect(() => {
    autosaveIntervalRef.current = setInterval(() => {
      if (showResumePromptRef.current) return;

      const strokes = canvasRef.current?.getStrokes() ?? [];
      const { message: draftMessage, color: draftColor, strokeSize: draftStrokeSize } = draftStateRef.current;
      const trimmedMessage = draftMessage.trim();

      // Nothing new worth checkpointing right now — leave any existing saved draft
      // alone. Undo/redo/clear must never silently erase a resumable draft; only a
      // successful plant or an explicit "Start over" does that.
      if (strokes.length === 0 && !trimmedMessage) return;

      saveDraft({ strokes, color: draftColor, strokeSize: draftStrokeSize, message: trimmedMessage });
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(autosaveIntervalRef.current);
  }, []);

  function handleResumeDraft() {
    if (pendingDraft) {
      if (pendingDraft.color) setColor(pendingDraft.color);
      if (pendingDraft.strokeSize) setStrokeSize(pendingDraft.strokeSize);
      if (pendingDraft.message) setMessage(pendingDraft.message);
      canvasRef.current?.loadStrokes(pendingDraft.strokes);
    }
    setShowResumePrompt(false);
  }

  function handleStartOver() {
    clearDraft();
    canvasRef.current?.clear();
    setShowResumePrompt(false);
  }

  function handlePlant() {
    if (limitReached) return;
    if (!canvasRef.current.hasDrawing()) {
      setError('Please draw a flower before planting it.');
      return;
    }
    const trimmed = message.trim();
    if (trimmed.length < 5) {
      setError('Please write at least 5 characters.');
      return;
    }
    if (trimmed.length > 200) {
      setError('Your message is too long (max 200 characters).');
      return;
    }

    clientPlantIdRef.current = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setShowConfirm(true);
  }

  async function handleConfirmPlant() {
    // Synchronous ref guard: blocks re-entrant calls fired within the same tick
    // (spam-clicks, Enter-key repeats) before React has re-rendered the disabled button.
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const image = canvasRef.current.getDataURL();
    const trimmedMessage = message.trim();
    const trimmedAuthor = gardenerName.trim() || 'Anonymous Gardener';
    const trimmedLocation = location.trim();

    let savedViaApi = true;

    try {
      try {
        await plantFlower({
          image,
          message: trimmedMessage,
          author: trimmedAuthor,
          location: trimmedLocation,
          clientPlantId: clientPlantIdRef.current,
        });
      } catch {
        savedViaApi = false;
        const now = Date.now();
        const flower = {
          id:           now,
          image,
          message:      trimmedMessage,
          author:       trimmedAuthor,
          location:     trimmedLocation,
          plantedAt:    new Date(now).toISOString(),
          expiresAt:    new Date(now + THREE_DAYS_MS).toISOString(),
          wateredCount: 0,
        };

        try {
          const existing = JSON.parse(localStorage.getItem('bloomspaceFlowers') || '[]');
          localStorage.setItem('bloomspaceFlowers', JSON.stringify([flower, ...existing]));
        } catch {
          localStorage.setItem('bloomspaceFlowers', JSON.stringify([flower]));
        }
      }

      setShowConfirm(false);
      setPlantedFlower({ image, message: trimmedMessage, author: trimmedAuthor, location: trimmedLocation });
      setPlantTimestamps(recordPlantTimestamp());
      trackEvent(ANALYTICS_EVENTS.FLOWER_CREATED, { method: savedViaApi ? 'api' : 'local_fallback' });
      clearInterval(autosaveIntervalRef.current);
      clearDraft();
      // Deliberately not resetting isSubmitting on success — the confirm modal and
      // Plant button both unmount once plantedFlower is set, so there's nothing left to guard.
    } catch {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setError('Could not plant your flower. Please try again.');
    }
  }

  function renderColorSwatch(value, label) {
    return (
      <button
        key={value}
        title={label || value}
        onClick={() => setColor(value)}
        className="rounded-full transition-all duration-150 hover:scale-110 focus:outline-none"
        style={{
          width: 22,
          height: 22,
          background: value,
          border: color === value
            ? '2.5px solid #2d4a2c'
            : '2px solid rgba(45, 74, 44, 0.15)',
          transform: color === value ? 'scale(1.18)' : undefined,
        }}
      />
    );
  }

  return (
    <main
      className="flex-1 py-16 px-6"
      style={{ background: 'linear-gradient(to bottom, #faf6ef, #f2e9d8)' }}
    >
      <SEO
        title="Plant a Flower"
        description="Draw your bloom, write a kind message, and plant it in the shared Bloomspace garden."
        path="/create"
      />
      {plantedFlower ? (
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-moss mb-3">
            Your Flower Has Bloomed! 🌼
          </h1>
          <p className="text-moss/80 text-sm max-w-sm mx-auto leading-relaxed mb-8">
            It&rsquo;s growing in the shared garden now. Share your bloom card with the world, or go see it live.
          </p>

          <div
            className="rounded-3xl overflow-hidden mb-6"
            style={{
              background: '#fffbf5',
              border: '1px solid rgba(184, 212, 182, 0.35)',
              boxShadow: '0 12px 48px rgba(45, 74, 44, 0.10), 0 2px 8px rgba(45, 74, 44, 0.05)',
              aspectRatio: '1 / 1',
            }}
          >
            <img src={plantedFlower.image} alt="Your planted bloom" className="w-full h-full object-contain" />
          </div>

          {plantedFlower.message && (
            <p className="text-moss/85 text-sm italic leading-relaxed mb-8">&ldquo;{plantedFlower.message}&rdquo;</p>
          )}

          <div className="flex flex-col items-center gap-4">
            <ShareBloomButton
              image={plantedFlower.image}
              message={plantedFlower.message}
              author={plantedFlower.author}
              location={plantedFlower.location}
            />

            <button
              onClick={() => navigate('/garden')}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ color: 'rgba(45,74,44,0.80)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,212,182,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              View My Garden →
            </button>
          </div>
        </div>
      ) : (
      <>
      {/* Page header */}
      <div className="text-center mb-10">
        <h1 className="font-heading text-4xl md:text-5xl text-moss mb-3">
          Plant a Flower
        </h1>
        <p className="text-moss/80 text-sm max-w-sm mx-auto leading-relaxed">
          Draw your bloom, write a message, and send it to the shared garden.
        </p>
      </div>

      {/* Studio panel */}
      <div
        className="max-w-2xl mx-auto rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255, 251, 245, 0.95)',
          border: '1px solid rgba(184, 212, 182, 0.35)',
          boxShadow: '0 12px 48px rgba(45, 74, 44, 0.10), 0 2px 8px rgba(45, 74, 44, 0.05)',
        }}
      >

        {/* Toolbar — three groups (colours / brush size / actions) that stack on
            mobile and sit inline on sm+. Actions are a single flex item pinned to
            the right via sm:ml-auto, so they stay grouped together regardless of
            how many custom colour swatches the palette group grows to. */}
        <div
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center px-5 py-3 border-b"
          style={{
            background: 'rgba(184, 212, 182, 0.10)',
            borderColor: 'rgba(184, 212, 182, 0.28)',
          }}
        >
          {/* 1. Colour controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_COLORS.map(({ label, value }) => renderColorSwatch(value, label))}
            {customColors.map(value => renderColorSwatch(value))}

            {/* Custom colour input */}
            <label
              title="Custom colour"
              className="relative rounded-full cursor-pointer flex items-center justify-center shrink-0"
              style={{
                width: 22,
                height: 22,
                border: '1.5px dashed rgba(122, 171, 120, 0.5)',
                background: 'rgba(255,251,245,0.8)',
              }}
            >
              <FontAwesomeIcon icon={faPalette} className="text-moss/80" style={{ width: 10, height: 10 }} />
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                onBlur={e => setCustomColors(addCustomColor(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>

          {/* Divider — sm+ only; on mobile the groups are already separated by stacking */}
          <div className="hidden sm:block w-px h-5" style={{ background: 'rgba(184, 212, 182, 0.5)' }} />

          {/* 2. Tool toggle + Stroke size */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Brush / Eraser segmented toggle */}
            <div
              className="flex items-center gap-0.5 rounded-full p-0.5"
              style={{ background: 'rgba(184,212,182,0.18)', border: '1px solid rgba(122,171,120,0.22)' }}
            >
              <button
                onClick={() => setEraser(false)}
                title="Brush"
                aria-label="Brush"
                aria-pressed={!eraser}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-150 cursor-pointer"
                style={!eraser
                  ? { background: '#fffbf5', color: 'rgba(45,74,44,0.85)', boxShadow: '0 1px 4px rgba(45,74,44,0.10)' }
                  : { color: 'rgba(45,74,44,0.50)' }}
              >
                <FontAwesomeIcon icon={faPen} style={{ width: 10, height: 10 }} />
              </button>
              <button
                onClick={() => setEraser(true)}
                title="Eraser"
                aria-label="Eraser"
                aria-pressed={eraser}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-150 cursor-pointer"
                style={eraser
                  ? { background: '#fffbf5', color: 'rgba(45,74,44,0.85)', boxShadow: '0 1px 4px rgba(45,74,44,0.10)' }
                  : { color: 'rgba(45,74,44,0.50)' }}
              >
                <FontAwesomeIcon icon={faEraser} style={{ width: 10, height: 10 }} />
              </button>
            </div>

            <div className="hidden sm:block w-px h-4" style={{ background: 'rgba(184,212,182,0.5)' }} />

            <span className="text-[10px] font-bold tracking-widest uppercase text-moss/80">
              Size
            </span>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeSize}
              onChange={e => setStrokeSize(Number(e.target.value))}
              className="w-20 accent-sage cursor-pointer"
            />
            {/* Live preview dot — uses current color; in eraser mode it shows as a faded outline */}
            <div
              className="rounded-full shrink-0"
              style={{
                width:  Math.max(6, strokeSize + 2),
                height: Math.max(6, strokeSize + 2),
                background: eraser ? 'transparent' : color,
                border: eraser ? '1.5px solid rgba(45,74,44,0.30)' : 'none',
                opacity: 0.75,
              }}
            />
          </div>

          {/* 3. Actions — Undo/Redo/Clear stay grouped together; pinned to the
              right on sm+ via ml-auto, which works per-line even if the colour
              group above has wrapped to multiple rows. */}
          <div className="flex items-center gap-1 flex-wrap sm:ml-auto sm:flex-nowrap">
            <button
              onClick={() => canvasRef.current?.undo()}
              aria-label="Undo"
              title="Undo"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ color: 'rgba(45,74,44,0.80)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,212,182,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <FontAwesomeIcon icon={faRotateLeft} style={{ width: 12, height: 12 }} />
              Undo
            </button>

            <button
              onClick={() => canvasRef.current?.redo()}
              aria-label="Redo"
              title="Redo"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ color: 'rgba(45,74,44,0.80)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,212,182,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <FontAwesomeIcon icon={faRotateRight} style={{ width: 12, height: 12 }} />
              Redo
            </button>

            <button
              onClick={() => canvasRef.current?.clear()}
              aria-label="Clear"
              title="Clear"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ color: 'rgba(45,74,44,0.80)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,212,182,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <FontAwesomeIcon icon={faTrashCan} style={{ width: 12, height: 12 }} />
              Clear
            </button>

            <div className="hidden sm:block w-px h-4" style={{ background: 'rgba(184, 212, 182, 0.5)' }} />

            <button
              onClick={() => { if (canvasRef.current?.save() === false) setError('Please draw something before saving.'); }}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ color: 'rgba(45,74,44,0.80)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,212,182,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Save PNG
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="px-5 pt-5">
          <DrawingCanvas ref={canvasRef} color={color} strokeSize={strokeSize} eraser={eraser} />
        </div>

        {/* Message input */}
        <div className="px-5 pt-4 pb-2">
          <label htmlFor="bloom-message" className="block text-[10px] font-bold tracking-widest uppercase text-moss/80 mb-2">
            Your Message
          </label>
          <textarea
            id="bloom-message"
            value={message}
            onChange={e => { setMessage(e.target.value); setError(''); }}
            placeholder="Write a kind word, wish, or intention to attach to your flower…"
            rows={3}
            className="w-full text-sm text-moss placeholder-sage/50 leading-relaxed resize-none rounded-2xl px-4 py-3 outline-none transition-all duration-200"
            style={{
              background: 'rgba(250, 246, 239, 0.80)',
              border: '1px solid rgba(122, 171, 120, 0.22)',
            }}
            onFocus={e  => { e.target.style.borderColor = 'rgba(122, 171, 120, 0.60)'; e.target.style.boxShadow = '0 0 0 3px rgba(122,171,120,0.08)'; }}
            onBlur={e   => { e.target.style.borderColor = 'rgba(122, 171, 120, 0.22)'; e.target.style.boxShadow = 'none'; }}
          />
          {error && (
            <p className="text-xs mt-1.5 px-1" style={{ color: '#b84444' }}>{error}</p>
          )}
        </div>

        {/* Gardener details */}
        <div className="px-5 pt-2 pb-2 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="gardener-name" className="block text-[10px] font-bold tracking-widest uppercase text-moss/80 mb-2">
              Your Name (optional)
            </label>
            <input
              id="gardener-name"
              type="text"
              value={gardenerName}
              onChange={e => setGardenerName(e.target.value)}
              placeholder="Anonymous Gardener"
              maxLength={60}
              className="w-full text-sm text-moss placeholder-sage/50 rounded-2xl px-4 py-2.5 outline-none transition-all duration-200"
              style={{
                background: 'rgba(250, 246, 239, 0.80)',
                border: '1px solid rgba(122, 171, 120, 0.22)',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(122, 171, 120, 0.60)'; e.target.style.boxShadow = '0 0 0 3px rgba(122,171,120,0.08)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(122, 171, 120, 0.22)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="gardener-location" className="block text-[10px] font-bold tracking-widest uppercase text-moss/80 mb-2">
              Location (optional)
            </label>
            <input
              id="gardener-location"
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Somewhere in the world"
              maxLength={60}
              className="w-full text-sm text-moss placeholder-sage/50 rounded-2xl px-4 py-2.5 outline-none transition-all duration-200"
              style={{
                background: 'rgba(250, 246, 239, 0.80)',
                border: '1px solid rgba(122, 171, 120, 0.22)',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(122, 171, 120, 0.60)'; e.target.style.boxShadow = '0 0 0 3px rgba(122,171,120,0.08)'; }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(122, 171, 120, 0.22)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Plant CTA */}
        <div className="px-5 pb-6 pt-3 flex flex-col items-end gap-2">
          {limitReached && (
            <div className="text-right max-w-xs">
              <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(45,74,44,0.85)' }}>
                🌸 You&rsquo;ve planted 3 blooms in the last 24 hours.
              </p>
              <p className="text-xs" style={{ color: 'rgba(45,74,44,0.80)' }}>
                Come back tomorrow to draw more, or water the garden while you wait.
              </p>
            </div>
          )}
          <button
            onClick={handlePlant}
            disabled={limitReached}
            className="bg-sage text-cream px-8 py-3 rounded-full text-sm font-semibold hover:bg-sage-dark transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-sage"
            style={{ boxShadow: '0 4px 18px rgba(122, 171, 120, 0.42)' }}
          >
            🌼 Plant in the Garden
          </button>
        </div>

      </div>
      </>
      )}

      {showConfirm && (
        <PlantConfirmModal
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmPlant}
          isSubmitting={isSubmitting}
        />
      )}

      {showResumePrompt && (
        <ResumeDraftModal
          onResume={handleResumeDraft}
          onStartOver={handleStartOver}
        />
      )}
    </main>
  );
}

export default CreateFlower;
