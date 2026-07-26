import { REASONS_PARAGRAPHS, STORY_TEASER } from '../data/reasons';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function ReasonsCard() {
  const [headRef, headInView] = useScrollReveal(0.3);
  const [bodyRef, bodyInView] = useScrollReveal(0.2);

  return (
    <section id="reasons">
      <div ref={headRef} className={`section-head reveal ${headInView ? 'in-view' : ''}`}>
        <p className="eyebrow">Just one, really</p>
        <h2>Reasons You're Amazing</h2>
        <div className="section-line" />
      </div>

      <div ref={bodyRef} className={`reasons-wrap reveal zoom ${bodyInView ? 'in-view' : ''}`}>
        <div className="chapter-card">
          {REASONS_PARAGRAPHS.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
          <p className="reasons-teaser">{STORY_TEASER}</p>
        </div>
      </div>
    </section>
  );
}
