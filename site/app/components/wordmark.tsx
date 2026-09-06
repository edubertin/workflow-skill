'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useMotion } from './motion-provider';
import { useInView } from './motion-hooks';
function useFontReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    let timer = 0;
    const start = () => { if (active) timer = window.setTimeout(() => setReady(true), 350); };
    document.fonts.ready.then(start).catch(error => { console.error('Wordmark font readiness unavailable', error); start(); });
    return () => { active = false; window.clearTimeout(timer); };
  }, []);
  return ready;
}
export function Wordmark(): React.JSX.Element {
  const [pass, setPass] = useState(0);
  const ref = useRef<HTMLAnchorElement>(null);
  const { running } = useMotion();
  const { visible } = useInView(ref);
  const illuminated = useFontReady();
  const repeat = () => { if (running) setPass(value => value + 1); };
  return <Link ref={ref} className="wordmark" href="/" aria-label="Workflow, início" data-illuminated={illuminated} data-active={visible} data-pass={pass % 2} onMouseEnter={repeat} onFocus={repeat}>
    <span className="wordmark-letters" aria-hidden="true">{Array.from('WORKFLOW').map((letter, index) =>
      <span className="wordmark-letter" key={index} style={{ animationDelay: index * 90 + 'ms' }}>{letter}</span>)}</span>
    <span className="wordmark-badge" aria-hidden="true">SKILL</span>
  </Link>;
}
