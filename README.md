# GP-200 Tone Generator

Webbapp som ger färdiga inställningar för **Valeton GP-200** för omkring 1 500 låtar och 20 ljudtyper –
regelbaserat, utan AI och utan backend. Originalljuden (förstärkare, rattar, effekter) kommer från
GuitarToneAdapts dataset och från egen research med källor per låt, och översätts till de modeller och
parametrar som finns i din GP-200 enligt Valetons manual.

**Appen online:** https://megaman3.github.io/valeton_gp_200_song_sounds/

Skriv låt, artist eller **ljudtyp**, och välj med musen eller med **↑ / ↓ + Enter** (Esc rensar sökningen).

- **Ljudtyper:** 20 färdiga grundljud som "Jazz clean", "Texas blues", "60-tals fuzz", "Djent / modern metal" och
  "Ambient shimmer". Sök på t.ex. `clean`, `blues`, `high gain`, `fuzz` eller `ljudtyp` (visar alla), eller välj en
  ljudtyp på startsidan. Ljudtyperna är profilerna i `src/data/tone-profiles.json`.
- **Favorites:** tryck på ☆ vid en låt eller ljudtyp för att spara den under fliken *★ Favorites*. Favoriterna
  sparas bara lokalt i webbläsaren på den enhet du använder (ingen backend, fungerar offline) och försvinner om du
  rensar webbplatsdata.
- **Offline:** appen är en PWA. Öppna den en gång med nät, så fungerar den sedan utan nät.
  Installera den på hemskärmen: iPhone (Safari) → Dela → *Lägg till på hemskärmen*; Android (Chrome) →
  menyn → *Installera app*. Nya versioner hämtas automatiskt nästa gång appen öppnas med nät.

## Kom igång

```bash
npm install
npm run dev            # starta appen lokalt (http://localhost:5173, eller nästa lediga port)
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
  data/        JSON: din modellista, manualkatalog, mappningsregler, låtar, ljudprofiler (= ljudtyper)
    external/  Importerade data (GuitarToneAdapt)
    research/  Egen research för artister/låtar som saknas i externa källor (byggs av tools/build-research.py)
  assets/      Bilder (bakgrund, logga)
  engine/      Tone Engine: validator, translator, generator, sökning, textformat
  components/  React-UI: SongSearch, FavoritesList, EffectChain, PresetView, OriginalGearView
  hooks/       useFavorites – favoriter i localStorage
  types/       Delade TypeScript-typer
public/        PWA-ikoner (appikon på hemskärmen)
tests/         Vitest – bl.a. att inget preset använder en modell som saknas i GP-200
tools/         CLI: import-guitartoneadapt, validate-data, preset-cli, build-research.py
docs/          ARCHITECTURE.md – dataflöde, hur man lägger till låtar, färdplan
```

Se [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) för detaljer.

## Teknik

React + TypeScript + Vite + Tailwind CSS, vite-plugin-pwa (offline), Vitest, GitHub Actions → GitHub Pages
(deploy sker vid push till `main` och publiceras på https://megaman3.github.io/valeton_gp_200_song_sounds/;
Pages måste vara aktiverat med källa "GitHub Actions" under Settings → Pages).

## Principer (från CLAUDE.md)

- `src/data/gp200-models.json` är sanningskällan – validatorn stoppar alla andra modellnamn.
- Alla tio block visas alltid, i ordningen NR → DST → AMP → CAB → EQ → DLY → RVB → PRE → WHA → MOD.
- EQ-band (125 Hz, 400 Hz, 800 Hz, 1.6 kHz, 4 kHz) ligger inom −50…+50.
- Obekräftade parametervärden märks som rekommenderade startvärden.

## Datakällor och licens

- **Låtdata:** [GuitarToneAdapt – Guitar Tone Dataset](https://github.com/Pera-Labs/guitar-tone-dataset),
  © GuitarToneAdapt (https://guitartoneadapt.com), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
  Datan är normaliserad (basljud borttagna) och översatt till GP-200-modeller av detta projekt.
- **Egen research:** `src/data/research/research-tones.json` – originalutrustning från intervjuer och
  rig-genomgångar (källa anges per låt). Utrustningen är källbelagd; rattlägen per låt är tolkningar och
  märks med lägre säkerhet. Finns låten redan i GuitarToneAdapt läggs researchdelarna till som extra delar.
  Lägg till fler artister i `tools/build-research.py` och kör
  `python3 tools/build-research.py src/data/research/research-tones.json`.
- **Modeller och parametrar:** Valeton GP-200 Online Manual, firmware v1.8.0.
