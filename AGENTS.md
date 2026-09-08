# AGENTS.md — Plataforma Inteligente de Recuperação de Orçamentos

## 1. Objetivo

Este arquivo define as regras gerais de trabalho para agentes de desenvolvimento neste projeto.

Ele deve ser tratado como o **ponto de entrada operacional** para qualquer tarefa realizada por IA, incluindo:

- Codex;
- agentes de desenvolvimento;
- revisores automáticos;
- assistentes de implementação;
- agentes de correção;
- agentes de testes.

O objetivo é garantir que todas as alterações respeitem:

- o escopo do produto;
- a arquitetura;
- o Design System;
- as regras de banco;
- as regras de IA;
- segurança;
- privacidade;
- consistência;
- simplicidade do MVP.

---

# 2. Projeto

Este projeto é uma **Plataforma Inteligente de Recuperação de Orçamentos** para a Clínica Basilico.

A plataforma auxilia recepcionistas e gestores a recuperar oportunidades comerciais de pacientes que receberam orçamentos odontológicos, mas não realizaram o fechamento imediato.

O sistema utiliza:

- dados importados do CRM;
- classificação de objeções;
- priorização de oportunidades;
- análise por Inteligência Artificial;
- estratégias personalizadas;
- mensagens sugeridas;
- follow-ups;
- histórico de interações;
- indicadores de recuperação.

A IA funciona como **copiloto comercial**.

Ela não substitui a equipe e não envia mensagens automaticamente no MVP.

---

# 3. Documentos de Referência

Antes de implementar qualquer funcionalidade, identifique quais documentos são relevantes.

## Produto

```text
docs/PRD.md
```

Define:

- problema;
- usuários;
- funcionalidades;
- fluxos;
- regras do produto;
- escopo do MVP;
- métricas;
- funcionalidades futuras.

Pergunta respondida pelo PRD:

> O que deve ser construído?

---

## Arquitetura

```text
docs/ARCHITECTURE.md
```

Define:

- stack;
- estrutura técnica;
- banco;
- autenticação;
- OpenRouter;
- Drizzle;
- Neon;
- Vercel;
- importação;
- segurança;
- estrutura de pastas;
- multi-tenancy;
- migrations.

Pergunta respondida:

> Como deve ser construído?

---

## Design System

```text
docs/DESIGN_SYSTEM.md
```

Define:

- identidade visual;
- cores;
- tipografia;
- espaçamento;
- componentes;
- layouts;
- responsividade;
- estados;
- acessibilidade;
- padrões de UX.

Pergunta respondida:

> Como deve parecer e se comportar visualmente?

---

# 4. Skills

As skills do projeto estão localizadas em:

```text
.agents/skills/
```

Skills previstas:

```text
frontend-design
database
ai-integration
```

Cada skill deve ser utilizada apenas quando sua área for relevante.

---

# 5. Skill de Frontend

Local:

```text
.agents/skills/frontend-design/SKILL.md
```

Utilizar quando a tarefa envolver:

- páginas;
- componentes;
- layout;
- responsividade;
- dashboard;
- formulários;
- tabelas;
- filtros;
- navegação;
- cards;
- modais;
- estados visuais;
- revisão de frontend.

Antes de implementar frontend:

```text
PRD
+
DESIGN_SYSTEM
+
frontend-design skill
```

---

# 6. Skill de Banco

Local:

```text
.agents/skills/database/SKILL.md
```

Utilizar quando a tarefa envolver:

- schema;
- migrations;
- Neon;
- Drizzle;
- queries;
- tabelas;
- relacionamentos;
- índices;
- importação;
- integridade;
- multi-tenancy;
- auditoria.

Antes de alterar banco:

```text
PRD
+
ARCHITECTURE
+
database skill
```

---

# 7. Skill de IA

Local:

```text
.agents/skills/ai-integration/SKILL.md
```

Utilizar quando envolver:

- OpenRouter;
- prompts;
- structured output;
- modelos;
- análise de objeções;
- geração de estratégias;
- mensagens;
- validação de saída;
- custos;
- segurança de IA.

Antes de alterar IA:

```text
PRD
+
ARCHITECTURE
+
ai-integration skill
```

---

# 8. Ordem de Prioridade

Quando houver conflito entre instruções, utilizar esta ordem:

```text
1. Solicitação explícita da tarefa
2. PRD.md
3. ARCHITECTURE.md
4. DESIGN_SYSTEM.md
5. Skill específica
6. Padrões existentes do código
7. Preferência do agente
```

Uma solicitação de tarefa não autoriza violar segurança ou privacidade.

Quando houver conflito material entre documentos, não invente uma solução silenciosamente.

Identifique o conflito e implemente a opção que preserve melhor:

- segurança;
- integridade;
- escopo do MVP;
- arquitetura existente.

---

# 9. Princípio Principal

> Implemente a menor alteração completa que resolva corretamente o requisito.

Evite mudanças não relacionadas.

Não refatore grandes áreas do projeto apenas porque encontrou oportunidade de melhoria.

---

# 10. Stack Oficial

A stack definida para o MVP é:

| Área | Tecnologia |
|---|---|
| Framework | Next.js |
| Linguagem | TypeScript |
| Frontend | React |
| Estilização | Tailwind CSS |
| Componentes | shadcn/ui + componentes próprios |
| Backend | Next.js server-side |
| Hospedagem | Vercel |
| Banco | Neon PostgreSQL |
| ORM | Drizzle ORM |
| IA | OpenRouter |
| Validação | Zod |
| Autenticação | Better Auth |
| Planilhas | SheetJS/XLSX + parser CSV |
| Deploy | GitHub + Vercel |
| Arquitetura | Monólito modular |

Não trocar tecnologias principais sem requisito explícito.

---

# 11. Arquitetura

O projeto deve permanecer como:

```text
Monólito modular
```

Não criar no MVP:

- microserviços;
- filas distribuídas;
- Kubernetes;
- múltiplos backends;
- múltiplos bancos;
- infraestrutura complexa sem necessidade.

---

# 12. Estrutura Esperada

```text
/
├── AGENTS.md
│
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   └── DESIGN_SYSTEM.md
│
├── .agents/
│   └── skills/
│       ├── frontend-design/
│       │   └── SKILL.md
│       ├── database/
│       │   └── SKILL.md
│       └── ai-integration/
│           └── SKILL.md
│
├── drizzle/
│   └── migrations/
│
├── public/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── db/
│   ├── services/
│   ├── lib/
│   ├── schemas/
│   ├── types/
│   └── auth/
│
└── ...
```

---

# 13. Separação de Responsabilidades

Manter separação clara entre:

```text
UI
API
Services
Database
Validation
AI
Auth
```

Evitar arquivos que concentram várias responsabilidades.

---

# 14. Services

Regras de negócio devem ficar preferencialmente em:

```text
src/services/
```

Exemplos:

```text
src/services/opportunities/
src/services/priority/
src/services/imports/
src/services/follow-ups/
src/services/ai/
```

Exemplos de funções:

```text
analyzeOpportunity()

calculatePriority()

importOpportunities()

registerInteraction()

scheduleFollowUp()

recoverOpportunity()
```

---

# 15. Frontend

Antes de criar um novo componente:

1. procure componente equivalente;
2. tente reutilizar;
3. tente estender;
4. só então crie um novo.

Prioridade:

```text
reutilizar
>
estender
>
criar
```

---

# 16. UI

Toda interface deve seguir:

```text
docs/DESIGN_SYSTEM.md
```

Não inventar:

- novas cores;
- nova tipografia;
- novos padrões de radius;
- novos estilos de botão;
- novos padrões de sombra;
- novos padrões de espaçamento;

quando já houver padrão equivalente.

---

# 17. Responsividade

Toda página ou componente relevante deve considerar:

```text
Mobile
Tablet
Desktop
```

A aplicação possui foco operacional em desktop.

Mesmo assim, mobile deve ser funcional.

Não simplesmente comprimir tabelas desktop no celular.

---

# 18. Acessibilidade

Implementações devem considerar:

- labels;
- contraste;
- foco visível;
- teclado;
- aria-label;
- touch targets;
- feedback não baseado somente em cor.

---

# 19. Server Components

Não adicionar:

```text
"use client"
```

por padrão.

Use Client Components somente quando houver necessidade de:

- estado;
- eventos;
- hooks;
- APIs do navegador.

Manter Server Components quando suficientes.

---

# 20. Backend

Operações sensíveis devem acontecer server-side.

Nunca realizar no frontend:

- conexão direta com Neon;
- chamada direta ao OpenRouter;
- acesso a secrets;
- autorização crítica.

---

# 21. Validação

Entradas externas devem ser validadas com Zod.

Incluindo:

- formulários;
- APIs;
- planilhas;
- parâmetros;
- respostas de IA.

Não confiar no frontend como única camada de validação.

---

# 22. Banco de Dados

Banco oficial:

```text
Neon PostgreSQL
```

ORM oficial:

```text
Drizzle ORM
```

Toda alteração estrutural deve usar migration.

---

# 23. Migrations

Nunca alterar estrutura de produção manualmente sem registrar migration.

Fluxo:

```text
schema
↓
migration
↓
revisão
↓
teste
↓
aplicação
```

Migrations devem ser versionadas no Git.

---

# 24. Multi-tenancy

Mesmo no MVP, o projeto deve estar preparado para múltiplas clínicas.

Entidades de negócio devem possuir:

```text
clinic_id
```

quando aplicável.

---

# 25. Isolamento por Clínica

Nunca confiar em:

```text
clinic_id
```

enviado pelo frontend.

Obter a clínica a partir da sessão autenticada.

Toda query de negócio deve filtrar pelo tenant.

---

# 26. Autenticação

Autenticação definida:

```text
Better Auth
```

Perfis iniciais:

```text
MANAGER
RECEPTIONIST
```

Autenticação e autorização são responsabilidades diferentes.

---

# 27. Autorização

Antes de operações protegidas, validar:

```text
usuário autenticado?
↓
qual clinic_id?
↓
qual role?
↓
possui permissão?
```

---

# 28. IA

Provider:

```text
OpenRouter
```

Toda chamada deve ocorrer server-side.

Fluxo:

```text
Frontend
↓
Backend
↓
OpenRouter
↓
Structured Output
↓
Zod
↓
Persistência
```

---

# 29. Structured Output

Funcionalidades de IA estruturadas não devem depender de texto livre.

Utilizar schema previsível.

Exemplo:

```json
{
  "objection_category": "FINANCIAL",
  "context_analysis": "...",
  "contact_goal": "...",
  "strategy": "...",
  "suggested_approach": "...",
  "suggested_message": "...",
  "next_action": "...",
  "suggested_follow_up_days": 3
}
```

---

# 30. Prompts

Prompts devem ficar centralizados.

Exemplo:

```text
src/services/ai/prompts/
```

Não escrever prompts grandes diretamente dentro de:

- componentes;
- páginas;
- endpoints.

---

# 31. Versionamento de Prompts

Prompts importantes devem possuir versão.

Exemplo:

```text
OPPORTUNITY_ANALYSIS_V1
```

Persistir:

```text
prompt_version
```

junto à análise.

---

# 32. IA como Assistente

A IA:

```text
sugere
```

A equipe:

```text
decide
```

No MVP, a IA não deve:

- enviar mensagens automaticamente;
- agendar follow-up automaticamente;
- alterar regras comerciais;
- fechar oportunidades automaticamente;
- tomar decisões clínicas.

---

# 33. Regras Comerciais

A IA só pode utilizar regras cadastradas.

Nunca inventar:

- descontos;
- parcelamentos;
- promoções;
- garantias;
- benefícios;
- condições.

---

# 34. Escopo Clínico

A plataforma possui finalidade:

```text
comercial
```

Não:

```text
diagnóstica
```

Não implementar funcionalidades de:

- diagnóstico;
- recomendação clínica;
- análise de exames;
- interpretação de radiografia;
- orientação médica.

---

# 35. Privacidade

Aplicar minimização de dados.

Não armazenar ou enviar à IA informações sem necessidade comercial.

Evitar:

- CPF;
- RG;
- prontuário;
- exames;
- diagnósticos;
- radiografias;
- histórico médico;
- dados clínicos detalhados.

---

# 36. LGPD

Aplicar princípios de:

```text
Privacy by Design
```

Considerar:

- finalidade;
- minimização;
- controle de acesso;
- proteção de dados;
- auditoria;
- exclusão quando aplicável.

---

# 37. Importação

Formatos do MVP:

```text
CSV
XLSX
```

Fluxo:

```text
arquivo
↓
preview
↓
mapeamento de colunas
↓
validação
↓
revisão
↓
importação
```

Não importar automaticamente sem revisão do usuário.

---

# 38. Duplicidades

Antes de criar paciente:

- verificar referência externa;
- verificar telefone;
- avaliar correspondência existente.

Não usar somente nome como critério confiável.

---

# 39. Prioridade de Oportunidades

O score principal deve ser determinístico.

A IA não deve definir sozinha a prioridade.

Regra de negócio deve ficar em:

```text
src/services/priority/
```

---

# 40. Dashboard

Agregações devem ocorrer preferencialmente no PostgreSQL.

Utilizar:

```text
COUNT
SUM
AVG
GROUP BY
```

Não carregar todos os dados no frontend para calcular métricas.

---

# 41. Performance

Priorizar:

- queries server-side;
- paginação;
- índices úteis;
- carregamento sob demanda;
- agregações no banco.

Não otimizar prematuramente com infraestrutura complexa.

---

# 42. Segurança de Secrets

Secrets incluem:

```text
DATABASE_URL
OPENROUTER_API_KEY
BETTER_AUTH_SECRET
```

Nunca:

- commitar;
- expor em client;
- utilizar `NEXT_PUBLIC_*`;
- escrever em logs.

---

# 43. Variáveis de Ambiente

Exemplo:

```text
DATABASE_URL=

OPENROUTER_API_KEY=
OPENROUTER_MODEL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

NEXT_PUBLIC_APP_URL=
```

Manter:

```text
.env.example
```

sem valores secretos.

---

# 44. Erros

Não expor detalhes internos.

Evitar:

```text
Postgres error...
OpenRouter 502...
Stack trace...
```

Preferir mensagens amigáveis.

Logs técnicos podem conter contexto seguro.

---

# 45. Logging

Não registrar:

- secrets;
- senhas;
- tokens;
- dados sensíveis desnecessários;
- prompts completos com informações pessoais.

---

# 46. Testes

Priorizar testes em regras críticas.

## Unitários

```text
calculatePriority()
schemas Zod
mapeamento de importação
parsing de IA
regras comerciais
```

## Integração

```text
importação
oportunidades
análise de IA
interações
follow-ups
isolamento por clínica
```

---

# 47. Antes de Implementar

Para cada tarefa:

1. leia a solicitação;
2. identifique domínio;
3. consulte documentos relevantes;
4. consulte skills necessárias;
5. inspecione código existente;
6. identifique menor alteração necessária;
7. implemente;
8. teste;
9. revise segurança e escopo.

---

# 48. Durante a Implementação

Não:

- criar funcionalidades extras;
- trocar stack;
- refatorar módulos não relacionados;
- alterar comportamento sem requisito;
- inventar regra de negócio.

Se encontrar problema fora do escopo:

- não expandir automaticamente a tarefa;
- registrar ou mencionar o problema quando relevante.

---

# 49. Depois da Implementação

Revisar:

```text
funcionalidade
segurança
multi-tenancy
tipagem
validação
UX
responsividade
testes
impacto em dados
```

---

# 50. Critérios de Conclusão

Uma tarefa só deve ser considerada concluída quando:

```text
[ ] O requisito foi implementado.

[ ] O código compila.

[ ] Os tipos estão corretos.

[ ] Validações necessárias existem.

[ ] Segurança foi considerada.

[ ] clinic_id foi considerado quando necessário.

[ ] Migrations foram criadas quando necessário.

[ ] UI respeita o Design System.

[ ] Estados de erro foram considerados.

[ ] Responsividade foi considerada.

[ ] Testes relevantes foram executados ou adicionados.

[ ] Não foram introduzidas alterações fora de escopo.
```

---

# 51. Git

Fluxo recomendado:

```text
main
↓
feature/*
fix/*
chore/*
```

Exemplos:

```text
feature/import-opportunities

feature/ai-analysis

feature/follow-up

fix/duplicate-patients
```

---

# 52. Commits

Commits devem representar mudanças coerentes.

Preferir:

```text
feat: add opportunity import flow
```

em vez de:

```text
changes
```

Evitar commits gigantes com funcionalidades não relacionadas.

---

# 53. Pull Requests

Para funcionalidades relevantes:

1. implementar;
2. revisar;
3. testar;
4. abrir PR;
5. revisar diff;
6. corrigir problemas;
7. fazer merge.

Não acumular muitas funcionalidades diferentes no mesmo PR quando puderem ser separadas.

---

# 54. Revisão de Código

Ao revisar:

Prioridade:

```text
1. Bugs
2. Segurança
3. Perda de dados
4. Multi-tenancy
5. Regressões
6. Regras do produto
7. Performance
8. Manutenibilidade
9. Estilo
```

Não focar apenas em estética de código.

---

# 55. Dependências

Não adicionar biblioteca sem necessidade.

Antes de instalar:

1. verificar se a plataforma já resolve;
2. verificar se existe dependência atual;
3. avaliar peso;
4. avaliar manutenção;
5. avaliar segurança.

---

# 56. Não Implementar no MVP

A menos que haja instrução explícita, não implementar:

- WhatsApp automático;
- integração direta com CRM;
- chatbot autônomo;
- ligação automática;
- aplicativo mobile nativo;
- treinamento de modelo próprio;
- prontuário;
- diagnóstico por IA;
- dark mode;
- microserviços;
- arquitetura distribuída complexa.

---

# 57. Evoluções Futuras

O código pode ser preparado para evolução, mas sem antecipar funcionalidades.

Possíveis evoluções:

```text
integração CRM
WhatsApp
automação de follow-up
analytics avançado
score preditivo
multi-clínica SaaS
```

Preparar arquitetura não significa implementar agora.

---

# 58. Regra de Simplicidade

Se existem duas soluções válidas:

```text
A → simples e suficiente
B → mais genérica, sofisticada e complexa
```

para o MVP, preferir:

```text
A
```

desde que não viole arquitetura, segurança ou requisitos.

---

# 59. Regra de Consistência

Ao implementar funcionalidade semelhante a uma existente:

> siga o padrão já utilizado no projeto.

Não introduza um segundo padrão para resolver o mesmo problema.

---

# 60. Regra de Segurança

Nunca sacrificar:

- isolamento de clínica;
- autenticação;
- autorização;
- privacidade;
- integridade de dados;

para simplificar implementação.

---

# 61. Regra de IA

Nunca tratar a saída do modelo como autoridade.

Sempre:

```text
modelo
↓
validação
↓
sistema
↓
usuário
```

---

# 62. Regra de Produto

A plataforma existe para ajudar a equipe a responder:

```text
Quem abordar?

Por que abordar?

Como abordar?

Quando abordar?

Qual próxima ação?
```

Funcionalidades que não ajudam diretamente ou indiretamente esse objetivo devem ser avaliadas antes de entrar no MVP.

---

# 63. Resumo Operacional

Antes de qualquer tarefa:

```text
Entenda
↓
Leia os documentos
↓
Carregue a skill adequada
↓
Inspecione o código
↓
Planeje a menor mudança
↓
Implemente
↓
Valide
↓
Teste
↓
Revise
```

---

# 64. Regra Final

> Construa um MVP simples, seguro, consistente e mensurável. Preserve o escopo do produto, siga a arquitetura definida, reutilize padrões existentes e trate IA como assistência controlada, nunca como autoridade autônoma.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
