import { useRef, useState } from 'react';
import { createShareCardBlob } from '../utils/shareCard';

const STATUS_PREPARING = 'Preparing your Bloomspace card…';
const STATUS_DOWNLOADED = 'Share is not supported here, so your card was downloaded.';
const STATUS_ERROR = 'Could not create share card. Please try again.';

const STATUS_CLEAR_DELAY = 4500;

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function canShareFile(file) {
  return typeof navigator.share === 'function'
    && (typeof navigator.canShare !== 'function' || navigator.canShare({ files: [file] }));
}

function ShareBloomButton({ image, message, author, location }) {
  const [status, setStatus] = useState('');
  const [isWorking, setIsWorking] = useState(false);
  const clearTimer = useRef(null);

  function flashStatus(text) {
    setStatus(text);
    clearTimeout(clearTimer.current);
    if (text) {
      clearTimer.current = setTimeout(() => setStatus(''), STATUS_CLEAR_DELAY);
    }
  }

  async function handleShare() {
    setIsWorking(true);
    flashStatus(STATUS_PREPARING);

    let blob;
    try {
      blob = await createShareCardBlob({ image, message, author, location });
    } catch {
      flashStatus(STATUS_ERROR);
      setIsWorking(false);
      return;
    }

    const file = new File([blob], 'bloomspace-card.png', { type: 'image/png' });

    try {
      if (canShareFile(file)) {
        await navigator.share({
          files: [file],
          title: 'My Bloomspace flower',
          text: 'planted in Bloomspace 🌱',
        });
        flashStatus('');
      } else {
        downloadBlob(blob, 'bloomspace-card.png');
        flashStatus(STATUS_DOWNLOADED);
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        flashStatus('');
      } else {
        downloadBlob(blob, 'bloomspace-card.png');
        flashStatus(STATUS_DOWNLOADED);
      }
    }

    setIsWorking(false);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        disabled={isWorking}
        className="bg-sage text-cream px-8 py-3 rounded-full text-sm font-semibold hover:bg-sage-dark transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ boxShadow: '0 4px 18px rgba(122, 171, 120, 0.42)' }}
      >
        🌱 Share Bloom
      </button>
      {status && (
        <p
          className="text-xs text-center max-w-xs"
          style={{ color: status === STATUS_ERROR ? '#b84444' : 'rgba(74,112,72,0.75)' }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default ShareBloomButton;
