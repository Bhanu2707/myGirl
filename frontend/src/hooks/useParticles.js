import { useEffect } from 'react';

// Tiny module-level pub/sub so components anywhere in the tree (Greeting,
// ImageReveal, MessageForm...) can trigger a burst on <FloatingParticles />
// without prop-drilling a ref through the whole app.
const listeners = new Set();

/**
 * Call from FloatingParticles to receive burst requests.
 */
export function useParticleListener(onBurst) {
  useEffect(() => {
    listeners.add(onBurst);
    return () => listeners.delete(onBurst);
  }, [onBurst]);
}

/**
 * Call from anywhere to fire a burst of particles.
 * @param {string[]} symbols - characters to choose from, e.g. ['♡','✦']
 * @param {number} xPosition - viewport x in px for the burst origin
 * @param {number} count - how many particles to spawn
 */
export function burstParticles(symbols, xPosition, count = 12) {
  listeners.forEach((fn) => fn(symbols, xPosition, count));
}

export function useParticles() {
  return { burst: burstParticles };
}
