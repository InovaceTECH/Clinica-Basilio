---
name: database
description: Define como o agente deve projetar, alterar e revisar o banco de dados Neon PostgreSQL usando Drizzle ORM, migrations e isolamento por clínica.
---

# Database Skill

## 1. Objetivo

Esta skill define como o agente deve trabalhar com o banco de dados da Plataforma Inteligente de Recuperação de Orçamentos da Clínica Basilico.

A fonte de verdade técnica é:

`docs/ARCHITECTURE.md`

A fonte de verdade funcional é:

`docs/PRD.md`

Esta skill orienta:

- modelagem de dados;
- Drizzle ORM;
- migrations;
- queries;
- índices;
- isolamento multi-clínica;
- integridade referencial;
- segurança;
- performance;
- auditoria.

---

# 2. Quando Usar

Utilize esta skill sempre que a tarefa envolver:

- criação ou alteração de tabelas;
- relacionamentos;
- migrations;
- Drizzle schema;
- constraints;
- índices;
- queries;
- paginação;
- agregações;
- filtros;
- auditoria;
- importação de dados;
- isolamento por `clinic_id`;
- correção de problemas de banco;
- revisão de performance SQL.

---

# 3. Fontes de Verdade

Consultar, conforme a tarefa:

```text
docs/PRD.md
docs/ARCHITECTURE.md
```

Prioridade:

```text
PRD.md
→ define o dado necessário para o produto.

ARCHITECTURE.md
→ define como ele deve ser persistido e acessado.

Esta skill
→ define como executar alterações de banco com segurança.
```

---

# 4. Stack Obrigatória

Banco:

```text
Neon PostgreSQL
```

ORM:

```text
Drizzle ORM
```

Driver:

```text
@neondatabase/serverless
```

Validação de entrada:

```text
Zod
```

Não trocar essas tecnologias sem requisito explícito.

---

# 5. Regra Principal

> Toda alteração de estrutura deve ser versionada por migration.

Não alterar manualmente produção sem registrar a mudança no projeto.

---

# 6. Fluxo para Alteração de Schema

Ao alterar banco:

```text
1. Entender requisito
        ↓
2. Revisar schema atual
        ↓
3. Identificar impacto
        ↓
4. Alterar schema Drizzle
        ↓
5. Criar migration
        ↓
6. Revisar SQL gerado
        ↓
7. Aplicar em ambiente de desenvolvimento
        ↓
8. Validar dados existentes
        ↓
9. Atualizar services e tipos
        ↓
10. Testar
```

---

# 7. Migrations

Migrations devem ficar em:

```text
drizzle/migrations/
```

Devem ser:

- pequenas;
- sequenciais;
- compreensíveis;
- reversíveis quando possível;
- seguras para dados existentes.

Evitar migrations com múltiplas mudanças não relacionadas.

---

# 8. Alterações Destrutivas

Não executar automaticamente:

- `DROP TABLE`;
- `DROP COLUMN`;
- alterações que eliminem dados;
- alterações irreversíveis;

sem verificar impacto.

Quando uma alteração destrutiva for necessária:

1. identificar dados afetados;
2. preferir migração em etapas;
3. preservar dados;
4. documentar impacto.

---

# 9. Multi-tenant

O sistema deve ser preparado para múltiplas clínicas.

Entidades de negócio devem possuir:

```text
clinic_id
```

quando aplicável.

Exemplos:

```text
users
patients
opportunities
ai_analyses
interactions
follow_ups
objection_playbooks
commercial_rules
imports
audit_logs
```

---

# 10. Isolamento por Clínica

Nunca confiar em `clinic_id` vindo do frontend.

O `clinic_id` deve ser obtido a partir da sessão autenticada.

Query incorreta:

```sql
SELECT *
FROM opportunities
WHERE id = $1;
```

Preferir:

```sql
SELECT *
FROM opportunities
WHERE id = $1
AND clinic_id = $2;
```

Essa regra vale para:

- leitura;
- atualização;
- exclusão;
- agregação;
- joins;
- relatórios.

---

# 11. Chaves Primárias

Utilizar identificadores consistentes.

Preferir UUID quando o padrão do projeto estiver estabelecido.

Não misturar tipos de ID sem necessidade.

---

# 12. Chaves Estrangeiras

Relacionamentos importantes devem possuir foreign keys.

Exemplo:

```text
opportunities.patient_id
→ patients.id

ai_analyses.opportunity_id
→ opportunities.id

interactions.opportunity_id
→ opportunities.id

follow_ups.opportunity_id
→ opportunities.id
```

---

# 13. Integridade Referencial

Definir comportamento de deleção conscientemente.

Não usar `CASCADE` automaticamente.

Perguntar conceitualmente:

```text
Se o registro pai for removido,
os registros filhos devem:

- ser apagados?
- permanecer?
- bloquear a exclusão?
- receber null?
```

Preferir preservar histórico comercial.

---

# 14. Dados Históricos

Não sobrescrever histórico relevante quando for necessário auditar evolução.

Exemplo:

```text
ai_analyses
```

deve permitir múltiplas análises por oportunidade.

Não manter apenas a análise mais recente se o histórico for útil.

---

# 15. Campos de Auditoria

Entidades relevantes devem possuir quando apropriado:

```text
created_at
updated_at
```

Eventos relevantes podem gerar:

```text
audit_logs
```

---

# 16. Timestamps

Armazenar datas e horas de forma consistente.

Preferir timestamps com timezone quando aplicável.

Conversão para formato brasileiro deve ocorrer na interface.

---

# 17. Valores Monetários

Evitar ponto flutuante para valores financeiros.

Preferir:

```text
numeric / decimal
```

com precisão apropriada.

Exemplo conceitual:

```text
budget_value NUMERIC(12,2)
```

---

# 18. Enums

Utilizar enums somente quando o conjunto de valores for realmente controlado.

Exemplos adequados:

```text
role
status
priority
objection_category
interaction_result
follow_up_status
```

Evitar enum quando o valor precisa ser customizável pela clínica.

---

# 19. Status

Os valores iniciais devem seguir o `PRD.md`.

Não inventar novos status sem necessidade funcional.

Se um fluxo exigir novo status:

1. verificar se um existente resolve;
2. avaliar impacto;
3. atualizar schema;
4. atualizar tipos;
5. atualizar UI e regras relacionadas.

---

# 20. Índices

Criar índices guiados por queries reais.

Priorizar:

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

Índices compostos úteis:

```text
clinic_id + status
clinic_id + priority
clinic_id + next_follow_up_at
```

Não adicionar índices indiscriminadamente.

---

# 21. Queries

Queries devem ser:

- tipadas;
- filtradas no servidor;
- simples;
- previsíveis.

Evitar carregar grandes volumes para filtrar no frontend.

---

# 22. Dashboard

Agregações devem ser feitas no PostgreSQL.

Preferir:

```text
COUNT
SUM
AVG
GROUP BY
FILTER
```

em vez de carregar todos os registros e calcular em JavaScript.

---

# 23. Paginação

Listagens devem ser paginadas.

Preferir paginação server-side.

Não buscar todos os registros para tabelas operacionais.

---

# 24. Ordenação

Ordenação deve ser feita no banco.

Exemplos:

```text
priority
budget_date
next_follow_up_at
created_at
```

---

# 25. Busca

Busca deve ser segura e limitada ao tenant.

Nunca construir SQL por concatenação de strings vindas do usuário.

Utilizar APIs do Drizzle e parâmetros.

---

# 26. Importação de Dados

Fluxo esperado:

```text
arquivo
↓
normalização
↓
validação Zod
↓
detecção de duplicidade
↓
persistência
```

Não persistir linhas não validadas.

---

# 27. Duplicidades

Critérios iniciais podem considerar:

```text
external_reference
phone
```

Não usar apenas nome como identificador confiável.

Quando houver ambiguidade, não sobrescrever automaticamente.

---

# 28. Transações

Utilizar transação quando múltiplas operações precisam ser atômicas.

Exemplo:

```text
criar paciente
+
criar oportunidade
+
registrar importação
```

quando o fluxo exigir consistência completa.

---

# 29. Regras de Negócio

Evitar colocar lógica de negócio complexa dentro do schema.

Regras como:

```text
calculatePriority()
```

devem ficar em `src/services`.

O banco deve proteger integridade, não concentrar toda a lógica do produto.

---

# 30. Constraints

Utilizar constraints para impedir estados inválidos.

Exemplos:

- campos obrigatórios;
- unicidade quando aplicável;
- valores positivos;
- relações válidas.

Não depender apenas do frontend.

---

# 31. Nullable

Não marcar campos como nullable por padrão.

Para cada coluna, definir:

```text
é obrigatória?
pode ser desconhecida?
é preenchida depois?
```

---

# 32. Dados Sensíveis

Não armazenar dados clínicos desnecessários.

A plataforma tem finalidade comercial.

Evitar:

- prontuário;
- exames;
- diagnósticos detalhados;
- imagens clínicas;
- dados médicos sem necessidade.

---

# 33. Soft Delete

Não implementar soft delete em tudo por padrão.

Utilizar apenas quando houver necessidade de histórico ou recuperação.

Em muitos casos, status é suficiente.

---

# 34. Logs

Não registrar em logs:

- senha;
- token;
- `DATABASE_URL`;
- chave OpenRouter;
- dados sensíveis desnecessários.

---

# 35. Performance

Antes de otimizar:

1. identificar query real;
2. medir;
3. revisar índice;
4. revisar join;
5. revisar volume retornado.

Não criar cache ou complexidade antecipadamente.

---

# 36. Drizzle Schema

Separar schemas por domínio quando crescer.

Exemplo:

```text
src/db/schema/
├── clinics.ts
├── users.ts
├── patients.ts
├── opportunities.ts
├── ai-analyses.ts
├── interactions.ts
├── follow-ups.ts
├── playbooks.ts
├── imports.ts
└── audit-logs.ts
```

---

# 37. Naming

Utilizar naming consistente.

Banco:

```text
snake_case
```

TypeScript:

```text
camelCase
```

Não misturar padrões arbitrariamente.

---

# 38. Services

Acesso ao banco deve preferencialmente passar por services ou módulos de domínio.

Exemplo:

```text
src/services/opportunities/
src/services/imports/
src/services/follow-ups/
```

Evitar queries espalhadas por componentes React.

---

# 39. Server-side

Acesso ao banco deve ocorrer somente no servidor.

Nunca expor:

```text
DATABASE_URL
```

ao browser.

---

# 40. Testes

Priorizar testes para:

- cálculo de prioridade;
- importação;
- isolamento de tenant;
- filtros;
- criação de follow-up;
- mudança de status;
- deduplicação.

---

# 41. Checklist de Migration

Antes de considerar uma migration concluída:

```text
[ ] O schema Drizzle foi atualizado?

[ ] A migration foi criada?

[ ] O SQL foi revisado?

[ ] Dados existentes foram considerados?

[ ] Há risco de perda de dados?

[ ] clinic_id foi incluído quando necessário?

[ ] Foreign keys estão corretas?

[ ] Índices necessários foram avaliados?

[ ] Services afetados foram atualizados?

[ ] Tipos foram atualizados?

[ ] Testes relevantes foram executados?
```

---

# 42. Checklist de Query

```text
[ ] A query roda server-side?

[ ] Está filtrada por clinic_id?

[ ] Inputs são parametrizados?

[ ] Retorna apenas os campos necessários?

[ ] Possui paginação quando necessário?

[ ] Ordenação ocorre no banco?

[ ] Agregação ocorre no banco quando apropriado?

[ ] Existe índice útil para o padrão de acesso?
```

---

# 43. Proibições

Não:

- acessar banco diretamente do frontend;
- confiar em `clinic_id` enviado pelo cliente;
- alterar produção manualmente sem migration;
- usar SQL concatenado com input do usuário;
- remover dados sem avaliar impacto;
- criar tabelas redundantes sem necessidade;
- armazenar dados clínicos desnecessários;
- duplicar lógica de negócio em queries e frontend;
- criar índices sem motivo;
- substituir Drizzle por outra ORM sem requisito.

---

# 44. Regra Final

> O banco deve ser simples, íntegro, auditável e seguro, com isolamento rigoroso entre clínicas e migrations versionadas como única forma de evolução estrutural.
