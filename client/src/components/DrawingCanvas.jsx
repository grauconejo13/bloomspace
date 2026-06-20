import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';

const DrawingCanvas = forwardRef(function DrawingCanvas({ color, strokeSize }, ref) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const hasDrawingRef = useRef(false);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeSize;
  }, [color, strokeSize]);

  useImperativeHandle(ref, () => ({
    clear() {
      const canvas = canvasRef.current;
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      hasDrawingRef.current = false;
    },
    hasDrawing() {
      return hasDrawingRef.current;
    },
    save() {
      if (!hasDrawingRef.current) return false;
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'my-bloom.png';
      link.click();
      return true;
    },
    getDataURL() {
      return canvasRef.current.toDataURL();
    },
  }));

  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  }

  function startDrawing(e) {
    drawing.current = true;
    lastPos.current = getPos(e);
  }

  function draw(e) {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    hasDrawingRef.current = true;
  }

  function stopDrawing() {
    drawing.current = false;
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    function onTouchStart(e) {
      e.preventDefault();
      startDrawing(e);
    }

    function onTouchMove(e) {
      e.preventDefault();
      draw(e);
    }

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   stopDrawing);

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('touchend',   stopDrawing);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={440}
      className="w-full rounded-2xl cursor-crosshair block"
      style={{
        background: '#fffbf5',
        border: '1.5px dashed rgba(122, 171, 120, 0.38)',
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
});

export default DrawingCanvas;
