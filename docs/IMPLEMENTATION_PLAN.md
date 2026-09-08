# IMPLEMENTATION_PLAN.md — Plataforma Inteligente de Recuperação de Orçamentos

## 1. Objetivo

Este documento define a ordem recomendada de implementação do MVP da Plataforma Inteligente de Recuperação de Orçamentos da Clínica Basilico.

O plano transforma os requisitos do `PRD.md` e as decisões do `ARCHITECTURE.md` em etapas pequenas, verificáveis e adequadas para implementação incremental com Codex.

A prioridade é:

1. construir a fundação corretamente;
2. evitar retrabalho;
3. validar cada módulo antes de avançar;
4. manter segurança e isolamento por clínica;
5. não implementar funcionalidades futuras antes do MVP.

---

# 2. Documentos Obrigatórios

Antes de iniciar qualquer sprint, o agente deve consultar:

```text
AGENTS.md
docs/PRD.md
docs/ARCHITECTURE.md
docs/DESIGN_SYSTEM.md
```

E carregar a skill adequada quando necessário:

```text
.agents/skills/frontend-design/SKILL.md
.agents/skills/database/SKILL.md
.agents/skills/ai-integration/SKILL.md
```

---

# 3. Estrutura Correta das Skills

A estrutura esperada é:

```text
.agents/
└── skills/
    ├── frontend-design/
    │   └── SKILL.md
    ├── database/
    │   └── SKILL.md
    └── ai-integration/
        └── SKILL.md
```

Não manter como estrutura final:

```text
.agents/
└── skills/
    ├── SKILL_frontend-design.md
    ├── SKILL_database.md
    └── SKILL_ai-integration.md
```

---

# 4. Estratégia Geral

O MVP será implementado em fases.

```text
Fase 0
Preparação do projeto

Fase 1
Fundação técnica

Fase 2
Autenticação e multi-tenancy

Fase 3
Banco e domínio comercial

Fase 4
App Shell e interface base

Fase 5
Importação de planilhas

Fase 6
Oportunidades

Fase 7
Priorização

Fase 8
IA / OpenRouter

Fase 9
Interações e Follow-ups

Fase 10
Dashboard

Fase 11
Playbooks e regras comerciais

Fase 12
Revisão, segurança e testes

Fase 13
Deploy e validação do MVP
```

---

# 5. Regra de Execução

Cada sprint deve:

```text
implementar
↓
testar
↓
revisar
↓
corrigir
↓
somente então avançar
```

Evitar implementar múltiplas sprints grandes em um único prompt.

---

# 6. Fase 0 — Preparação do Repositório

## Objetivo

Organizar os documentos e regras antes de gerar código.

## Tarefas

### 0.1 Organizar documentação

Garantir:

```text
AGENTS.md

docs/
├── PRD.md
├── ARCHITECTURE.md
├── DESIGN_SYSTEM.md
└── IMPLEMENTATION_PLAN.md
```

### 0.2 Organizar skills

Criar:

```text
.agents/skills/frontend-design/SKILL.md
.agents/skills/database/SKILL.md
.agents/skills/ai-integration/SKILL.md
```

### 0.3 Remover ou renomear arquivos duplicados

Não manter duas versões divergentes do mesmo documento.

## Critério de conclusão

- estrutura organizada;
- documentos acessíveis;
- skills reconhecíveis;
- nenhuma implementação funcional ainda.

---

# 7. Fase 1 — Fundação Técnica

## Sprint 1 — Inicialização do projeto

### Objetivo

Criar a base Next.js.

### Implementar

- Next.js;
- TypeScript;
- App Router;
- Tailwind CSS;
- ESLint;
- estrutura `src/`;
- configuração inicial.

### Estrutura mínima

```text
src/
├── app/
├── components/
├── db/
├── services/
├── schemas/
├── types/
├── lib/
└── auth/
```

### Não implementar ainda

- banco completo;
- IA;
- autenticação;
- funcionalidades comerciais.

### Critério de conclusão

```text
npm run dev
```

funciona sem erros.

---

# 8. Sprint 2 — Base visual

## Objetivo

Preparar o Design System sem construir todas as páginas.

## Skill

```text
frontend-design
```

## Implementar

- tokens;
- fonte Inter;
- cores;
- background;
- borders;
- radius;
- configuração Tailwind;
- shadcn/ui;
- componentes básicos necessários.

Inicialmente:

```text
Button
Input
Textarea
Select
Badge
Card
Skeleton
Toast
```

Não criar componentes que ainda não possuem uso.

## Critério de conclusão

Uma página simples de teste deve demonstrar corretamente:

- tipografia;
- cores;
- buttons;
- inputs;
- cards.

---

# 9. Fase 2 — Banco e Autenticação

## Sprint 3 — Neon + Drizzle

### Skill

```text
database
```

### Objetivo

Estabelecer comunicação segura com PostgreSQL.

### Implementar

- `DATABASE_URL`;
- Neon;
- Drizzle ORM;
- `drizzle.config.ts`;
- conexão server-side;
- migrations;
- `.env.example`.

### Criar inicialmente

```text
clinics
users
```

### Critério de conclusão

- migration funciona;
- aplicação conecta ao Neon;
- query simples funciona;
- nenhum secret está no frontend.

---

# 10. Sprint 4 — Autenticação

## Objetivo

Adicionar Better Auth.

## Implementar

- login;
- logout;
- sessão;
- proteção de rotas;
- integração Better Auth + Neon.

## Roles

```text
MANAGER
RECEPTIONIST
```

## Não implementar ainda

Tela completa de gerenciamento de usuários.

## Critério de conclusão

Usuário não autenticado não acessa área interna.

Usuário autenticado consegue entrar e sair.

---

# 11. Sprint 5 — Multi-tenancy

## Skill

```text
database
```

## Objetivo

Garantir isolamento por clínica desde o início.

## Implementar

- `clinic_id` no usuário;
- helper para obter clínica da sessão;
- autorização;
- padrões de queries tenant-aware.

## Testar

Usuário da clínica A não pode acessar dados da clínica B.

## Critério de conclusão

Teste de isolamento aprovado.

---

# 12. Fase 3 — Modelo Comercial

## Sprint 6 — Patients e Opportunities

### Skill

```text
database
```

### Criar

```text
patients
opportunities
```

### Campos principais

#### Patients

```text
id
clinic_id
name
phone
external_reference
created_at
updated_at
```

#### Opportunities

```text
id
clinic_id
patient_id
treatment
budget_value
budget_date
raw_objection
objection_category
priority_score
priority
status
last_contact_at
next_follow_up_at
responsible_user_id
created_at
updated_at
```

## Implementar

- migrations;
- schemas Drizzle;
- relacionamentos;
- índices iniciais.

## Critério de conclusão

Criar e consultar oportunidade manualmente em desenvolvimento.

---

# 13. Fase 4 — App Shell

## Sprint 7 — Estrutura principal da interface

### Skill

```text
frontend-design
```

### Implementar

App Shell com:

```text
Sidebar
Topbar
Content Area
```

Navegação:

```text
Dashboard
Oportunidades
Follow-ups
Importar
Playbooks
Configurações
```

## Implementar páginas vazias estruturais

Cada rota deve existir, mas sem funcionalidades completas.

## Critério de conclusão

Navegação funcional em:

- desktop;
- tablet;
- mobile.

---

# 14. Fase 5 — Importação

## Sprint 8 — Upload e leitura

### Skills

```text
frontend-design
database
```

### Objetivo

Ler CSV/XLSX sem persistir imediatamente.

### Implementar

- upload;
- validação de tipo;
- XLSX parser;
- CSV parser;
- leitura de headers;
- preview de linhas.

## Critério de conclusão

Usuário seleciona planilha e visualiza dados.

---

# 15. Sprint 9 — Mapeamento de colunas

## Implementar

Fluxo:

```text
Coluna original
↓
Amostra
↓
Campo correspondente
```

Campos:

```text
patient_name
phone
treatment
budget_value
budget_date
raw_objection
notes
external_reference
```

## Regras

- permitir ignorar coluna;
- campos essenciais claramente indicados;
- usuário confirma mapeamento.

## Critério de conclusão

Planilhas com nomes de colunas diferentes podem ser mapeadas.

---

# 16. Sprint 10 — Persistência da importação

### Skill

```text
database
```

### Criar

```text
imports
import_rows
```

### Implementar

- normalização;
- Zod;
- deduplicação;
- criação/associação de patients;
- criação de opportunities;
- registro de erros.

## Resultado esperado

```text
250 processados
242 importados
8 com erro
```

## Critério de conclusão

Importação real funciona no Neon.

---

# 17. Fase 6 — Oportunidades

## Sprint 11 — Lista de oportunidades

### Skill

```text
frontend-design
```

### Implementar

Tabela desktop com:

```text
Paciente
Tratamento
Valor
Objeção
Prioridade
Status
Último contato
Próximo follow-up
Ação
```

## Filtros

- busca;
- status;
- prioridade;
- objeção.

## Backend

- paginação;
- filtros server-side;
- ordenação server-side.

## Mobile

Transformar tabela em cards/list rows.

## Critério de conclusão

Listagem operacional completa.

---

# 18. Sprint 12 — Página da oportunidade

## Skill

```text
frontend-design
```

## Implementar

- dados do paciente;
- dados do orçamento;
- objeção;
- prioridade;
- status;
- histórico placeholder;
- área de análise IA placeholder.

Desktop:

```text
Dados / histórico
+
Análise / estratégia
```

Mobile:

```text
stack vertical
```

## Critério de conclusão

Usuário consegue abrir qualquer oportunidade.

---

# 19. Fase 7 — Priorização

## Sprint 13 — Score determinístico

### Objetivo

Calcular prioridade sem depender da IA.

### Implementar

```text
src/services/priority/calculate-priority.ts
```

Considerar inicialmente:

- recência;
- valor;
- follow-up;
- tipo de objeção;
- histórico positivo quando disponível.

## Saída

```text
score: 0–100
priority:
HIGH
MEDIUM
LOW
```

## Testes unitários obrigatórios

Testar vários cenários.

## Critério de conclusão

Score previsível e testado.

---

# 20. Fase 8 — Inteligência Artificial

## Sprint 14 — Fundação OpenRouter

### Skill

```text
ai-integration
```

### Implementar

```text
src/services/ai/openrouter.ts
```

Variáveis:

```text
OPENROUTER_API_KEY
OPENROUTER_MODEL
```

## Regras

- server-side;
- timeout;
- erros;
- nenhuma chamada do browser.

## Critério de conclusão

Teste controlado consegue chamar modelo.

---

# 21. Sprint 15 — Schema de análise

## Skill

```text
ai-integration
```

## Criar schema Zod

Campos:

```text
objection_category
context_analysis
contact_goal
strategy
suggested_approach
suggested_message
next_action
suggested_follow_up_days
```

## Criar prompt

```text
OPPORTUNITY_ANALYSIS_V1
```

## Segurança

Prompt deve incluir:

- finalidade comercial;
- regras de não manipulação;
- proibição de diagnóstico;
- proibição de inventar condições;
- proteção contra instruções contidas nos dados importados.

## Critério de conclusão

Casos de teste retornam estrutura válida.

---

# 22. Sprint 16 — Análise real da oportunidade

## Skills

```text
ai-integration
database
```

### Criar

```text
ai_analyses
```

### Endpoint

```text
POST /api/ai/analyze
```

### Fluxo

```text
session
↓
clinic_id
↓
opportunity
↓
contexto mínimo
↓
playbook
↓
commercial rules
↓
OpenRouter
↓
Zod
↓
persistência
↓
UI
```

## Critério de conclusão

Botão:

```text
Analisar com IA
```

gera uma análise real e a salva.

---

# 23. Sprint 17 — Card da IA

### Skill

```text
frontend-design
```

### Implementar

```text
AIAnalysisCard
SuggestedMessageCard
```

Mostrar:

- objeção identificada;
- contexto;
- objetivo;
- estratégia;
- abordagem;
- mensagem;
- próxima ação;
- follow-up sugerido.

## Adicionar

```text
Copiar mensagem
```

com feedback.

## Critério de conclusão

Resultado da IA é operacionalmente útil e legível.

---

# 24. Fase 9 — Interações

## Sprint 18 — Registro de contato

### Skills

```text
database
frontend-design
```

### Criar

```text
interactions
```

### Implementar

Modal/formulário:

```text
Canal
Resultado
Observação
```

Canais:

```text
WHATSAPP
PHONE
IN_PERSON
OTHER
```

## Critério de conclusão

Contato registrado aparece no histórico.

---

# 25. Sprint 19 — Timeline

## Skill

```text
frontend-design
```

### Implementar

Timeline da oportunidade com:

- orçamento;
- análises;
- contatos;
- mudanças relevantes;
- follow-ups.

## Critério de conclusão

Histórico pode ser entendido cronologicamente.

---

# 26. Sprint 20 — Follow-ups

### Skills

```text
database
frontend-design
```

### Criar

```text
follow_ups
```

### Implementar

- criar;
- editar;
- concluir;
- cancelar.

Campos:

```text
scheduled_at
reason
notes
status
```

## Critério de conclusão

Follow-up aparece tanto na oportunidade quanto na página geral.

---

# 27. Sprint 21 — Página de Follow-ups

## Implementar

Seções:

```text
Atrasados
Hoje
Próximos
```

Filtros:

- responsável;
- data;
- status.

## Critério de conclusão

Recepcionista consegue usar a página como agenda operacional.

---

# 28. Fase 10 — Dashboard

## Sprint 22 — KPIs

### Implementar no backend

```text
orçamentos em aberto
valor potencial
oportunidades recuperadas
receita recuperada
taxa de recuperação
```

Usar agregações PostgreSQL.

## UI

Metric cards.

## Critério de conclusão

KPIs refletem dados reais.

---

# 29. Sprint 23 — Objeções e funil

## Implementar

### Principais objeções

```text
categoria
quantidade
percentual
valor potencial
```

### Funil

```text
abertas
trabalhadas
responderam
negociação
recuperadas
```

## Visualizações

Manter gráficos simples.

## Critério de conclusão

Gestor consegue entender desempenho comercial.

---

# 30. Fase 11 — Playbooks e Configurações

## Sprint 24 — Playbooks

### Skills

```text
database
frontend-design
ai-integration
```

### Criar

```text
objection_playbooks
```

### Implementar

CRUD para gestor.

Campos:

```text
categoria
título
objetivo
diretrizes
perguntas sugeridas
ativo
```

## Integração

Análise da IA deve consultar playbook ativo.

---

# 31. Sprint 25 — Regras comerciais

### Criar

```text
commercial_rules
```

### Gestor pode configurar

- formas de pagamento;
- parcelamento;
- descontos autorizados;
- diferenciais;
- orientações comerciais.

## Integração com IA

Somente regras cadastradas podem ser utilizadas.

## Critério de conclusão

IA deixa de depender de regras hardcoded.

---

# 32. Fase 12 — Segurança e Qualidade

## Sprint 26 — Auditoria de segurança

Revisar:

```text
auth
authorization
clinic_id
API routes
secrets
OpenRouter
inputs
uploads
logs
```

## Testar explicitamente

Clínica A não consegue acessar clínica B.

---

# 33. Sprint 27 — Auditoria LGPD

Revisar:

- dados armazenados;
- dados importados;
- dados enviados à IA;
- logs;
- exclusões;
- exposição visual.

Remover qualquer coleta sem finalidade clara.

---

# 34. Sprint 28 — Testes

## Unitários

Prioridade:

```text
calculatePriority
Zod schemas
import mapping
deduplication
AI parser
commercial rules
```

## Integração

```text
auth
tenant isolation
imports
opportunities
AI analysis
interactions
follow-ups
```

---

# 35. Sprint 29 — Revisão visual

### Skill

```text
frontend-design
```

Revisar todas as páginas com `DESIGN_SYSTEM.md`.

Validar:

```text
375px
768px
1280px
```

Verificar:

- alinhamento;
- loading;
- empty states;
- errors;
- focus;
- touch targets;
- consistência.

---

# 36. Fase 13 — Deploy

## Sprint 30 — Vercel

### Configurar

- GitHub;
- Vercel;
- variáveis de ambiente;
- build de produção;
- domínio quando aplicável.

## Ambientes

```text
Development
Preview
Production
```

## Critério de conclusão

Deploy de produção está funcional.

---

# 37. Sprint 31 — Seed inicial

Criar dados iniciais para a Clínica Basilico:

- clínica;
- gestor;
- recepcionista;
- playbooks iniciais;
- regras comerciais aprovadas.

Não incluir dados reais de pacientes no repositório.

---

# 38. Sprint 32 — Teste com usuário

Realizar teste com a recepcionista.

Validar principalmente:

```text
importar é simples?

ela entende prioridades?

a análise é útil?

a mensagem parece natural?

é fácil registrar contato?

follow-up ajuda?

dashboard faz sentido?
```

Registrar feedback antes de expandir o produto.

---

# 39. Definição do MVP Concluído

O MVP estará funcional quando a recepcionista conseguir executar:

```text
Login
↓
Importar planilha
↓
Visualizar oportunidades
↓
Filtrar / priorizar
↓
Abrir paciente
↓
Gerar análise com IA
↓
Copiar abordagem
↓
Realizar contato
↓
Registrar resultado
↓
Agendar follow-up
↓
Acompanhar recuperação
```

E o gestor conseguir:

```text
visualizar dashboard
editar playbooks
configurar regras comerciais
```

---

# 40. O que Não Deve Entrar Antes da Validação

Não implementar antes da validação do MVP:

```text
WhatsApp automático
CRM em tempo real
agentes autônomos
app mobile nativo
modelo próprio
score preditivo ML
analytics avançado
dark mode
microserviços
```

---

# 41. Ordem Recomendada para Uso do Codex

Para cada sprint:

## Etapa 1 — Implementação

Solicitar ao Codex apenas a sprint atual.

## Etapa 2 — Revisão

Pedir revisão específica do diff.

Foco:

```text
bugs
segurança
escopo
arquitetura
```

## Etapa 3 — Correção

Corrigir os problemas encontrados.

## Etapa 4 — Testes

Executar e adicionar testes relevantes.

## Etapa 5 — PR

Abrir Pull Request.

## Etapa 6 — Merge

Fazer merge somente após revisão.

---

# 42. Regra para Prompts

Evitar:

```text
"Implemente todo o MVP."
```

Preferir:

```text
"Implemente somente a Sprint 8 — Upload e leitura de planilhas.
Leia AGENTS.md e os documentos necessários.
Não implemente persistência ainda."
```

Isso mantém o agente dentro do escopo.

---

# 43. Marco 1 — Fundação

Concluído após Sprint 7.

Resultado:

```text
Projeto
Auth
Neon
Multi-tenancy
Design System
App Shell
```

---

# 44. Marco 2 — Dados

Concluído após Sprint 13.

Resultado:

```text
Importação
Patients
Opportunities
Lista
Detalhe
Prioridade
```

Neste ponto o sistema já funciona sem IA.

---

# 45. Marco 3 — Inteligência

Concluído após Sprint 17.

Resultado:

```text
OpenRouter
Structured Output
Análise
Estratégia
Mensagem
```

Este é o primeiro ponto em que a proposta central de valor pode ser testada.

---

# 46. Marco 4 — Operação

Concluído após Sprint 23.

Resultado:

```text
Interações
Follow-ups
Dashboard
```

A recuperação passa a ser mensurável.

---

# 47. Marco 5 — MVP

Concluído após Sprint 32.

Resultado:

```text
produto funcional
seguro
implantado
testado com usuário real
```

---

# 48. Regra Final

> O projeto deve avançar por pequenas entregas completas. Cada sprint deve reduzir incerteza, produzir algo testável e preservar o escopo do MVP.
