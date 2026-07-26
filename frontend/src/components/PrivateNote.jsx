import { useState } from 'react';
import { FINAL_NOTE_INTRO, PANDI_HEART } from '../data/reasons';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { logClick } from '../lib/analytics';

export default function PrivateNote() {
  const [ref, inView] = useScrollReveal(0.3);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    logClick('open_pandi_heart');
    setOpen(true);
  }

  return (
    <section id="final-note">
      <div ref={ref} className={`reveal zoom ${inView ? 'in-view' : ''}`}>
        <p className="eyebrow">Before you go</p>
        {FINAL_NOTE_INTRO.map((line) => (
          <p key={line.slice(0, 20)} className="final-note-text">{line}</p>
        ))}
        {!open && (
          <button className="glow-btn" onClick={handleOpen}>
            Open Pandi's Heart
          </button>
        )}
      </div>

      <div className={`pandi-panel ${open ? 'open' : ''}`}>
        <div className="chapter-card">
          {PANDI_HEART.map((line) => (
            <p key={line.slice(0, 20)} className="about-para">{line}</p>
          ))}
        </div>
        {open && (
          <button className="glow-btn" onClick={() => setOpen(false)}>
            Close Your Pandi Heart
          </button>
        )}
      </div>
    </section>
  );
}
