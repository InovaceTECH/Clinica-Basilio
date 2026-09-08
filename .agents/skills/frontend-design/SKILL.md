---
name: frontend-design
description: Aplica e revisa o Design System da Plataforma Inteligente de Recuperação de Orçamentos da Clínica Basilico em qualquer implementação de interface.
---

# Frontend Design Skill

## 1. Objetivo

Esta skill define como o agente deve implementar, modificar e revisar interfaces da Plataforma Inteligente de Recuperação de Orçamentos da Clínica Basilico.

A fonte de verdade visual do projeto é:

`docs/DESIGN_SYSTEM.md`

Esta skill não substitui o Design System.

Ela define **como o agente deve utilizá-lo** durante o desenvolvimento.

---

# 2. Quando Usar esta Skill

Utilize esta skill sempre que a tarefa envolver:

- criação de páginas;
- criação de componentes visuais;
- alteração de layout;
- alteração de estilos;
- responsividade;
- formulários;
- dashboards;
- tabelas;
- filtros;
- navegação;
- modais;
- drawers;
- cards;
- estados vazios;
- loading states;
- feedback visual;
- badges;
- gráficos;
- página de oportunidade;
- análise da IA;
- importação de planilhas;
- revisão visual;
- refatoração de frontend.

Se a tarefa alterar o que o usuário vê ou como interage com a interface, esta skill deve ser considerada aplicável.

---

# 3. Fontes de Verdade

Antes de implementar uma interface, consulte:

```text
docs/PRD.md
docs/DESIGN_SYSTEM.md
docs/ARCHITECTURE.md
```

Responsabilidades:

```text
PRD.md
→ define o que a funcionalidade deve fazer.

DESIGN_SYSTEM.md
→ define como a funcionalidade deve parecer e se comportar visualmente.

ARCHITECTURE.md
→ define como a funcionalidade deve ser implementada tecnicamente.
```

Nunca usar esta skill para substituir requisitos explícitos desses documentos.

---

# 4. Ordem de Leitura

Para uma tarefa de frontend:

```text
1. Entender a solicitação
        ↓
2. Consultar PRD.md
        ↓
3. Consultar DESIGN_SYSTEM.md
        ↓
4. Consultar ARCHITECTURE.md quando houver impacto técnico
        ↓
5. Inspecionar componentes existentes
        ↓
6. Planejar alteração mínima necessária
        ↓
7. Implementar
        ↓
8. Revisar
        ↓
9. Testar responsividade e estados
```

---

# 5. Regra Principal

> Não invente um novo padrão visual quando o Design System ou um componente existente já resolver o problema.

Sempre priorize:

```text
reutilizar
>
estender
>
criar
```

---

# 6. Inspeção Antes da Implementação

Antes de criar código frontend:

1. identifique quais páginas ou componentes serão afetados;
2. procure componentes reutilizáveis existentes;
3. identifique os tokens necessários;
4. verifique padrões equivalentes no Design System;
5. identifique os estados da interface;
6. verifique comportamento desktop, tablet e mobile;
7. determine se existem loading, empty e error states;
8. identifique requisitos de acessibilidade.

Não comece criando novos componentes sem realizar essa inspeção.

---

# 7. Reutilização de Componentes

Antes de criar:

```text
Button
Input
Select
Card
Modal
Badge
Table
Drawer
Toast
PageHeader
```

verifique se já existe implementação equivalente em:

```text
src/components/ui/
src/components/
```

Se existir:

- reutilize;
- estenda por props;
- crie variante somente quando necessário.

Evite duplicações como:

```text
BlueButton
PrimaryButton
MainButton
ActionButton
```

quando todos representam a mesma ação primária.

---

# 8. Componentes Base Esperados

O sistema poderá possuir componentes como:

```text
Button
IconButton

Input
Textarea
Select
Checkbox
Radio

Badge
StatusBadge
PriorityBadge

Card
MetricCard

Table
DataTable
Pagination

Modal
Drawer
Dropdown
Tooltip
Toast

Tabs
Skeleton
EmptyState

PageHeader
Sidebar
Topbar

FilterBar
SearchInput

Timeline

AIAnalysisCard
SuggestedMessageCard

FollowUpCard
OpportunityCard

ImportWizard
ColumnMapper
```

Use estes nomes como referência conceitual.

Não crie todos antecipadamente.

Crie somente quando a funcionalidade exigir.

---

# 9. Tokens de Design

Não espalhar valores visuais arbitrários pelo código.

Preferir tokens.

Exemplo:

```text
bg-background
bg-surface
text-foreground
text-muted-foreground
border-border
bg-primary
text-primary-foreground
```

Evitar:

```text
bg-[#F6F5F4]
text-[#31302E]
rounded-[11px]
shadow-[...]
```

quando já existir token correspondente.

Valores customizados são permitidos apenas quando:

1. o Design System exige;
2. não existe token equivalente;
3. o valor é centralizado posteriormente.

---

# 10. Cor

O sistema utiliza uma única cor estrutural principal.

Use a cor primária para:

- principal CTA;
- links;
- item ativo;
- foco;
- ação de IA;
- elementos principais de navegação.

Não usar cores adicionais como decoração estrutural.

Cores de sucesso, atenção e erro devem possuir função semântica.

---

# 11. Estados Semânticos

Não depender apenas de cor.

Exemplo correto:

```text
[Alta]
```

com texto + cor.

Não:

```text
●
```

vermelho sem label.

Prioridades:

```text
Alta
Média
Baixa
```

Status devem sempre possuir texto legível.

---

# 12. Tipografia

Utilizar Inter ou o stack definido pelo Design System.

Não adicionar novas famílias tipográficas sem instrução explícita.

Hierarquia:

```text
Heading 1
→ título de página

Heading 2
→ seção

Heading 3
→ card / painel

Body
→ conteúdo principal

Body Small
→ tabelas e metadata

Label
→ formulários

Caption
→ badges e pequenos indicadores
```

Evite criar tamanhos arbitrários de fonte.

---

# 13. Espaçamento

Utilize a escala definida em `DESIGN_SYSTEM.md`.

Priorizar múltiplos da escala existente.

Não criar espaçamentos isolados sem necessidade.

Exemplo:

```text
gap-4
p-6
space-y-4
```

é preferível a valores arbitrários.

---

# 14. Border Radius

Respeitar:

```text
Inputs
→ radius pequeno

Botões
→ radius médio

Cards
→ radius maior

Modais
→ radius grande

Badges
→ full
```

Não transformar toda a interface em elementos pill-shaped.

---

# 15. Sombras

A interface deve utilizar principalmente:

```text
borda + superfície
```

Sombras são secundárias.

Use sombras apenas para:

- menus;
- popovers;
- cards elevados;
- modais;
- drawers.

Não usar sombras fortes ou decorativas.

---

# 16. Layout

A aplicação utiliza App Shell.

Desktop:

```text
Sidebar
+
Área principal
```

A área de conteúdo deve priorizar:

- boa largura de leitura;
- respiro;
- alinhamento;
- densidade moderada.

---

# 17. Navegação

Navegação prevista:

```text
Dashboard
Oportunidades
Follow-ups
Importar
Playbooks
Configurações
```

O item ativo deve ser claramente identificável.

Não alterar a arquitetura principal de navegação sem requisito do PRD.

---

# 18. Page Header

Páginas principais devem utilizar um padrão consistente.

Estrutura:

```text
Título
Descrição opcional
Ação principal opcional
```

Exemplo:

```text
Oportunidades

Gerencie pacientes com orçamentos em aberto.

[Importar planilha]
```

---

# 19. Botões

Cada tela deve possuir hierarquia clara.

## Primário

Use para a ação principal.

Exemplo:

```text
Analisar com IA
Salvar
Importar planilha
Adicionar follow-up
```

## Secundário

Use para:

```text
Cancelar
Voltar
Editar
Ver detalhes
```

## Destrutivo

Somente para ações realmente destrutivas.

Não utilizar dois ou três botões primários concorrendo na mesma área.

---

# 20. Formulários

Todos os campos devem possuir:

- label;
- estado de foco;
- estado de erro;
- mensagem de erro quando necessário;
- tipagem correta;
- acessibilidade.

Não depender exclusivamente de placeholder como label.

---

# 21. Tabelas

No desktop, listas operacionais podem utilizar tabelas.

Priorizar:

- linhas legíveis;
- cabeçalho discreto;
- poucas bordas;
- ações organizadas;
- filtros server-side quando aplicável.

Não incluir colunas sem valor operacional.

---

# 22. Mobile

Não reproduzir a tabela desktop inteira horizontalmente.

Converter listagens densas para:

- cards;
- rows;
- drawers;
- filtros condensados.

Mobile deve ser uma reorganização da experiência, não apenas uma versão menor.

---

# 23. Responsividade

Validar sempre:

```text
Mobile
< 640px

Tablet
640px – 1023px

Desktop
>= 1024px

Wide
>= 1440px
```

Cada tela deve ser verificada pelo menos em:

```text
375px
768px
1280px
```

quando houver possibilidade de teste visual.

---

# 24. Página de Oportunidade

A página de oportunidade é uma das telas centrais do produto.

Ela deve permitir que a recepcionista responda rapidamente:

```text
Quem é o paciente?

Qual é a oportunidade?

Qual é a objeção?

Qual é a prioridade?

Qual é a estratégia?

Qual mensagem posso usar?

Qual é a próxima ação?
```

Desktop pode utilizar duas colunas:

```text
Dados / histórico
+
Análise da IA / estratégia
```

Mobile deve empilhar os blocos.

---

# 25. Análise da IA

A IA é assistiva.

A interface não deve apresentar resultados como fatos absolutos.

Use:

```text
Análise sugerida

Estratégia recomendada

Mensagem sugerida

Próxima ação recomendada
```

Evite:

```text
Resposta correta

Estratégia garantida

Paciente certamente fechará
```

---

# 26. Card de IA

O componente deve ser visualmente distinto sem parecer um chatbot genérico.

Preferir:

- superfície clara;
- borda;
- ícone discreto;
- hierarquia textual;
- seções claras.

Evitar:

- gradientes chamativos;
- neon;
- animações excessivas;
- roxo como identidade genérica de IA.

---

# 27. Mensagem Sugerida

A mensagem gerada deve possuir:

- bloco próprio;
- boa legibilidade;
- botão de copiar;
- feedback após copiar.

Exemplo:

```text
Mensagem sugerida

[conteúdo]

[Copiar mensagem]
```

---

# 28. Timeline

Interações devem utilizar timeline simples.

Ordenação:

```text
mais recente primeiro
```

ou conforme padrão já estabelecido no projeto.

Não misture histórico e formulário de nova interação sem separação visual.

---

# 29. Follow-ups

Destaques operacionais:

```text
Atrasados
Hoje
Próximos
```

Atrasados precisam chamar atenção, mas sem dominar a tela com vermelho.

---

# 30. Importação

A importação deve utilizar fluxo guiado.

```text
Arquivo
↓
Mapeamento
↓
Revisão
↓
Importação
```

Nunca importar automaticamente após escolher o arquivo sem permitir revisão.

---

# 31. Mapeamento de Colunas

Mostrar:

```text
coluna original
amostra
campo de destino
```

Exemplo:

```text
"Cliente"
"João da Silva"
→ Nome do paciente
```

Isso reduz erros de importação.

---

# 32. Dashboard

Dashboard deve responder:

```text
Quantas oportunidades temos?

Qual valor está em aberto?

Quanto recuperamos?

Quais objeções são mais frequentes?

O que precisa de atenção hoje?
```

Não adicionar gráficos sem uma pergunta operacional clara.

---

# 33. Gráficos

Preferir visualizações simples.

Use:

- barras;
- linhas;
- funil simples;
- donut quando apropriado.

Evite:

- 3D;
- muitas cores;
- gráficos puramente decorativos.

---

# 34. Loading

Toda operação assíncrona precisa de feedback.

Exemplos:

```text
Analisando oportunidade...

Importando registros...

Salvando follow-up...
```

Para conteúdo de página, preferir skeleton.

Para ações curtas, spinner no botão é suficiente.

---

# 35. Empty State

Sempre informar:

```text
o que está vazio
+
o que o usuário pode fazer
```

Exemplo:

```text
Nenhuma oportunidade encontrada.

Importe uma planilha para começar.

[Importar planilha]
```

---

# 36. Error State

Erros devem orientar o usuário.

Evitar:

```text
Error 500
```

Preferir:

```text
Não foi possível gerar a análise.

Revise as informações ou tente novamente.
```

Não expor stack traces ou mensagens internas.

---

# 37. Toasts

Utilizar para confirmação de ações.

Exemplos:

```text
Follow-up agendado.

Mensagem copiada.

Importação concluída.
```

Não utilizar toast como única forma de informar erro de validação em formulário.

---

# 38. Modais

Utilizar para tarefas curtas:

- confirmação;
- registrar contato;
- criar follow-up;
- pequenas edições.

Não colocar fluxos complexos dentro de modal.

---

# 39. Drawers

Utilizar quando apropriado para:

- filtros;
- detalhes rápidos;
- experiência mobile.

---

# 40. Acessibilidade

Toda implementação deve considerar:

- contraste;
- foco visível;
- navegação por teclado;
- labels;
- aria-label;
- tamanho mínimo de toque;
- feedback não baseado somente em cor.

Botões apenas com ícone devem possuir:

```text
aria-label
tooltip
```

---

# 41. Ícones

Utilizar preferencialmente:

```text
Lucide React
```

Não misturar estilos de diferentes bibliotecas sem necessidade.

Ícones são auxiliares.

Ações críticas devem possuir texto.

---

# 42. Linguagem da Interface

Usuários não precisam conhecer termos técnicos.

Use:

```text
Análise da IA
Importar planilha
Oportunidade
Follow-up
Mensagem sugerida
```

Não use na interface:

```text
LLM
prompt
token
JSON
endpoint
completion
```

---

# 43. Formatação Local

Aplicação brasileira.

## Moeda

```text
R$ 7.500,00
```

## Data

```text
19/08/2026
```

ou:

```text
19 ago
```

## Telefone

```text
(14) 99999-9999
```

---

# 44. Performance Visual

Evitar:

- renderizações desnecessárias;
- listas gigantes sem paginação;
- imagens pesadas;
- dependências visuais grandes sem necessidade;
- animações constantes.

A interface deve parecer rápida.

---

# 45. shadcn/ui

Pode ser utilizado como base.

Mas:

```text
shadcn/ui
≠
identidade visual final
```

Sempre adaptar componentes para:

```text
docs/DESIGN_SYSTEM.md
```

---

# 46. Tailwind CSS

Preferir classes semânticas e tokens.

Exemplo:

```tsx
<Card className="bg-surface border-border">
```

em vez de:

```tsx
<div className="bg-[#fff] border-[#e6e6e6] rounded-[12px]">
```

quando já houver abstração apropriada.

---

# 47. Componentização

Não transformar cada pequeno bloco em componente.

Criar componente quando houver:

- reutilização;
- lógica própria;
- responsabilidade visual clara;
- complexidade suficiente.

Evitar abstrações prematuras.

---

# 48. Lógica de Negócio

Não colocar regras de negócio importantes dentro de componentes visuais.

Exemplo incorreto:

```text
OpportunityCard
→ calcula score
→ define regra comercial
→ chama OpenRouter
```

Correto:

```text
service
→ calcula dados

component
→ apresenta dados
```

---

# 49. Server e Client Components

Seguir a arquitetura do projeto.

Não adicionar `"use client"` automaticamente.

Use Client Components somente quando necessário para:

- estado;
- eventos;
- hooks;
- APIs do navegador.

Manter Server Components quando forem suficientes.

---

# 50. Estados da Tela

Antes de concluir um componente ou página, verificar:

```text
Default

Loading

Empty

Error

Success

Disabled

Mobile
```

Nem todos precisam de implementação específica, mas todos devem ser considerados.

---

# 51. Revisão Visual Obrigatória

Depois da implementação, revise:

## Estrutura

- hierarquia;
- alinhamento;
- espaçamento;
- densidade.

## Design

- cores;
- tipografia;
- radius;
- bordas;
- sombras.

## Componentes

- reutilização;
- consistência;
- variantes.

## UX

- ação principal;
- feedback;
- loading;
- erro;
- empty state.

## Responsividade

- desktop;
- tablet;
- mobile.

## Acessibilidade

- teclado;
- foco;
- contraste;
- labels.

---

# 52. Checklist de Implementação

Antes de considerar uma tarefa frontend concluída:

```text
[ ] Consultei PRD.md.

[ ] Consultei DESIGN_SYSTEM.md.

[ ] Consultei ARCHITECTURE.md quando necessário.

[ ] Procurei componentes existentes.

[ ] Reutilizei componentes quando possível.

[ ] Usei tokens de design.

[ ] Evitei valores arbitrários.

[ ] A hierarquia visual está clara.

[ ] Existe uma ação principal clara.

[ ] Os estados semânticos estão consistentes.

[ ] Loading foi considerado.

[ ] Empty state foi considerado.

[ ] Error state foi considerado.

[ ] Testei ou revisei desktop.

[ ] Testei ou revisei tablet.

[ ] Testei ou revisei mobile.

[ ] Acessibilidade básica foi considerada.

[ ] Não introduzi padrão visual desnecessário.
```

---

# 53. Revisão de Código Existente

Quando a tarefa for revisar uma tela:

1. compare com `DESIGN_SYSTEM.md`;
2. identifique inconsistências;
3. priorize as que afetam UX;
4. preserve comportamentos funcionais corretos;
5. altere somente o necessário;
6. evite refatorações grandes não relacionadas.

---

# 54. Refatoração Visual

Uma tarefa visual não autoriza automaticamente:

- alterar banco;
- modificar regras comerciais;
- mudar fluxo do produto;
- adicionar funcionalidades;
- trocar arquitetura.

Se for necessária alteração fora do frontend, consulte os documentos correspondentes e limite o escopo.

---

# 55. Novos Padrões

Quando nenhum padrão existente resolver a necessidade:

1. confirme que o componente é realmente novo;
2. siga os tokens existentes;
3. mantenha linguagem visual atual;
4. crie o componente;
5. documente o padrão caso seja reutilizável.

Não introduza uma nova cor, tipografia ou sistema de spacing para resolver um caso isolado.

---

# 56. Proibições

Não:

- inventar cores estruturais;
- criar gradientes chamativos;
- utilizar glassmorphism;
- usar sombras pesadas;
- utilizar emojis como sistema de ícones;
- misturar bibliotecas de ícones sem necessidade;
- criar múltiplas versões do mesmo componente;
- adicionar animações decorativas;
- criar dark mode no MVP;
- esconder ações importantes atrás de ícones sem texto;
- usar tabelas complexas no mobile;
- alterar fluxo do produto por preferência estética;
- chamar OpenRouter diretamente de componentes;
- expor dados sensíveis na interface sem necessidade.

---

# 57. Regra de Escopo

Para cada tarefa:

> Implemente a menor alteração completa que resolva corretamente o requisito.

Evite:

```text
"já que estou aqui, vou refazer a página inteira"
```

quando o pedido é apenas:

```text
"adicionar filtro de prioridade"
```

---

# 58. Resultado Esperado

Toda interface deve contribuir para que a recepcionista consiga responder rapidamente:

```text
Quem precisa da minha atenção?

Por que essa oportunidade importa?

Qual é a objeção?

Qual abordagem devo utilizar?

O que devo fazer agora?
```

Se a interface não facilita essas respostas, ela deve ser reconsiderada.

---

# 59. Regra Final

> O frontend deve parecer uma ferramenta profissional de produtividade e inteligência comercial para uma clínica odontológica — limpa, calma, previsível, acessível e orientada à ação.

Sempre priorize:

```text
clareza
>
consistência
>
reutilização
>
decoração
```
