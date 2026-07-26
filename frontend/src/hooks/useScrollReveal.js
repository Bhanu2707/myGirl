import { useEffect, useRef, useState } from 'react';

/**
 * Attaches an IntersectionObserver to the returned ref.
 * Once the element crosses `threshold` visibility it flips `inView` to
 * true and stays true (one-way reveal, matches the rest of the site).
 */
export function useScrollReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
