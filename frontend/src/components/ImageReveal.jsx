

import { useRef, useState } from 'react';
import { IMAGE_SECTION } from '../data/reasons';
import { burstParticles } from '../hooks/useParticles';
import { useScrollReveal } from '../hooks/useScrollReveal';
import music from '/music/song.aac'

const HER_BURST_SYMBOLS = ['♡', '✦', '💫', '⭐', '🎶', '🕊️', '💖', '💕', '🎈', '🎀', '🌸', '✨', '💗'];
const GUITAR_BURST_SYMBOLS = ['✦', '⭐', '✨', '🎸', '💫', '🌟', '🎈', '💖'];

export default function ImageReveal() {
  const [tagRef, tagInView] = useScrollReveal(0.3);
  const [frameRef, frameInView] = useScrollReveal(0.2);
  const frameElRef = useRef(null);
  const audioRef = useRef(null);

  const [current, setCurrent] = useState('guitar');
  const [everToggled, setEverToggled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const rect = frameElRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;

    if (current === 'guitar') {
      setCurrent('her');
      burstParticles(HER_BURST_SYMBOLS, x, 50);
    } else {
      setCurrent('guitar');
      burstParticles(GUITAR_BURST_SYMBOLS, x, 28);
    }
    setEverToggled(true);

    // Play song on click
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }

  function handleStop(e) {
    e.stopPropagation(); // don't toggle image
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }

  const captionText = !everToggled
    ? IMAGE_SECTION.caption
    : (current === 'guitar' ? IMAGE_SECTION.hintGuitar : IMAGE_SECTION.hintHer);

  return (
    <section id="image-section">
      {/* Put your song in public/music/ — change path if needed */}
      <audio ref={audioRef} src={music} loop preload="auto" />

      <p ref={tagRef} className={`tag eyebrow reveal ${tagInView ? 'in-view' : ''}`}>
        {IMAGE_SECTION.tag}
      </p>

      <div
        ref={(node) => { frameRef.current = node; frameElRef.current = node; }}
        className={`image-frame reveal zoom ${frameInView ? 'in-view' : ''}`}
        onClick={handleClick}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <img
          src="/images/guitar-sketch.png"
          className={current === 'guitar' ? 'active' : ''}
          alt="A little sketch I kept"
        />
        <img
          src="/images/her-photo.jpg"
          className={current === 'her' ? 'active' : ''}
          alt="A moment I kept"
        />
      </div>

      {/* Stop button — only shows while song is playing */}
      {isPlaying && (
        <button
          type="button"
          onClick={handleStop}
          className="music-stop-btn"
          style={{
            margin: '12px auto 0',
            display: 'block',
            padding: '8px 18px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.08)',
            color: 'var(--cream, #f5f0e8)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            letterSpacing: '0.04em',
          }}
        >
          ■ Stop song
        </button>
      )}

      <p className="image-caption">{captionText}</p>
      <p className={`after-reveal-text ${everToggled ? 'show' : ''}`}>
        {IMAGE_SECTION.afterRevealText}
      </p>
    </section>
  );
}