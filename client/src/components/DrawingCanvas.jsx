import { forwardRef, useRef, useImperativeHandle, useEffect } from 'react';

const DrawingCanvas = forwardRef(function DrawingCanvas({ color, strokeSize }, ref) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const activeStroke = useRef(null);
  const strokesRef = useRef([]);
  const redoStackRef = useRef([]);

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

  function redrawAll() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokesRef.current.forEach(stroke => {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.beginPath();
        ctx.moveTo(stroke.points[i - 1].x, stroke.points[i - 1].y);
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        ctx.stroke();
      }
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeSize;
  }

  useImperativeHandle(ref, () => ({
    clear() {
      const canvas = canvasRef.current;
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      strokesRef.current = [];
      redoStackRef.current = [];
    },
    undo() {
      if (strokesRef.current.length === 0) return;
      const last = strokesRef.current.pop();
      redoStackRef.current.push(last);
      redrawAll();
    },
    redo() {
      if (redoStackRef.current.length === 0) return;
      const stroke = redoStackRef.current.pop();
      strokesRef.current.push(stroke);
      redrawAll();
    },
    hasDrawing() {
      return strokesRef.current.length > 0;
    },
    save() {
      if (strokesRef.current.length === 0) return false;
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
    getStrokes() {
      return strokesRef.current;
    },
    loadStrokes(strokes) {
      strokesRef.current = Array.isArray(strokes)
        ? strokes.filter(s => s && Array.isArray(s.points))
        : [];
      redoStackRef.current = [];
      redrawAll();
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
    const pos = getPos(e);
    lastPos.current = pos;
    activeStroke.current = { color, size: strokeSize, points: [pos] };
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
    activeStroke.current.points.push(pos);
  }

  function stopDrawing() {
    if (drawing.current && activeStroke.current?.points.length > 1) {
      strokesRef.current.push(activeStroke.current);
      redoStackRef.current = [];
    }
    activeStroke.current = null;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- startDrawing/draw only close over color and strokeSize, both listed
  }, [color, strokeSize]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={800}
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
