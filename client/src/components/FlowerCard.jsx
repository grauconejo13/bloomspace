import { useState } from 'react';

function formatTimeLeft(msLeft) {
  if (msLeft <= 0)      return { label: 'wilted',       urgent: true  };
  if (msLeft < 3600000) return { label: 'expires soon', urgent: true  };
  const hours = Math.floor(msLeft / 3600000);
  if (hours < 24)       return { label: `${hours}h left`, urgent: false };
  const days = Math.floor(hours / 24);
  return { label: `Blooming for ${days} day${days !== 1 ? 's' : ''}`, urgent: false };
}

function FlowerCard({ emoji, bg, image, author, expiresAt, wateredCount, onSelect }) {
  const hasExpiry = expiresAt != null;
  const [timeLeft] = useState(() =>
    hasExpiry ? formatTimeLeft(new Date(expiresAt).getTime() - Date.now()) : null
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative rounded-3xl overflow-hidden cursor-pointer w-full active:scale-95 transition-transform duration-150"
      style={{
        background: image ? '#fffbf5' : bg,
        border: '1px solid rgba(184, 212, 182, 0.28)',
        boxShadow: '0 4px 20px rgba(45, 74, 44, 0.07), 0 1px 4px rgba(45, 74, 44, 0.04)',
        aspectRatio: '1 / 1',
      }}
      aria-label={`View flower by ${author}`}
    >
      {/* Flower image or emoji */}
      <div className="absolute inset-0 flex items-center justify-center">
        {image ? (
          <img src={image} alt="drawn flower" className="w-full h-full object-contain" />
        ) : (
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300 inline-block select-none">
            {emoji}
          </span>
        )}
      </div>

      {/* Status badges — frosted overlay at card bottom */}
      {timeLeft && (
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: timeLeft.urgent ? 'rgba(245,191,191,0.84)' : 'rgba(250,246,239,0.84)',
              color:      timeLeft.urgent ? '#b84444'                 : 'rgba(45,74,44,0.85)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          >
            🌿 {timeLeft.label}
          </span>
          {wateredCount > 0 && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(184,216,232,0.84)',
                color: 'rgba(45,74,44,0.85)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            >
              💧 {wateredCount}×
            </span>
          )}
        </div>
      )}
    </button>
  );
}

export default FlowerCard;
