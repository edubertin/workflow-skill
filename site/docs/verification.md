# Verificação inicial — 5 de setembro de 2026

Registro histórico da primeira publicação, concluída posteriormente. Para o estado atual, consulte a [verificação mobile e pública 0.3.2](mobile-verification.md) e o [registro de entrega](https://github.com/edubertin/workflow-skill/blob/main/docs/site-release-0.3.2.md). Os próximos passos e os resultados abaixo se referem à data deste registro.

## Registro anterior à publicação
Versão desenvolvida e verificada localmente. Estes resultados foram registrados antes de commit, push e implantação. A prévia da aplicação compilada usa http://127.0.0.1:4173/; o manual fica em /manual.

A origem nos metadados é https://workflow-skill.edubertin.chatgpt.site. A implantação precisa ter seu resultado confirmado antes de esse endereço ser apresentado como publicado.

## Checks da versão final
| Verificação | Resultado |
| --- | --- |
| Compilação de produção: npm run build | Passou |
| TypeScript estrito: npm run typecheck | Passou |
| Lint do código próprio e componentes utilizados: npm run lint | Passou |
| Contratos HTTP: npm test com SITE_TEST_ORIGIN=http://127.0.0.1:4173 | 5 testes passaram |
| Auditoria de dependências npm | 0 vulnerabilidades relatadas após atualização das versões compatíveis |
| Rotas, âncoras, imagem social, ilustração e ícone | Respostas e referências verificadas |
| Desktop 1440 × 1000 e mobile 390 × 844 | Revisão visual; sem transbordamento horizontal da página |
| Navegação por teclado | Avançar etapas preserva foco; setas movem foco entre abas e Enter ativa a aba |
| Manual e FAQ | Navegação entre páginas, dez capítulos, âncoras e abertura do FAQ verificadas |
| Cópia de comandos | Clipboard confirmou cópia; mensagem de estado apresentada |
| Logs do navegador no endereço da versão compilada | Nenhum erro observado durante a verificação final |

O lint inclui app/, lib/ e os componentes button, tabs, accordion e table utilizados pela aplicação. Os demais componentes fornecidos pelo scaffold foram preservados; o lint não é uma declaração de revisão integral desses componentes não utilizados.

## Interações e movimento
A revisão visual solicitada pelo usuário em 1091 × 930 encontrou repetição da imagem e dimensionamento inadequado no hero. A imagem foi integrada ao fundo de toda a abertura, com no-repeat e dimensionamento que preserva a figura. Em telas intermediárias o fluxo ocupa uma faixa abaixo do texto; em mobile a arte é discreta e o fluxo permanece no layout normal. A revisão em 1440, 1091 e 390 pixels confirmou a composição e ausência de transbordamento horizontal. Pausa e retomada por teclado foram verificadas pelo estado real das animações.

A demonstração permite selecionar cinco etapas, avançar, voltar, reiniciar, reproduzir e pausar. A reprodução foi observada avançando as etapas. Especialistas, exemplos de pedidos e exemplos de continuidade alternam por abas. As interações representam o processo da skill, sem executar agentes.

A implementação respeita prefers-reduced-motion: o CSS reduz animações e o controle de reprodução automática é desativado. A preferência foi revisada no código; não foi feita alteração da configuração de acessibilidade do sistema operacional.

A revisão independente identificou perda de foco causada pela remontagem dos controles a cada etapa. A correção mantém os controles estáveis e restringe a remontagem aos textos animados. A versão compilada foi verificada depois da correção: foco mantido em Próxima etapa após clique e Enter.

## Card social
public/og.png contém a identidade do produto, 1731 × 909 pixels, PNG abaixo de 5 MB. Os metadados Open Graph e X usam URL absoluta, título, descrição e texto alternativo; a imagem é compartilhada entre a apresentação e o manual. O manual possui título, descrição, URL e canonical próprios.

O card foi inspecionado visualmente e servido com Content-Type correto. A captura por serviços externos de compartilhamento ainda depende de publicação e acesso ao endereço hospedado.

## Piloto portátil
O relatório público, em public/docs/piloto-portatil.md, distingue:
- integridade dos arquivos e instalação com recibo;
- descoberta automática em um novo processo do Codex CLI isolado;
- três casos locais em executor separado;
- verificações pendentes de autenticação no mesmo CLI, desktop e qualificação estável.

A skill pessoal permaneceu intacta. Os 45 testes do pacote pertencem à release v0.1.0-alpha.1; não são contados como testes do site ou como validação completa dos 37 cenários comportamentais documentados.

## Observações de execução
- Dependências do scaffold foram atualizadas em conjunto para corrigir os achados da auditoria, sem force ou legacy-peer-deps.
- A reotimização de dependências em desenvolvimento deixou uma versão antiga do React no navegador; o recarregamento resolveu. A validação final foi realizada na versão compilada.
- Uma recompilação encontrou um arquivo gerado bloqueado pelo servidor de prévia no Windows. O servidor foi encerrado, o build foi concluído e a prévia reiniciada.
- O Vinext informa que não consegue classificar estaticamente as duas rotas. A compilação terminou com sucesso e ambas responderam aos testes HTTP.

## Encaminhamento registrado na época
A próxima etapa era publicar e confirmar rotas, assets e card no endereço hospedado. Essa etapa foi concluída; o registro de entrega indicado no início documenta a publicação posterior. Este histórico não concede autorização para novas operações Git ou Sites.
