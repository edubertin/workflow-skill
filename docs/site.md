# Manutenção do site

O site público fica em https://workflow-skill.edubertin.chatgpt.site; o manual
técnico, em https://workflow-skill.edubertin.chatgpt.site/manual. O código em
`site/` permite revisar e versionar a aplicação junto da skill, mantendo a
instalação e as versões da skill independentes da publicação visual.

## Desenvolvimento

Use Node.js 22.13 ou superior, na linha 22 usada pelo CI, e npm. Dentro de `site/`:

```sh
npm ci
npm run dev
```

Os checks são `npm run lint`, `npm run typecheck`, `npm run build` e `npm test`.
Os testes HTTP precisam do servidor local; `SITE_TEST_ORIGIN` seleciona a origem.
O [README do site](../site/README.md) descreve a prévia da aplicação compilada.
A revisão visual de desktop, celular, scroll, teclado e movimento reduzido
complementa esses checks; testes HTTP não demonstram qualidade visual.

O workflow `.github/workflows/site.yml` instala o lockfile, verifica lint/tipos,
compila e testa HTTP contra uma instância local. Ele não usa credenciais de
produção nem publica o site. Os quatro checks Python existentes seguem separados.

## Fonte e artefatos

Versione `app/`, `components/`, `hooks/`, `lib/`, `public/`, `tests/`, `docs/`,
instruções, configurações de build e `package.json`/`package-lock.json` dentro de
`site/`. Preserve as licenças de dependências e assets. A licença MIT na raiz
acompanha o código do projeto; dependências mantêm suas próprias licenças.

`site/.openai/hosting.json` contém somente o identificador público do projeto
Sites e os nomes de bindings, atualmente sem banco ou armazenamento. É necessário
ao build e não contém autorização para publicar. Não inclua tokens, arquivos de
ambiente, autenticação, caches, histórico Git aninhado ou configurações pessoais.

O validador da skill continua verificando os arquivos-fonte do repositório.
Ignora somente estas árvores locais geradas do site: `site/node_modules/`,
`site/dist/`, `site/.wrangler/`, `site/.vinext/`, `site/.next/`, `site/coverage/`,
`site/test-results/` e `site/playwright-report/`. As próprias pastas ainda não
podem ser links. Essa exceção não se aplica a pastas com nomes semelhantes em
outros caminhos nem permite secrets nos fontes. Esses artefatos também são
ignorados pelo Git. O instalador continua copiando somente `skills/workflow/`.

## Publicação e versionamento

Use uma branch `codex/...` e PR para revisar o código versionado em `site/`.
O projeto existente no Sites mantém seu repositório de implantação próprio,
com a aplicação na raiz. Preserve os dois formatos: `site/` no GitHub e raiz
no checkout usado pelo Sites. Uma sincronização copia apenas arquivos-fonte
revisados, sem `.git/`, dependências, credenciais ou artefatos locais.

Antes de publicar, compare os arquivos dos dois checkouts, rode os checks e
registre os commits completos de GitHub e Sites junto da versão implantada.
Publique no projeto Sites existente, valide a URL pública e as rotas/metadata
após a implantação e mantenha o registro dos resultados e limitações. A revisão
em PR e a publicação são operações diferentes; um push não faz deploy.

O site mantém sua versão de aplicação em `site/package.json`. Mudanças de
apresentação não alteram `.codex-plugin/plugin.json`, a release da skill ou as
evidências de comportamento. Uma nova tag/release da skill requer o processo
específico em [releasing.md](releasing.md).
