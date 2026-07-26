import { CHAPTERS } from '../data/chapters';
import ChapterCard from './ChapterCard';

export default function StoryChapters({ open }) {
  return (
    <div id="story-gate" className={`story-gate ${open ? 'open' : ''}`}>
      <section id="story">
        {CHAPTERS.map((chapter) => (
          <ChapterCard key={chapter.num} chapter={chapter} />
        ))}
      </section>
    </div>
  );
}
