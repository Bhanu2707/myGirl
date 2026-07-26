import { STORY_INTRO } from '../data/reasons';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { logClick } from '../lib/analytics';

export default function StoryIntro({ onRead }) {
  const [ref, inView] = useScrollReveal(0.3);

  function handleClick() {
    logClick('read_story');
    onRead();
  }

  return (
    <section id="story-intro">
      <div ref={ref} className={`story-intro reveal zoom ${inView ? 'in-view' : ''}`}>
        <p className="line1">{STORY_INTRO.line1}</p>
        <p className="line2">{STORY_INTRO.line2}</p>
        <button className="glow-btn" onClick={handleClick}>Read My Story</button>
      </div>
    </section>
  );
}
