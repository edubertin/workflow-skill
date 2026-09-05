import Link from 'next/link';
import { ArrowUpRight, Download } from 'lucide-react';
import { RELEASE, REPOSITORY } from './chrome';
const evidence = [
  ['Pacote', '45 testes locais', 'Ferramentas de instalação e validação verificadas na release; CI em Windows e Linux.'],
  ['Descoberta', 'CLI verificado', 'A cópia portátil apareceu automaticamente em um contexto isolado do Codex CLI.'],
  ['Comportamento', 'Casos documentados', 'Tarefas locais foram executadas em contextos separados da descoberta do CLI.'],
];
export function EvidenceSection() : React.JSX.Element {
  return <section className="evidence shell"><div className="section-heading"><span className="section-number">05 / VERSÃO E EVIDÊNCIAS</span><h2>Aberta para explorar.<br /><em>Transparente para avaliar.</em></h2><p>A primeira versão é experimental. Cada evidência tem um alcance definido.</p></div><div className="evidence-grid">{evidence.map(([label, title, description]) => <article key={label}><span className="micro">{label}</span><h3>{title}</h3><p>{description}</p></article>)}</div><div className="release-banner"><div><span className="eyebrow">v0.1.0-alpha.1 · MIT</span><h3>Conheça o pacote portátil.</h3><p>Consulte o manual antes de escolher o destino de instalação.</p></div><div className="actions"><Link className="button primary" href="/manual#instalacao"><Download size={17} /> Guia de instalação</Link><a className="text-link" href={RELEASE} target="_blank" rel="noreferrer">Release no GitHub <ArrowUpRight size={16} /></a></div></div><p className="diagram-note">Execução autenticada no CLI isolado, ativação no desktop e qualificação estável ainda têm verificações pendentes. <Link href="/manual#validacao">Ler limites do piloto ↗</Link> · <a href={REPOSITORY + '/blob/main/docs/evaluation.md'} target="_blank" rel="noreferrer">Evidências da release ↗</a></p></section>;
}
