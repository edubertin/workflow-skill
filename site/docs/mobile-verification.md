# Verificação mobile — versão 0.3.0

Executada em 5 de setembro de 2026, America/Sao_Paulo, contra a aplicação compilada em Windows. Esta verificação cobre apresentação e manual; não altera as evidências de comportamento da skill.

## Qualidade e interfaces

- Lint, TypeScript estrito e build passaram.
- Cinco contratos HTTP passaram, incluindo rotas, âncoras, manual, metadados sociais e assinatura/formato/tamanho do novo WebP.
- Chromium: cenários mobile-responsive, mobile-manual, mobile-fallback, mobile-touch e regressão de movimento.
- WebKit 26.5 automatizado no Windows: mobile-responsive e mobile-touch.
- Larguras: 320, 360, 375, 390, 414, 430, 650, 651, 700, 701, 760, 761, 844, 960 e 961px; paisagem 844×390.
- Sem overflow da página em apresentação e manual. Medição por scrollWidth/clientWidth; barras internas em árvore e abas são intencionais.
- Menu por toque e teclado, Escape/foco, fechamento na navegação/resize, cinco etapas, alvos de 44 px, índice/deep links, FAQ e cópia exata dos comandos/árvore passaram.
- Texto ampliado a 200% em 320 px passou nas duas rotas. A verificação duplica os tamanhos computados, incluindo fontes em pixels. Encontrou e corrigiu overflow real nos títulos/grades do manual, evidências e etapa final.
- JavaScript desativado mantém conteúdo e navegação nativa. Clipboard negado oferece cópia manual; o log de erro desse teste é esperado.
- Pausa congela quadros reais, retomada funciona, redução de movimento mantém texto visível e o scroll mobile permanece normal.

## Desktop preservado

Comparação de seis screenshots completos antes/depois em 1091, 1440 e 1920 px, nas duas rotas, com fontes prontas, pausa e estilos de captura idênticos:
- Cinco pares são idênticos pixel a pixel.
- Home em 1440 px: 363 de 9.473.760 pixels diferem, 0,00383%, com máximo 2/255 por canal, restritos à figura. Alinhamento ótimo sem deslocamento; diferença compatível com rasterização/composição, sem mudança geométrica.
- Alturas dos seis documentos são iguais. A revisão estática independente não encontrou alteração de comportamento desktop.

O cenário hero-refinement também confere alinhamento em 2560 px. A marca mantém retorno ao início por mouse e teclado.

## Transferência e diagnóstico de carregamento

PNG original: 1.552.692 bytes. WebP mobile: 868.250 bytes, redução de 44,08%. Dimensões 1536×1024 e pixels decodificados idênticos. Em carregamento frio mobile foi solicitado somente o WebP.

Três amostras locais por versão, viewport 390×844, cache desativado, latência de 100 ms, download de 500.000 B/s, upload de 125.000 B/s e CPU limitada 4×:

| Métrica | Antes 0.2.1 | Depois 0.3.0 |
| --- | --- | --- |
| LCP, amostras em ms | 4520 /4544 /4528 | 3228 /3224 /3260 |
| LCP, mediana | 4528ms | 3228ms |
| CLS | 0 nas três | 0 nas três |

A mediana caiu aproximadamente 29%. A referência de 2,5 s ainda não foi alcançada nesse perfil de laboratório. Não foram medidos INP de campo, percentil 75, bateria ou sessões prolongadas; não há afirmação de desempenho real de usuários.

## Falhas observadas e limites

A antiga simulação que fazia todo construtor IntersectionObserver lançar erro falhou no build de produção: atingia também o prefetch de links do vinext e acionava a página de erro do framework. Os componentes de movimento registravam sua própria falha corretamente. O cenário foi delimitado à observação dos elementos de movimento do site, mantendo o observador de links real. Ele demonstra o fallback da aplicação, não tolerância do framework a uma API global deliberadamente corrompida. A falha ampla não foi corrigida por estar fora da adaptação mobile e exigir alteração de comportamento compartilhado.

A execução no servidor de desenvolvimento também encontrou avisos de hidratação e encerramento durante ciclos de rebuild; as verificações de entrega foram feitas no build compilado. Não se confundem os logs de injeção de falhas com erros de uso normal.

WebKit automatizado no Windows não é Safari em iPhone. Não houve acesso a aparelho físico, navegador interno do Instagram, VoiceOver ou TalkBack. Navegação semântica, foco e dimensões foram verificados por automação; isso não certifica conformidade completa de acessibilidade. Safari iOS, Chrome Android e Instagram reais continuam como verificação complementar recomendada.

## Checagem pública e correção 0.3.1

A primeira publicação mobile (Sites versão 5, app 0.3.0) renderizou corretamente, mas o contrato HTTP do WebP falhou: a hospedagem respondeu application/octet-stream. Foi adicionado public/_headers com Content-Type: image/webp apenas para esse asset, preservando o cache existente dos arquivos com hash. A configuração segue a [documentação de headers para static assets da Cloudflare](https://developers.cloudflare.com/workers/static-assets/headers/). A alteração não muda pixels, CSS ou interação. O teste permanece estrito e deve passar novamente no endereço público após a correção.
