# Auditoria de Privacidade — Sprint 27

Data da revisão: setembro de 2026.

## Escopo revisado

- Persistência de pacientes, oportunidades, importações, interações e follow-ups.
- Leitura e persistência de planilhas CSV/XLSX.
- Contexto enviado ao OpenRouter para análise comercial.
- Logs técnicos e arquivos de configuração.
- Exposição de dados nas telas operacionais.

## Controles aplicados

- A importação persiste somente campos explicitamente mapeados para a finalidade comercial. As linhas originais da planilha não são armazenadas.
- O esquema de pacientes não possui CPF, RG, endereço, data de nascimento ou campos clínicos.
- A análise por IA recebe somente o primeiro nome, tratamento, valor do orçamento, objeção e regras comerciais. Observações livres não são enviadas, pois podem conter dados pessoais ou clínicos sem necessidade para a sugestão.
- O conteúdo comercial enviado ao modelo é tratado como não confiável e delimitado no prompt.
- Os logs do endpoint de IA registram apenas código técnico, modelo, duração e metadados do provedor; não registram prompt, chave ou dados do paciente.
- Arquivos `.env` são ignorados pelo Git; o código não usa variáveis `NEXT_PUBLIC_*` para secrets.
- Dados operacionais são acessados no servidor e filtrados pela clínica da sessão.

## Limites do MVP

- A plataforma é comercial e não deve ser usada como prontuário. Ao preparar planilhas e observações, a equipe deve omitir exames, diagnósticos, imagens e histórico médico.
- Esta revisão técnica não substitui a definição institucional de base legal, retenção, atendimento aos direitos dos titulares e procedimento de exclusão, que devem ser aprovados pela clínica antes de produção.
