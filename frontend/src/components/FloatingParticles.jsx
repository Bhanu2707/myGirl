import { useCallback, useEffect, useRef } from 'react';
import { useParticleListener } from '../hooks/useParticles';

const AMBIENT_SYMBOLS = ['♡', '✦', '💫', '⭐'];

export default function FloatingParticles() {
  const layerRef = useRef(null);

  const spawnOne = useCallback((symbol, x, color) => {
    const el = document.createElement('div');
    el.className = 'floaty';
    el.textContent = symbol;
    el.style.left = x + 'px';
    el.style.top = (window.scrollY + window.innerHeight - 40) + 'px';
    el.style.fontSize = (Math.random() * 14 + 14) + 'px';
    el.style.color = color;
    el.style.animationDuration = (Math.random() * 4 + 6) + 's';
    layerRef.current.appendChild(el);
    setTimeout(() => el.remove(), 11000);
  }, []);

  // ambient drift, one particle every ~900ms
  useEffect(() => {
    const id = setInterval(() => {
      const symbol = AMBIENT_SYMBOLS[Math.floor(Math.random() * AMBIENT_SYMBOLS.length)];
      const color = Math.random() > 0.5 ? '#e8a3ab' : '#eecfa0';
      spawnOne(symbol, Math.random() * window.innerWidth, color);
    }, 900);
    return () => clearInterval(id);
  }, [spawnOne]);

  // imperative burst, called via burstParticles(...) from anywhere
  const handleBurst = useCallback((symbols, xPosition, count) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const color = Math.random() > 0.5 ? '#e8a3ab' : '#eecfa0';
        const x = xPosition + (Math.random() - 0.5) * 160;
        spawnOne(symbol, x, color);
      }, i * 70);
    }
  }, [spawnOne]);
  useParticleListener(handleBurst);

  return <div ref={layerRef} id="particle-layer" />;
}
