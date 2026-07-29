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
        <p>If we're meant to be together, 
          I'll tell you everything I couldn't say today.And if that day ever comes... 
          I'll be yours, completely.</p>
          <p>And if you've read everything I wrote here, I think you'll have an idea about who I really am. That's exactly me.</p>
      </div>
    </section>
  );
}
