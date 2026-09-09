# PostgreSQL local

O ambiente local usa PostgreSQL 16 em `127.0.0.1:5432`, banco e role exclusivos `clinica_basilio_local`. A configuração privada está em `.env`, ignorado pelo Git. Nenhum dado de paciente foi adicionado.

## Iniciar

Com o PostgreSQL em execução:

```sh
npm install
npm run db:migrate
npm run dev -- --webpack --hostname 127.0.0.1 --port 3002
```

Abra http://localhost:3002. O endereço precisa corresponder a `BETTER_AUTH_URL` no `.env`.

## Configuração

- `DATABASE_DRIVER=postgres`: usa o driver TCP `pg`, com até cinco conexões e transações locais.
- `DATABASE_DRIVER=neon` (padrão): mantém o driver Neon HTTP usado no ambiente remoto.
- `DATABASE_URL`: conexão ao banco selecionado.
- `BETTER_AUTH_SECRET`: segredo próprio deste ambiente.
- `BETTER_AUTH_URL=http://localhost:3002`.

O gestor local foi criado pelo script `auth:bootstrap`, com senha armazenada como hash pelo Better Auth. As credenciais de acesso são entregues separadamente e não devem ser versionadas. Cadastros públicos continuam desativados.

Em um banco novo, configure `AUTH_BOOTSTRAP_CLINIC_NAME`, `AUTH_BOOTSTRAP_USER_NAME`, `AUTH_BOOTSTRAP_EMAIL` e `AUTH_BOOTSTRAP_PASSWORD` e execute `npm run auth:bootstrap`. O script recusa e-mails já existentes.

## Gravações atômicas

`executeBatch(connection => [...])` preserva a execução atômica nos dois drivers: batch HTTP no Neon e transação no PostgreSQL local. Construa as consultas usando a conexão recebida no callback, inclusive os registros de auditoria, para não executar fora da transação.

## Verificação

```sh
npm run db:check
npm run db:batch:check
npm run auth:check -- --http-url=http://localhost:3002
npm run tenant:check
npm run imports:persistence:check
npm run interactions:check
npm run follow-ups:check
```

Esses testes criam registros identificados por UUID e removem os próprios registros ao terminar.

As funções de IA continuam dependendo de `OPENROUTER_API_KEY` e `OPENROUTER_MODEL`; o banco local não substitui esse serviço.
