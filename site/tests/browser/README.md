# Verificação de movimento e responsividade no navegador

Os dez arquivos são cenários executáveis pelo Playwright CLI e retornam listas de verificações aprovadas. Lançam erro no primeiro resultado diferente do esperado. Use uma sessão isolada de testes e uma origem local. Não usam contas nem produção.

Com a aplicação iniciada, na raiz do site:

```sh
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa open http://localhost:3000/
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa run-code --filename tests/browser/motion-core.js
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa run-code --filename tests/browser/motion-scroll.js
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa run-code --filename tests/browser/motion-mobile.js
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa run-code --filename tests/browser/motion-fallback.js
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa run-code --filename tests/browser/hero-refinement.js
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa run-code --filename tests/browser/wordmark-navigation.js
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa run-code --filename tests/browser/mobile-responsive.js
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa run-code --filename tests/browser/mobile-manual.js
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa run-code --filename tests/browser/mobile-fallback.js
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa run-code --filename tests/browser/mobile-touch.js
npx --yes --package @playwright/cli playwright-cli -s=workflow-qa close
```

Para testar o build, abra http://127.0.0.1:4173/ depois de iniciar `npm run start -- --port 4173`. Os cenários reutilizam a origem aberta; não chamam Sites ou GitHub.

- Core: deriva, congelamento de quadros, retomada, preferência durante navegação e iluminação por letra.
- Scroll: cinco etapas nos dois sentidos, escolha manual, resize, pausa sem bloquear página e conteúdo revelado.
- Mobile: layout, overflow, reprodução opcional, pausa global, redução de movimento e teclado.
- Fallback: JavaScript desativado, falha ao observar elementos de movimento, viewport baixa e redução desde o carregamento.

A visibilidade é um sinal simulado no documento de teste; não comprova suspensão real do sistema operacional. Redução de movimento usa emulação do navegador. O cenário de observador cria um contexto separado com falha intencional ao observar .hero, .flow-chapter e .reveal; preserva o observador de prefetch dos links do framework. Logs de diagnóstico nesse contexto são esperados. A simulação antiga que corrompia a API global inteira falhou no build de produção; veja docs/mobile-verification.md para o resultado e o limite.

As esperas curtas comparam quadros ou aguardam ciclos de quatro segundos; não servem para substituir o carregamento da página. O CLI deve apresentar uma lista Result de checks aprovados. Verifique também Error: algumas versões do CLI podem encerrar com código zero após um erro de cenário.

O CI padrão executa os cinco contratos HTTP, lint, tipos e build. Estes cenários complementares de navegador são executados separadamente; não estão apresentados como cobertura de CI.

Hero refinement: alinhamento durante resize, nota removida, luz por letra, pausa pelo cabeçalho e suspensão fora da viewport.
