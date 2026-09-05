# Plano de movimento — Workflow

Status: implementado na aplicação 0.2.0 e verificado localmente. O relatório motion-verification.md registra critérios, resultados e limites. Os tópicos abaixo preservam a proposta aprovada; consulte o relatório para a calibração final.
Data: 5 de setembro de 2026.

## Direção
Dar ao site uma presença mais viva e uma narrativa que responda à rolagem, preservando o fundo escuro, a tipografia editorial e a luz champanhe. O movimento deve mostrar o processo da skill, manter o texto legível e deixar evidente quando está pausado.

O título e as cinco etapas mantêm suas dimensões. A figura da abertura fica cerca de 15% menor e o rótulo FIG. 01 é removido.

## Diagnóstico do controle atual
A verificação na versão pública confirmou que Pausar movimento congela as três animações da abertura: figura, sinal luminoso e círculos. Em duas leituras separadas durante a pausa, as transformações renderizadas permaneceram idênticas. Depois de retomar, as posições voltaram a mudar.

Não foi reproduzida uma falha no mecanismo de pausa. Foram identificados dois problemas de experiência:
- o fundo percorre apenas 12 px em 16 segundos, com rotação muito pequena; a diferença é difícil de perceber;
- o controle abrange somente a abertura. O demonstrador de etapas mais abaixo possui reprodução independente.

Ajuste imediato preparado: explicitar “Pausar animação da abertura” / “Retomar animação da abertura”, retirar o rótulo e reduzir a figura. O controle global proposto abaixo substituirá esse escopo local quando as novas animações forem implementadas.

## Referência inspecionada
[EduardoBertin.com.br](https://eduardobertin.com.br) redirecionou para o portfólio hospedado no Sites. A seção Method foi observada passando de Intent para Evidence durante a rolagem, com o diagrama permanecendo visível e mudando de configuração.

A inspeção do CSS e JavaScript públicos confirmou:
- entrada do hero por opacidade e deslocamento de 20 px em 780–820 ms;
- revelações ao entrar na tela, com 22 px, 620 ms e pequenos atrasos entre itens;
- IntersectionObserver que deixa de observar o elemento após sua primeira entrada;
- um capítulo de 230svh com conteúdo sticky e progresso normalizado de scroll, atualizado por requestAnimationFrame;
- no mobile de até 960 px ou com movimento reduzido, o capítulo vira conteúdo estático;
- o nome do portfólio é texto estático: iluminação por letra será uma solução nova para Workflow.

Fontes técnicas: [CSS servido](https://eduardo-bertin-agent-portfolio.edubertin.chatgpt.site/assets/index-CIaF2HkJ.css) e [código da página](https://eduardo-bertin-agent-portfolio.edubertin.chatgpt.site/assets/page-CSgySc7t.js). Esses endereços podem mudar em publicações futuras.

## Etapas de implementação

### 1. Uma política de movimento para o site
Criar um proprietário único do estado de movimento na apresentação. Ele coordenará a abertura, o wordmark, as entradas de seções e a reprodução automática do fluxo.

- Controle global com nome claro: “Pausar animações” / “Retomar animações”, acessível também por teclado.
- Pausa deve interromper as animações automáticas decorativas e as transformações decorativas guiadas por scroll. Revelações de conteúdo em andamento são concluídas imediatamente, deixando o texto totalmente visível.
- A página continua rolando normalmente. Links, abas, cópia de comandos e seleção manual de etapas continuam funcionando.
- Elementos ainda fora da tela devem aparecer imediatamente quando entrarem durante a pausa; nunca deixar conteúdo invisível.
- Respeitar prefers-reduced-motion e mostrar o estado estático completo.
- Parar trabalho visual quando a aba estiver oculta ou a seção estiver fora da tela.
- Manter a preferência durante a navegação entre apresentação e manual na mesma sessão da aplicação, sem exigir conta ou armazenamento remoto.

Critério de aceite: ao pausar, revelações de conteúdo chegam ao estado final legível; após essa transição imediata, amostras reais de transformações e posições decorativas permanecem estáveis. Ao retomar, os movimentos decorativos voltam a avançar, preservando a etapa selecionada.

### 2. Wordmark acendendo por letra
Aplicar ao WORKFLOW no canto superior esquerdo.

- Letras permanecem legíveis desde o primeiro quadro.
- Uma passagem de luz champanhe percorre W → O → R → K → F → L → O → W.
- Intervalo inicial sugerido de 60 ms entre letras; percurso completo em aproximadamente 1,2 segundo.
- Depois, o nome fica estável. Hover ou foco podem repetir uma passagem.
- Sem piscar continuamente, apagar o nome ou alterar largura e espaçamento.
- Expor o nome completo uma única vez para leitores de tela; letras decorativas ficam ocultas da árvore de acessibilidade.
- Reduzir a duração a zero quando movimento reduzido estiver ativo.

Critério de aceite: a iluminação é visível sem competir com o título; nenhum salto no cabeçalho ou repetição de letras na leitura assistiva.

### 3. Abertura com movimento perceptível
Preservar a figura menor e o fundo integrado.

- Aumentar moderadamente a amplitude e encurtar o ciclo da deriva, calibrando pela visualização real.
- Ponto de partida: 18–24 px, cerca de 1,5 grau de rotação e ciclo de 8–10 segundos.
- Tornar o sinal do percurso mais legível, mantendo o texto e os círculos em posições estáveis.
- Aplicar uma resposta pequena ao início da rolagem: deslocamento da arte limitado a cerca de 36 px.
- Separar os elementos responsáveis por deriva e scroll para que duas animações não sobrescrevam o mesmo transform.
- No celular, reduzir a amplitude e preservar a figura inteira.

Critério de aceite: em poucos segundos é possível perceber que a animação está rodando; ao pausar, a diferença é inequívoca. A arte não invade textos nem cria cortes.

### 4. Revelar as seções conforme a rolagem
Usar o padrão editorial visto no portfólio.

- Títulos e textos entram por opacidade e deslocamento curto de 18–22 px.
- Duração de 500–650 ms, com intervalo de cerca de 80 ms entre itens relacionados.
- Revelar uma vez ao entrar na tela; voltar a rolar para cima não reinicia a página inteira.
- Aplicar à apresentação: processo, especialistas, exemplos, continuidade e evidências.
- Manter os capítulos longos do manual estáveis para favorecer a leitura técnica.
- O conteúdo deve ser visível por padrão. Só habilitar o estado preparatório oculto depois de inicializar o observador com sucesso.

Critério de aceite: entrada suave sem conteúdo preso invisível; funcionamento com JavaScript indisponível, falha do observador, pausa e movimento reduzido.

### 5. Transformar o percurso em uma narrativa de scroll
Evoluir o demonstrador existente, reaproveitando seu conteúdo de Pedido → Contexto → Plano → Execução → Verificação.

- Em desktop, manter o diagrama visível enquanto a rolagem destaca cada etapa e atualiza sua explicação.
- Começar com uma seção de aproximadamente 200–220svh e ajustar a duração após revisão; a referência usa 230svh.
- Não capturar a roda do mouse nem bloquear a rolagem.
- Clicar numa etapa muda o conteúdo sem deslocar a página ou perder o foco. A sincronização automática retorna apenas após o próximo gesto de rolagem.
- Evitar disputa entre o temporizador do botão Animar fluxo e o progresso de scroll: um modo dirige a etapa por vez.
- Em telas menores, mostrar o fluxo no layout normal, com as etapas selecionáveis. Movimento reduzido utiliza a mesma alternativa.
- Atualizar estilos por requestAnimationFrame apenas enquanto a seção estiver ativa; alterar o estado React somente quando a etapa mudar.

Critério de aceite: as cinco etapas acompanham a rolagem nos dois sentidos; os controles manuais permanecem úteis; a página não parece travada.

## Superfícies técnicas afetadas
| Superfície | Responsabilidade |
| --- | --- |
| app/components/chrome.tsx | Wordmark animado e acesso ao controle global |
| app/components/hero.tsx | Figura, sinal e resposta inicial à rolagem |
| app/components/flow-explorer.tsx | Etapa ativa dirigida por scroll ou seleção manual |
| app/components/motion-provider.tsx, novo | Estado compartilhado, preferência reduzida e pausa |
| app/components/reveal.tsx, novo | Revelação progressiva com fallback visível |
| app/page.tsx e app/layout.tsx | Integração, preservando renderização e conteúdo no servidor |
| app/globals.css | Tempos, curvas, estados, composição e alternativas estáticas |
| Verificações de navegador | Movimento real, pausa, scroll, teclado e responsividade |

Usar primeiro CSS, IntersectionObserver e requestAnimationFrame. Nenhuma biblioteca nova é necessária para o escopo proposto. Não adicionar um motor 3D ou vídeo ao carregamento inicial.

## Ordem de entrega
1. Política global e testes reais de pausa.
2. Wordmark, abertura e revelações.
3. Capítulo guiado por scroll.
4. Revisão integrada e publicação da evolução aprovada.

As duas primeiras entregas podem ser revisadas como uma prévia coerente antes do capítulo de scroll, que tem maior impacto na navegação. Uma única pessoa ou agente deve editar e publicar o checkout Sites; revisores podem avaliar trechos em modo somente leitura.

## Validação e limites
- Desktop 1440 px, largura intermediária 1091 px e mobile 390 px.
- Mouse, toque, Tab, Enter, âncoras e navegação de volta do manual.
- Pausa medida por posição/transformação, não apenas pela troca de texto do botão.
- Pausa durante uma entrada, antes de uma seção aparecer e durante o avanço automático.
- Movimento reduzido desde o carregamento e alterado durante a sessão.
- Retorno de aba oculta sem saltos ou timers duplicados.
- Ausência de transbordamento horizontal, cortes da figura e deslocamentos no conteúdo.
- Inspeção de desempenho durante scroll; limitar o trabalho por quadro. Fluidez é uma meta a verificar, não uma garantia antecipada.
- Manter os testes existentes de links, metadados e card social.

O principal risco é fazer o movimento disputar atenção com a documentação ou alongar a rolagem. Por isso haverá uma única seção de narrativa sticky; o manual conserva leitura direta.
