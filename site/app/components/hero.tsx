'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { MotionToggle } from './motion-toggle';
import { useMotion } from './motion-provider';
import { observeScroll, useInView } from './motion-hooks';
function HeroCopy(): React.JSX.Element {
  return <div className="hero-copy">
    <span className="eyebrow"><i /> WORKFLOW SKILL / CODEX</span>
    <h1>Clareza para<br />cada <em>etapa.</em></h1>
    <p className="hero-description">Do primeiro pedido à entrega verificada.<br />Uma skill para dar contexto, direção e continuidade ao trabalho com IA.</p>
    <div className="actions"><a className="button primary" href="#como-funciona">Explorar o fluxo <ArrowDown size={17} /></a><Link className="text-link" href="/manual">Ler o manual <ArrowUpRight size={17} /></Link></div>
    <div className="release-note"><span className="status-dot" /> v0.1.0-alpha.1 <span>Experimental · Licença MIT</span></div>
  </div>;
}
export function Hero(): React.JSX.Element {
  const ref = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const { running } = useMotion();
  const { visible: inView } = useInView(ref);
  useEffect(() => {
    if (!running || !inView) return;
    return observeScroll(() => {
      if (!ref.current || !art.current) return;
      const progress = Math.max(0, Math.min(1, -ref.current.getBoundingClientRect().top / ref.current.clientHeight));
      art.current.style.setProperty('--hero-scroll', progress * 36 + 'px');
    });
  }, [running, inView]);
  return <section ref={ref} className="hero" id="inicio" data-active={inView}>
    <div className="hero-layout shell">
      <div ref={art} className="hero-visual" aria-hidden="true"><div className="hero-ribbon" /></div>
      <HeroCopy />
      <div className="hero-art" aria-label="Do pedido à verificação, um processo conectado">
        <ol className="hero-route" aria-label="Do pedido à verificação">{['Pedido', 'Contexto', 'Plano', 'Execução', 'Verificação'].map((label, index) => <li className="hero-route-step" key={label}><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong></li>)}</ol>
        <div className="hero-art-footer"><span className="art-coordinate">A intenção conduz. O contexto orienta.</span><MotionToggle /></div>
      </div>
    </div>
  </section>;
}
