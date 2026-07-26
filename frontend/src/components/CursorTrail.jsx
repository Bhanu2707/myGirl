import { useEffect, useRef } from 'react';

export default function CursorTrail() {
  const glowRef = useRef(null);
  const ringRef = useRef(null);
  const real = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const eased = useRef({ x: real.current.x, y: real.current.y });

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return undefined;

    function onMove(e) {
      real.current.x = e.clientX;
      real.current.y = e.clientY;
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px';
        glowRef.current.style.top = e.clientY + 'px';
      }
    }
    window.addEventListener('mousemove', onMove);

    let raf;
    function loop() {
      eased.current.x += (real.current.x - eased.current.x) * 0.18;
      eased.current.y += (real.current.y - eased.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = eased.current.x + 'px';
        ringRef.current.style.top = eased.current.y + 'px';
      }
      raf = requestAnimationFrame(loop);
    }
    loop();

    function onOver(e) {
      if (e.target.closest('button, .image-frame, .fruit, .reason-card')) {
        ringRef.current.style.transform = 'translate(-50%,-50%) scale(1.6)';
      }
    }
    function onOut(e) {
      if (e.target.closest('button, .image-frame, .fruit, .reason-card')) {
        ringRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
      }
    }
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cursor-glow" ref={glowRef} />
      <div id="cursor-ring" ref={ringRef} />
    </>
  );
}
