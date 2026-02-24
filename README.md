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
