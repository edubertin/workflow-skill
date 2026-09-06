# Entrega do site — 0.3.2

Publicação concluída em 5 de setembro de 2026, America/Sao_Paulo. Este é o
registro da entrega aprovada; os identificadores abaixo descrevem esse momento,
não o HEAD de futuras alterações documentais.

## Publicação e fonte

- [Site público](https://workflow-skill.edubertin.chatgpt.site/).
- [Manual técnico](https://workflow-skill.edubertin.chatgpt.site/manual).
- Aplicação: **0.3.2**; skill: **v0.1.0-alpha.1**, experimental e independente.
- Sites: versão **7**, resultado **succeeded**.
- Commit Sites: `4b859d3d03652264b762654f115a02431655a5a5`.
- Commit GitHub: `7f1cdc7d9ff5f4be5880c2261bbb08003cd0d62c`.
- PRs integrados: [site e mobile #2](https://github.com/edubertin/workflow-skill/pull/2),
  [tentativa de headers #3](https://github.com/edubertin/workflow-skill/pull/3) e
  [validação pública #4](https://github.com/edubertin/workflow-skill/pull/4).

Na entrega, os 120 arquivos versionados de `site/` eram equivalentes ao fonte
Sites. A `main` local estava sincronizada e ambos os checkouts estavam limpos.
O [procedimento de manutenção](site.md) explica essa duplicação intencional e
como registrar uma próxima publicação. Um ajuste documental não exige uma nova
versão visual ou uma nova release da skill.

## Resultado e aceite

Apresentação e manual publicados, com menu mobile, abertura proporcional,
seletores para toque, índice recolhível, comandos legíveis e movimento acessível.
A composição desktop aprovada foi preservada. A adaptação mobile foi aceita
pelo responsável pelo produto.

Lint, tipos, build, 49 testes Python e os cinco checks do GitHub passaram.
Os cinco contratos HTTP passaram na publicação final. A matriz responsiva cobre
15 tamanhos/orientações, com interações verificadas em Chromium e WebKit
automatizados. Seis comparações desktop não identificaram regressão visual.

As [evidências técnicas](../site/docs/mobile-verification.md) mantêm a matriz,
os resultados de desempenho, as falhas observadas e os critérios dos testes.
Os [cenários de navegador](../site/tests/browser/README.md) permitem repetir as
verificações. A [implementação mobile](../site/docs/mobile-implementation.md)
descreve as decisões e os limites das alterações.

## Limites e continuidade

- Safari iOS, Chrome Android, Instagram interno, VoiceOver e TalkBack em
  aparelhos físicos continuam como verificação complementar. WebKit automatizado
  no Windows não equivale a um iPhone.
- A mediana LCP de laboratório melhorou de 4.528 para 3.228 ms, com CLS zero,
  mas não atingiu a referência de 2,5 s nesse perfil. Não há medição de campo.
- O Sites entrega o WebP como `application/octet-stream` e não aplica `_headers`
  nessa modalidade. Os testes exigem assinatura, orçamento de bytes e
  decodificação real; não se afirma que o cabeçalho foi corrigido.
- A aprovação do site não qualifica a skill como estável. A qualificação
  comportamental continua regida por [evaluation.md](evaluation.md).

Esta etapa de site e mobile está concluída. As verificações complementares e
a qualificação estável pertencem a próximas etapas, com escopo próprio.
