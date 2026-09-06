import Link from 'next/link';
import { Wordmark } from './wordmark';
import { MotionToggle } from './motion-toggle';
import { MobileDisclosure } from './mobile-disclosure';
import { ArrowUpRight } from 'lucide-react';
export const REPOSITORY = 'https://github.com/edubertin/workflow-skill';
export const RELEASE = REPOSITORY + '/releases/tag/v0.1.0-alpha.1';
export function GithubIcon({ size = 20 }: { size?: number }) : React.JSX.Element {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.333-5.467-5.93 0-1.31.467-2.382 1.235-3.222-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.292-1.552 3.295-1.23 3.295-1.23.647 1.653.24 2.873.12 3.176.765.84 1.23 1.912 1.23 3.222 0 4.61-2.807 5.622-5.48 5.92.43.37.81 1.102.81 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.295 24 17.795 24 12.5 24 5.87 18.627.5 12 .5Z" /></svg>;
}
export function Header() : React.JSX.Element {
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><header className="header shell"><Wordmark /><nav className="desktop-navigation" aria-label="Navegação principal"><Link href="/#como-funciona">Como funciona</Link><Link href="/manual">Manual técnico</Link><a className="github-link" href={REPOSITORY} target="_blank" rel="noreferrer" aria-label="Repositório da Workflow no GitHub"><GithubIcon /></a><MotionToggle compact /></nav><div className="mobile-header-actions"><Link className="mobile-manual-link" href="/manual">Manual</Link><MobileDisclosure label="Menu" className="mobile-menu" compact><nav aria-label="Navegação principal"><Link href="/#como-funciona">Como funciona</Link><a href={REPOSITORY} target="_blank" rel="noreferrer"><GithubIcon size={18} /> GitHub</a><MotionToggle /></nav></MobileDisclosure></div></header></>;
}
export function Footer() : React.JSX.Element {
  return <footer className="footer shell"><div><Link className="footer-wordmark" href="/">WORKFLOW</Link><span>Uma skill. Um processo com direção.</span></div><div className="footer-links"><a href={REPOSITORY + '/blob/main/LICENSE'} target="_blank" rel="noreferrer">MIT</a><a href="https://eduardobertin.com.br" target="_blank" rel="noreferrer">eduardobertin.com.br <ArrowUpRight size={13} /></a><a href={REPOSITORY} target="_blank" rel="noreferrer" aria-label="GitHub da Workflow"><GithubIcon size={18} /></a></div></footer>;
}
