import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { Header, Footer } from './components/chrome';
import { FlowExplorer } from './components/flow-explorer';
import { SpecialistDiscovery } from './components/discovery';
import { UsageExamples, ContinuityDemo } from './components/examples';
import { EvidenceSection } from './components/evidence';
import { Hero } from './components/hero';
import { Reveal } from './components/reveal';

function Introduction(): React.JSX.Element {
  return <section className="intro shell" id="como-funciona"><span className="section-number">01 / O PROCESSO</span><div><h2>O próximo passo começa<br />com o <em>contexto certo.</em></h2><p>A Workflow consulta as instruções do projeto, escolhe um processo proporcional à tarefa e usa os especialistas que estão disponíveis. O objetivo permanece visível até a verificação da entrega.</p><Link className="text-link" href="/manual"><BookOpen size={17} /> Conhecer a estrutura técnica <ArrowUpRight size={16} /></Link></div></section>;
}
export default function Home() : React.JSX.Element {
  return <><Header /><main id="conteudo"><Hero /><Reveal><Introduction /></Reveal><FlowExplorer /><Reveal><SpecialistDiscovery /></Reveal><Reveal><UsageExamples /></Reveal><Reveal><ContinuityDemo /></Reveal><Reveal><EvidenceSection /></Reveal></main><Footer /></>;
}
