import { useState } from 'react';
import { WISHES, FRUIT_POSITIONS } from '../data/wishes';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function WishTree() {
  const [headRef, headInView] = useScrollReveal(0.3);
  const [treeRef, treeInView] = useScrollReveal(0.2);
  const [activeWish, setActiveWish] = useState('');

  function revealWish(wish) {
    setActiveWish('');
    setTimeout(() => setActiveWish(wish), 150);
  }

  return (
    <section id="wish-tree">
      <div ref={headRef} className={`section-head reveal ${headInView ? 'in-view' : ''}`}>
        <p className="eyebrow">Make a wish</p>
        <h2>The Wish Tree</h2>
        <div className="section-line" />
      </div>

      <div ref={treeRef} className={`tree-wrap reveal zoom ${treeInView ? 'in-view' : ''}`}>
        <svg viewBox="0 0 400 440" aria-hidden="true">
          <defs>
            <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2b1f18" />
              <stop offset="100%" stopColor="#4a3527" />
            </linearGradient>
            <radialGradient id="canopyGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#3a3f2e" />
              <stop offset="100%" stopColor="#232a1c" />
            </radialGradient>
          </defs>
          <path d="M200 430 C194 360 188 320 192 270 C196 230 204 230 208 270 C212 320 206 360 200 430 Z" fill="url(#trunkGrad)" />
          <path d="M198 300 C170 288 150 270 138 248" stroke="#3a2a20" strokeWidth="9" fill="none" strokeLinecap="round" />
          <path d="M204 300 C232 288 252 270 264 248" stroke="#3a2a20" strokeWidth="9" fill="none" strokeLinecap="round" />
          <ellipse cx="140" cy="190" rx="92" ry="78" fill="url(#canopyGrad)" />
          <ellipse cx="260" cy="185" rx="98" ry="82" fill="url(#canopyGrad)" />
          <ellipse cx="200" cy="140" rx="115" ry="95" fill="url(#canopyGrad)" />
          <ellipse cx="200" cy="150" rx="180" ry="130" fill="rgba(238,207,160,0.05)" />
        </svg>

        <div id="tree-leaves">
          {WISHES.map((wish, i) => (
            <button
              key={wish}
              className="fruit"
              style={{
                left: FRUIT_POSITIONS[i % FRUIT_POSITIONS.length].left,
                top: FRUIT_POSITIONS[i % FRUIT_POSITIONS.length].top,
                animationDelay: `${i * 0.3}s`,
              }}
              aria-label="Reveal a wish"
              onClick={() => revealWish(wish)}
            />
          ))}
        </div>
      </div>

      <p className={`wish-message ${activeWish ? 'show' : ''}`}>{activeWish}</p>
      <p className="tree-hint">tap a glowing fruit</p>
    </section>
  );
}
