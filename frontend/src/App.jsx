import { useEffect, useRef, useState } from 'react';
import Starfield from './components/Starfield';
import CursorTrail from './components/CursorTrail';
import FloatingParticles from './components/FloatingParticles';
import Greeting from './components/Greeting';
import Timeline from './components/Timeline';
import ReasonsCard from './components/ReasonsCard';
import WishTree from './components/WishTree';
import ImageReveal from './components/ImageReveal';
import StoryIntro from './components/StoryIntro';
import StoryChapters from './components/StoryChapters';
import PrivateNote from './components/PrivateNote';
import MessageForm from './components/MessageForm';
import Ending from './components/Ending';
import BackToTop from './components/BackToTop';

function Loader({ hidden }) {

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// This hook runs AUTOMATICALLY once when the page loads
  useEffect(() => {
    
    const trackUser = async () => {
      try {
        // Call your Node.js server route
        const response = await fetch(`${API_URL}/api/track-visitor`);
      } catch{
        console.log("hii");
      }
    };

    trackUser(); // Execute the function

  }, []); // <-- The empty brackets [] mean "only run once on page load"


  const [pct, setPct] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          clearInterval(id);
          return 100;
        }
        return Math.min(100, p + Math.random() * 9 + 3);
      });
    }, 160);
    return () => clearInterval(id);
  }, []);

  return (
    <div id="loader" className={hidden ? 'hidden' : ''} style={{
      position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #1b1440 0%, #0b0e23 70%)',
      transition: 'opacity 1.1s ease, visibility 1.1s ease',
      opacity: hidden ? 0 : 1, visibility: hidden ? 'hidden' : 'visible', pointerEvents: hidden ? 'none' : 'auto',
    }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(1.1rem,2.4vw,1.7rem)', color: 'var(--cream)', letterSpacing: '.08em', marginBottom: '1.4rem', opacity: .9 }}>
        Preparing something beautiful...
      </div>
      <div style={{
        fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.4rem,7vw,4rem)', fontWeight: 600,
        background: 'linear-gradient(90deg, var(--rose), var(--champagne))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
      }}>
        {Math.floor(pct)}%
      </div>
      <div style={{ width: 'min(260px,60vw)', height: '2px', background: 'rgba(255,255,255,.12)', marginTop: '1.6rem', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--rose), var(--champagne))' }} />
      </div>
    </div>
  );
}

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const progressRef = useRef(null);

  // loader hides itself ~2s after mount regardless of exact percentage timing
  useEffect(() => {
    const t = setTimeout(() => setLoaderDone(true), 2200);
    return () => clearTimeout(t);
  }, []);

  // scroll lock until "Open My Heart" is clicked — greeting stays in the
  // normal document flow the whole time, it's just unreachable until then
  useEffect(() => {
    document.documentElement.classList.toggle('locked', !unlocked);
    document.body.classList.toggle('locked', !unlocked);
  }, [unlocked]);

  // scroll progress bar
  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      if (progressRef.current) progressRef.current.style.width = `${isFinite(pct) ? pct : 0}%`;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // click ripple, everywhere
  useEffect(() => {
    function onClick(e) {
      const r = document.createElement('div');
      r.className = 'ripple';
      r.style.width = r.style.height = '60px';
      r.style.left = `${e.clientX}px`;
      r.style.top = `${e.clientY}px`;
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 900);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  function handleOpenHeart() {
    setUnlocked(true);
    requestAnimationFrame(() => {
      document.getElementById('about-her')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function handleReadStory() {
    if (storyOpen) return;
    setStoryOpen(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    });
  }

  return (
    <>
      <Loader hidden={loaderDone} />
      <CursorTrail />
      <div id="scroll-progress" ref={progressRef} />
      <Starfield />
      <FloatingParticles />

      <main>
        <Greeting onOpen={handleOpenHeart} />
        <Timeline />
        <ReasonsCard />
        <WishTree />
        <ImageReveal />
        <StoryIntro onRead={handleReadStory} />
        <StoryChapters open={storyOpen} />
        <PrivateNote />
        <MessageForm />
        <Ending />
      </main>

      <BackToTop />
    </>
  );
}
