import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GardenGrid from '../components/GardenGrid';
import FlowerModal from '../components/FlowerModal';
import { fetchFlowers } from '../services/flowerService';
import { trackEvent, ANALYTICS_EVENTS } from '../utils/analytics';

function formatAge(isoString) {
  const mins = Math.round((Date.now() - new Date(isoString).getTime()) / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

const WAKEUP_NOTICE_DELAY_MS = 5000;

function Garden() {
  const navigate = useNavigate();
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [userFlowers, setUserFlowers] = useState([]);
  const [showWakeupNotice, setShowWakeupNotice] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.GARDEN_VIEW);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const wakeupTimer = setTimeout(() => {
      if (!cancelled) setShowWakeupNotice(true);
    }, WAKEUP_NOTICE_DELAY_MS);

    function loadFromLocalStorage() {
      try {
        const now = Date.now();
        const stored = JSON.parse(localStorage.getItem('bloomspaceFlowers') || '[]');
        return stored
          .filter(f => !f.expiresAt || new Date(f.expiresAt).getTime() > now)
          .map(f => ({ ...f, plantedAt: formatAge(f.plantedAt) }));
      } catch {
        return [];
      }
    }

    fetchFlowers()
      .then(flowers => {
        if (!cancelled) {
          setUserFlowers(flowers.map(f => ({ ...f, plantedAt: formatAge(f.plantedAt) })));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUserFlowers(loadFromLocalStorage());
          setLoadError(true);
        }
      })
      .finally(() => {
        clearTimeout(wakeupTimer);
        if (!cancelled) {
          setShowWakeupNotice(false);
          setHasLoaded(true);
        }
      });

    return () => { cancelled = true; clearTimeout(wakeupTimer); };
  }, [retryToken]);

  function handleRetry() {
    setLoadError(false);
    setShowWakeupNotice(false);
    setHasLoaded(false);
    setRetryToken(t => t + 1);
  }

  function handleFlowerUpdated(updatedFlower) {
    setUserFlowers(prev =>
      prev.map(f =>
        f.id === updatedFlower.id
          ? { ...f, expiresAt: updatedFlower.expiresAt, wateredCount: updatedFlower.wateredCount }
          : f
      )
    );
  }

  return (
    <main
      className="flex-1"
      style={{ background: 'linear-gradient(to bottom, #faf6ef, #f2e9d8)' }}
    >

      {/* Page header */}
      <section className="text-center px-6 pt-20 pb-12">
        <p className="text-[10px] font-bold tracking-widest uppercase text-sage-dark/45 mb-4">
          Community Garden
        </p>
        <h1 className="font-heading text-4xl md:text-5xl text-moss mb-4">
          The Garden
        </h1>
        <p className="text-sage-dark/65 text-sm max-w-md mx-auto leading-relaxed mb-10">
          Every flower here was drawn and planted by someone in the world.
          Browse, feel inspired, and add your own.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mb-10">

          <div className="text-center">
            <p className="font-heading text-2xl text-moss">{userFlowers.length}</p>
            <p className="text-sage-dark/50 text-xs mt-0.5">flowers planted</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(184, 212, 182, 0.5)' }} />

          <div className="text-center">
            <p className="font-heading text-2xl text-moss">42</p>
            <p className="text-sage-dark/50 text-xs mt-0.5">gardeners</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(184, 212, 182, 0.5)' }} />
          
          <div className="text-center">
            <p className="font-heading text-2xl text-moss">{userFlowers.length}</p>
            <p className="text-sage-dark/50 text-xs mt-0.5">bloomed today</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/create')}
          className="bg-sage text-cream px-8 py-3 rounded-full text-sm font-semibold hover:bg-sage-dark transition-all duration-300 cursor-pointer"
          style={{ boxShadow: '0 4px 18px rgba(122, 171, 120, 0.42)' }}
        >
          🌼 Plant a Flower
        </button>
      </section>

      {showWakeupNotice && !loadError && (
        <div className="max-w-md mx-auto mb-8 px-6">
          <div
            className="rounded-2xl px-5 py-4 text-center"
            style={{
              background: 'rgba(184, 212, 182, 0.18)',
              border: '1px solid rgba(184, 212, 182, 0.40)',
            }}
          >
            <p className="text-sm font-semibold text-moss mb-1">🌱 Bloomspace is waking up…</p>
            <p className="text-xs text-sage-dark/70 leading-relaxed">
              Our little garden has been resting. This may take a few moments.
            </p>
          </div>
        </div>
      )}

      {loadError && (
        <div className="max-w-md mx-auto mb-8 px-6">
          <div
            className="rounded-2xl px-5 py-4 text-center flex flex-col items-center gap-2"
            style={{
              background: 'rgba(245, 191, 191, 0.16)',
              border: '1px solid rgba(245, 191, 191, 0.42)',
            }}
          >
            <p className="text-xs text-sage-dark/75 leading-relaxed">
              We couldn&rsquo;t reach the garden&rsquo;s database right now — showing flowers saved on this device.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="text-xs font-semibold px-4 py-1.5 rounded-full cursor-pointer transition-colors duration-200"
              style={{
                color: 'rgba(74,112,72,0.85)',
                border: '1px solid rgba(184,212,182,0.5)',
                background: 'rgba(255,251,245,0.7)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,212,182,0.22)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,251,245,0.7)'}
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Flower grid */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          {hasLoaded && userFlowers.length === 0 ? (
            <div
              className="max-w-md mx-auto text-center rounded-3xl px-8 py-12"
              style={{
                background: 'rgba(255, 251, 245, 0.7)',
                border: '1px dashed rgba(184, 212, 182, 0.45)',
              }}
            >
              <p className="font-heading text-xl text-moss mb-2">No blooms yet 🌱</p>
              <p className="text-sage-dark/65 text-sm leading-relaxed">
                Be the first to plant one.
              </p>
            </div>
          ) : (
            <GardenGrid flowers={userFlowers} onSelect={setSelectedFlower} />
          )}
        </div>
      </section>

      {selectedFlower && (
        <FlowerModal
          flower={selectedFlower}
          onClose={() => setSelectedFlower(null)}
          onFlowerUpdated={handleFlowerUpdated}
        />
      )}
    </main>
  );
}

export default Garden;
