import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawingCanvas from '../components/DrawingCanvas';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

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
  const [error, setError]           = useState('');

  function handlePlant() {
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

    if (!window.confirm('Ready to plant this flower in the garden?')) return;

    const now = Date.now();
    const flower = {
      id:           now,
      image:        canvasRef.current.getDataURL(),
      message:      trimmed,
      author:       'Anonymous Gardener',
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

    navigate('/garden');
  }

  return (
    <main
      className="flex-1 py-16 px-6"
      style={{ background: 'linear-gradient(to bottom, #faf6ef, #f2e9d8)' }}
    >
      {/* Page header */}
      <div className="text-center mb-10">
        <h1 className="font-heading text-4xl md:text-5xl text-moss mb-3">
          Plant a Flower
        </h1>
        <p className="text-sage-dark/70 text-sm max-w-sm mx-auto leading-relaxed">
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

        {/* Toolbar */}
        <div
          className="flex flex-wrap items-center gap-3 px-5 py-3 border-b"
          style={{
            background: 'rgba(184, 212, 182, 0.10)',
            borderColor: 'rgba(184, 212, 182, 0.28)',
          }}
        >
          {/* Colour swatches */}
          <div className="flex items-center gap-1.5">
            {PRESET_COLORS.map(({ label, value }) => (
              <button
                key={value}
                title={label}
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
            ))}

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
              <span className="text-[9px] text-sage-dark/50 select-none">+</span>
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-5" style={{ background: 'rgba(184, 212, 182, 0.5)' }} />

          {/* Stroke size */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-sage-dark/50">
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
            {/* Live preview dot */}
            <div
              className="rounded-full shrink-0"
              style={{
                width:  Math.max(6, strokeSize + 2),
                height: Math.max(6, strokeSize + 2),
                background: color,
                opacity: 0.75,
              }}
            />
          </div>

          {/* Push clear/save to the right */}
          <div className="flex-1" />

          <button
            onClick={() => canvasRef.current?.clear()}
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
            style={{ color: 'rgba(74,112,72,0.75)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,212,182,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Clear
          </button>

          <button
            onClick={() => { if (canvasRef.current?.save() === false) setError('Please draw something before saving.'); }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
            style={{ color: 'rgba(74,112,72,0.75)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,212,182,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            Save PNG
          </button>
        </div>

        {/* Canvas */}
        <div className="px-5 pt-5">
          <DrawingCanvas ref={canvasRef} color={color} strokeSize={strokeSize} />
        </div>

        {/* Message input */}
        <div className="px-5 pt-4 pb-2">
          <label className="block text-[10px] font-bold tracking-widest uppercase text-sage-dark/50 mb-2">
            Your Message
          </label>
          <textarea
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

        {/* Plant CTA */}
        <div className="px-5 pb-6 pt-3 flex justify-end">
          <button
            onClick={handlePlant}
            className="bg-sage text-cream px-8 py-3 rounded-full text-sm font-semibold hover:bg-sage-dark transition-all duration-300 cursor-pointer"
            style={{ boxShadow: '0 4px 18px rgba(122, 171, 120, 0.42)' }}
          >
            🌼 Plant in the Garden
          </button>
        </div>

      </div>
    </main>
  );
}

export default CreateFlower;
