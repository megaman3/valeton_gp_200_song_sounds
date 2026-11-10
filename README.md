# GP-200 Tone Generator

Webbapp som ger färdiga inställningar för **Valeton GP-200** för över 1 100 låtar –
regelbaserat, utan AI och utan backend. Originalljuden (förstärkare, rattar, effekter) kommer från
GuitarToneAdapts dataset och översätts till de modeller och parametrar som finns i din GP-200 enligt Valetons manual.

## Kom igång

```bash
npm install
npm run dev            # starta appen lokalt (http://localhost:5173)
npm test               # kör testerna (Vitest)
npm run validate-data  # kontrollera att all data bara använder modeller/parametrar som finns i din GP-200
npm run import:gta     # hämta senaste GuitarToneAdapt-datasetet
npm run preset -- "paranoid"             # skriv ut preset i terminalen
npm run preset -- "back in black" lead   # en specifik del
npm run build          # bygg för produktion (dist/)
```

## Struktur

```
src/
  data/        JSON: din modellista, manualkatalog, mappningsregler, låtar, profiler
    external/  Importerade data (GuitarToneAdapt)
  engine/      Tone Engine: validator, translator, generator, sökning, textformat
  components/  React-UI: SongSearch, EffectChain, PresetView, OriginalGearView
  types/       Delade TypeScript-typer
tests/         Vitest – bl.a. att inget preset använder en modell som saknas i GP-200
tools/         CLI: import-guitartoneadapt, validate-data, preset-cli
docs/          ARCHITECTURE.md – dataflöde, hur man lägger till låtar, färdplan
```

Se [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) för detaljer.

## Teknik

React + TypeScript + Vite + Tailwind CSS, Vitest, GitHub Actions → GitHub Pages
(deploy sker vid push till `main`; aktivera Pages med källa "GitHub Actions" i repo-inställningarna).

## Principer (från CLAUDE.md)

- `src/data/gp200-models.json` är sanningskällan – validatorn stoppar alla andra modellnamn.
- Alla tio block visas alltid, i ordningen NR → DST → AMP → CAB → EQ → DLY → RVB → PRE → WHA → MOD.
- EQ-band (125 Hz, 400 Hz, 800 Hz, 1.6 kHz, 4 kHz) ligger inom −50…+50.
- Obekräftade parametervärden märks som rekommenderade startvärden.

## Datakällor och licens

- **Låtdata:** [GuitarToneAdapt – Guitar Tone Dataset](https://github.com/Pera-Labs/guitar-tone-dataset),
  © GuitarToneAdapt (https://guitartoneadapt.com), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
  Datan är normaliserad (basljud borttagna) och översatt till GP-200-modeller av detta projekt.
- **Modeller och parametrar:** Valeton GP-200 Online Manual, firmware v1.8.0.
