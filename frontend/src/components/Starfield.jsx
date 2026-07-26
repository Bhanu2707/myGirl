import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);
  const stateRef = useRef({ W: 0, H: 0, stars: [], flies: [] });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    function buildFields() {
      const STAR_COUNT = Math.min(140, Math.floor((state.W * state.H) / 9000));
      state.stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * state.W, y: Math.random() * state.H,
        r: Math.random() * 1.4 + 0.3, tw: Math.random() * Math.PI * 2, speed: Math.random() * 0.015 + 0.005,
      }));
      const FIREFLY_COUNT = 22;
      state.flies = Array.from({ length: FIREFLY_COUNT }, () => ({
        x: Math.random() * state.W, y: Math.random() * state.H,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 1, phase: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      state.W = canvas.width = window.innerWidth;
      state.H = canvas.height = document.documentElement.scrollHeight;
      if (state.stars.length === 0) buildFields();
    }
    resize();
    window.addEventListener('resize', resize);

    // Recheck document height periodically — gated sections (story, pandi
    // panel) change scrollHeight after mount without a window resize event.
    const growInterval = setInterval(() => {
      const newH = document.documentElement.scrollHeight;
      if (newH > state.H) {
        const oldH = state.H;
        state.H = canvas.height = newH;
        const addedRatio = (newH - oldH) / Math.max(oldH, 1);
        const newStars = Math.floor(state.stars.length * addedRatio);
        for (let i = 0; i < newStars; i++) {
          state.stars.push({ x: Math.random() * state.W, y: oldH + Math.random() * (newH - oldH), r: Math.random() * 1.4 + 0.3, tw: Math.random() * Math.PI * 2, speed: Math.random() * 0.015 + 0.005 });
        }
        const newFlies = Math.ceil(state.flies.length * addedRatio * 0.6);
        for (let i = 0; i < newFlies; i++) {
          state.flies.push({ x: Math.random() * state.W, y: oldH + Math.random() * (newH - oldH), vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: Math.random() * 1.6 + 1, phase: Math.random() * Math.PI * 2 });
        }
      }
    }, 500);

    let raf;
    function draw() {
      ctx.clearRect(0, 0, state.W, state.H);
      state.stars.forEach((s) => {
        s.tw += s.speed;
        const alpha = 0.35 + Math.sin(s.tw) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(250,243,231,${Math.max(0, alpha)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      state.flies.forEach((f) => {
        f.x += f.vx; f.y += f.vy; f.phase += 0.02;
        if (f.x < 0 || f.x > state.W) f.vx *= -1;
        if (f.y < 0 || f.y > state.H) f.vy *= -1;
        const a = 0.4 + Math.sin(f.phase) * 0.4;
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 10);
        grad.addColorStop(0, `rgba(238,207,160,${Math.max(0, a)})`);
        grad.addColorStop(1, 'rgba(238,207,160,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 10, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(growInterval);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="bg-canvas" ref={canvasRef} />;
}
