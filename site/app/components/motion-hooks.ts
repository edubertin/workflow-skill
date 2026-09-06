'use client';
import { useEffect, useState, type RefObject } from 'react';
export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}
export function useInView(ref: RefObject<HTMLElement | null>): { visible: boolean; supported: boolean } {
  const [state, setState] = useState({ visible: true, supported: false });
  useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window)) return;
    try {
      const observer = new IntersectionObserver(([entry]) => setState({ visible: entry.isIntersecting, supported: true }));
      observer.observe(ref.current);
      return () => observer.disconnect();
    } catch (error) { console.error('Visibility observation unavailable', error); }
  }, [ref]);
  return state;
}
export function observeScroll(update: () => void): () => void {
  let frame = 0;
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  return () => { window.removeEventListener('scroll', schedule); cancelAnimationFrame(frame); };
}
