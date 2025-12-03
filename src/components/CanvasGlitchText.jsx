import React, { useRef, useEffect } from 'react';

function CanvasGlitchText({ text }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Правильный numeric size
    canvas.width = 600;
    canvas.height = 120;

    ctx.font = '60px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'top';

    const letterPositions = [];
    let x = 0;
    text.split('').forEach((char) => {
      const width = ctx.measureText(char).width;
      letterPositions.push({ char, x, width });
      x += width + 5;
    });

    const activeGlitches = [];
    const glitchTypes = ['fragments', 'horizontal', 'noise', 'rgbSplit', 'artifacts'];

    const startGlitch = (letterIndex) => {
      const type = glitchTypes[Math.floor(Math.random() * glitchTypes.length)];
      const duration = 80 + Math.random() * 120;
      const startTime = Date.now();
      activeGlitches.push({ letterIndex, type, startTime, duration });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Основной текст
      letterPositions.forEach((pos) => {
        ctx.fillText(pos.char, pos.x, 30);
      });

      // Глюки
      activeGlitches.forEach((glitch, idx) => {
        const elapsed = Date.now() - glitch.startTime;
        const progress = Math.min(elapsed / glitch.duration, 1);
        const pos = letterPositions[glitch.letterIndex];

        if (glitch.type === 'fragments') {
          for (let i = 0; i < 20; i++) {
            const px = pos.x + Math.random() * pos.width;
            const py = 30 + Math.random() * 60;
            const offsetX = (Math.random() - 0.5) * 5 * (1 - progress);
            const offsetY = (Math.random() - 0.5) * 5 * (1 - progress);
            ctx.fillStyle = `rgba(255,255,255,${1 - progress})`;
            ctx.fillRect(px + offsetX, py + offsetY, 2, 2);
          }
        } else if (glitch.type === 'horizontal') {
          for (let i = 0; i < 10; i++) {
            const y = 30 + i * 6;
            const offsetX = (Math.random() - 0.5) * 3 * (1 - progress);
            ctx.fillStyle = `rgba(255,255,255,${1 - progress})`;
            ctx.fillRect(pos.x + offsetX, y, pos.width, 1);
          }
        } else if (glitch.type === 'noise') {
          for (let i = 0; i < 50; i++) {
            const px = pos.x + Math.random() * pos.width;
            const py = 30 + Math.random() * 60;
            const offsetX = (Math.random() - 0.5) * 2 * (1 - progress);
            const offsetY = (Math.random() - 0.5) * 2 * (1 - progress);
            ctx.fillStyle = `rgba(255,255,255,${1 - progress})`;
            ctx.fillRect(px + offsetX, py + offsetY, 1, 1);
          }
        } else if (glitch.type === 'rgbSplit') {
          ctx.fillStyle = `rgba(255,0,0,${1 - progress})`;
          ctx.fillText(pos.char, pos.x - 2, 30);
          ctx.fillStyle = `rgba(0,0,255,${1 - progress})`;
          ctx.fillText(pos.char, pos.x + 2, 30);
        } else if (glitch.type === 'artifacts') {
          for (let i = 0; i < 5; i++) {
            const lx = pos.x + Math.random() * pos.width;
            const ly = 30 + Math.random() * 60;
            ctx.strokeStyle = `rgba(255,255,255,${1 - progress})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx + 10 + Math.random() * 20, ly);
            ctx.stroke();
          }
          for (let i = 0; i < 10; i++) {
            const dx = pos.x + Math.random() * pos.width;
            const dy = 30 + Math.random() * 60;
            ctx.fillStyle = `rgba(255,255,255,${1 - progress})`;
            ctx.beginPath();
            ctx.arc(dx, dy, 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        if (progress >= 1) activeGlitches.splice(idx, 1);
      });

      requestAnimationFrame(draw);
    };

    draw();

    const glitchInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * letterPositions.length);
      startGlitch(randomIndex);
    }, 500 + Math.random() * 700);

    return () => clearInterval(glitchInterval);
  }, [text]);

  // Прозрачный фон
  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '600px',
        height: '120px',
        background: 'transparent'
      }}
    />
  );
}

export default CanvasGlitchText;
