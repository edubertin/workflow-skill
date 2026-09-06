# Refinamento 0.2.1 — alinhamento e iluminação

Revisão das três anotações de 5 de setembro de 2026.

## Mudanças

- Retirada somente a nota explicativa abaixo do demonstrador de etapas.
- Camada visual da abertura agora pertence à mesma shell limitada a 1440 px do texto e do diagrama. A figura acompanha o conteúdo ao ampliar a janela.
- Iluminação aguarda a fonte estar pronta e mais 350 ms; passagem de aproximadamente 1,88 s, intervalo de 90 ms entre letras e luz champanhe mais visível.
- A passagem continua única, repetível por hover/foco, e suspende quando o nome sai da viewport.
- Botão do cabeçalho mantido: utiliza o controle global da abertura e pausa figura, letras, sinal e reprodução automática. O estado continua preservado na navegação pelo manual.

## Auditoria do plano

As cinco etapas funcionais estão presentes: política global, wordmark, deriva e scroll da abertura, revelações e percurso guiado pela rolagem. A revisão identificou duas lacunas de acabamento: arte ligada à largura da janela e animação do nome que podia terminar fora da viewport. Ambas foram corrigidas.

Os limites de validação anteriores continuam documentados: viewport móvel e movimento reduzido são emulados; não houve teste em aparelho físico nem benchmark prolongado de FPS/bateria.

## Verificação específica

Cenário tests/browser/hero-refinement.js: dez verificações aprovadas, incluindo alinhamento em 390, 760, 1091, 1440, 1920 e 2560 px, ausência da nota, luz por letra, pausa pelo cabeçalho e suspensão fora da viewport. Seis verificações centrais de movimento e navegação também aprovadas.

A revisão visual em tela larga confirmou que a figura permanece no conjunto de conteúdo. Build, lint, TypeScript e contratos HTTP são os checks de entrega; o resultado da publicação será registrado separadamente.

## Clique no nome com movimento ativo

A verificação identificou uma falha adicional: repetir a iluminação em hover/foco remontava as letras e podia interromper o clique para voltar do manual à apresentação. As letras agora mantêm os mesmos elementos; apenas o nome da animação alterna. O cenário wordmark-navigation.js cobre duas idas e voltas por mouse e uma por teclado com animações ativas. O cenário central também passou a esperar explicitamente a URL e o conteúdo de destino.
