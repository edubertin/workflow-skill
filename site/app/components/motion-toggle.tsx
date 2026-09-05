'use client';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMotion } from './motion-provider';
export function MotionToggle({ compact = false }: { compact?: boolean }): React.JSX.Element {
  const { paused, reduced, ready, toggle } = useMotion();
  const label = paused ? 'Retomar animações' : 'Pausar animações';
  if (ready && reduced) return <span className={compact ? 'motion-status compact' : 'motion-status'}>Movimento reduzido</span>;
  return <Button variant="ghost" className={compact ? 'global-motion-toggle compact' : 'global-motion-toggle'}
    onClick={toggle} aria-label={label} title={label} aria-pressed={paused} disabled={!ready}>
    {paused ? <Play size={14} /> : <Pause size={14} />}{compact ? null : label}
  </Button>;
}
