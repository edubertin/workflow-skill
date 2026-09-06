'use client';
import { createContext, useContext, useEffect, useState } from 'react';
type MotionPolicy = {
  paused: boolean; reduced: boolean; ready: boolean; running: boolean;
  visible: boolean; toggle: () => void;
};
const MotionContext = createContext<MotionPolicy | null>(null);
function useEnvironment(): { reduced: boolean; ready: boolean; visible: boolean } {
  const [state, setState] = useState({ reduced: true, ready: false, visible: true });
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setState({ reduced: query.matches, ready: true, visible: !document.hidden });
    update();
    query.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      query.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  return state;
}
export function MotionProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [paused, setPaused] = useState(false);
  const { reduced, ready, visible } = useEnvironment();
  const running = ready && !paused && !reduced && visible;
  const mode = !ready ? 'loading' : reduced ? 'reduced' : paused ? 'paused' : !visible ? 'hidden' : 'running';
  return <MotionContext.Provider value={{ paused, reduced, ready, running, visible, toggle: () => setPaused(value => !value) }}>
    <div className="motion-root" data-motion={mode} data-ready={ready}>{children}</div>
  </MotionContext.Provider>;
}
export function useMotion(): MotionPolicy {
  const value = useContext(MotionContext);
  if (!value) throw new Error('MotionProvider is required.');
  return value;
}
