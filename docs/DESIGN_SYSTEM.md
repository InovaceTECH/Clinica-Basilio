# DESIGN_SYSTEM.md — Plataforma Inteligente de Recuperação de Orçamentos

## 1. Objetivo

Este documento define a identidade visual, os padrões de interface e as regras de consistência da Plataforma Inteligente de Recuperação de Orçamentos da Clínica Basilico.

O objetivo visual da plataforma é transmitir:

* confiança;
* clareza;
* organização;
* profissionalismo;
* leveza;
* tecnologia;
* acolhimento;
* simplicidade operacional.

A interface deve ser adequada principalmente para uso diário por recepcionistas e gestores, com alta legibilidade, baixa carga visual e foco em produtividade.

Este documento é a fonte de verdade visual do projeto.

Toda implementação de frontend deve respeitar estas regras.

---

# 2. Princípios Visuais

A interface deve seguir os seguintes princípios:

## 2.1 Clareza acima de decoração

A plataforma é uma ferramenta de trabalho.

Informações como:

* nome do paciente;
* valor do orçamento;
* prioridade;
* objeção;
* status;
* próximo follow-up;
* recomendação da IA;

devem ser mais importantes visualmente do que elementos decorativos.

---

## 2.2 Aparência calma e profissional

A experiência deve evitar:

* excesso de cores;
* gradientes fortes;
* sombras pesadas;
* animações exageradas;
* interfaces visualmente carregadas.

A sensação geral deve ser de uma ferramenta organizada e confiável.

---

## 2.3 Uma cor estrutural principal

A interface deve utilizar uma única cor de marca como principal destaque estrutural.

Ela será usada principalmente para:

* botão principal;
* links;
* seleção ativa;
* foco;
* indicadores de ação;
* elementos principais de navegação.

Cores adicionais devem ser utilizadas principalmente para estados semânticos e não como decoração estrutural.

---

## 2.4 Hierarquia forte de informação

A interface deve deixar claro:

1. o que é mais importante;
2. o que exige ação;
3. o que é contexto;
4. o que é informação secundária.

Prioridade e status devem ser identificáveis rapidamente.

---

## 2.5 Consistência

Componentes equivalentes devem possuir sempre o mesmo comportamento e aparência.

Exemplos:

* todos os botões primários devem ser iguais;
* todos os cards de métricas devem seguir o mesmo padrão;
* todas as tabelas devem compartilhar a mesma estrutura;
* prioridades devem usar sempre a mesma semântica visual.

---

# 3. Direção Visual

O sistema utiliza como referência uma linguagem visual de produtividade moderna:

* fundos claros;
* grandes áreas de respiro;
* superfícies brancas;
* tipografia Inter;
* bordas discretas;
* sombras muito suaves;
* cantos arredondados moderados;
* alta legibilidade;
* interface predominantemente neutra.

A plataforma não deve parecer:

* um site institucional;
* uma landing page promocional;
* um aplicativo infantil;
* um CRM visualmente pesado;
* um dashboard financeiro agressivo.

Ela deve parecer um **copiloto comercial moderno e confiável**.

---

# 4. Paleta de Cores

## 4.1 Cor Primária

Enquanto não houver uma cor oficial da Clínica Basilico definida para o sistema, utilizar:

```css
--primary: #0075DE;
--primary-hover: #0068C7;
--primary-active: #005BAB;
--on-primary: #FFFFFF;
```

Uso:

* CTA principal;
* links;
* item ativo;
* estado de foco;
* botões de análise da IA;
* principais ações operacionais.

Não utilizar a cor primária em grandes áreas desnecessariamente.

---

# 5. Cores de Superfície

```css
--background: #F6F5F4;
--surface: #FFFFFF;
--surface-secondary: #F9F9F8;
--surface-hover: #F3F2F1;

--border: #E6E6E6;
--border-strong: #D8D8D8;
```

## Aplicação

### Background

`#F6F5F4`

Usado no fundo geral da aplicação.

O fundo deve ser levemente quente e não branco puro.

### Surface

`#FFFFFF`

Utilizado para:

* cards;
* tabelas;
* modais;
* formulários;
* painéis;
* sidebar quando aplicável.

### Border

`#E6E6E6`

Utilizado em:

* divisores;
* cards;
* campos;
* tabelas;
* menus.

---

# 6. Cores de Texto

```css
--text-primary: #111111;
--text-secondary: #31302E;
--text-muted: #615D59;
--text-faint: #8F8B87;
--text-disabled: #A9A6A3;
```

## Regras

### Primary

Usado em:

* títulos;
* nomes de pacientes;
* valores importantes;
* textos principais.

### Secondary

Usado em:

* descrições;
* textos auxiliares;
* corpo padrão.

### Muted

Usado em:

* metadata;
* labels secundárias;
* datas;
* informações menos importantes.

---

# 7. Cores Semânticas

As cores semânticas devem ser discretas.

## Sucesso

```css
--success: #18864B;
--success-bg: #EAF6EF;
--success-border: #C9E8D5;
```

Utilização:

* oportunidade recuperada;
* tratamento fechado;
* follow-up concluído;
* importação concluída.

---

## Atenção

```css
--warning: #A66300;
--warning-bg: #FFF5DF;
--warning-border: #F1D79A;
```

Utilização:

* follow-up próximo;
* pendência;
* prioridade média;
* informação que exige atenção.

---

## Erro / Risco

```css
--danger: #C73535;
--danger-bg: #FDEEEE;
--danger-border: #F2CACA;
```

Utilização:

* erros;
* falha de importação;
* follow-up atrasado;
* ação destrutiva;
* oportunidade perdida quando apropriado.

---

## Informação

```css
--info: #3A69B7;
--info-bg: #EDF3FC;
--info-border: #CAD9F2;
```

Utilização:

* mensagens informativas;
* IA;
* dados auxiliares.

---

# 8. Prioridades

A prioridade deve possuir identificação visual clara sem dominar a interface.

## Alta

```css
background: #FDEEEE;
color: #B32626;
```

Label:

```text
Alta
```

---

## Média

```css
background: #FFF5DF;
color: #8B5700;
```

Label:

```text
Média
```

---

## Baixa

```css
background: #EDF3FC;
color: #3A69B7;
```

Label:

```text
Baixa
```

---

# 9. Status de Oportunidade

Os status devem utilizar badges discretos.

## Novo

Neutro.

## A analisar

Azul suave.

## Contato pendente

Amarelo suave.

## Contatado

Azul suave.

## Aguardando paciente

Cinza.

## Follow-up agendado

Roxo ou azul secundário discreto.

## Em negociação

Azul primário suave.

## Recuperado

Verde.

## Perdido

Vermelho suave.

## Não contatar

Cinza escuro / neutro.

Nunca utilizar cores extremamente saturadas.

---

# 10. Tipografia

## Fonte

Utilizar:

```css
font-family:
  Inter,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Helvetica,
  Arial,
  sans-serif;
```

Não utilizar fonte proprietária.

---

# 11. Escala Tipográfica

## Display

```css
font-size: 48px;
font-weight: 700;
line-height: 1.05;
letter-spacing: -1.5px;
```

Uso restrito.

Pode ser usado em:

* autenticação;
* empty states especiais;
* páginas institucionais internas.

Não utilizar em dashboards densos.

---

## Heading 1

```css
font-size: 32px;
font-weight: 700;
line-height: 1.15;
letter-spacing: -0.75px;
```

Uso:

* título de página.

Exemplo:

```text
Oportunidades
```

---

## Heading 2

```css
font-size: 24px;
font-weight: 700;
line-height: 1.25;
letter-spacing: -0.4px;
```

Uso:

* seções;
* títulos de painéis.

---

## Heading 3

```css
font-size: 20px;
font-weight: 600;
line-height: 1.3;
```

Uso:

* cards;
* modais;
* subtítulos.

---

## Body

```css
font-size: 16px;
font-weight: 400;
line-height: 1.5;
```

Uso:

* texto principal;
* formulários;
* descrições.

---

## Body Small

```css
font-size: 14px;
font-weight: 400;
line-height: 1.45;
```

Uso:

* tabelas;
* metadata;
* textos auxiliares.

---

## Label

```css
font-size: 13px;
font-weight: 500;
line-height: 1.4;
```

Uso:

* formulário;
* labels;
* filtros.

---

## Caption

```css
font-size: 12px;
font-weight: 500;
line-height: 1.4;
```

Uso:

* badges;
* pequenas informações;
* indicadores.

---

# 12. Peso Tipográfico

Utilizar principalmente:

```text
400 → corpo
500 → labels / botões
600 → títulos pequenos
700 → títulos principais
```

Evitar:

```text
800
900
```

Não utilizar peso excessivo em textos longos.

---

# 13. Espaçamento

A escala base é baseada em múltiplos de 4px.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

---

# 14. Espaçamento de Componentes

## Cards

```text
padding desktop: 24px
padding mobile: 16px
```

## Formulários

Entre label e input:

```text
8px
```

Entre campos:

```text
16px
```

Entre grupos:

```text
24px
```

## Seções

```text
24–32px
```

---

# 15. Border Radius

```css
--radius-xs: 4px;
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

---

# 16. Uso de Radius

## Inputs

```text
6px
```

## Botões

```text
8px
```

## Cards

```text
12px
```

## Modais

```text
16px
```

## Badges

```text
9999px
```

Não utilizar formato pill em todos os componentes.

---

# 17. Sombras

Sombras devem ser discretas.

## Level 0

```css
box-shadow: none;
border: 1px solid var(--border);
```

Uso padrão para cards.

---

## Level 1

```css
box-shadow:
  0 1px 2px rgba(0, 0, 0, 0.03),
  0 4px 12px rgba(0, 0, 0, 0.04);
```

Uso:

* menus;
* cards elevados;
* popovers.

---

## Level 2

```css
box-shadow:
  0 4px 12px rgba(0, 0, 0, 0.06),
  0 16px 40px rgba(0, 0, 0, 0.08);
```

Uso:

* modais;
* drawers.

Não usar sombras pesadas.

---

# 18. Layout Principal

A aplicação deve utilizar um App Shell.

Desktop:

```text
┌──────────────┬───────────────────────────────────┐
│              │                                   │
│   Sidebar    │             Conteúdo              │
│              │                                   │
│              │                                   │
└──────────────┴───────────────────────────────────┘
```

---

# 19. Sidebar

## Desktop

Largura aproximada:

```text
240px
```

Com:

* logo / nome do sistema;
* navegação principal;
* usuário;
* logout.

Itens:

```text
Dashboard

Oportunidades

Follow-ups

Importar

Playbooks

Configurações
```

---

# 20. Item de Navegação

Default:

```css
background: transparent;
color: var(--text-secondary);
```

Hover:

```css
background: var(--surface-hover);
```

Active:

```css
background: #EDF3FC;
color: var(--primary);
font-weight: 500;
```

Radius:

```text
8px
```

---

# 21. Área de Conteúdo

Desktop:

```text
max-width: 1440px
```

Padding:

```text
24–32px
```

Mobile:

```text
16px
```

---

# 22. Page Header

Cada página deve possuir um cabeçalho consistente.

Exemplo:

```text
Oportunidades

Gerencie pacientes com orçamentos em aberto.

                         [+ Importar]
```

Estrutura:

```text
Título
Descrição opcional
Ação principal
```

---

# 23. Botão Primário

Uso:

* ação principal da tela.

Exemplos:

```text
Analisar com IA

Importar planilha

Salvar

Adicionar follow-up
```

Estilo:

```css
background: var(--primary);
color: white;
border-radius: 8px;
font-weight: 500;
```

Altura:

```text
40px
```

---

# 24. Botão Secundário

```css
background: #FFFFFF;
color: var(--text-primary);
border: 1px solid var(--border);
border-radius: 8px;
```

Uso:

```text
Cancelar

Voltar

Ver detalhes

Editar
```

---

# 25. Botão Destrutivo

Utilizar somente quando necessário.

```css
color: var(--danger);
```

Não utilizar vermelho como ação principal.

---

# 26. Icon Buttons

Tamanho recomendado:

```text
36x36px
```

Radius:

```text
8px
```

Sempre devem possuir:

```text
tooltip
aria-label
```

---

# 27. Inputs

Estilo:

```css
height: 40px;

background: #FFFFFF;

border:
1px solid var(--border);

border-radius:
6px;

padding:
0 12px;
```

Focus:

```css
border-color: var(--primary);

box-shadow:
0 0 0 3px rgba(0, 117, 222, 0.12);
```

---

# 28. Textarea

Min-height:

```text
96px
```

Pode crescer conforme conteúdo.

Utilizar para:

* objeção;
* observações;
* regras comerciais;
* notas de interação.

---

# 29. Select

Deve compartilhar o mesmo estilo dos inputs.

Não criar selects visualmente diferentes dos outros campos.

---

# 30. Cards

O card padrão:

```css
background: var(--surface);
border: 1px solid var(--border);
border-radius: 12px;
padding: 24px;
```

Usar sombra somente quando necessário.

---

# 31. KPI Cards

Dashboard deve utilizar cards simples.

Exemplo:

```text
┌───────────────────────────┐
│ Valor potencial           │
│                           │
│ R$ 84.250                 │
│                           │
│ 32 oportunidades abertas  │
└───────────────────────────┘
```

Hierarquia:

1. label;
2. valor;
3. contexto.

---

# 32. Tabelas

A listagem de oportunidades deve utilizar tabela no desktop.

Características:

* alta legibilidade;
* linhas espaçosas;
* cabeçalho discreto;
* hover suave;
* ações concentradas;
* sem excesso de bordas verticais.

Cabeçalho:

```css
font-size: 12px;
font-weight: 600;
color: var(--text-muted);
```

Célula:

```text
padding vertical: 12px
padding horizontal: 16px
```

Separação:

```text
border-bottom: 1px solid var(--border)
```

---

# 33. Tabela de Oportunidades

Colunas recomendadas:

```text
Paciente

Tratamento

Valor

Objeção

Prioridade

Status

Último contato

Próximo follow-up

Ações
```

---

# 34. Lista Mobile

No mobile, tabelas extensas devem virar cards/list rows.

Exemplo:

```text
João Silva
Implante

R$ 7.500

Financeira       Alta

Follow-up: Hoje

[Ver oportunidade]
```

Nunca forçar uma tabela desktop horizontal complexa no celular.

---

# 35. Filtros

Filtros devem ficar acima da listagem.

Desktop:

```text
[Buscar...] [Status ▼] [Prioridade ▼] [Objeção ▼]
```

Mobile:

```text
[Buscar...]

[Filtros]
```

Filtros avançados podem abrir drawer ou modal.

---

# 36. Página da Oportunidade

A página do paciente deve priorizar a decisão operacional.

Desktop sugerido:

```text
┌──────────────────────────────────┬─────────────────────────┐
│                                  │                         │
│ Dados da oportunidade            │ Análise da IA           │
│                                  │                         │
│ Histórico                        │ Estratégia              │
│                                  │                         │
│                                  │ Mensagem sugerida       │
│                                  │                         │
└──────────────────────────────────┴─────────────────────────┘
```

---

# 37. Card de Análise da IA

A análise da IA deve possuir identidade própria, porém discreta.

Exemplo:

```text
✨ Análise da IA

Objeção identificada
Financeira

Objetivo
Descobrir se a dificuldade está no valor
total ou na condição de pagamento.

Estratégia
...

Mensagem sugerida
...

[Copiar mensagem]
```

Evitar:

* gradientes chamativos;
* neon;
* roxo excessivo;
* animações constantes;
* aparência de chatbot genérico.

---

# 38. Mensagem Sugerida

Deve ficar em bloco separado.

Exemplo:

```text
Mensagem sugerida

┌──────────────────────────────────────┐
│ Olá, João. Tudo bem? ...             │
│                                      │
│                                      │
└──────────────────────────────────────┘

[Copiar mensagem]
```

O usuário deve conseguir copiar facilmente.

---

# 39. Histórico

Usar timeline vertical simples.

Exemplo:

```text
● 18 ago
  Paciente informou que precisa pensar.

│
● 19 ago
  WhatsApp enviado.

│
● 22 ago
  Follow-up agendado.
```

---

# 40. Follow-ups

Separar visualmente:

```text
Atrasados

Hoje

Próximos
```

Follow-ups atrasados devem possuir maior destaque.

---

# 41. Importação de Planilha

O fluxo de importação deve funcionar como wizard.

```text
1. Arquivo
      ↓
2. Mapear colunas
      ↓
3. Revisar
      ↓
4. Importar
```

Exibir progresso.

---

# 42. Upload

Área de upload:

```text
┌──────────────────────────────────────┐
│                                      │
│      Arraste sua planilha aqui       │
│                                      │
│       ou selecione um arquivo        │
│                                      │
│       CSV ou XLSX                    │
│                                      │
└──────────────────────────────────────┘
```

Evitar áreas de upload excessivamente grandes.

---

# 43. Mapeamento de Colunas

Exemplo:

```text
Coluna da planilha          Campo

Cliente                     [Nome do paciente ▼]

Celular                     [Telefone ▼]

Motivo                      [Objeção ▼]
```

Mostrar exemplos reais da coluna para facilitar identificação.

---

# 44. Modais

Modal padrão:

```text
max-width: 520–640px
```

Estilo:

```css
background: white;
border-radius: 16px;
```

Utilizar para:

* confirmar ação;
* registrar contato;
* criar follow-up;
* pequenas configurações.

Fluxos longos devem utilizar página ou drawer.

---

# 45. Drawers

Preferíveis para:

* filtros;
* detalhes rápidos;
* ações secundárias;
* visualização mobile.

---

# 46. Toasts

Utilizar para feedback imediato.

Exemplos:

```text
Análise gerada com sucesso.

Follow-up agendado.

Erro ao importar a planilha.
```

Não substituir mensagens de erro de formulário por toast.

---

# 47. Empty States

Devem explicar:

1. o que está vazio;
2. por que;
3. o que fazer.

Exemplo:

```text
Nenhuma oportunidade encontrada

Importe uma planilha com os orçamentos em aberto
para começar a analisar oportunidades.

[Importar planilha]
```

---

# 48. Loading States

Nunca deixar o usuário sem feedback.

Utilizar:

* skeleton;
* spinner em ações pequenas;
* estado de botão.

Exemplo:

```text
Analisando oportunidade...
```

Durante análise de IA, permitir feedback claro.

---

# 49. Skeletons

Usar preferencialmente em:

* dashboard;
* tabela;
* página de oportunidade.

Evitar skeletons excessivamente detalhados.

---

# 50. Animações

Animações devem ser rápidas.

Duração:

```text
150–200ms
```

Aplicações:

* hover;
* menu;
* modal;
* dropdown;
* mudança de estado.

Evitar animações decorativas contínuas.

---

# 51. Gráficos

Gráficos devem ser simples.

Preferir:

* barras;
* linhas;
* donut apenas quando fizer sentido;
* funil simples.

Evitar:

* 3D;
* sombras fortes;
* excesso de cores;
* gráficos decorativos.

---

# 52. Dashboard

Estrutura recomendada:

```text
Dashboard

[KPI] [KPI] [KPI] [KPI]

Principais objeções
[gráfico]

Funil de recuperação
[gráfico]

Follow-ups de hoje
[listagem]
```

---

# 53. Responsividade

Breakpoints recomendados:

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

---

# 54. Desktop

Prioridade para uso operacional.

Utilizar:

* sidebar;
* tabelas;
* grids;
* painéis lado a lado;
* filtros visíveis.

---

# 55. Tablet

Adaptar:

```text
sidebar → compacta

4 KPIs → 2x2

duas colunas → uma ou duas conforme espaço
```

---

# 56. Mobile

Priorizar:

* uma coluna;
* botões grandes;
* cards;
* drawers;
* navegação simplificada.

Não apenas reduzir o desktop.

Reorganizar a experiência.

---

# 57. Touch Targets

Elementos interativos devem possuir pelo menos:

```text
44x44px
```

quando utilizados em mobile.

---

# 58. Acessibilidade

Requisitos mínimos:

* contraste adequado;
* navegação por teclado;
* foco visível;
* labels em inputs;
* `aria-label` em ícones;
* não depender somente de cor;
* tamanho mínimo confortável de texto.

---

# 59. Ícones

Utilizar preferencialmente uma única biblioteca.

Sugestão:

```text
Lucide React
```

Não misturar múltiplos estilos de ícone.

Características:

* outline;
* simples;
* consistentes.

---

# 60. Ícones e Texto

Botões importantes devem utilizar texto.

Evitar deixar ações críticas representadas somente por ícones.

Exemplo correto:

```text
[✨ Analisar com IA]
```

Em vez de:

```text
[✨]
```

---

# 61. Conteúdo

Textos da interface devem ser:

* simples;
* diretos;
* profissionais;
* curtos;
* compreensíveis para usuários não técnicos.

Evitar termos técnicos como:

```text
LLM

prompt

embedding

JSON

token
```

na interface da recepcionista.

---

# 62. Linguagem da IA

Na interface utilizar:

```text
Analisar com IA

Análise da IA

Estratégia recomendada

Mensagem sugerida

Próxima ação
```

Não utilizar:

```text
Executar prompt

Rodar modelo

Gerar completion
```

---

# 63. Formatação de Valores

Valores monetários devem utilizar:

```text
R$ 7.500,00
```

Não:

```text
7500
```

---

# 64. Datas

Interface brasileira:

```text
19/08/2026
```

Quando contexto permitir:

```text
19 ago
```

Para follow-ups:

```text
Hoje

Amanhã

Em 3 dias

Atrasado há 2 dias
```

---

# 65. Telefones

Formato visual:

```text
(14) 99999-9999
```

---

# 66. Feedback de IA

Quando uma análise não puder ser gerada:

```text
Não foi possível gerar a análise.

Você pode tentar novamente ou revisar
as informações da oportunidade.
```

Não expor erros técnicos do provedor.

---

# 67. Segurança Visual

Informações sensíveis não devem aparecer desnecessariamente em:

* previews;
* toasts;
* URLs;
* breadcrumbs;
* logs visuais.

---

# 68. Do

* utilizar fundo claro e suave;
* utilizar branco para superfícies;
* manter bastante espaço entre seções;
* priorizar legibilidade;
* utilizar uma cor estrutural principal;
* usar badges discretos;
* destacar ações importantes;
* manter componentes reutilizáveis;
* utilizar bordas suaves;
* utilizar sombras apenas quando necessário;
* manter tabelas limpas;
* utilizar hierarchy visual consistente;
* adaptar realmente a interface para mobile.

---

# 69. Don't

* não criar gradientes chamativos;
* não utilizar muitas cores estruturais;
* não utilizar glassmorphism;
* não usar sombras fortes;
* não utilizar bordas grossas;
* não criar interfaces visualmente densas;
* não utilizar fontes diferentes sem necessidade;
* não usar emojis como ícones principais;
* não usar cores semânticas como decoração;
* não fazer todos os componentes pill-shaped;
* não colocar todos os textos em negrito;
* não usar tabelas desktop complexas no mobile;
* não criar estilos exclusivos para cada página;
* não inventar componentes visuais sem verificar os existentes.

---

# 70. Componentes Base

A aplicação deverá possuir uma biblioteca reutilizável.

Componentes previstos:

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

---

# 71. Reutilização

Antes de criar um componente novo:

1. procurar equivalente;
2. verificar se pode ser estendido;
3. verificar o Design System;
4. criar apenas se houver necessidade real.

---

# 72. Tokens

Tokens visuais devem ser centralizados.

Exemplo:

```css
:root {
  --primary: #0075DE;
  --primary-active: #005BAB;

  --background: #F6F5F4;
  --surface: #FFFFFF;

  --text-primary: #111111;
  --text-secondary: #31302E;
  --text-muted: #615D59;

  --border: #E6E6E6;

  --success: #18864B;
  --warning: #A66300;
  --danger: #C73535;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}
```

Não duplicar valores arbitrários pelo código quando existir token equivalente.

---

# 73. Tailwind

Quando utilizado Tailwind CSS, mapear tokens para o tema sempre que possível.

Exemplo conceitual:

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
```

repetido em dezenas de componentes.

---

# 74. shadcn/ui

shadcn/ui pode ser utilizado como base.

Entretanto:

> componentes shadcn devem ser adaptados ao Design System.

Não considerar o estilo padrão do shadcn como identidade final.

---

# 75. Dark Mode

Dark mode não faz parte do MVP.

A plataforma será inicialmente:

```text
Light Mode Only
```

Não criar complexidade adicional para dark mode neste momento.

---

# 76. Identidade da Clínica

Quando a identidade visual oficial da Clínica Basilico estiver disponível, poderão ser atualizados:

* cor primária;
* logo;
* favicon;
* detalhes de marca.

Essas alterações devem acontecer principalmente através dos tokens.

A estrutura visual e os padrões de UX definidos neste documento devem permanecer consistentes.

---

# 77. Regra para IA

A interface deve comunicar que a IA é uma ferramenta de apoio.

Não utilizar linguagem que transmita certeza absoluta.

Preferir:

```text
Análise sugerida

Estratégia recomendada

Mensagem sugerida

Possível objeção
```

Evitar:

```text
Resposta correta

Estratégia garantida

Paciente vai fechar

Melhor decisão
```

---

# 78. Diretriz para Telas Geradas por IA

Toda tela criada por um agente de desenvolvimento deve:

1. consultar este documento;
2. reutilizar componentes existentes;
3. seguir a escala de espaçamento;
4. utilizar tokens;
5. respeitar a tipografia;
6. respeitar cores semânticas;
7. funcionar em desktop e mobile;
8. possuir estados de loading;
9. possuir estados vazios quando aplicável;
10. possuir feedback de erro;
11. manter foco na operação da recepcionista.

---

# 79. Checklist Visual

Antes de considerar uma tela finalizada:

```text
[ ] Usa tokens de cor?

[ ] Tipografia segue a hierarquia?

[ ] Espaçamentos seguem a escala?

[ ] Componentes existentes foram reutilizados?

[ ] Botão primário está claro?

[ ] Existem cores desnecessárias?

[ ] Há sombras pesadas?

[ ] Status são consistentes?

[ ] Prioridades são consistentes?

[ ] Funciona em desktop?

[ ] Funciona em tablet?

[ ] Funciona em mobile?

[ ] Loading foi considerado?

[ ] Empty state foi considerado?

[ ] Erros foram considerados?

[ ] Foco de teclado é visível?

[ ] A interface continua simples?
```

---

# 80. Resumo Visual

A identidade da plataforma pode ser resumida como:

> **Uma interface clínica e comercial moderna, limpa, organizada e calma, inspirada em ferramentas de produtividade, com fundo levemente quente, superfícies brancas, tipografia Inter, bordas discretas e uma única cor estrutural forte para orientar ações.**

A prioridade é fazer com que a recepcionista consiga abrir o sistema e identificar rapidamente:

```text
Quem precisa de atenção?

Por quê?

Qual é a estratégia?

O que devo fazer agora?
```

O design deve sempre facilitar essas quatro respostas.
