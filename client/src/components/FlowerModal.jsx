import { useState, useRef, useEffect } from 'react';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function formatTimeLeft(msLeft) {
  if (msLeft <= 0)      return { label: 'wilted',       urgent: true  };
  if (msLeft < 3600000) return { label: 'expires soon', urgent: true  };
  const hours = Math.floor(msLeft / 3600000);
  if (hours < 24)       return { label: `${hours}h left`, urgent: false };
  const days = Math.floor(hours / 24);
  return { label: `Blooming for ${days} day${days !== 1 ? 's' : ''}`, urgent: false };
}

function FlowerModal({ flower, onClose }) {
  const { id, emoji, bg, image, message, author, plantedAt, expiresAt, wateredCount: initCount } = flower;
  const hasExpiry = expiresAt != null;

  const [timeLeft, setTimeLeft] = useState(() => {
    if (!hasExpiry) return null;
    try {
      const stored = JSON.parse(localStorage.getItem('bloomspaceFlowers') || '[]');
      const fresh = stored.find(f => f.id === id);
      if (fresh?.expiresAt) return formatTimeLeft(new Date(fresh.expiresAt).getTime() - Date.now());
    } catch { /* silent */ }
    return formatTimeLeft(new Date(expiresAt).getTime() - Date.now());
  });

  const [wateredCount, setWateredCount] = useState(() => {
    if (!hasExpiry) return null;
    try {
      const stored = JSON.parse(localStorage.getItem('bloomspaceFlowers') || '[]');
      const fresh = stored.find(f => f.id === id);
      if (fresh) return fresh.wateredCount ?? 0;
    } catch { /* silent */ }
    return initCount ?? 0;
  });

  const [justWatered, setJustWatered] = useState(false);
  const feedbackTimer = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleWater() {
    const next = Date.now() + THREE_DAYS_MS;
    setTimeLeft(formatTimeLeft(THREE_DAYS_MS));
    setWateredCount(c => c + 1);
    setJustWatered(true);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setJustWatered(false), 3000);
    try {
      const stored = JSON.parse(localStorage.getItem('bloomspaceFlowers') || '[]');
      localStorage.setItem(
        'bloomspaceFlowers',
        JSON.stringify(
          stored.map(f =>
            f.id === id
              ? { ...f, expiresAt: new Date(next).toISOString(), wateredCount: (f.wateredCount || 0) + 1 }
              : f
          )
        )
      );
    } catch { /* silent */ }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(45,74,44,0.38)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Flower details"
        className="relative w-full max-w-sm rounded-3xl overflow-y-auto"
        style={{
          maxHeight: '90vh',
          background: 'rgba(255, 251, 245, 0.98)',
          border: '1px solid rgba(184, 212, 182, 0.35)',
          boxShadow: '0 24px 64px rgba(45, 74, 44, 0.18), 0 4px 16px rgba(45, 74, 44, 0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full text-lg cursor-pointer transition-colors duration-150 active:opacity-60"
          style={{
            background: 'rgba(250,246,239,0.90)',
            border: '1px solid rgba(184,212,182,0.40)',
            color: 'rgba(74,112,72,0.70)',
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Flower image */}
        <div
          className="flex items-center justify-center"
          style={{ height: 220, background: image ? '#fffbf5' : bg }}
        >
          {image ? (
            <img src={image} alt="drawn flower" className="w-full h-full object-contain" />
          ) : (
            <span className="text-7xl select-none">{emoji}</span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <p className="text-moss/85 text-sm leading-relaxed italic">"{message}"</p>

          {timeLeft && (
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: timeLeft.urgent ? 'rgba(245,191,191,0.40)' : 'rgba(184,212,182,0.35)',
                  color:      timeLeft.urgent ? '#b84444'                 : 'rgba(74,112,72,0.85)',
                }}
              >
                🌿 {timeLeft.label}
              </span>
              {wateredCount > 0 && (
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(184,216,232,0.30)',
                    color: 'rgba(74,112,72,0.75)',
                  }}
                >
                  💧 Refreshed {wateredCount}×
                </span>
              )}
            </div>
          )}

          <div
            className="flex items-center justify-between text-xs border-t pt-3"
            style={{ borderColor: 'rgba(184,212,182,0.28)', color: 'rgba(74,112,72,0.55)' }}
          >
            <span>— {author}</span>
            <span>{plantedAt}</span>
          </div>

          {hasExpiry && (
            <>
              <button
                type="button"
                onClick={handleWater}
                className="w-full min-h-11 flex items-center justify-center gap-1.5 text-sm font-semibold rounded-xl cursor-pointer transition-opacity duration-150 active:opacity-60"
                style={{
                  background: 'rgba(184,216,232,0.32)',
                  color:      'rgba(74,112,72,0.88)',
                  border:     '1px solid rgba(184,216,232,0.50)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,216,232,0.52)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(184,216,232,0.32)'}
              >
                💧 Water Flower
              </button>
              {justWatered && (
                <p className="text-center text-xs" style={{ color: 'rgba(74,112,72,0.60)' }}>
                  Bloom refreshed for 3 days.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FlowerModal;
