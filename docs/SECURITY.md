# Segurança e decisões de arquitetura

## Regras
- RLS é obrigatório em todas as tabelas.
- `service_role` existe apenas no servidor; nunca usar `NEXT_PUBLIC_` para segredos.
- O browser não escolhe role, teacher_id, estado da nota ou identidade do aluno.
- Notas publicadas e emissão de códigos geram auditoria.
- `audit_logs` não aceita UPDATE/DELETE.
- Códigos de estudante são gerados com CSPRNG e armazenados apenas como hash bcrypt.
- O código em claro só existe no retorno da função de emissão e não é persistido.
- Portal deve derivar o aluno da sessão; endpoints não devem aceitar `student_id` para selecionar o próprio perfil.

## Deploy
1. Definir `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `NEXT_PUBLIC_SITE_URL` no ambiente server-side.
2. Nunca commitar .env real.
3. Aplicar migração Supabase e testar RLS com anon/authenticated.
4. Configurar domínio oficial e HSTS no proxy/hosting.
5. Configurar backups cifrados e testar restauração.
6. Rotacionar chaves após qualquer suspeita de exposição.
7. Ativar Dependabot/Renovate e executar `npm audit` antes do deploy.
8. Validar MFA obrigatório para professores/admins.
9. Confirmar retenção/eliminação de dados com a direção e assessoria jurídica.

## Nota
A política legal final deve ser validada por assessoria jurídica em Moçambique. A LGPD brasileira não é automaticamente aplicável.

## Estado desta fase
- A migração para Next.js App Router está em andamento num branch separado para revisão.
- Next.js 16 usa `proxy.ts` no lugar do antigo `middleware.ts`; o Proxy verifica autenticação Supabase para /admin e /professor e exige o cookie de sessão próprio no /portal. A documentação atual do Next.js/Supabase recomenda Proxy para este fluxo. 
- O login do estudante usa sessão opaca própria, com token aleatório armazenado apenas como hash no banco e cookie HttpOnly/Secure/SameSite=Strict.
- O endpoint de inscrição usa Zod no servidor e service role apenas server-side.
- O CMS tem utilitário de sanitização no servidor e whitelist HTTPS para YouTube/YouTube-nocookie.

## Gaps obrigatórios antes de produção
1. Configurar rate limiting distribuído por IP/conta e teto diário; o endpoint atual ainda precisa ser ligado a um mecanismo persistente/Redis/Edge rate limit.
2. Implementar MFA TOTP completo para staff, incluindo challenge/verify e política de recuperação.
3. Implementar CRUD real de estudantes, professores, turmas, disciplinas, horários, materiais e notícias, mantendo os DTOs mínimos.
4. Criar políticas de Storage privado e URLs assinadas de curta duração.
5. Completar testes de violação para cada regra de aceitação da especificação.
6. Validar CORS, CSP com nonce quando necessário, dependências e build em CI.
7. Aplicar a migração ao projeto Supabase correto e confirmar o projeto antes de produção.
8. Rotacionar qualquer segredo que tenha estado no histórico do Git, porque o repositório continha anteriormente um `.env` rastreado.
