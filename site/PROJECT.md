# Workflow Site

## Estado atual

Apresentação e manual técnico em português da Workflow Skill para Codex.
Aplicação **0.3.2** publicada no Sites, com adaptação mobile aprovada e composição
desktop preservada. A skill continua experimental, em **v0.1.0-alpha.1**.

O [registro da entrega](https://github.com/edubertin/workflow-skill/blob/main/docs/site-release-0.3.2.md)
identifica a publicação e seus commits. Evidências históricas não representam
novos testes nem autorização para outra publicação.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| app/page.tsx | Apresentação |
| app/manual/page.tsx | Manual técnico |
| app/components/ | Navegação, fluxos, movimento e exemplos |
| app/components/mobile-disclosure.tsx | Menu e índice recolhíveis do mobile |
| app/globals.css | Tema editorial e apresentação desktop |
| app/mobile.css | Adaptação até 760px e elementos exclusivos do mobile |
| public/hero-ribbon.png | Arte original usada no desktop |
| public/hero-ribbon-mobile.webp | Mesma arte, otimizada sem perdas para mobile |
| public/og.png e public/icon.svg | Card social e ícone do produto |
| public/docs/piloto-portatil.md | Relatório público do piloto da skill |
| docs/ | Decisões, implementação e evidências por etapa |
| tests/ | Contratos HTTP e cenários de navegador |

O GitHub mantém este fonte em `site/`; o Sites exige a aplicação na raiz de seu
checkout próprio. Esse espelho é intencional. Sincronize apenas fontes revisados,
preservando Git, dependências e caches de cada checkout.

## Stack e comandos

Vinext, React, TypeScript estrito, componentes Shadcn/Base UI e CSS.
Sem banco ou autenticação; hospedagem no Sites. Preserve o lockfile e o manifesto.

Instalação: `npm ci`. Prévia: `npm run dev`.
Checks: `npm run lint`, `npm run typecheck`, `npm run build`.
Contratos HTTP: `npm test`, com servidor ativo e `SITE_TEST_ORIGIN` definido.
O [README](README.md) contém os comandos da prévia compilada.

## Contexto para manutenção

1. [Implementação mobile](docs/mobile-implementation.md).
2. [Verificação mobile, resultado público e limites](docs/mobile-verification.md).
3. [Cenários reproduzíveis de navegador](tests/browser/README.md).
4. [Movimento](docs/motion-plan.md) e [refinamento da abertura](docs/hero-refinement.md).

O [plano inicial](docs/implementation-plan.md) e a
[primeira verificação](docs/verification.md) são históricos. Preserve as falhas
registradas quando houver retestes. Os testes da skill e os testes do site têm
escopos distintos; a aprovação visual não qualifica a skill como estável.
