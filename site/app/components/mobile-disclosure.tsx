'use client';
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { ChevronDown, Menu } from 'lucide-react';

function closeDisclosure(ref: RefObject<HTMLDetailsElement | null>, restoreFocus = false): void {
  if (!ref.current?.open) return;
  ref.current.open = false;
  if (restoreFocus) ref.current.querySelector('summary')?.focus({ preventScroll: true });
}

function useDisclosureDismiss(ref: RefObject<HTMLDetailsElement | null>): void {
  useEffect(() => {
    const element = ref.current;
    const navigate = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('a[href]')) closeDisclosure(ref);
    };
    const outside = (event: Event) => {
      if (event.target instanceof Node && !ref.current?.contains(event.target)) closeDisclosure(ref);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && ref.current?.open && ref.current.getClientRects().length) {
        event.preventDefault(); closeDisclosure(ref, true);
      }
    };
    const media = window.matchMedia('(max-width: 760px)');
    const resize = () => { if (!media.matches) closeDisclosure(ref); };
    element?.addEventListener('click', navigate);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    media.addEventListener('change', resize);
    return () => {
      element?.removeEventListener('click', navigate);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
      media.removeEventListener('change', resize);
    };
  }, [ref]);
}

export function MobileDisclosure({ label, className, compact = false, children }: {
  label: string; className: string; compact?: boolean; children: ReactNode;
}): React.JSX.Element {
  const ref = useRef<HTMLDetailsElement>(null);
  useDisclosureDismiss(ref);
  return <details ref={ref} className={'mobile-disclosure ' + className}>
    <summary aria-label={label}>{compact ? <><Menu size={20} /><span className="sr-only">{label}</span></> : <>{label}<ChevronDown size={18} /></>}</summary>
    <div className="mobile-disclosure-panel">{children}</div>
  </details>;
}
