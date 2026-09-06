'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const questions = [
 ['Preciso instalar agentes adicionais?', 'Não. A Workflow usa o contexto e as capacidades que o host já oferece. Perfis locais podem orientar uma consulta; agentes inexistentes não são instalados automaticamente.'],
 ['A Workflow escolhe um modelo por mim?', 'Não. O pacote não define modelo ou esforço padrão. O perfil de GPT-5.6 é uma referência histórica condicional, usada apenas quando esse alvo é explicitamente avaliado.'],
 ['Posso substituir minha Workflow pessoal agora?', 'O piloto preservou a instalação pessoal. Antes de uma troca, compare as regras, faça backup dos arquivos atuais e confirme descoberta e comportamento da candidata no host que você usa.'],
 ['A skill já está no diretório de plugins?', 'A release contém o manifesto de plugin, mas não há listagem publicada no diretório. O pacote pode ser obtido pelo GitHub e avaliado em um destino local explícito.'],
 ['O instalador recusou uma pasta. O que conferir?', 'Verifique se o destino está fora do checkout de origem, se sua pasta pai existe e se não contém links, junctions ou conteúdo diferente. Para uma atualização, use uma pasta nova. Em uma instalação parcial, o instalador preserva os arquivos para inspeção.'],
 ['A pasta foi instalada, mas a skill não apareceu.', 'Confira os caminhos de descoberta do seu host, abra um contexto novo e verifique possíveis duplicidades de nome. O --check verifica a integridade dos arquivos; não comprova que o host os carregou.'],
 ['A Workflow é o mesmo projeto que Workflow 2.0?', 'Não. workflow-skill é este pacote portátil de instruções. workflow-2.0 é um projeto separado de runtime. O histórico workflow-v2-review também é um repositório independente.'],
];
export function ManualFaq() : React.JSX.Element {
  return <Accordion className="manual-faq">{questions.map(([question, answer], index) => <AccordionItem key={question} value={String(index)}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent><p>{answer}</p></AccordionContent></AccordionItem>)}</Accordion>;
}
