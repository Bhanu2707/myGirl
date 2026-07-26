import { useScrollReveal } from '../hooks/useScrollReveal';
import { useTypewriter } from '../hooks/useTypewriter';

const REVEAL_CLASS = {
  base: '',
  'from-left': 'from-left',
  'from-right': 'from-right',
  zoom: 'zoom',
};

export default function ChapterCard({ chapter }) {
  const [ref, inView] = useScrollReveal(0.35);
  const { visible, done } = useTypewriter(chapter.text, inView);
  const revealClass = REVEAL_CLASS[chapter.reveal] || '';

  return (
    <div ref={ref} className={`chapter reveal ${revealClass} ${inView ? 'in-view' : ''}`}>
      <div className="chapter-num">{chapter.num}</div>
      <div className="chapter-card">
        <h3>{chapter.title}</h3>
        <p className="letter-text">
          {visible}
          {!done && <span className="cursor-blink" />}
        </p>
      </div>
    </div>
  );
}
