# Movimento — aplicação 0.2.0

Data: 5 de setembro de 2026. Implementação do plano aprovado, pronta para publicação após os checks abaixo.

## Resultado

- Controle global Pausar animações / Retomar animações no cabeçalho e na abertura.
- Estado de pausa preservado na navegação interna entre apresentação e manual.
- Luz champanhe pelas oito letras, uma passagem inicial e repetição em hover/foco.
- Deriva da figura de 22 px e 1,5 grau em 9 s; mobile usa 12 px e 0,8 grau.
- Camada separada de resposta ao scroll, limitada a 36 px, reduzida no celular.
- Revelações de 620 ms com entrada curta e intervalos de 80 ms nos títulos.
- Capítulo de 210svh em desktop acima de 960 px e com pelo menos 720 px de altura; cinco etapas dirigidas por scroll. Mobile, viewport baixa e movimento reduzido conservam layout normal.
- Clique manual controla a etapa até novo gesto de rolagem. O temporizador opcional existe somente no layout normal.
- Decoração para com pausa, documento oculto ou seção fora da tela; texto permanece disponível.

## Integração do fundo

O arquivo original possui fundo opaco com valores RGB de até 9/255 nas regiões externas analisadas e no furo interno. Duas extrações por Imagegen produziram quadriculado rasterizado sem canal alpha e foram descartadas.

A solução final preserva a imagem original: contrast(1.08) neutraliza esse fundo antes da composição screen sobre a cor uniforme da página. Não há máscaras lineares ou camada de degradê para esconder bordas. O arquivo não foi convertido para PNG transparente; a integração acontece na composição do navegador, com leve aumento de contraste do metal.

Revisão visual em 1440 × 960, 1091 × 930 e 390 × 844: fundo integrado, figura inteira e ausência de overflow horizontal. O card social continua independente e preservado.

## Verificação funcional

- Build de produção, lint e TypeScript estrito aprovados.
- Cinco contratos HTTP aprovados no desenvolvimento e na aplicação compilada: apresentação, manual, âncoras, limites documentados e assets/metadados sociais.
- 33 verificações de navegador aprovadas nos quatro cenários em tests/browser: seis core, dez scroll, dez mobile e sete fallback.
- Quadros reais da figura e sinal comparados durante execução, pausa e retomada.
- Navegação preserva a pausa; etapas manuais continuam funcionando durante pausa e movimento reduzido.
- Rolagem passa pelas cinco etapas nos dois sentidos; resize não substitui escolha manual.
- Pausa finaliza revelações e retomada não reapresenta conteúdo já visto.
- Emulação de movimento reduzido testada desde o carregamento e durante a sessão.
- Ausência de JavaScript e falha intencional do observador mantêm leitura e layout normal.
- Sinal de documento oculto simulado: temporizador suspenso, retorno sem avanço acumulado.
- Revisão independente de hooks, cleanup, foco e tipagem. Corrigidos reinício de revelações, animação redundante no fluxo e fallback do observador.

## Limites

Os testes de viewport móvel e redução de movimento usam emulação, não um aparelho físico ou alteração do sistema operacional. A suspensão por visibilidade foi simulada. Não foi realizado benchmark quantitativo de FPS, bateria ou sessão prolongada; o código limita scroll a um requestAnimationFrame pendente e evita atualizar a etapa React quando o índice permanece igual.

O CI do GitHub verifica HTTP/build/tipos/lint separadamente dos testes Python da skill. Os cenários de navegador são uma verificação complementar reproduzível. A skill permanece v0.1.0-alpha.1; os 45 testes citados na página pertencem àquela release, sem misturar os novos testes de manutenção do repositório.

O resultado da publicação e o vínculo entre commits de GitHub/Sites serão registrados no relatório de entrega, depois que as operações terminarem.
