# ARCHITECTURE.md — Plataforma Inteligente de Recuperação de Orçamentos

## 1. Objetivo deste Documento

Este documento define **como a Plataforma Inteligente de Recuperação de Orçamentos será construída tecnicamente**.

A arquitetura deve priorizar:

- simplicidade para desenvolvimento do MVP;
- baixo custo operacional;
- segurança dos dados;
- facilidade de manutenção;
- boa integração com Inteligência Artificial;
- possibilidade de evolução futura;
- implantação simples;
- escalabilidade suficiente para atender outras clínicas no futuro;
- separação clara entre frontend, backend, banco de dados e serviços externos.

O `PRD.md` define **o que o produto deve fazer**.

Este documento define **como essas funcionalidades serão implementadas**.

---

# 2. Visão Geral da Arquitetura

A aplicação será uma plataforma web full-stack construída com **Next.js e TypeScript**, hospedada na **Vercel**.

Os dados serão armazenados no **Neon PostgreSQL**.

A comunicação com modelos de Inteligência Artificial será realizada através da **API do OpenRouter**.

A aplicação seguirá a arquitetura:

```text
                    ┌─────────────────┐
                    │     Usuário     │
                    │                 │
                    │ Recepcionista   │
                    │ Gestor          │
                    └────────┬────────┘
                             │
                             ▼
                  ┌────────────────────┐
                  │      Next.js       │
                  │      Vercel        │
                  │                    │
                  │ Frontend + Backend │
                  └─────────┬──────────┘
                            │
             ┌──────────────┼───────────────┐
             │              │               │
             ▼              ▼               ▼
       Neon PostgreSQL   OpenRouter     XLSX / CSV
             │              │            Parser
             │              │
             ▼              ▼
        Dados da        Modelos de
        aplicação           IA
```

---

# 3. Stack Tecnológica

## 3.1 Framework Principal

### Next.js

A aplicação será construída utilizando:

- Next.js;
- React;
- TypeScript;
- App Router.

O Next.js será responsável tanto pelo frontend quanto pelo backend da aplicação.

Essa abordagem evita a necessidade de manter dois projetos separados durante o MVP.

---

## 3.2 Frontend

Tecnologias principais:

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
```

Responsabilidades do frontend:

- renderização das páginas;
- formulários;
- tabelas;
- filtros;
- dashboards;
- importação de arquivos;
- gerenciamento da interface;
- interação com APIs internas;
- exibição das análises da IA;
- registro de follow-ups;
- feedback de erros e carregamento.

---

# 4. Backend

O backend será implementado dentro do próprio Next.js.

Serão utilizados:

- Server Components quando apropriado;
- Server Actions quando simplificarem operações internas;
- Route Handlers em `app/api/*` para APIs;
- serviços server-side para regras de negócio.

Exemplo:

```text
app/
├── api/
│   ├── ai/
│   │   └── analyze/
│   │       └── route.ts
│   ├── imports/
│   │   └── route.ts
│   ├── opportunities/
│   │   └── route.ts
│   └── follow-ups/
│       └── route.ts
```

---

# 5. Hospedagem

## Vercel

A aplicação será hospedada na Vercel.

A Vercel ficará responsável por:

- hospedagem do frontend;
- execução das funções server-side;
- deploy automático;
- HTTPS;
- variáveis de ambiente;
- previews de pull requests;
- integração com GitHub.

Fluxo:

```text
Desenvolvedor
     ↓
GitHub
     ↓
Push / Pull Request
     ↓
Vercel
     ↓
Build
     ↓
Deploy
```

---

# 6. Banco de Dados

## Neon PostgreSQL

O banco principal será PostgreSQL hospedado no Neon.

O banco armazenará:

- clínicas;
- usuários;
- pacientes;
- oportunidades;
- orçamentos;
- objeções;
- análises da IA;
- histórico de contatos;
- follow-ups;
- playbooks;
- regras comerciais;
- importações;
- registros de auditoria.

---

# 7. ORM

Será utilizado:

## Drizzle ORM

Responsabilidades:

- definição do schema;
- queries;
- relacionamentos;
- migrations;
- tipagem TypeScript;
- comunicação com PostgreSQL.

Estrutura sugerida:

```text
src/
└── db/
    ├── index.ts
    ├── schema/
    │   ├── clinics.ts
    │   ├── users.ts
    │   ├── patients.ts
    │   ├── opportunities.ts
    │   ├── ai-analyses.ts
    │   ├── interactions.ts
    │   ├── follow-ups.ts
    │   ├── playbooks.ts
    │   └── imports.ts
    └── migrations/
```

---

# 8. Estrutura Multi-Clínica

Mesmo que inicialmente apenas a Clínica Basilico utilize o sistema, a arquitetura deverá ser preparada para múltiplas clínicas.

As principais entidades deverão possuir:

```text
clinic_id
```

Exemplo:

```text
clinics
    │
    ├── users
    ├── patients
    ├── opportunities
    ├── playbooks
    ├── commercial_rules
    └── imports
```

Isso evita uma grande reformulação caso o sistema posteriormente se torne um SaaS.

---

# 9. Modelo de Dados de Alto Nível

Estrutura principal:

```text
clinics
   │
   ├── users
   │
   ├── patients
   │      │
   │      └── opportunities
   │              │
   │              ├── ai_analyses
   │              ├── interactions
   │              └── follow_ups
   │
   ├── objection_playbooks
   ├── commercial_rules
   ├── imports
   │      │
   │      └── import_rows
   │
   └── audit_logs
```

---

# 10. Principais Entidades

## 10.1 Clinics

Representa uma clínica que utiliza a plataforma.

Campos principais:

```text
id
name
created_at
updated_at
```

---

# 11. Users

Representa usuários internos.

Campos principais:

```text
id
clinic_id
name
email
role
created_at
updated_at
```

Papéis iniciais:

```text
MANAGER
RECEPTIONIST
```

---

# 12. Patients

Representa o paciente importado ou registrado na plataforma.

Campos sugeridos:

```text
id
clinic_id
name
phone
external_reference
created_at
updated_at
```

Evitar armazenar informações clínicas desnecessárias.

---

# 13. Opportunities

Será a principal entidade comercial do sistema.

Uma oportunidade representa um orçamento que pode ser recuperado.

Campos sugeridos:

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

---

# 14. Categorias de Objeção

Valores iniciais:

```text
FINANCIAL
SHARED_DECISION
INDECISION
COMPARISON
LOW_URGENCY
INSECURITY
NO_RESPONSE
OTHER
```

---

# 15. Status da Oportunidade

Enum inicial:

```text
NEW
TO_ANALYZE
CONTACT_PENDING
CONTACTED
WAITING_PATIENT
FOLLOW_UP_SCHEDULED
NEGOTIATING
RECOVERED
LOST
DO_NOT_CONTACT
```

---

# 16. Prioridade

```text
HIGH
MEDIUM
LOW
```

A prioridade será calculada pelo sistema.

Não deverá depender exclusivamente da IA.

---

# 17. Score de Prioridade

A priorização será baseada principalmente em regras determinísticas.

Exemplo inicial:

```text
Recência do orçamento            +30
Valor relevante                  +20
Follow-up pendente               +20
Objeção recuperável              +15
Interação anterior positiva      +15
                                 ----
Máximo                           100
```

Exemplo:

```text
score >= 70
→ HIGH

score >= 40
→ MEDIUM

score < 40
→ LOW
```

Os pesos deverão estar centralizados em uma função ou serviço específico para poderem ser alterados posteriormente.

Exemplo:

```text
src/services/
└── priority/
    └── calculate-priority.ts
```

A IA poderá gerar informações que auxiliem no cálculo, mas não deverá determinar arbitrariamente toda a prioridade.

---

# 18. AI Analyses

Cada análise da IA deve ser armazenada separadamente.

Campos sugeridos:

```text
id
clinic_id
opportunity_id

model
provider

objection_category

context_analysis
contact_goal
strategy
suggested_approach
suggested_message
next_action

suggested_follow_up_days

prompt_version

created_at
```

Isso permite manter histórico quando uma oportunidade for analisada mais de uma vez.

---

# 19. Integração com Inteligência Artificial

## OpenRouter

A comunicação com os modelos será realizada através da API do OpenRouter.

Arquitetura:

```text
Frontend
   ↓
API interna
   ↓
Serviço de IA
   ↓
OpenRouter
   ↓
Modelo selecionado
```

Nunca:

```text
Frontend
   ↓
OpenRouter
```

A chave da API nunca deverá ser exposta ao navegador.

---

# 20. Serviço de IA

Estrutura sugerida:

```text
src/
└── services/
    └── ai/
        ├── openrouter.ts
        ├── analyze-opportunity.ts
        ├── prompts/
        │   ├── opportunity-analysis.ts
        │   └── system-prompt.ts
        └── schemas/
            └── opportunity-analysis-schema.ts
```

---

# 21. Endpoint de Análise

Exemplo:

```text
POST /api/ai/analyze
```

Fluxo:

```text
Recebe opportunity_id
        ↓
Valida usuário
        ↓
Verifica clinic_id
        ↓
Busca oportunidade
        ↓
Busca playbook relacionado
        ↓
Busca regras comerciais
        ↓
Monta contexto
        ↓
Remove informações desnecessárias
        ↓
OpenRouter
        ↓
Recebe JSON
        ↓
Valida resposta
        ↓
Salva análise
        ↓
Retorna resultado
```

---

# 22. Structured Output

A IA não deverá retornar somente texto livre.

Será utilizado um contrato estruturado.

Exemplo:

```json
{
  "objection_category": "FINANCIAL",
  "context_analysis": "O principal impedimento informado pelo paciente parece ser financeiro.",
  "contact_goal": "Identificar se a barreira está relacionada ao valor total, entrada ou parcelas.",
  "strategy": "Realizar uma abordagem consultiva e explorar qual condição seria mais viável.",
  "suggested_approach": "Retomar a conversa sem pressionar o paciente.",
  "suggested_message": "Olá, João...",
  "next_action": "Avaliar as condições comerciais disponíveis.",
  "suggested_follow_up_days": 3
}
```

---

# 23. Validação

Será utilizado:

## Zod

Todas as entradas externas deverão ser validadas.

Incluindo:

- formulários;
- APIs;
- parâmetros;
- planilhas;
- respostas da IA.

Exemplo:

```text
OpenRouter
    ↓
JSON
    ↓
Zod
    ↓
válido?
   ├── Sim → armazenar
   └── Não → rejeitar / tentar novamente
```

Nenhuma resposta da IA deverá ser armazenada sem validação.

---

# 24. Seleção de Modelo

O modelo utilizado pelo OpenRouter deverá ser configurado através de variável de ambiente.

Exemplo:

```text
OPENROUTER_MODEL
```

O código não deverá depender diretamente de um único modelo.

Isso permitirá trocar modelos posteriormente sem alterar a arquitetura.

---

# 25. Prompt Versioning

Prompts importantes deverão possuir versão.

Exemplo:

```text
OPPORTUNITY_ANALYSIS_V1
```

As análises deverão registrar:

```text
prompt_version
```

Assim será possível descobrir posteriormente qual versão gerou determinado resultado.

---

# 26. Controle de Alucinação

A IA nunca deverá inventar:

- descontos;
- parcelamentos;
- condições;
- preços;
- tratamentos;
- garantias;
- disponibilidade;
- informações médicas;
- promoções.

Para minimizar isso, o prompt receberá somente informações comerciais cadastradas.

---

# 27. Minimização de Dados para IA

Como o sistema trabalhará com dados de pacientes, apenas informações estritamente necessárias deverão ser enviadas ao OpenRouter.

Enviar quando necessário:

```text
primeiro nome ou identificação mínima
tratamento/orçamento em contexto comercial
valor
objeção
observações comerciais relevantes
histórico comercial
regras comerciais
playbook
```

Evitar:

```text
CPF
RG
endereço
data de nascimento
prontuário
exames
diagnósticos
imagens clínicas
informações médicas sem necessidade
dados pessoais irrelevantes
```

---

# 28. Interactions

Tabela responsável pelo histórico de contatos.

Campos:

```text
id
clinic_id
opportunity_id
user_id

channel
result
notes

created_at
```

Canais iniciais:

```text
WHATSAPP
PHONE
IN_PERSON
OTHER
```

---

# 29. Resultado das Interações

Valores possíveis:

```text
NO_RESPONSE
REQUESTED_CALLBACK
STILL_THINKING
INTERESTED
NEGOTIATING
RETURN_SCHEDULED
PROCEDURE_SCHEDULED
CLOSED
DECLINED
DO_NOT_CONTACT
```

---

# 30. Follow-ups

Campos sugeridos:

```text
id
clinic_id
opportunity_id
assigned_user_id

scheduled_at
reason
notes

status

completed_at

created_at
updated_at
```

Status:

```text
PENDING
COMPLETED
CANCELED
```

---

# 31. Consultas de Follow-up

O sistema deverá suportar facilmente:

```text
Follow-ups de hoje
Follow-ups atrasados
Próximos follow-ups
Follow-ups por responsável
```

No MVP isso poderá ser feito diretamente através de queries PostgreSQL.

---

# 32. Playbooks

Os playbooks determinam orientações aprovadas pela clínica para cada objeção.

Tabela:

```text
objection_playbooks
```

Campos:

```text
id
clinic_id

objection_category

title
objective
guidelines
suggested_questions

is_active

created_at
updated_at
```

---

# 33. Commercial Rules

Tabela:

```text
commercial_rules
```

Poderá armazenar:

- formas de pagamento;
- parcelamento;
- descontos autorizados;
- diferenciais;
- políticas;
- orientações comerciais.

A IA poderá consultar essas informações antes de gerar uma estratégia.

---

# 34. Importação de Planilhas

O sistema aceitará inicialmente:

```text
.xlsx
.csv
```

Bibliotecas possíveis:

```text
SheetJS / xlsx
PapaParse
```

---

# 35. Arquitetura da Importação

Fluxo:

```text
Usuário seleciona arquivo
        ↓
Browser lê cabeçalhos
        ↓
Preview
        ↓
Mapeamento de colunas
        ↓
Normalização
        ↓
API
        ↓
Validação Zod
        ↓
Persistência no Neon
```

---

# 36. Mapeamento de Colunas

O sistema não deverá depender dos nomes exatos exportados pelo CRM.

Exemplo:

```text
Planilha              Sistema

Cliente          →    patient_name
Paciente         →    patient_name

Celular          →    phone
Telefone         →    phone

Tratamento       →    treatment

Valor            →    budget_value

Motivo           →    raw_objection

Observação       →    notes
```

A confirmação final deverá ser feita pelo usuário.

---

# 37. Imports

Cada importação deverá ser registrada.

Tabela:

```text
imports
```

Campos sugeridos:

```text
id
clinic_id
user_id

file_name

total_rows
imported_rows
failed_rows

status

created_at
```

---

# 38. Import Rows

Opcionalmente poderá existir:

```text
import_rows
```

Responsável por armazenar erros e rastreabilidade.

Exemplo:

```text
row_number
status
error_message
```

---

# 39. Detecção de Duplicidades

Antes de criar um paciente, o sistema deverá tentar identificar possíveis duplicidades.

Critérios iniciais:

- telefone;
- referência externa do CRM;
- combinação de dados quando necessário.

O sistema não deverá criar automaticamente registros duplicados quando houver correspondência confiável.

---

# 40. Autenticação

Será utilizada uma camada própria.

Sugestão:

## Better Auth

Responsável por:

- login;
- sessão;
- logout;
- controle de autenticação;
- armazenamento de sessões.

A autenticação deverá utilizar o PostgreSQL do Neon.

---

# 41. Autorização

Depois do login, toda operação deverá verificar:

```text
Quem é o usuário?

A qual clinic_id ele pertence?

Qual é seu role?

Ele pode executar esta operação?
```

Nunca confiar em um `clinic_id` enviado pelo frontend.

---

# 42. Permissões

## RECEPTIONIST

Permitido:

- visualizar oportunidades;
- analisar oportunidades;
- registrar contatos;
- criar follow-ups;
- realizar importações;
- consultar playbooks.

## MANAGER

Além das permissões anteriores:

- acessar indicadores gerais;
- configurar regras comerciais;
- editar playbooks;
- gerenciar usuários;
- acessar informações administrativas.

---

# 43. Isolamento de Dados

Toda query relacionada a dados de negócio deverá filtrar pela clínica.

Exemplo conceitual:

```text
WHERE clinic_id = current_user.clinic_id
```

Nunca:

```text
SELECT *
FROM opportunities
WHERE id = ?
```

Preferir:

```text
SELECT *
FROM opportunities
WHERE id = ?
AND clinic_id = ?
```

---

# 44. Auditoria

Operações importantes deverão poder ser auditadas.

Tabela sugerida:

```text
audit_logs
```

Eventos importantes:

```text
IMPORT_CREATED
OPPORTUNITY_UPDATED
AI_ANALYSIS_CREATED
INTERACTION_CREATED
FOLLOW_UP_CREATED
OPPORTUNITY_RECOVERED
COMMERCIAL_RULE_UPDATED
PLAYBOOK_UPDATED
```

---

# 45. Variáveis de Ambiente

Exemplo:

```text
DATABASE_URL=

OPENROUTER_API_KEY=
OPENROUTER_MODEL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

NEXT_PUBLIC_APP_URL=
```

Nunca colocar segredos diretamente no código.

---

# 46. Segurança das Chaves

Nunca utilizar no frontend:

```text
OPENROUTER_API_KEY
DATABASE_URL
BETTER_AUTH_SECRET
```

Essas variáveis devem existir somente em contexto server-side.

---

# 47. Estrutura de Pastas

Estrutura sugerida:

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
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── opportunities/
│   │   │   ├── follow-ups/
│   │   │   ├── imports/
│   │   │   ├── playbooks/
│   │   │   └── settings/
│   │   │
│   │   └── api/
│   │       ├── ai/
│   │       ├── opportunities/
│   │       ├── imports/
│   │       └── follow-ups/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── dashboard/
│   │   ├── opportunities/
│   │   ├── follow-ups/
│   │   └── imports/
│   │
│   ├── db/
│   │   ├── index.ts
│   │   └── schema/
│   │
│   ├── services/
│   │   ├── ai/
│   │   ├── opportunities/
│   │   ├── priority/
│   │   ├── imports/
│   │   └── follow-ups/
│   │
│   ├── lib/
│   ├── schemas/
│   ├── types/
│   └── auth/
│
├── .env.example
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

# 48. Separação de Responsabilidades

Evitar colocar toda a lógica dentro de:

```text
page.tsx
route.ts
```

Exemplo correto:

```text
route.ts
   ↓
schema validation
   ↓
service
   ↓
database
```

---

# 49. Camada de Services

Regras de negócio deverão ficar preferencialmente em:

```text
src/services
```

Exemplos:

```text
analyzeOpportunity()
calculatePriority()
importOpportunities()
scheduleFollowUp()
registerInteraction()
recoverOpportunity()
```

---

# 50. Dashboard

Os dados do dashboard deverão ser calculados no backend diretamente no PostgreSQL.

Utilizar agregações como:

```text
COUNT
SUM
AVG
GROUP BY
```

Evitar carregar milhares de registros no frontend para depois calcular indicadores.

---

# 51. Performance

No MVP não será necessário criar arquitetura distribuída.

Priorizar:

- queries eficientes;
- paginação;
- índices PostgreSQL;
- filtros no servidor;
- agregações no banco;
- carregamento sob demanda.

---

# 52. Índices

Criar índices principalmente para:

```text
clinic_id
patient_id
opportunity_id
status
priority
budget_date
next_follow_up_at
objection_category
```

Índices compostos poderão ser utilizados:

```text
clinic_id + status
clinic_id + next_follow_up_at
clinic_id + priority
```

---

# 53. Paginação

A lista de oportunidades não deverá buscar todos os pacientes de uma vez.

Exemplo:

```text
20–50 registros por página
```

Com:

- paginação;
- filtros server-side;
- ordenação server-side.

---

# 54. Cron Jobs

Não são obrigatórios para a primeira versão.

Se futuramente forem necessárias automações, poderão ser utilizados Cron Jobs da Vercel.

Exemplo:

```text
Todos os dias
     ↓
Verificar follow-ups
     ↓
Identificar atrasados
     ↓
Criar alertas
```

---

# 55. WhatsApp

Integração direta com WhatsApp ficará fora do MVP inicial.

Arquitetura futura:

```text
Plataforma
    ↓
Serviço de mensagens
    ↓
WhatsApp Business API
```

A camada de interações já deverá armazenar:

```text
channel
```

Isso facilitará a integração futura.

---

# 56. CRM

No MVP:

```text
CRM
 ↓
Exportação manual
 ↓
CSV/XLSX
 ↓
Plataforma
```

Futuramente:

```text
CRM
 ↓
API / Webhook
 ↓
Integration Service
 ↓
Plataforma
```

---

# 57. Tratamento de Erros

Erros devem ser classificados.

Exemplos:

```text
VALIDATION_ERROR
AUTHENTICATION_ERROR
AUTHORIZATION_ERROR
NOT_FOUND
DATABASE_ERROR
AI_PROVIDER_ERROR
AI_INVALID_RESPONSE
IMPORT_ERROR
INTERNAL_ERROR
```

O frontend deverá receber mensagens adequadas sem expor informações internas.

---

# 58. Logging

Eventos importantes deverão possuir logs técnicos.

Não registrar em logs:

- chaves de API;
- senhas;
- dados clínicos sensíveis;
- conteúdos desnecessários do paciente.

---

# 59. Testes

Priorizar testes para regras críticas.

## Unitários

Principalmente:

```text
calculatePriority()
validation schemas
mapping functions
AI output parser
commercial rule validation
```

## Integração

Principalmente:

```text
importação
criação de oportunidade
geração de análise
registro de interação
follow-up
```

---

# 60. Responsividade

A aplicação deverá ser responsiva.

Prioridade:

```text
Desktop
Tablet
Mobile
```

As regras visuais completas estarão definidas em:

```text
docs/DESIGN_SYSTEM.md
```

---

# 61. LGPD e Privacidade

O desenvolvimento deve seguir o princípio de:

## Privacy by Design

Práticas:

- coletar somente dados necessários;
- minimizar dados enviados à IA;
- proteger sessões;
- controlar acesso por clínica;
- permitir exclusão quando aplicável;
- manter auditoria;
- evitar informações clínicas desnecessárias;
- não utilizar dados para finalidades diferentes das autorizadas.

---

# 62. Dados Sensíveis

O sistema não deverá se tornar um prontuário odontológico.

A plataforma possui finalidade:

```text
COMERCIAL
```

Não:

```text
CLÍNICA / DIAGNÓSTICA
```

Evitar armazenar:

- prontuários;
- exames;
- radiografias;
- diagnósticos detalhados;
- históricos médicos.

---

# 63. Human in the Loop

Nenhuma comunicação deverá ser enviada automaticamente para pacientes no MVP.

Fluxo:

```text
IA gera sugestão
       ↓
Recepcionista analisa
       ↓
Recepcionista decide
       ↓
Contato é realizado
```

A IA será:

```text
assistente
```

e não:

```text
agente autônomo
```

---

# 64. Controle de Custos de IA

Cada análise deverá registrar:

```text
model
created_at
```

Quando disponível, também poderá registrar:

```text
input_tokens
output_tokens
estimated_cost
```

---

# 65. Cache de Análises

O sistema não deverá chamar a IA repetidamente sem necessidade.

Se uma oportunidade já possuir uma análise válida e suas informações não tiverem sido alteradas, reutilizar a análise existente.

Gerar uma nova análise quando:

- objeção mudar;
- observações relevantes forem adicionadas;
- contexto comercial mudar;
- usuário solicitar explicitamente nova análise.

---

# 66. Versionamento de Dados da IA

Cada análise deverá permanecer histórica.

Não sobrescrever necessariamente a análise anterior.

---

# 67. Arquitetura do Fluxo Principal

```text
                         CRM
                          │
                          ▼
                    CSV / XLSX
                          │
                          ▼
                 Importação Next.js
                          │
                          ▼
                   Validação Zod
                          │
                          ▼
                   Neon PostgreSQL
                          │
                          ▼
                    Oportunidade
                          │
              ┌───────────┴──────────┐
              │                      │
              ▼                      ▼
      Score determinístico      OpenRouter
              │                      │
              ▼                      ▼
          Prioridade           Análise da IA
              │                      │
              └──────────┬───────────┘
                         │
                         ▼
                Tela da oportunidade
                         │
                         ▼
                    Recepcionista
                         │
                         ▼
                  Realiza contato
                         │
                         ▼
                Registra interação
                         │
                         ▼
                  Cria follow-up
                         │
                         ▼
                     Dashboard
```

---

# 68. Deploy

Ambientes:

```text
Development
Preview
Production
```

## Development

Execução local.

```text
npm run dev
```

## Preview

Criado automaticamente pela Vercel em Pull Requests.

## Production

Branch principal:

```text
main
```

---

# 69. Branches

Fluxo recomendado:

```text
main
  │
  ├── feature/import
  ├── feature/opportunities
  ├── feature/ai-analysis
  └── fix/...
```

---

# 70. Migrations

Alterações de banco devem ser feitas por migrations.

Nunca modificar estrutura de produção manualmente sem registrar a mudança no projeto.

Exemplo:

```text
drizzle/
└── migrations/
    ├── 0001_initial_schema.sql
    ├── 0002_add_followups.sql
    └── 0003_add_ai_analysis.sql
```

---

# 71. Regra para o Agente

Ao implementar funcionalidades relacionadas ao banco:

1. verificar schema atual;
2. criar migration quando necessário;
3. não apagar dados existentes sem motivo;
4. manter migrations versionadas;
5. atualizar tipos;
6. atualizar services relacionados;
7. validar isolamento por `clinic_id`.

---

# 72. Dependências Principais

Sugestão inicial:

```text
next
react
typescript

tailwindcss

drizzle-orm
drizzle-kit

@neondatabase/serverless

zod

better-auth

xlsx
papaparse
```

Bibliotecas adicionais deverão ser adicionadas somente quando houver necessidade concreta.

---

# 73. Princípios de Arquitetura

## 73.1 Simplicidade

Não criar microserviços no MVP.

## 73.2 Server-side First

Dados sensíveis e operações importantes devem acontecer no servidor.

## 73.3 Type Safety

Utilizar TypeScript e Zod.

## 73.4 Separation of Concerns

Separar:

```text
UI
API
Services
Database
AI
Validation
```

## 73.5 Security by Default

Todo recurso deve assumir que precisa validar:

```text
sessão
usuário
clinic_id
permissão
input
```

## 73.6 AI as a Service

Toda interação com IA deverá passar pela camada:

```text
services/ai
```

## 73.7 Data First

A IA complementa os dados.

Ela não deverá substituir regras determinísticas quando regras simples forem suficientes.

---

# 74. Decisões Arquiteturais do MVP

| Área | Decisão |
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
| Planilhas | SheetJS/XLSX + CSV parser |
| Deploy | GitHub + Vercel |
| Arquitetura | Monólito modular |
| Multi-tenant | `clinic_id` |
| Priorização | Algoritmo determinístico |
| IA | Structured Output |
| Comunicação | Human in the loop |

---

# 75. O que Evitar

Durante o MVP, evitar:

- microserviços;
- filas complexas sem necessidade;
- Kubernetes;
- múltiplos bancos;
- modelos próprios de IA;
- processamento automático de prontuários;
- comunicação automática com pacientes;
- dependência direta de um único modelo de IA;
- lógica de negócio dentro de componentes React;
- chamadas ao OpenRouter pelo navegador;
- queries sem filtro de clínica;
- dados clínicos desnecessários;
- regras comerciais inventadas pela IA.

---

# 76. Evolução Futura

A arquitetura deverá permitir futuramente:

```text
Integração CRM
        ↓
Importação automática

WhatsApp
        ↓
Envio de mensagens

Cron Jobs
        ↓
Follow-ups automáticos

Analytics
        ↓
Aprendizado com conversões

Multi-clínica
        ↓
SaaS

Model Routing
        ↓
Escolha automática de modelos de IA
```

Essas evoluções não deverão aumentar desnecessariamente a complexidade do MVP atual.

---

# 77. Regra Principal

A arquitetura do projeto deve seguir o princípio:

> **Construir a solução mais simples que valide a recuperação inteligente de orçamentos, mantendo os dados estruturados e a arquitetura preparada para crescer sem antecipar complexidades desnecessárias.**

---

# 78. Resumo Técnico

```text
Next.js + TypeScript
        │
        ├── React / Tailwind / shadcn
        │
        ├── APIs / Server Actions
        │
        ├── Better Auth
        │
        └── Services
             │
             ├── Neon PostgreSQL
             │      ↓
             │    Drizzle
             │
             ├── OpenRouter
             │      ↓
             │  Structured AI
             │
             └── XLSX / CSV
                    ↓
                 Imports

Deploy
  ↓
Vercel

Versionamento
  ↓
GitHub
```
