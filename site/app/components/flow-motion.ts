'use client';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useMotion } from './motion-provider';
import { observeScroll, useInView, useMedia } from './motion-hooks';
function observeIntent(intent: RefObject<boolean>): () => void {
  const mark = () => { intent.current = true; };
  const key = (event: KeyboardEvent) => {
    const target = event.target;
    if (target instanceof HTMLElement && (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName))) return;
    if (['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End', ' '].includes(event.key)) mark();
  };
  const pointer = (event: PointerEvent) => { if (event.target === document.documentElement) mark(); };
  window.addEventListener('wheel', mark, { passive: true });
  window.addEventListener('touchmove', mark, { passive: true });
  window.addEventListener('keydown', key);
  window.addEventListener('pointerdown', pointer);
  return () => {
    window.removeEventListener('wheel', mark); window.removeEventListener('touchmove', mark);
    window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', pointer);
  };
}
export function useFlowMotion(ref: RefObject<HTMLElement | null>): {
  active: number; select: (index: number) => void; toggle: () => void;
  playing: boolean; desktop: boolean; running: boolean; reduced: boolean; paused: boolean;
} {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { running, reduced, paused, ready } = useMotion();
  const wide = useMedia('(min-width: 961px) and (min-height: 720px)');
  const { visible: inView, supported } = useInView(ref);
  const desktop = ready && wide && !reduced && supported;
  const intent = useRef(false);
  useEffect(() => { intent.current = false; }, [running, desktop]);
  useEffect(() => desktop ? observeIntent(intent) : undefined, [desktop]);
  useEffect(() => {
    if (!desktop || !running || !inView) return;
    return observeScroll(() => {
      if (!intent.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      setActive(Math.min(4, Math.floor(progress * 5)));
    });
  }, [desktop, running, inView, ref]);
  useEffect(() => {
    if (desktop || !playing || !running || !inView) return;
    const timer = window.setTimeout(() => setActive(value => (value + 1) % 5), 4000);
    return () => window.clearTimeout(timer);
  }, [desktop, playing, running, inView, active]);
  const select = (index: number) => { intent.current = false; setPlaying(false); setActive(index); };
  return { active, select, toggle: () => setPlaying(value => !value), playing, desktop, running, reduced, paused };
}
