# Clóvis Lima Comunicações

## Import do portfólio (sem tropeço)

1. Coloque as imagens em `public/portfolio/`:
   - Exemplo: `public/portfolio/01.jpg`, `public/portfolio/02.jpg`
   - Extensões suportadas: `.jpg`, `.jpeg`, `.png`, `.webp`

2. Edite `public/portfolio/manifest.json`:
   - Cada entrada deve apontar para um arquivo existente.
   - Exemplo:

```json
{
  "defaultType": "other",
  "items": {
    "01.jpg": {
      "title": "Obra 01",
      "type": "other",
      "content_warning": null
    }
  }
}
```

3. Valide a pasta e o manifest:

```bash
npm run portfolio:check
```

4. (Opcional) Simule o import sem enviar nada:

```bash
node scripts/import-portfolio.mjs --dry-run
```

5. Execute o import real:

```bash
npm run import:portfolio
```

6. Veja o relatório:
   - `scripts/import-report.md`

## Variáveis de Ambiente Necessárias (Vercel)

Para o adequado funcionamento do sistema, as seguintes variáveis de ambiente devem estar configuradas na Vercel (em Preview e Production):

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Chave pública do Cloudflare Turnstile (habilita o envio de formulário na UI).
- `TURNSTILE_SECRET_KEY`: Chave secreta do Cloudflare Turnstile (validação de bot na API).
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: Número do WhatsApp para fallback de contatos (ex: `5511999999999`).
- `SUPABASE_URL` (ou `NEXT_PUBLIC_SUPABASE_URL`): URL do projeto no Supabase para envio de leads.
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase, necessária para gravar leads no DB.
