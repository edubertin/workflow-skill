import type { Metadata } from 'next';
import { Cormorant_Garamond, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './mobile.css';
import { MotionProvider } from './components/motion-provider';
const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const display = Cormorant_Garamond({ variable: '--font-display', subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'] });
export const metadata: Metadata = {
  metadataBase: new URL('https://workflow-skill.edubertin.chatgpt.site'),
  title: { default: 'Workflow — Clareza para cada etapa', template: '%s | Workflow' },
  description: 'Conheça a Workflow Skill para Codex. Explore o processo, os especialistas, a instalação e o manual técnico da versão portátil.',
  icons: { icon: '/icon.svg' },
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Workflow Skill', title: 'Workflow — Clareza para cada etapa', description: 'Uma skill para orientar o trabalho no Codex. Explore o fluxo e o manual técnico.', url: '/', images: [{ url: '/og.png', width: 1731, height: 909, alt: 'Workflow — Clareza para cada etapa. Manual técnico da skill para Codex.' }] },
  twitter: { card: 'summary_large_image', title: 'Workflow — Clareza para cada etapa', description: 'Uma skill para orientar o trabalho no Codex. Explore o fluxo e o manual técnico.', images: ['/og.png'] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) : React.JSX.Element {
  return <html lang="pt-BR" className="dark"><body className={sans.variable + ' ' + mono.variable + ' ' + display.variable}><MotionProvider>{children}</MotionProvider></body></html>;
}
