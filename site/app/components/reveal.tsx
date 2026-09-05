'use client';
import { useEffect, useRef } from 'react';
import { useMotion } from './motion-provider';
export function Reveal({ children }: { children: React.ReactNode }): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const { ready, paused, reduced, visible } = useMotion();
  useEffect(() => {
    const node = ref.current;
    if (!ready || !node) return;
    if (paused || reduced || !visible || !('IntersectionObserver' in window)) {
      finished.current = true; node.dataset.reveal = 'visible'; return;
    }
    if (finished.current) return;
    try {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.reveal = 'revealed'; finished.current = true; observer.disconnect();
        }
      }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
      observer.observe(node);
      if (node.getBoundingClientRect().top > window.innerHeight) node.dataset.reveal = 'pending';
      return () => observer.disconnect();
    } catch (error) {
      console.error('Section reveal unavailable', error);
      finished.current = true; node.dataset.reveal = 'visible';
    }
  }, [ready, paused, reduced, visible]);
  return <div ref={ref} className="reveal" onAnimationEnd={event => { if (event.target === event.currentTarget) event.currentTarget.dataset.reveal = 'visible'; }}>{children}</div>;
}
