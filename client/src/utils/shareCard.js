import { PUBLIC_APP_DISPLAY_URL } from './publicUrl';

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;
const PADDING = 56;
const IMAGE_BOX_HEIGHT = 760;

const COLORS = {
  background: '#faf6ef',
  imagePanel: '#fffbf5',
  imageBorder: 'rgba(184, 212, 182, 0.45)',
  message: '#2d4a2c',
  signature: 'rgba(74, 112, 72, 0.75)',
  tagline: 'rgba(74, 112, 72, 0.60)',
  footerLink: 'rgba(74, 112, 72, 0.45)',
  watermarkPill: 'rgba(250, 246, 239, 0.85)',
  watermarkText: 'rgba(45, 74, 44, 0.55)',
};

function roundRectPath(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load bloom image.'));
    img.src = src;
  });
}

function drawContainImage(ctx, img, x, y, maxWidth, maxHeight) {
  const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
  const width = img.width * scale;
  const height = img.height * scale;
  ctx.drawImage(img, x + (maxWidth - width) / 2, y + (maxHeight - height) / 2, width, height);
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  words.forEach(word => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines;
}

async function ensureFontsReady() {
  try {
    await document.fonts?.ready;
  } catch {
    /* fonts API unavailable or failed — fall back to default font stack */
  }
}

/**
 * Composites a shareable Bloomspace PNG card (bloom image + message +
 * tagline + subtle watermark) and resolves with the resulting PNG Blob.
 */
async function createShareCardBlob({ image, message, author, location }) {
  await ensureFontsReady();

  const canvas = document.createElement('canvas');
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Image frame
  ctx.fillStyle = COLORS.imagePanel;
  roundRectPath(ctx, PADDING, PADDING, CARD_WIDTH - PADDING * 2, IMAGE_BOX_HEIGHT, 32);
  ctx.fill();
  ctx.strokeStyle = COLORS.imageBorder;
  ctx.lineWidth = 2;
  ctx.stroke();

  if (image) {
    try {
      const img = await loadImage(image);
      drawContainImage(
        ctx, img,
        PADDING + 20, PADDING + 20,
        CARD_WIDTH - (PADDING + 20) * 2, IMAGE_BOX_HEIGHT - 40
      );
    } catch {
      /* leave the frame empty if the bloom image can't be decoded */
    }
  }

  // Watermark — kept small and tucked into a corner of the image so it never dominates
  const wmText = 'Bloomspace';
  ctx.font = '600 22px "Playfair Display", Georgia, serif';
  const wmTextWidth = ctx.measureText(wmText).width;
  const wmPillW = wmTextWidth + 56;
  const wmPillH = 40;
  const wmX = CARD_WIDTH - PADDING - wmPillW - 16;
  const wmY = PADDING + IMAGE_BOX_HEIGHT - wmPillH - 16;

  ctx.fillStyle = COLORS.watermarkPill;
  roundRectPath(ctx, wmX, wmY, wmPillW, wmPillH, wmPillH / 2);
  ctx.fill();

  ctx.fillStyle = COLORS.watermarkText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`🌸 ${wmText}`, wmX + wmPillW / 2, wmY + wmPillH / 2 + 1);

  // Message
  ctx.textBaseline = 'alphabetic';
  let cursorY = PADDING + IMAGE_BOX_HEIGHT + 70;
  if (message) {
    ctx.fillStyle = COLORS.message;
    ctx.font = '500 38px "Playfair Display", Georgia, serif';
    const lines = wrapText(ctx, `"${message}"`, CARD_WIDTH - PADDING * 2);
    lines.slice(0, 4).forEach(line => {
      ctx.fillText(line, CARD_WIDTH / 2, cursorY);
      cursorY += 50;
    });
    cursorY += 14;
  }

  // Signature
  const signature = [author, location].filter(Boolean).join(', ');
  if (signature) {
    ctx.fillStyle = COLORS.signature;
    ctx.font = '400 26px "Nunito", system-ui, sans-serif';
    ctx.fillText(`— ${signature}`, CARD_WIDTH / 2, cursorY);
  }

  // Tagline
  ctx.fillStyle = COLORS.tagline;
  ctx.font = '600 26px "Nunito", system-ui, sans-serif';
  ctx.fillText('planted in Bloomspace 🌱', CARD_WIDTH / 2, CARD_HEIGHT - 56);

  // Footer link
  ctx.fillStyle = COLORS.footerLink;
  ctx.font = '500 20px "Nunito", system-ui, sans-serif';
  ctx.fillText(PUBLIC_APP_DISPLAY_URL, CARD_WIDTH / 2, CARD_HEIGHT - 24);

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Could not create share card.'));
    }, 'image/png');
  });
}

export { createShareCardBlob };
