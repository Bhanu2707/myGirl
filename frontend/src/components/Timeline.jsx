import { TIMELINE_ITEMS } from '../data/timeline';
import TimelineCard from './TimelineCard';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Timeline() {
  const [headRef, headInView] = useScrollReveal(0.3);

  return (
    <section id="about-her">
      <div ref={headRef} className={`section-head reveal ${headInView ? 'in-view' : ''}`}>
        <p className="eyebrow">Before anything else</p>
        <h2>About You</h2>
        <div className="section-line" />
      </div>

      {TIMELINE_ITEMS.map((item) => (
        <TimelineCard key={item.index} item={item} />
      ))}
    </section>
  );
}
