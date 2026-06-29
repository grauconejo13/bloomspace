import { useRef, useState } from 'react';
import { createShareCardBlob } from '../utils/shareCard';
import { trackEvent, ANALYTICS_EVENTS } from '../utils/analytics';
import { PUBLIC_APP_URL } from '../utils/publicUrl';

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

function canShareData(data) {
  return typeof navigator.share === 'function'
    && (typeof navigator.canShare !== 'function' || navigator.canShare(data));
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
    const shareData = {
      files: [file],
      title: 'My Bloomspace flower',
      text: 'planted in Bloomspace 🌱',
      url: PUBLIC_APP_URL,
    };

    try {
      if (canShareData(shareData)) {
        await navigator.share(shareData);
        flashStatus('');
        trackEvent(ANALYTICS_EVENTS.FLOWER_SHARED);
      } else {
        downloadBlob(blob, 'bloomspace-card.png');
        flashStatus(STATUS_DOWNLOADED);
        trackEvent(ANALYTICS_EVENTS.SHARE_DOWNLOADED);
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        flashStatus('');
      } else {
        downloadBlob(blob, 'bloomspace-card.png');
        flashStatus(STATUS_DOWNLOADED);
        trackEvent(ANALYTICS_EVENTS.SHARE_DOWNLOADED);
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
          style={{ color: status === STATUS_ERROR ? '#b84444' : 'rgba(45,74,44,0.85)' }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default ShareBloomButton;
