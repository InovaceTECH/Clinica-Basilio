# Migração do Neon para São Paulo

Concluída em 03/09/2026, às 08:30 (America/Sao_Paulo).

| Item | Origem | Destino |
| --- | --- | --- |
| Projeto | Clinica Basilico | Clinica Basilico - São Paulo |
| ID | blue-recipe-22911462 | cool-star-05287655 |
| Região | aws-us-east-2 (Ohio) | aws-sa-east-1 (São Paulo) |
| Branch | main | main |
| Banco | neondb | neondb |
| PostgreSQL | 18 | 18 |

Foram copiados e conferidos os 136 registros das 13 tabelas, incluindo as sete
migrations do Drizzle, usuários e sessão existente. A conferência comparou o
conteúdo integral das tabelas por checksum, colunas, constraints, índices,
enums, sequências, políticas, proprietários e permissões.

A cópia usou `pg_dump` e `pg_restore` com conexões diretas. As gravações na
origem foram bloqueadas durante a transferência e liberadas ao final. Duas
permissões internas de `cloud_admin`, idênticas e já presentes no destino,
foram preservadas sem tentar reaplicá-las.

O `DATABASE_URL` do `.env` local foi atualizado para a conexão com pooling
em São Paulo. As outras variáveis foram preservadas. A conta Vercel conectada
não continha projetos publicados; nenhuma configuração de deploy foi alterada.

Validações após a troca: `npm run db:check` e `npm run auth:check`, incluindo
login, sessão, clínica, perfil, logout e bloqueio do cadastro público.

O projeto de Ohio foi mantido. A configuração anterior está em
`.env.backup-ohio-20260903`, ignorada pelo Git. O dump e o relatório da operação
estão na pasta temporária local `codex-neon-basilico-20260903`, com acesso
restrito ao usuário. Esses arquivos contêm dados ou credenciais e não devem
ser versionados ou compartilhados.

Para voltar a Ohio após novas gravações em São Paulo, primeiro interrompa as
gravações e sincronize os dados recentes. Restaurar apenas a configuração
antiga não transfere os registros criados depois da migração.
