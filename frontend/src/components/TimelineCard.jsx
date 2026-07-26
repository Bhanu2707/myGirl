import { useScrollReveal } from '../hooks/useScrollReveal';

export default function TimelineCard({ item }) {
  const [ref, inView] = useScrollReveal(0.2);
  const directionClass = item.direction === 'left' ? 'from-left' : 'from-right';

  return (
    <div ref={ref} className={`chapter reveal ${directionClass} ${inView ? 'in-view' : ''}`}>
      <div className="chapter-num">{item.date}</div>
      <div className="chapter-card">
        <div className="chapter-icon" aria-hidden="true">{item.icon}</div>
        <h3>{item.title}</h3>
        <p className="about-para">{item.body}</p>
      </div>
    </div>
  );
}
