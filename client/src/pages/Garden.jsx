import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GardenGrid from '../components/GardenGrid';

function formatAge(isoString) {
  const mins = Math.round((Date.now() - new Date(isoString).getTime()) / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

const SAMPLE_FLOWERS = [
  {
    id: 1,
    emoji: '🌸',
    bg: 'rgba(242, 200, 176, 0.22)',
    message: 'A bloom for every new beginning.',
    author: 'a wanderer',
    plantedAt: '2 hours ago',
  },
  {
    id: 2,
    emoji: '🌺',
    bg: 'rgba(196, 181, 212, 0.22)',
    message: 'Growth takes patience, just like flowers.',
    author: 'a dreamer',
    plantedAt: '5 hours ago',
  },
  {
    id: 3,
    emoji: '🌼',
    bg: 'rgba(184, 216, 232, 0.22)',
    message: 'Plant kindness and it will bloom everywhere.',
    author: 'sun_seeker',
    plantedAt: 'yesterday',
  },
  {
    id: 4,
    emoji: '🌷',
    bg: 'rgba(184, 212, 182, 0.22)',
    message: 'Every flower is a quiet act of hope.',
    author: 'morning_tea',
    plantedAt: 'yesterday',
  },
  {
    id: 5,
    emoji: '🌻',
    bg: 'rgba(245, 230, 160, 0.22)',
    message: 'You are allowed to grow at your own pace.',
    author: 'gentle_garden',
    plantedAt: '2 days ago',
  },
  {
    id: 6,
    emoji: '🌹',
    bg: 'rgba(245, 191, 191, 0.22)',
    message: 'Small moments of beauty matter.',
    author: 'petal_path',
    plantedAt: '3 days ago',
  },
];

function Garden() {
  const navigate = useNavigate();
  const [userFlowers] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('bloomspaceFlowers') || '[]');
      return stored.map(f => ({ ...f, plantedAt: formatAge(f.plantedAt) }));
    } catch {
      return [];
    }
  });

  const allFlowers = [...userFlowers, ...SAMPLE_FLOWERS];

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
            <p className="font-heading text-2xl text-moss">{allFlowers.length}</p>
            <p className="text-sage-dark/50 text-xs mt-0.5">flowers planted</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(184, 212, 182, 0.5)' }} />
          <div className="text-center">
            <p className="font-heading text-2xl text-moss">42</p>
            <p className="text-sage-dark/50 text-xs mt-0.5">gardeners</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(184, 212, 182, 0.5)' }} />
          <div className="text-center">
            <p className="font-heading text-2xl text-moss">{userFlowers.length || 12}</p>
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

      {/* Flower grid */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <GardenGrid flowers={allFlowers} />
        </div>
      </section>

    </main>
  );
}

export default Garden;
