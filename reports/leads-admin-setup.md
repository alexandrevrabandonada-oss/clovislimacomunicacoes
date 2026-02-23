# Leads Admin Setup Report

- Generated at: 2026-02-23T00:00:00Z
- Scope: pipeline completo de leads (formulário, API, migração, painel admin, export CSV)

## 1) Contato (Turnstile + UX)

Arquivo:
- `src/components/ContactForm.tsx`

Implementado:
- Cloudflare Turnstile com `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- Token enviado no payload como `turnstileToken`
- UX de sucesso com card visual e botão WhatsApp com mensagem prefill
- Erros humanizados para validação e falha de rede

## 2) Backend (`POST /api/lead`)

Arquivo:
- `src/app/api/lead/route.ts`

Implementado:
- Validação de campos (`name`, `email`, `phone`, `message`)
- Rate limit por IP (janela de 10 minutos)
- Validação server-side do Turnstile via `TURNSTILE_SECRET_KEY`
- Insert em `public.leads` com `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- Campos persistidos:
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
  - `referrer`
  - `page_url`
  - `user_agent`
  - `status` (`new`)
  - `notes` (`null`)
  - `created_at` (default do banco + metadata auxiliar)

## 3) Migrações e RLS

Arquivos:
- `supabase/migrations/20260222233000_leads_pipeline_fields.sql`
- `supabase/migrations/20260222235500_admin_leads_access.sql`

Implementado:
- Colunas extras em `public.leads`:
  - `utm_source`, `utm_medium`, `utm_campaign`
  - `referrer`, `page_url`, `user_agent`
  - `status` (default `'new'`)
  - `notes` (text)
- Constraint de status: `new | contacted | closed | spam`
- RLS/policies:
  - remove políticas de leitura/escrita públicas para `leads`
  - revoke `select/insert/update/delete` de `anon` e `authenticated`
  - grant de acesso para `service_role`

Observação:
- O painel admin acessa `leads` por rotas server (`/api/admin/leads*`) com service role e gate de autenticação/allowlist.

## 4) Admin `/admin/leads`

Arquivos:
- `src/app/admin/leads/page.tsx`
- `src/app/api/admin/leads/route.ts`
- `src/app/api/admin/leads/export/route.ts`

Proteções:
- Login por Supabase Auth (magic link)
- Gate adicional por allowlist `ADMIN_EMAILS` (CSV), validado no backend das rotas admin

Funcionalidades:
- Lista paginada de leads
- Filtros:
  - status (`new/contacted/closed/spam`)
  - período (`7/30/90` dias)
  - busca por `name/email/phone`
- Ações:
  - atualizar status
  - copiar email / WhatsApp
  - modal com mensagem + UTMs + referrer/page/user-agent
  - export CSV com os filtros aplicados

## 5) Verificação executada

Comandos:
- `npm run lint`
- `npm run build`

Resultado:
- Lint: OK (sem erros/warnings)
- Build: OK

## 6) Variáveis de ambiente necessárias

Front:
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (opcional)

Server:
- `TURNSTILE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL` (ou `NEXT_PUBLIC_SUPABASE_URL`)
- `ADMIN_EMAILS` (csv de emails autorizados para admin)

## 7) Segurança / logs

- Nenhum segredo é retornado ao cliente.
- Logs de erro são genéricos e não incluem tokens/chaves.
- Turnstile é validado apenas no servidor.
