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
