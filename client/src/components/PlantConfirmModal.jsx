import { useEffect } from 'react';

function PlantConfirmModal({ onCancel, onConfirm, isSubmitting = false }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && !isSubmitting) onCancel(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel, isSubmitting]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(45,74,44,0.38)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={() => { if (!isSubmitting) onCancel(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Confirm planting"
        className="relative w-full max-w-sm rounded-3xl p-6"
        style={{
          background: 'rgba(255, 251, 245, 0.98)',
          border: '1px solid rgba(184, 212, 182, 0.35)',
          boxShadow: '0 24px 64px rgba(45, 74, 44, 0.18), 0 4px 16px rgba(45, 74, 44, 0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="font-heading text-2xl text-moss mb-3">
          Ready to plant this flower?
        </h2>
        <p className="text-moss/80 text-sm leading-relaxed mb-6">
          Your flower will bloom for 3 days. If other gardeners water it, its bloom time refreshes.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 min-h-11 rounded-full text-sm font-semibold cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: 'rgba(45,74,44,0.85)',
              border: '1px solid rgba(184,212,182,0.5)',
              background: 'transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,212,182,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="flex-1 min-h-11 bg-sage text-cream rounded-full text-sm font-semibold hover:bg-sage-dark transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-sage"
            style={{ boxShadow: '0 4px 18px rgba(122, 171, 120, 0.42)' }}
          >
            {isSubmitting ? 'Planting…' : '🌼 Plant in Garden'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlantConfirmModal;
