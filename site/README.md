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

## Documentação do projeto

- [Contexto e estrutura](PROJECT.md).
- [Plano de implementação](docs/implementation-plan.md).
- [Resultados e limites da verificação](docs/verification.md).
- [Relatório público do piloto portátil](public/docs/piloto-portatil.md).

A publicação segue a autorização do usuário; não está implícita nesses comandos.

## Movimento e versionamento

A versão 0.2.0 do site adiciona pausa global, iluminação por letra, revelações e fluxo guiado por scroll. A skill continua na release v0.1.0-alpha.1.

- [Implementação de movimento](docs/motion-plan.md).
- [Verificação da versão 0.2.0](docs/motion-verification.md).
- [Cenários de navegador reproduzíveis](tests/browser/README.md).

O GitHub guarda este código em site/ dentro de edubertin/workflow-skill. O Sites usa o mesmo fonte na raiz do checkout de implantação, preservando seu manifesto público. Sincronizar apenas fonte revisado; nunca copiar .git, dependências, caches ou credenciais.

A versão 0.2.1 refina o alinhamento da figura e a percepção da iluminação; veja [auditoria do plano e ajustes](docs/hero-refinement.md).

A versão 0.3.0 melhora apresentação, navegação por toque e manual no celular, preservando o desktop. Veja [implementação mobile](docs/mobile-implementation.md) e [verificação e limites](docs/mobile-verification.md).
