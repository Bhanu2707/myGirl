import { GREETING } from '../data/reasons';
import { burstParticles } from '../hooks/useParticles';
import { logClick } from '../lib/analytics';

export default function Greeting({ onOpen }) {
  function handleClick() {
    burstParticles(['♡'], window.innerWidth / 2, 50);
    logClick('open_heart');
    onOpen();
  }

  return (
    <section id="greeting">
      <div>
        <h1 className="greeting-title">{GREETING.title}</h1>
        <p className="greeting-sub">{GREETING.subtitle}</p>
        <button className="glow-btn" id="open-heart-btn" onClick={handleClick}>
          Open It
        </button>
      </div>
    </section>
  );
}
