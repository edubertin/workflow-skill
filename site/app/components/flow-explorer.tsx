'use client';
import { useRef } from 'react';
import { useFlowMotion } from './flow-motion';
import { ArrowLeft, ArrowRight, CheckCheck, FileText, ListChecks, MessageSquare, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
const steps = [
  { title: 'Pedido', icon: MessageSquare, heading: 'A intenção vem primeiro.', copy: 'O objetivo, o escopo e as restrições dão direção ao trabalho. Uma dúvida pequena e reversível pode ser resolvida com uma hipótese explícita.', source: 'Contrato operacional', example: '“Confira este projeto e explique o que falta para a próxima entrega.”' },
  { title: 'Contexto', icon: FileText, heading: 'O projeto tem a primeira palavra.', copy: 'AGENTS.md, PROJECT.md e documentos relevantes revelam decisões e restrições. A leitura é direcionada; especialistas entram quando ajudam a tarefa.', source: 'Contexto e descoberta', example: 'Instruções locais → documentos relevantes → capacidades disponíveis.' },
  { title: 'Plano', icon: ListChecks, heading: 'Um processo do tamanho da tarefa.', copy: 'Uma correção simples pode seguir diretamente. Uma mudança ampla pede um plano curto, divisão de responsabilidades e critérios claros de conclusão.', source: 'Modos e risco', example: 'Resultado esperado · arquivos afetados · verificação necessária.' },
  { title: 'Execução', icon: Play, heading: 'Avançar dentro do combinado.', copy: 'Ações seguem a autorização vigente. Trabalho independente pode acontecer em paralelo; mudanças de escopo ou interrupções ajustam os próximos passos.', source: 'Autoridade e continuidade', example: '“Como está indo?” pede uma atualização e preserva a tarefa em andamento.' },
  { title: 'Verificação', icon: CheckCheck, heading: 'A entrega vem acompanhada de evidência.', copy: 'Checks proporcionais, resultado observado e limitações tornam a entrega revisável. Uma verificação que não pôde acontecer continua identificada como pendente.', source: 'Verificação e avaliação', example: 'O que mudou · o que foi testado · o que ainda precisa ser verificado.' },
];
function FlowNodes({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  return <ol className="flow-nodes" aria-label="Etapas do processo">{steps.map((step, index) => <li key={step.title} className={index <= active ? 'reached' : ''}><Button className="flow-node" variant="ghost" aria-pressed={index === active} aria-label={'Etapa ' + (index + 1) + ': ' + step.title} onClick={() => onSelect(index)}><span className="node-icon"><step.icon size={23} /><span className="mobile-node-number" aria-hidden="true">0{index + 1}</span></span><span className="node-label"><small>0{index + 1}</small>{step.title}</span></Button></li>)}</ol>;
}
export function FlowExplorer(): React.JSX.Element {
  const ref = useRef<HTMLElement>(null);
  const { active, select, toggle, playing, desktop, running, reduced, paused } = useFlowMotion(ref);
  const step = steps[active];
  return <section ref={ref} className="flow-chapter" data-scroll={desktop} aria-label="Explore as cinco etapas">
    <div className="flow-explorer shell">
      <div className="flow-top"><span className="micro">UM EXEMPLO DE PERCURSO</span>{desktop
        ? <span className="scroll-cue">{paused ? 'Animações pausadas · explore as etapas' : 'Role para percorrer as etapas'}<ArrowRight size={15} /></span>
        : <Button variant="ghost" className="motion-button" onClick={toggle} disabled={reduced || paused}>{playing && running ? <Pause /> : <Play />}{playing && running ? 'Pausar fluxo' : paused ? 'Fluxo pausado' : 'Animar fluxo'}</Button>}</div>
      <FlowNodes active={active} onSelect={select} />
      <p className="mobile-stage-title" aria-live="polite">0{active + 1} / {step.title}</p>
      <div className="flow-details"><div className="flow-copy" key={active}><span className="eyebrow">0{active + 1} / {step.source}</span><h3>{step.heading}</h3><p>{step.copy}</p></div><div className="flow-example"><span className="micro">NA PRÁTICA</span><p key={active}>{step.example}</p><div className="flow-controls"><Button variant="ghost" aria-label="Etapa anterior" disabled={active === 0} onClick={() => select(active - 1)}><ArrowLeft /></Button><span>0{active + 1} / 05</span><Button variant="ghost" aria-label="Próxima etapa" disabled={active === 4} onClick={() => select(active + 1)}><ArrowRight /></Button><Button variant="ghost" aria-label="Reiniciar demonstração" onClick={() => select(0)}><RotateCcw /></Button></div></div></div>
    </div>
  </section>;
}
