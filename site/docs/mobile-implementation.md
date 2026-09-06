# Adaptação mobile — versão 0.3.0

Implementação do plano aprovado em 5 de setembro de 2026. A apresentação e o manual compartilham o conteúdo e o estado de movimento existentes. A skill permanece v0.1.0-alpha.1.

## Limite visual

A folha app/mobile.css é importada depois de globals.css. Suas regras visuais ficam em max-width:760px; fora desse intervalo, somente elementos novos exclusivos do mobile são ocultados. Os tokens, a imagem PNG original, globals.css e os componentes Hero, Wordmark e MotionProvider foram preservados. Não há seleção por user-agent, nova dependência ou alteração de metadados sociais.

## Navegação e apresentação

O cabeçalho mobile reúne marca, acesso direto ao Manual e menu com Como funciona, GitHub e pausa global. MobileDisclosure usa details/summary nativos: funciona sem JavaScript, fecha ao navegar ou sair do componente e devolve o foco ao summary com Escape. Fechar ao trocar para desktop evita um painel aberto ao retornar.

A abertura usa título fluido, ações antes da arte, figura em uma área proporcional e percurso dentro da largura útil. Botões principais têm pelo menos 44px. Cinco seletores numéricos do explorador mantêm os nomes acessíveis completos; a etapa ativa aparece acima da explicação. O fluxo continua manual no celular, com reprodução opcional e pausa global.

Os recuos de exemplos e conversa foram reduzidos. As abas mantêm rolagem interna quando necessário. Grades de conteúdo usam largura mínima zero nos pontos que apresentaram transbordamento com texto ampliado.

## Manual

O índice recolhível “Neste manual” mantém os dez capítulos e seus fragmentos. Fica compacto durante a leitura e volta ao fluxo normal em viewports móveis de até 500px de altura. Os modos viraram registros verticais no celular, gerados a partir do mesmo array da tabela desktop. Apenas uma apresentação fica visível à árvore de acessibilidade.

CodeBlock distingue comandos e árvore: comandos preservam o texto original copiado; a árvore mantém indentação e uma região focável com rolagem própria. A cópia informa sucesso ou orienta seleção manual em caso de bloqueio. FAQ, exemplos, URLs e conteúdo técnico foram mantidos.

## Imagem e movimento

hero-ribbon-mobile.webp é uma codificação WebP sem perdas do PNG original, com as mesmas dimensões e pixels. É selecionada somente no mobile. O arquivo original permanece no desktop.

A política existente de pausa, movimento reduzido e suspensão fora da viewport continua controlando a arte. Não foram adicionados vídeo, 3D ou bibliotecas. O desktop mantém seu percurso por scroll.

## Verificação e manutenção

Consulte [resultados e limites](mobile-verification.md) e [cenários reproduzíveis](../tests/browser/README.md). A cópia em site/ no GitHub corresponde aos arquivos versionados da raiz do checkout Sites. CI e publicação seguem operações separadas; a versão visual não altera a qualificação comportamental da skill.
