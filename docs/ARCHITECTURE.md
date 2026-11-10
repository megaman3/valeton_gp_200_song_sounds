# Arkitektur – GP-200 Tone Generator

Appen genererar Valeton GP-200-inställningar **helt utan AI**. All kunskap ligger i JSON-filer;
Tone Engine (TypeScript) översätter, slår ihop och validerar.

```
  GuitarToneAdapt-dataset (CC BY 4.0)          songs.json (handskrivna)
          │  npm run import:gta                      │
          ▼                                          │
  external/guitartoneadapt.json                      │ profil + overrides
  (förstärkare, rattar 0–10, effekter, källor)       │
          │                                          ▼
          ▼                                   tone-profiles.json
  ToneTranslator  ◄── mapping-rules.json             │
  (regler: förstärkare/kabinett/effekter)            │
          │                                          │
          └───────────────► PresetGenerator ◄────────┘
                                   │
                                   ▼
             GP200Validator ◄── gp200-models.json (din lista, CLAUDE.md)
                            ◄── gp200-manual.json (Valetons manual v1.8.0)
                                   │
                                   ▼
     GeneratedPreset: alltid 10 block (NR→DST→AMP→CAB→EQ→DLY→RVB→PRE→WHA→MOD)
     + förklaring av varje beslut, källa och säkerhet
                                   │
                    React-UI / formatPreset() / CLI
```

## Datafiler (`src/data/`)

| Fil | Innehåll | Källa |
| --- | --- | --- |
| `gp200-models.json` | Modellnamn per block | **Din lista i CLAUDE.md §13** – whitelist |
| `gp200-manual.json` | Per modell: förebild, typ, parametrar (namn + switch/val/ratt), manualsida, rekommenderat kabinett | Valeton GP-200 manual, firmware 1.8.0 |
| `mapping-rules.json` | Regler originalutrustning → GP-200-modell (`amp`, `cab`, `effects`), med `basis: manual` (förebilden står i manualen) eller `interpretation` (närmaste val) | Projektet |
| `external/guitartoneadapt.json` | 1 240 normaliserade gitarrljud (basljud filtreras bort) | [GuitarToneAdapt](https://guitartoneadapt.com), CC BY 4.0 |
| `songs.json` + `tone-profiles.json` | Handskrivna presets – har företräde före importerade låtar med samma artist + titel | Projektet |

### Vad som är bekräftat och vad som är rekommendation

- **Bekräftat:** modellnamn (din lista, kontrollerad mot manualen), vilka parametrar varje modell har och vad modellen bygger på (manualen), EQ-banden −50…+50 (CLAUDE.md §12).
- **Rekommendation:** alla värden. Manualen anger inte intervall för vridreglage – de antas vara 0–100 och visas med `*` i appen.
- **Kända luckor i manualen:** Club, Concert, Arena (RVB) och Triangle Trem (MOD) beskrivs inte. DLY-tabellen på s. 62–65 är förskjuten en rad i manualen; katalogen är rättad efter modellnamnen.

## Översättningen (`src/engine/ToneTranslator.ts`)

1. **Förstärkare:** texten delas i segment (`into`, `with`, `,`, ` / ` …). Kabinettssegment (4x12, cab, speakers …) skiljs ut. Första segmentet med en regelträff vinner; inom segmentet vinner första regeln i filordning (specifika modeller står före generiska märken). Regeln kan välja kanal efter gain (`byGain`) och ge 60–70-talsinspelningar en vintage-modell (`vintage`). Hittas inget söks förstärkare i effektlistan, och sist används en tumregel efter gain, era och genre.
2. **Rattar:** 0–10 → 0–100. Gain skalas ned för Drive- (×0,9) och Hi Gain-modeller (×0,75). Bara parametrar som modellen har enligt manualen sätts. Saknar modellen Middle läggs originalets mellanregister på EQ 400/800 Hz.
3. **Kabinett:** angivet kabinett → regel, annars modellens `defaultCab` (motsvarar Auto CAB Match).
4. **Effekter:** för varje block vinner första regeln (i filordning) som matchar någon effekt. Overdrive framför high gain blir ren boost (`paramsHighGain`). "light/subtle" sänker mixen. Effekter som inte får plats (blocket upptaget) eller saknar motsvarighet förklaras i anteckningarna.
5. **NR/RVB:** noise gate vid gain ≥ 6; reverb från förstärkarens reverb-ratt (Spring för Fender-modeller).

Varje beslut skrivs till `translationNotes` och visas under "Så valdes inställningarna".

## Signalkedja

GP-200:s standardordning (manualen s. 9): PRE → WAH → DST → AMP → NR → CAB → EQ → MOD → DLY → RVB → VOL.
Presentationsordningen i appen följer CLAUDE.md §4 och påverkar inte ljudet.

## Uppdatera och utöka

| Uppgift | Gör så här |
| --- | --- |
| Hämta senaste datasetet | `npm run import:gta` |
| Ny förstärkar-/effektregel | Lägg till i `mapping-rules.json` (specifika regler före generiska) |
| Handskriven låt | `songs.json` (+ ev. profil i `tone-profiles.json`) |
| Kontrollera allt | `npm run validate-data && npm test` |

## Färdplan

| Version | Status | Funktion |
| --- | --- | --- |
| V1 | ✅ | Sök bland låtar och generera presets |
| V2 | ✅ | Regelbaserad översättning av originalutrustning (manualbaserad katalog) |
| V3 | 🟡 påbörjad | Externa källor: GuitarToneAdapt importerad. Nästa: GuitarPatches/Preset Forge (färdiga GP-200-patchar), KnobMastr – kräver villkorsgranskning per sajt |
| V4 | – | Import/export av GP-200-presetfiler (.prst), om formatet kan verifieras |
| V5 | – | Personliga justeringar och jämförelser |
