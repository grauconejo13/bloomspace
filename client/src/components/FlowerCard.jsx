import { useState } from 'react';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

function formatTimeLeft(msLeft) {
  if (msLeft <= 0)        return { label: 'wilted',       urgent: true  };
  if (msLeft < 3600000)   return { label: 'expires soon', urgent: true  };
  const hours = Math.floor(msLeft / 3600000);
  if (hours < 24)         return { label: `${hours}h left`,                          urgent: false };
  const days = Math.floor(hours / 24);
                          return { label: `${days} day${days !== 1 ? 's' : ''} left`, urgent: false };
}

function FlowerCard({ id, emoji, bg, image, message, author, plantedAt, expiresAt, wateredCount: initCount }) {
  const hasExpiry = expiresAt != null;

  const [timeLeft, setTimeLeft] = useState(() =>
    hasExpiry ? formatTimeLeft(new Date(expiresAt).getTime() - Date.now()) : null
  );
  const [wateredCount, setWateredCount] = useState(hasExpiry ? (initCount ?? 0) : null);

  function handleWater() {
    const next = Date.now() + THREE_DAYS_MS;
    setTimeLeft(formatTimeLeft(THREE_DAYS_MS));
    setWateredCount(c => c + 1);
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
      className="flex flex-col rounded-3xl overflow-hidden group transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255, 251, 245, 0.97)',
        border: '1px solid rgba(184, 212, 182, 0.28)',
        boxShadow: '0 4px 20px rgba(45, 74, 44, 0.07), 0 1px 4px rgba(45, 74, 44, 0.04)',
      }}
    >
      {/* Illustration area */}
      <div
        className="flex items-center justify-center h-40 overflow-hidden select-none"
        style={{ background: image ? '#fffbf5' : bg }}
      >
        {image ? (
          <img src={image} alt="drawn flower" className="w-full h-full object-contain" />
        ) : (
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300 inline-block">
            {emoji}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <p className="text-moss/80 text-sm leading-relaxed line-clamp-3 italic">
          "{message}"
        </p>

        {/* Lifespan badges — user flowers only */}
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
                💧 {wateredCount}×
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          className="mt-auto pt-3 flex items-center justify-between gap-2 border-t"
          style={{ borderColor: 'rgba(184, 212, 182, 0.28)' }}
        >
          <span className="text-sage-dark/55 text-xs">— {author}</span>
          <span className="text-sage/50 text-xs">{plantedAt}</span>
        </div>

        {/* Water button — user flowers only.
            min-h-11 meets Apple/Google tap-target guidelines.
            Resting state is clearly visible so touch users see a button without hover.
            onMouseEnter/Leave are desktop-only enhancements; they don't fire on touch. */}
        {hasExpiry && (
          <button
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
            💧 Water this flower
          </button>
        )}
      </div>
    </div>
  );
}

export default FlowerCard;
