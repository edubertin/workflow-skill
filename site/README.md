# Workflow Site

Apresentação visual e manual técnico da [Workflow Skill](https://github.com/edubertin/workflow-skill).

Design escuro editorial, diagramas interativos, documentação de instalação e card social. Publicado no Sites em https://workflow-skill.edubertin.chatgpt.site.

## Desenvolvimento

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Verificar a aplicação compilada

Inicie o servidor em um terminal:

```sh
npm run start -- --port 4173
```

Em outro terminal PowerShell:

```powershell
$env:SITE_TEST_ORIGIN = 'http://127.0.0.1:4173'
npm test
```

Abra / para a apresentação e /manual para a documentação. O comando de testes usa localhost:3000 quando SITE_TEST_ORIGIN não é definido.

## Documentação atual

A aplicação publicada está na versão **0.3.2**. A skill permanece na release
experimental **v0.1.0-alpha.1**, com qualificação independente.

- [Contexto e estrutura](PROJECT.md).
- [Entrega aprovada e fonte publicado](https://github.com/edubertin/workflow-skill/blob/main/docs/site-release-0.3.2.md).
- [Implementação mobile](docs/mobile-implementation.md).
- [Verificação mobile e limites](docs/mobile-verification.md).
- [Cenários de navegador reproduzíveis](tests/browser/README.md).
- [Relatório público do piloto portátil](public/docs/piloto-portatil.md).

O GitHub guarda este código em `site/`; o Sites usa o mesmo fonte na raiz do
checkout de implantação. O [procedimento de manutenção](https://github.com/edubertin/workflow-skill/blob/main/docs/site.md)
explica a sincronização e a publicação. A publicação segue a autorização do
usuário; não está implícita nos comandos de desenvolvimento.

## Histórico de implementação

| Etapa | Registro |
| --- | --- |
| Primeira publicação | [Plano](docs/implementation-plan.md) e [verificação inicial](docs/verification.md) |
| 0.2.0 — pausa global, iluminação e scroll | [Movimento](docs/motion-plan.md) e [verificação](docs/motion-verification.md) |
| 0.2.1 — alinhamento e iluminação | [Refinamento da abertura](docs/hero-refinement.md) |
| 0.3.0 — apresentação e manual mobile | [Implementação](docs/mobile-implementation.md) |
| 0.3.1 / 0.3.2 — tipo HTTP do WebP e validação pública | [Tentativa, resultado e contrato](docs/mobile-verification.md#resultado-da-hospedagem-e-contrato-032) |

Os registros mantêm resultados e falhas de cada etapa; o estado publicado está
no registro de entrega indicado acima.
