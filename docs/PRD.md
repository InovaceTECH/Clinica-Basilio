# PRD — Plataforma Inteligente de Recuperação de Orçamentos

## 1. Visão Geral

A Clínica Odontológica Basilio possui um processo comercial no qual pacientes recebem orçamentos de tratamentos, mas parte deles não realiza o fechamento imediato.

Durante o atendimento, a recepcionista registra no CRM da clínica informações do paciente, dados do orçamento e o motivo informado para não realizar o fechamento.

Entre as objeções mais comuns estão:

- “Não tenho dinheiro agora.”
- “Vou conversar com minha esposa/marido.”
- “Vou pensar e depois te aviso.”
- “Está caro.”
- “Vou pesquisar em outras clínicas.”
- “Agora não é o momento.”
- Falta de resposta após o orçamento.

Atualmente, essas informações ficam registradas no CRM, porém a recuperação desses pacientes depende principalmente da experiência e da iniciativa manual da recepcionista.

O projeto propõe a criação de uma **plataforma inteligente de recuperação de orçamentos odontológicos**, capaz de importar os dados já existentes no CRM, analisar os pacientes e suas objeções e auxiliar a equipe na definição da melhor estratégia de contato.

A IA atuará como um **copiloto comercial**, ajudando a equipe a decidir:

- quem deve ser contatado primeiro;
- qual é a principal barreira para o fechamento;
- como abordar o paciente;
- qual mensagem utilizar;
- qual objetivo deve ter o contato;
- qual deve ser o próximo passo.

---

# 2. Problema

A clínica já investiu tempo e recursos para atrair o paciente, realizar atendimento, avaliação e apresentar um orçamento.

Entretanto, quando o paciente apresenta uma objeção e não fecha o tratamento imediatamente, existe o risco de essa oportunidade ser perdida por falta de acompanhamento estruturado.

Os principais problemas identificados são:

### 2.1 Falta de estratégia de recuperação

A equipe possui informações sobre o motivo da objeção, mas nem sempre sabe qual abordagem utilizar para tentar recuperar o paciente.

### 2.2 Follow-up pouco estruturado

Pacientes podem ficar semanas ou meses sem contato porque não existe um processo claro de acompanhamento.

### 2.3 Dificuldade para priorizar oportunidades

A recepcionista pode possuir dezenas ou centenas de orçamentos pendentes e não saber quais pacientes possuem maior potencial de fechamento.

### 2.4 Abordagens genéricas

Mensagens iguais para todos os pacientes podem ter baixa efetividade porque diferentes objeções exigem diferentes estratégias.

### 2.5 Informações comerciais pouco exploradas

Os motivos das objeções estão registrados no CRM, mas não são transformados em inteligência sobre:

- principais barreiras de venda;
- tratamentos com maior índice de objeção;
- valores com maior dificuldade de fechamento;
- estratégias que mais recuperam pacientes;
- taxa de conversão após follow-up.

---

# 3. Objetivo do Produto

Criar uma plataforma que utilize Inteligência Artificial para transformar os dados dos orçamentos não fechados em **ações práticas de recuperação de pacientes**.

O sistema deve auxiliar a equipe comercial da clínica a:

1. identificar oportunidades de recuperação;
2. classificar as objeções;
3. priorizar os pacientes;
4. definir estratégias personalizadas;
5. gerar abordagens adequadas;
6. acompanhar tentativas de contato;
7. registrar resultados;
8. medir a recuperação dos orçamentos.

---

# 4. Proposta de Valor

> Transformar orçamentos odontológicos não fechados em oportunidades organizadas de recuperação, utilizando Inteligência Artificial para indicar quem abordar, como abordar e qual próximo passo realizar.

O sistema não será apenas um gerador de mensagens.

Ele deverá funcionar como um **assistente comercial inteligente para a recepção da clínica**.

---

# 5. Usuários

## 5.1 Usuário principal — Recepcionista / Comercial

Responsável por:

- importar os dados;
- visualizar oportunidades;
- analisar pacientes;
- consultar sugestões da IA;
- realizar contatos;
- registrar resultados;
- acompanhar follow-ups.

## 5.2 Usuário secundário — Gestor da Clínica

Responsável por acompanhar:

- quantidade de orçamentos em aberto;
- valor financeiro potencial;
- principais objeções;
- recuperação de pacientes;
- desempenho das abordagens;
- taxa de conversão.

---

# 6. Escopo do MVP

O MVP deverá validar se o uso de IA e priorização comercial ajuda a equipe da Clínica Basilico a recuperar pacientes que não fecharam seus tratamentos.

O MVP terá os seguintes módulos:

1. Autenticação
2. Importação de planilha
3. Base de pacientes e orçamentos
4. Classificação de objeções
5. Priorização de leads
6. Análise individual do paciente
7. Estratégia sugerida por IA
8. Mensagem personalizada
9. Gestão de follow-up
10. Registro dos resultados
11. Dashboard básico

---

# 7. Fluxo Principal

```text
CRM da Clínica
      ↓
Exportação CSV/XLSX
      ↓
Upload na plataforma
      ↓
Validação dos dados
      ↓
Pacientes e orçamentos cadastrados
      ↓
IA analisa contexto + objeção
      ↓
Classificação da objeção
      ↓
Priorização da oportunidade
      ↓
Estratégia recomendada
      ↓
Mensagem personalizada
      ↓
Recepcionista realiza contato
      ↓
Resultado é registrado
      ↓
Sistema agenda próximo follow-up
      ↓
Dashboard acompanha conversões
```

---

# 8. Importação de Dados

## 8.1 Formatos suportados

No MVP:

- `.xlsx`
- `.csv`

## 8.2 Dados esperados

A planilha poderá possuir campos como:

- nome do paciente;
- telefone;
- data do atendimento;
- procedimento/tratamento;
- valor do orçamento;
- status do orçamento;
- objeção;
- observações;
- responsável pelo atendimento;
- data do último contato.

Nem todos os campos deverão ser obrigatórios.

---

# 9. Processo de Importação

Ao importar uma planilha, o sistema deverá:

1. identificar as colunas;
2. permitir que o usuário relacione cada coluna ao campo correspondente;
3. validar os dados;
4. informar possíveis erros;
5. mostrar uma prévia;
6. solicitar confirmação;
7. importar os registros.

Exemplo:

```text
Coluna da planilha           Campo do sistema

Cliente                      → Nome
Celular                      → Telefone
Tratamento                   → Procedimento
Valor                        → Valor do orçamento
Motivo                       → Objeção
Observação                   → Observações
```

Isso permitirá utilizar planilhas exportadas de diferentes CRMs sem exigir um formato completamente fixo.

---

# 10. Lista de Oportunidades

A página principal operacional deverá apresentar os orçamentos não fechados.

Cada oportunidade deverá mostrar:

- nome do paciente;
- procedimento;
- valor;
- data do orçamento;
- objeção;
- prioridade;
- status;
- último contato;
- próximo follow-up.

Possíveis filtros:

- prioridade;
- status;
- objeção;
- procedimento;
- período;
- faixa de valor.

---

# 11. Classificação das Objeções

A IA deverá analisar o texto registrado pela recepcionista e associá-lo a uma categoria.

Categorias iniciais:

### Financeira

Exemplos:

- “Não tenho dinheiro agora.”
- “Está caro.”
- “Não consigo pagar essa entrada.”
- “A parcela ficou alta.”

### Decisão compartilhada

Exemplos:

- “Vou falar com minha esposa.”
- “Preciso conversar com meu marido.”
- “Vou conversar com minha família.”

### Indecisão

Exemplos:

- “Vou pensar.”
- “Depois eu te aviso.”
- “Ainda não sei.”

### Comparação

Exemplos:

- “Vou consultar outra clínica.”
- “Vou pesquisar preços.”
- “Recebi outro orçamento.”

### Falta de urgência

Exemplos:

- “Vou deixar para depois.”
- “Agora não é prioridade.”
- “Talvez no próximo mês.”

### Insegurança

Relacionada a dúvidas ou receios referentes ao procedimento.

### Sem resposta

Paciente que deixou de responder após receber o orçamento.

### Outros

Quando nenhuma categoria for suficientemente adequada.

---

# 12. Priorização de Oportunidades

O sistema deverá atribuir uma prioridade para auxiliar a recepcionista.

Categorias:

- Alta
- Média
- Baixa

A prioridade poderá considerar inicialmente:

- valor do orçamento;
- tempo desde o atendimento;
- tempo desde o último contato;
- tipo de objeção;
- histórico de interações;
- sinais de interesse registrados;
- estágio comercial.

Exemplo:

```text
Paciente: João
Tratamento: Implante
Valor: R$ 7.500
Orçamento: 3 dias atrás
Objeção: Forma de pagamento
Prioridade: ALTA
```

No MVP, essa classificação poderá combinar regras predefinidas com análise da IA.

---

# 13. Página de Análise do Paciente

Ao abrir uma oportunidade, a recepcionista deverá visualizar uma página centralizando as informações relevantes.

## Informações do paciente

- nome;
- telefone;
- procedimento;
- valor;
- data do orçamento;
- objeção;
- observações;
- histórico.

## Análise da IA

A IA deverá apresentar uma estrutura organizada.

### Objeção identificada

Exemplo:

> Financeira

### Análise do contexto

Breve interpretação da situação.

### Objetivo do próximo contato

Exemplo:

> Descobrir se a principal dificuldade está relacionada ao valor total, entrada ou valor das parcelas.

### Estratégia recomendada

Orientação prática para a recepcionista.

### Abordagem sugerida

Explicação de como conduzir a conversa.

### Mensagem sugerida

Mensagem personalizada que poderá ser copiada.

### Próxima ação recomendada

Exemplo:

> Caso demonstre interesse, verificar quais condições de pagamento disponíveis na clínica podem se adequar à situação.

---

# 14. Geração de Abordagem com IA

A IA deverá considerar:

- nome do paciente;
- tratamento;
- valor;
- objeção;
- observações;
- histórico de contatos;
- tempo desde o orçamento;
- informações comerciais cadastradas pela clínica.

A resposta deverá ser:

- curta;
- clara;
- humana;
- profissional;
- não agressiva;
- não manipulativa;
- contextualizada.

A IA não deverá inventar:

- descontos;
- condições de pagamento;
- benefícios;
- garantias;
- informações sobre tratamentos;
- disponibilidade;
- informações clínicas.

Qualquer condição comercial deverá estar previamente registrada no sistema.

---

# 15. Playbooks de Objeções

A plataforma deverá possuir estratégias base para cada tipo de objeção.

Exemplo:

## Objeção financeira

Objetivo:

Identificar qual elemento financeiro está impedindo o fechamento.

Possíveis perguntas:

- O maior impeditivo seria o valor total ou a forma de pagamento?
- Uma condição de pagamento diferente ajudaria?

A IA utilizará esse playbook como base e adaptará a estratégia para cada situação.

---

# 16. Histórico de Interações

Cada oportunidade deverá possuir uma linha do tempo.

Exemplo:

```text
05/08
Orçamento enviado

07/08
Paciente informou que precisava conversar com a esposa

09/08
Contato realizado pelo WhatsApp

09/08
Paciente solicitou retorno na próxima semana

16/08
Follow-up programado
```

---

# 17. Registro de Contato

Depois de realizar uma interação, a recepcionista deverá registrar o resultado.

Possíveis resultados:

- não respondeu;
- pediu retorno;
- ainda está pensando;
- interessado;
- negociação em andamento;
- agendou retorno;
- agendou procedimento;
- fechou tratamento;
- desistiu;
- não deseja contato.

O usuário poderá adicionar observações.

---

# 18. Próximo Follow-up

Após o registro de uma interação, o sistema deverá permitir definir:

- data do próximo contato;
- observação;
- motivo do follow-up.

Exemplo:

```text
Retornar em: 25/08/2026

Motivo:
Paciente informou que receberá salário nesta data.
```

---

# 19. Status da Oportunidade

Status iniciais:

- Novo
- A analisar
- Contato pendente
- Contatado
- Aguardando paciente
- Follow-up agendado
- Em negociação
- Recuperado
- Perdido
- Não contatar

---

# 20. Dashboard

O dashboard deverá apresentar uma visão simples da operação.

## Indicadores principais

### Orçamentos em aberto

Quantidade de oportunidades atualmente abertas.

### Valor potencial

Soma dos valores dos orçamentos ainda recuperáveis.

### Orçamentos recuperados

Quantidade de pacientes que fecharam após o processo de recuperação.

### Receita recuperada

Valor total dos tratamentos recuperados.

### Taxa de recuperação

```text
orçamentos recuperados
----------------------- × 100
oportunidades trabalhadas
```

---

# 21. Análise das Objeções

O dashboard deverá permitir visualizar:

- principais objeções;
- quantidade por categoria;
- valor potencial associado;
- taxa de recuperação por objeção.

Exemplo:

```text
Financeira                38%
Vou pensar                24%
Decisão com parceiro      16%
Comparação                12%
Outros                    10%
```

---

# 22. Funil de Recuperação

Exemplo:

```text
120 orçamentos em aberto
        ↓
85 oportunidades trabalhadas
        ↓
57 pacientes responderam
        ↓
32 entraram em negociação
        ↓
19 tratamentos recuperados
```

---

# 23. Inteligência Comercial Futura

À medida que forem registrados resultados, o sistema poderá futuramente analisar padrões.

Exemplos:

> Pacientes com objeção financeira contatados até 3 dias após o orçamento possuem maior taxa de recuperação.

> Pacientes que dizem “vou pensar” respondem melhor a uma segunda abordagem após determinado intervalo.

> Tratamentos do tipo X apresentam maior índice de objeções financeiras.

Essas funcionalidades não fazem parte obrigatoriamente do primeiro MVP, mas os dados deverão ser estruturados desde o início para permitir essas análises no futuro.

---

# 24. Regras Comerciais da Clínica

A plataforma deverá permitir que informações comerciais sejam previamente cadastradas.

Exemplos:

- formas de pagamento;
- parcelamento permitido;
- descontos autorizados;
- políticas comerciais;
- diferenciais da clínica;
- orientações sobre atendimento.

A IA somente poderá utilizar informações registradas.

Isso evita que o modelo invente condições comerciais inexistentes.

---

# 25. Segurança e Privacidade

Como a plataforma poderá trabalhar com informações pessoais e potencialmente informações relacionadas à saúde, deverá seguir princípios de proteção de dados desde sua concepção.

Princípios:

- armazenar somente informações necessárias;
- controle de acesso;
- autenticação;
- proteção dos dados;
- registro de ações importantes;
- limitar informações enviadas à IA;
- evitar exposição desnecessária de informações do paciente;
- permitir exclusão de registros quando necessário.

O projeto deverá considerar os requisitos aplicáveis da LGPD durante sua implementação.

---

# 26. Princípios Éticos da IA

A IA deverá atuar como ferramenta de assistência, não como mecanismo de pressão sobre pacientes.

As abordagens não deverão:

- criar falsas urgências;
- inventar riscos;
- utilizar medo como estratégia;
- pressionar financeiramente;
- manipular vulnerabilidades;
- fornecer diagnósticos;
- substituir orientação clínica;
- inventar informações comerciais.

A decisão final sobre o contato deverá permanecer com a equipe da clínica.

---

# 27. Fora do Escopo do MVP

Inicialmente não serão implementados:

- chatbot automático conversando diretamente com pacientes;
- envio automático pelo WhatsApp;
- integração direta com WhatsApp Business API;
- integração automática com o CRM;
- ligações automáticas;
- diagnóstico odontológico por IA;
- recomendação clínica;
- análise de exames;
- automações comerciais totalmente autônomas;
- aplicativo mobile nativo;
- treinamento de modelo próprio.

O MVP será uma plataforma web de apoio à equipe.

---

# 28. Possíveis Evoluções

Após validação do MVP:

### Integração com CRM

Sincronizar automaticamente novos orçamentos e resultados.

### WhatsApp

Enviar mensagens diretamente pela plataforma.

### Automação de follow-up

Criar sequências de acompanhamento.

### Templates inteligentes

Salvar estratégias que apresentam maior conversão.

### IA baseada no histórico da clínica

Utilizar resultados anteriores para recomendar abordagens.

### Score de conversão

Calcular uma probabilidade aproximada de recuperação.

### Segmentação

Identificar grupos de pacientes com comportamentos semelhantes.

### Análise de desempenho

Comparar:

- períodos;
- atendentes;
- procedimentos;
- objeções;
- estratégias.

---

# 29. Páginas do MVP

## Autenticação

- Login

## Dashboard

- visão geral;
- indicadores;
- objeções;
- funil;
- receita potencial;
- receita recuperada.

## Oportunidades

- lista de pacientes;
- filtros;
- busca;
- prioridade;
- status.

## Paciente / Oportunidade

- dados;
- orçamento;
- objeção;
- análise da IA;
- estratégia;
- mensagem;
- histórico;
- próximo follow-up.

## Importar dados

- upload;
- mapeamento de colunas;
- validação;
- prévia;
- confirmação.

## Follow-ups

- contatos previstos;
- atrasados;
- futuros.

## Playbooks

- tipos de objeção;
- estratégias aprovadas.

## Configurações

- dados da clínica;
- regras comerciais;
- informações utilizadas pela IA.

---

# 30. Navegação Principal

Uma sugestão inicial:

```text
Dashboard

Oportunidades

Follow-ups

Importar

Playbooks

Configurações
```

---

# 31. Métricas de Validação do MVP

O MVP deverá permitir medir se a solução realmente gera valor.

Principais métricas:

### Taxa de utilização

Percentual das oportunidades analisadas pela equipe.

### Taxa de contato

Quantidade de oportunidades em que houve tentativa de recuperação.

### Taxa de resposta

Percentual de pacientes que responderam ao follow-up.

### Taxa de recuperação

Percentual de oportunidades convertidas após utilização da plataforma.

### Receita recuperada

Valor financeiro associado aos tratamentos recuperados.

### Tempo médio até recuperação

Tempo entre o orçamento inicial e o fechamento.

---

# 32. Hipótese Principal

> Se a equipe da clínica receber orientação personalizada sobre quais pacientes abordar, como abordar e quando realizar follow-up, será possível aumentar a recuperação de orçamentos que atualmente seriam perdidos.

---

# 33. Critérios de Sucesso Inicial

O produto será considerado validado quando for possível demonstrar que:

1. a clínica consegue importar seus dados sem depender de integração complexa;
2. a IA consegue interpretar adequadamente as principais objeções;
3. a recepcionista considera as estratégias sugeridas úteis;
4. o sistema reduz a dificuldade de decidir quem contatar;
5. a equipe registra os resultados;
6. pacientes são recuperados através das abordagens;
7. é possível mensurar financeiramente o resultado.

---

# 34. Filosofia do MVP

O objetivo inicial não é substituir o CRM da Clínica Basilico.

O CRM continuará sendo responsável pelo cadastro e controle principal dos pacientes.

A nova plataforma funcionará inicialmente como uma **camada especializada de inteligência comercial e recuperação de orçamentos**.

```text
CRM
↓
Registra o paciente e orçamento

Plataforma de Recuperação
↓
Analisa a oportunidade

IA
↓
Recomenda estratégia

Recepcionista
↓
Executa o contato

Sistema
↓
Registra e mede o resultado
```

Essa separação permite validar rapidamente o valor da solução sem necessidade de substituir os sistemas já utilizados pela clínica.

---

# 35. Definição Resumida do Produto

**A plataforma é um assistente inteligente para recuperação de orçamentos odontológicos que transforma dados de pacientes e suas objeções em prioridades, estratégias de abordagem, mensagens personalizadas e ações de follow-up, permitindo que a clínica recupere oportunidades e acompanhe financeiramente os resultados.**
