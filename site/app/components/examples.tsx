'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export function CodeBlock({ code, label = 'Terminal' }: { code: string; label?: string }) : React.JSX.Element {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setState('copied'); }
    catch { console.error('Não foi possível copiar o comando para a área de transferência.'); setState('error'); }
  };
  return <div className="code-block"><div className="code-heading"><span><Terminal size={14} />{label}</span><Button variant="ghost" onClick={copy} aria-label={'Copiar ' + label}>{state === 'copied' ? <Check /> : <Copy />}{state === 'copied' ? 'Copiado' : 'Copiar'}</Button></div><pre><code>{code}</code></pre><output className="sr-only">{state === 'copied' ? 'Texto copiado.' : state === 'error' ? 'Cópia indisponível. Selecione o texto e copie manualmente.' : ''}</output>{state === 'error' && <p className="copy-error">Selecione o texto para copiar manualmente.</p>}</div>;
}
const examples = [
  { id: 'analisar', label: 'Analisar', command: 'workflow modo leitura: confira a estrutura deste projeto', title: 'Entender antes de mudar.', description: 'Consulta instruções e arquivos relevantes, identifica o estado atual e explica os próximos passos. O modo leitura preserva os arquivos.' },
  { id: 'implementar', label: 'Implementar', command: 'workflow implemente a correção descrita no issue e rode os checks do projeto', title: 'Transformar escopo em entrega.', description: 'Aplica a correção autorizada, usa os especialistas necessários e verifica o comportamento. Commit e publicação seguem as regras do usuário e do projeto.' },
  { id: 'retomar', label: 'Retomar', command: 'workflow retome a tarefa a partir do checkpoint e confira o que já foi concluído', title: 'Continuar com contexto.', description: 'Confere o estado real, preserva o trabalho concluído e avança nas pendências autorizadas. O checkpoint registra o contexto; não concede novas permissões.' },
];
export function UsageExamples() : React.JSX.Element {
  return <section className="usage-section shell"><div className="section-heading"><span className="section-number">03 / NO SEU DIA A DIA</span><h2>Um pedido claro.<br /><em>Um caminho possível.</em></h2></div><Tabs defaultValue="analisar" className="usage-tabs"><TabsList variant="line" className="site-tabs" aria-label="Exemplos de uso">{examples.map(example => <TabsTrigger key={example.id} value={example.id}>{example.label}</TabsTrigger>)}</TabsList>{examples.map(example => <TabsContent key={example.id} value={example.id}><div className="example-layout"><div><h3>{example.title}</h3><p>{example.description}</p><Link className="text-link" href="/manual#comandos">Ver todos os modos ↗</Link></div><CodeBlock label="Pedido ao Codex" code={example.command} /></div></TabsContent>)}</Tabs></section>;
}
const continuity = [
  { id: 'status', label: 'Pedir status', user: 'Como está indo?', reply: 'A primeira correção está pronta e passou nos checks. Vou concluir a segunda parte do escopo.', result: 'O objetivo continua ativo.', detail: 'A resposta de status informa o progresso e o trabalho autorizado segue.' },
  { id: 'parar', label: 'Interromper', user: 'Pare as alterações. Só me explique o que já foi feito.', reply: 'Parei de iniciar novas alterações. A primeira correção foi concluída; a segunda ficou pendente.', result: 'A nova instrução redefine o limite.', detail: 'O trabalho concluído é preservado e as ações afetadas deixam de ser iniciadas.' },
  { id: 'retomar', label: 'Retomar', user: 'Retome a segunda correção que ficou pendente.', reply: 'Vou conferir os arquivos e o checkpoint para continuar a partir do estado atual.', result: 'O estado real guia a retomada.', detail: 'Ações concluídas são conferidas antes de repetir qualquer efeito.' },
];
export function ContinuityDemo() : React.JSX.Element {
  return <section className="continuity-section shell"><div className="section-heading"><span className="section-number">04 / CONTINUIDADE</span><h2>A conversa muda.<br /><em>O contexto acompanha.</em></h2><p>Status, interrupção e retomada fazem parte do trabalho.</p></div><Tabs defaultValue="status"><TabsList variant="line" className="site-tabs" aria-label="Exemplos de continuidade">{continuity.map(item => <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>)}</TabsList>{continuity.map(item => <TabsContent key={item.id} value={item.id}><div className="continuity-layout"><div className="conversation"><span className="micro">CONVERSA ILUSTRATIVA</span><p className="message user"><span>VOCÊ</span>{item.user}</p><p className="message assistant"><span>CODEX + WORKFLOW</span>{item.reply}</p></div><div className="continuity-result"><span className="status-dot" /><h3>{item.result}</h3><p>{item.detail}</p></div></div></TabsContent>)}</Tabs></section>;
}
