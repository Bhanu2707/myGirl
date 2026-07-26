import { useRef, useState } from 'react';
import { IMAGE_SECTION } from '../data/reasons';
import { burstParticles } from '../hooks/useParticles';
import { useScrollReveal } from '../hooks/useScrollReveal';

const HER_BURST_SYMBOLS = ['♡', '✦', '💫', '⭐', '🎶', '🕊️'];
const GUITAR_BURST_SYMBOLS = ['✦'];

export default function ImageReveal() {
  const [tagRef, tagInView] = useScrollReveal(0.3);
  const [frameRef, frameInView] = useScrollReveal(0.2);
  const frameElRef = useRef(null);
  const [current, setCurrent] = useState('guitar');
  const [everToggled, setEverToggled] = useState(false);

  function handleClick() {
    const rect = frameElRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;

    if (current === 'guitar') {
      setCurrent('her');
      burstParticles(HER_BURST_SYMBOLS, x, 34);
    } else {
      setCurrent('guitar');
      burstParticles(GUITAR_BURST_SYMBOLS, x, 14);
    }
    setEverToggled(true);
  }

  const captionText = !everToggled
    ? IMAGE_SECTION.caption
    : (current === 'guitar' ? IMAGE_SECTION.hintGuitar : IMAGE_SECTION.hintHer);

  return (
    <section id="image-section">
      <p ref={tagRef} className={`tag eyebrow reveal ${tagInView ? 'in-view' : ''}`}>{IMAGE_SECTION.tag}</p>

      <div
        ref={(node) => { frameRef.current = node; frameElRef.current = node; }}
        className={`image-frame reveal zoom ${frameInView ? 'in-view' : ''}`}
        onClick={handleClick}
      >
        <img src="/images/guitar-sketch.png" className={current === 'guitar' ? 'active' : ''} alt="A little sketch I kept" />
        <img src="/images/her-photo.jpg" className={current === 'her' ? 'active' : ''} alt="A moment I kept" />
      </div>

      <p className="image-caption">{captionText}</p>
      <p className={`after-reveal-text ${everToggled ? 'show' : ''}`}>{IMAGE_SECTION.afterRevealText}</p>
    </section>
  );
}
