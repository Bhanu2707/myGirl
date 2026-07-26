import { ENDING_TEXT } from '../data/reasons';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Ending() {
  const [ref, inView] = useScrollReveal(0.3);

  return (
    <section id="ending">
      <div ref={ref} className={`reveal zoom ${inView ? 'in-view' : ''}`}>
        <p className="eyebrow">One more wish</p>
        <h2>Happy Birthday, always.</h2>
        <p>{ENDING_TEXT}</p>
      </div>
    </section>
  );
}
