'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useMotion } from './motion-provider';
export function Wordmark(): React.JSX.Element {
  const [pass, setPass] = useState(0);
  const { running } = useMotion();
  const repeat = () => { if (running) setPass(value => value + 1); };
  return <Link className="wordmark" href="/" aria-label="Workflow, início" onMouseEnter={repeat} onFocus={repeat}>
    <span className="wordmark-letters" aria-hidden="true" key={pass}>{Array.from('WORKFLOW').map((letter, index) =>
      <span className="wordmark-letter" key={index} style={{ animationDelay: index * 60 + 'ms' }}>{letter}</span>)}</span>
    <span className="wordmark-badge" aria-hidden="true">SKILL</span>
  </Link>;
}
