# Workflow Skill

Workflow ajuda o Codex a escolher o processo adequado para uma tarefa: análise,
planejamento, implementação, revisão ou publicação. Preserva o objetivo durante
interrupções, consulta o contexto do projeto e verifica a autorização antes de agir.

Este é o repositório de manutenção da skill. A versão inicial está em revisão;
ainda não existe uma release estável ou listagem publicada no diretório de plugins.

## Exemplos

- `workflow` — mostra o menu, sem inspecionar o projeto.
- `workflow modo leitura: confira a estrutura deste repositório` — analisa sem editar.
- `workflow implemente a correção descrita no issue` — implementa no escopo autorizado.
- `Como está indo?` — recebe uma atualização sem cancelar a tarefa em andamento.
- `Pare as alterações e só me explique` — revoga as alterações pendentes.
- `workflow prepara no GitHub` — aplica as regras de publicação do usuário e do projeto.

A seleção de um modo nunca concede permissão. A skill respeita as instruções do
usuário e do projeto, inclusive regras mais restritivas sobre Git, produção e dados.

## Instalação local

Requisitos das ferramentas deste repositório: Git e Python 3.11 ou superior.
A skill instalada contém instruções e referências; não precisa executar Python
para orientar uma conversa.

```sh
git clone https://github.com/edubertin/workflow-skill.git
cd workflow-skill
git switch codex/portable-workflow-foundation
python -m pip install -r requirements-dev.txt
python scripts/validate_package.py
```

O exemplo seleciona a branch em revisão. Quando houver releases, prefira uma tag
publicada e confira suas notas antes de atualizar.

O instalador exige o destino explícito da pasta da skill, fora deste checkout, e
uma pasta pai existente. Exemplo de instalação para avaliação, em uma pasta nova:

```sh
python -c "from pathlib import Path; Path('../workflow-install').mkdir(exist_ok=True)"
python scripts/install_workflow.py --destination ../workflow-install/workflow
python scripts/install_workflow.py --destination ../workflow-install/workflow --check
```

Esse destino de avaliação não é ativado automaticamente. Para instalação pessoal
ou de outro projeto, informe a pasta de skills usada pelo seu host. A
[documentação do Codex](https://learn.chatgpt.com/pt-BR/docs/build-skills) descreve
as opções de descoberta. O instalador não escolhe nem modifica sua configuração
global. Evite duas instalações ativas com o mesmo nome.

Destinos existentes com conteúdo diferente são preservados. Para avaliar uma
atualização, instale em outra pasta explícita, compare as mudanças e faça a troca
depois da revisão. `.workflow-install.json` registra origem e integridade;
`--check` verifica divergências. Reinicie o host se a skill não aparecer.

## Agentes e preferências

A Workflow consulta especialistas do projeto primeiro, usa as capacidades que o
host realmente oferece e continua com uma alternativa explícita quando algum
especialista não está disponível. Não instala agentes automaticamente.

Veja [a descoberta de especialistas](skills/workflow/references/specialist-discovery.md)
e [as preferências pessoais](docs/personalization.md). Os dois perfis em
`docs/agents/` orientam a manutenção deste repositório; são instruções de projeto,
não agentes registrados automaticamente no Codex.

## Verificação

```sh
python scripts/validate_package.py
python -m unittest discover -s tests -v
```

O GitHub Actions executa validações estruturais e testes das ferramentas em Windows
e Linux. Isso não demonstra que um modelo obedecerá às instruções. Os cenários de
comportamento e os limites ficam em [docs/evaluation.md](docs/evaluation.md).
Os checks automáticos não fazem chamadas de modelos nem acessam produção.

## Plugin e versões

O manifesto `.codex-plugin/plugin.json` empacota a mesma skill para distribuição.
O pacote não inclui MCP, servidor, hooks ou serviços externos. Validar o manifesto
não equivale a instalar ou publicar em um diretório de plugins. Veja o
[processo de release](docs/releasing.md).

Compatibilidade comportamental inicial: Codex desktop no Windows. A execução dos
scripts em outros sistemas é verificada separadamente. O suporte a outros hosts
e modelos precisa de avaliação própria.

## Origem

A skill evolui a versão pessoal de Workflow, anteriormente registrada em
[workflow-v2-review](https://github.com/edubertin/workflow-v2-review).
[workflow-2.0](https://github.com/edubertin/workflow-2.0) é o projeto separado de runtime.
Veja [PROVENANCE.md](PROVENANCE.md) para os limites do conteúdo incluído.

A licença está aguardando escolha do autor; nenhuma licença de código aberto
foi atribuída a esta versão em revisão.
