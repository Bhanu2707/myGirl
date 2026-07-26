import { useEffect, useRef, useState } from 'react';

/**
 * Reveals `text` a few characters at a time once `start` becomes true.
 * Only ever types once — matches the "letter being written" effect used
 * across the chapter cards. Returns the currently-visible slice and
 * whether typing has finished (so callers can hide the blinking cursor).
 */
export function useTypewriter(text, start) {
  const [visible, setVisible] = useState('');
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    let i = 0;
    let timeoutId;

    function step() {
      if (i <= text.length) {
        setVisible(text.slice(0, i));
        i += 1;
        timeoutId = setTimeout(step, 14 + Math.random() * 18);
      } else {
        setDone(true);
      }
    }

    const kickoff = setTimeout(step, 350);
    return () => {
      clearTimeout(kickoff);
      clearTimeout(timeoutId);
    };
  }, [start, text]);

  return { visible, done };
}
