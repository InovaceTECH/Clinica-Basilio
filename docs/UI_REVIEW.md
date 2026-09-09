# Redesign estilo Apple — 8 de setembro de 2026

Direção da gestão: *arredondado, minimalista, vidro líquido, simples e satisfatório.* Aplicada sobre a infraestrutura em camadas da mesma data — a arquitetura não mudou, só a linguagem visual. Regras completas em `docs/DESIGN_SYSTEM.md`, seção "Direção visual — estilo Apple".

## O que mudou

- **Raios**: escala remapeada para 8 / 10 / 12 / 18 / 24 px. Como os componentes usam `rounded-sm|md|lg|xl`, um ajuste de token arredondou o app inteiro. Botões viraram pílulas.
- **Paleta**: neutros frios da Apple (`#F5F5F7` / `#FFFFFF` / `#1D1D1F` no claro, `#000000` / `#1C1C1E` / `#F5F5F7` no escuro) e azul `#0071E3` · `#2997FF`. Bordas translúcidas no lugar de cinza sólido.
- **Vidro líquido**: utilitários `.glass`, `.glass-strong` e `.glass-edge` (o fio de luz da borda superior) aplicados à barra lateral, barra superior, menus, select, diálogos, painel do celular, paleta de comandos e toasts. Nada de vidro em listas ou cartões de conteúdo.
- **Estrutura**: padrão macOS — janela cinza, barra lateral como painel de vidro flutuante e conteúdo num cartão branco arredondado com sombra. Gradiente ambiente atrás de tudo para o vidro ter o que capturar.
- **Tipografia**: pilha SF Pro (sem download), corpo em 17 px, tracking negativo nos títulos.
- **Movimento**: curva `--ease-apple` em todas as transições, recuo de 3% ao pressionar botões e itens de navegação, elevação no hover dos cartões com link. Tudo desligado por `prefers-reduced-motion`.
- **Indicadores**: a faixa dividida virou grade bento — um cartão por métrica, com ícone em bloco arredondado.
- **Listagens**: linhas mais altas, cabeçalho leve, moldura com sombra baixa. Disclosure de filtros com chevron próprio.

## Correção de regressão encontrada na verificação

No modo compacto da barra lateral os rótulos não eram ocultados — apareciam recortados ao lado dos ícones ("V", "C", "F"). Causa: eu havia trocado `p-2`/clipping por `p-0` + `justify-center`, quebrando o recorte por `overflow-hidden` do shadcn. Revertido para o recorte original mantendo o trilho de 36 px.

## Validação

- `npx tsc --noEmit`, `npm run lint` e `npm run build -- --webpack` sem erros.
- Verificação visual em rota temporária com dados fictícios (removida depois), a 1440 px e 500 px, nos temas claro e escuro: grade bento, distribuições, tabela, cartões do layout estreito, filtros, paginação.
- Interações: barra lateral colapsada por `⌘B` (rail só com ícones), paleta `⌘K` com o material de vidro sobre o conteúdo desfocado, alternância de tema. Sem transbordo horizontal.

## Limites da verificação

Sem login real, importação, gravação de interação ou análise de IA — `OPENROUTER_API_KEY` está vazio e a senha do único usuário (`admin@basilico.local`) não está disponível nesta cópia.

O desfoque não foi medido em máquinas da clínica. Se pesar, o ajuste é `--glass-blur` em `globals.css`, num lugar só.

---

# Reformulação da infraestrutura de UI — 8 de setembro de 2026

Reorganização da camada de interface em quatro níveis (tokens → primitivos → padrões → shell), preservando o escopo de recuperação de orçamentos e acompanhamento comercial. Detalhes da arquitetura em `docs/DESIGN_SYSTEM.md`, seção "Infraestrutura de UI".

## O que mudou

- **Tokens**: tema escuro completo (`.dark`), tokens de barra lateral, `--surface-sunken`, elevações `--elevation-1..3`, curvas e durações de movimento. Utilitários `.tabular` e `.scroll-shadow-x`.
- **Primitivos**: vinte componentes novos (`sidebar`, `sheet`, `dialog`, `dropdown-menu`, `command`, `tooltip`, `table`, `breadcrumb`, `tabs`, `avatar`, `separator`, `popover`, `alert`, `progress`, `switch`, `checkbox`, `label`, `collapsible`, `scroll-area`, `input-group`). `table` reescrita sobre os tokens do projeto, como Server Component com coluna fixa e região rolável acessível. `button` com os tamanhos `icon-sm` e `icon-lg`.
- **Padrões** (`src/components/patterns/`): `StatGrid`/`StatCard`, `BarList`, `EmptyState`, `Section` e o conjunto de listagem (`DataTableFrame`, `DataTableToolbar`, `DataTableSortLink`, `DataTablePagination`, `DataField`).
- **Shell**: barra lateral colapsável em trilho de ícones com estado em cookie lido no servidor, `Sheet` no celular, topo fixo com trilha de navegação, paleta de comandos `⌘K`, menu do usuário com aparência e sair. Navegação centralizada em `layout/navigation-items.ts`.
- **Telas migradas**: visão geral, lista de oportunidades, esqueleto de carregamento, aviso de seção e login.

## Implementação

- MCP do 21st.dev: `get_inspiration` para o shell de painel clínico e leitura do componente Records Table (23604, theshanelevine). Da referência vieram a coluna fixa, o cabeçalho ordenável e a barra de contagem; o CSS próprio dela foi descartado em favor dos tokens do projeto.
- Sem biblioteca de gráficos, sem fontes remotas, sem animação contínua. As barras continuam em HTML/CSS renderizado no servidor.
- `useIsMobile` e `useMounted` usam `useSyncExternalStore` em vez de `useState` + `useEffect`, evitando render em cascata.
- Dependências novas: `next-themes` (tema) e `cmdk` (paleta de comandos).

## Correção encontrada na verificação

O `CommandDialog` do registro renderizava os filhos sem o provedor `<Command>` do cmdk e com `DialogTitle`/`DialogDescription` fora do `DialogContent`. A paleta quebrava ao abrir (`Cannot read properties of undefined (reading 'subscribe')`). Corrigido em `src/components/ui/command.tsx`.

## Validação

- `npx tsc --noEmit`, `npm run lint` e `npm run build -- --webpack` sem erros.
- `npm run db:check` e `npm run auth:check` executados com sucesso na cópia local.
- Verificação visual em rota temporária com dados fictícios (removida depois), em 1440 px e 500 px, nos temas claro e escuro: faixa de indicadores, distribuições, tabela, cartões do layout estreito, paginação e estados vazios.
- Interações verificadas: colapso da barra lateral por `⌘B` com gravação do cookie, `Sheet` no celular, paleta por `⌘K` com navegação e alternância de tema, menu do usuário. Sem transbordo horizontal.

## Limites da verificação

Não foram executados login com usuário real, importação de planilha, gravação de interação nem geração de análise pelo serviço de IA — `OPENROUTER_API_KEY` está vazio na cópia local. A revisão visual usou dados fictícios.

O diretório vazio `src/app/ui-review/`, resquício da revisão anterior, continua no repositório; não afeta o roteamento.

---

# Revisão da interface — 8 de setembro de 2026

Interface refinada para recepção e gestão, preservando o escopo existente de recuperação de orçamentos e acompanhamento comercial dos pacientes.

## Implementação

- MCP do 21st.dev: consulta e leitura do componente Dashboard Sidebar (14941, arunjdass). Organização da navegação adaptada à identidade e às permissões do projeto.
- Fontes do sistema, sem download; gráficos em HTML/CSS; shell e conteúdo da análise como Server Components.
- Disclosures nativos para filtros, menu mobile e fundamentos da análise. Apenas interações necessárias usam JavaScript.
- Lista paginada existente de 20 itens, sem prefetch automático dos detalhes. Paciente/tratamento e datas agrupados; layouts específicos para tabela e cartões.
- Carregamento com skeleton estático, movimento reduzido, link de pular navegação e campos identificados.

## Validação

- ESLint e compilação de produção com TypeScript.
- Dashboard, oportunidades e componente de análise revisados em 1280, 768 e 375 px, com dados fictícios, incluindo nome extenso, valor elevado, ausência de datas e estados vazios.
- Nenhum overflow horizontal; nenhuma violação nos testes automatizados axe WCAG A/AA dos componentes revisados, após correção da semântica da lista mobile.
- Interações verificadas com CPU limitada a 4×: menu mobile/Escape, cópia da mensagem, disclosure da análise, modal de contato/Escape, filtros e preservação de filtros nos links de paginação.
- Navegação conforme permissões e ausência de requisições de fontes verificadas.
- Detector Impeccable: nenhum achado nos arquivos revisados.

## Limites da verificação

A cópia local não possui credenciais de banco nem de autenticação da clínica. A revisão visual utilizou uma rota temporária de desenvolvimento com dados fictícios, removida após os testes. Não foram executados testes de gravação, importação, login com usuário real ou geração de análise com o serviço de IA.

O build foi validado com `npm run build -- --webpack`. O Turbopack encontrou uma restrição do ambiente ao abrir uma porta durante o processamento de CSS, inclusive após a tentativa com permissão ampliada. O projeto mantém o comando de build original.

A simulação de CPU verifica a funcionalidade sob limitação; não representa um benchmark em computadores da clínica nem uma garantia de latência do banco.
