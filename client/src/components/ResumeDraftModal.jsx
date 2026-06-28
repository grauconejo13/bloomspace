import { useEffect } from 'react';

function ResumeDraftModal({ onResume, onStartOver }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(45,74,44,0.38)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Resume unfinished bloom"
        className="relative w-full max-w-sm rounded-3xl p-6"
        style={{
          background: 'rgba(255, 251, 245, 0.98)',
          border: '1px solid rgba(184, 212, 182, 0.35)',
          boxShadow: '0 24px 64px rgba(45, 74, 44, 0.18), 0 4px 16px rgba(45, 74, 44, 0.08)',
        }}
      >
        <h2 className="font-heading text-2xl text-moss mb-3">
          Resume your unfinished bloom?
        </h2>
        <p className="text-sage-dark/70 text-sm leading-relaxed mb-6">
          We saved your drawing from last time. Pick up where you left off, or start fresh.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onStartOver}
            className="flex-1 min-h-11 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-200"
            style={{
              color: 'rgba(74,112,72,0.85)',
              border: '1px solid rgba(184,212,182,0.5)',
              background: 'transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,212,182,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Start over
          </button>
          <button
            type="button"
            onClick={onResume}
            className="flex-1 min-h-11 bg-sage text-cream rounded-full text-sm font-semibold hover:bg-sage-dark transition-all duration-300 cursor-pointer"
            style={{ boxShadow: '0 4px 18px rgba(122, 171, 120, 0.42)' }}
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeDraftModal;
