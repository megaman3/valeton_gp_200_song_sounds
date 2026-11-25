# Kvalitetsskanning av låtdatan

Genererad 2026-11-25 av `npm run scan-quality` – regelbaserad, utan webb och utan AI.
Poängen visar hur svagt eller motsägelsefullt underlaget är (högre = mer misstänkt), inte hur bra presetet låter.

**1542 låtar skannade** (handskrivna låtar ingår inte): **74 hög risk** (6+), **301 medel** (3–5), **1167 låg** (0–2).

## Regler som slog till

| Regel | Delar |
|---|---|
| sources | 538 |
| confidence | 510 |
| missing | 381 |
| amp-fallback | 267 |
| hedges | 182 |
| generic | 46 |
| type-gain | 10 |
| genre-gain | 1 |

## Motsägelser (1) – troliga fel att rätta först

Regler som tyder på faktiska fel: basutrustning, fel epok, ren del på high gain-modell, gain som inte passar.

| Regel | Artist – Låt | Del | AMP | Skäl |
|---|---|---|---|---|
| genre-gain | Speed – KILL CAP | riff/distorted | UK 45 | metal men bara gain 4.5/10 |

## Topp 30 mest misstänkta låtar (svagast underlag)

| # | Poäng | Artist – Låt | Källa | AMP | Skäl |
|---|---|---|---|---|---|
| 1 | 11 | Speed – KILL CAP | GuitarToneAdapt | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("tom") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; metal men bara gain 4.5/10; gitarr saknas |
| 2 | 10 | Bruno Mars – Why You Wanna Fight? | GuitarToneAdapt | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("tom") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; bara forum-/videokällor; gitarr saknas |
| 3 | 9 | Danko Jones – First Date | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 4 | 9 | Danko Jones – Sticky Situation | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 5 | 9 | Danko Jones – Lovercall | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 6 | 9 | Danko Jones – Full of Regret | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 7 | 9 | Danko Jones – Had Enough | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 8 | 9 | Dizzy Mizz Lizzy – Silverflame | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 9 | 9 | Dizzy Mizz Lizzy – Waterline | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 10 | 9 | Dizzy Mizz Lizzy – Glory | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 11 | 9 | Dizzy Mizz Lizzy – Barbedwired Baby's Dream | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 12 | 9 | Dizzy Mizz Lizzy – Love Is a Loser's Game | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 13 | 9 | Dizzy Mizz Lizzy – Rotator | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 14 | 9 | Gyllene Tider – Sommartider | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 15 | 9 | Gyllene Tider – När vi två blir en | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 16 | 9 | Gyllene Tider – Flickorna på TV2 | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 17 | 9 | Gyllene Tider – (Dansar inte lika bra som) sjömän | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 18 | 9 | Gyllene Tider – Juni, juli, augusti | egen research | Dark Twin | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 19 | 9 | Helen 55 – Dumb Summer | GuitarToneAdapt | Dark Twin | låg säkerhet i källan (0.3); förstärkaren ("tom") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 20 | 9 | Magnus Uggla – Varning på stan | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 21 | 9 | Magnus Uggla – Jag mår illa | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 22 | 9 | Magnus Uggla – Jag och min far | egen research | Dark Twin | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 23 | 9 | Magnus Uggla – Joey Killer | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 24 | 9 | Magnus Uggla – Centralstimulerad | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 25 | 9 | Pugh Rogefeldt – Hog Farm | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 26 | 9 | Stoopi – Six Minutes | GuitarToneAdapt | UK 45, Dark Twin | låg säkerhet i källan (0.3); förstärkaren ("tom") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 27 | 9 | Sunborn – Glacier | GuitarToneAdapt | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("tom") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 28 | 9 | Thomas Ledin – Sommaren är kort | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 29 | 9 | Thomas Ledin – Just nu! | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 30 | 9 | Thomas Ledin – Not Bad at All | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |

## Artister att researcha först

Sorterat på antal låtar med hög risk (vägt ×3) plus medel risk.

| Artist | Låtar | Hög | Medel | Snittpoäng |
|---|---|---|---|---|
| Metallica | 36 | 1 | 26 | 2.8 |
| The Haunted | 7 | 7 | 0 | 8.0 |
| Dizzy Mizz Lizzy | 6 | 6 | 0 | 9.0 |
| Danko Jones | 5 | 5 | 0 | 9.0 |
| Gyllene Tider | 5 | 5 | 0 | 9.0 |
| Magnus Uggla | 5 | 5 | 0 | 9.0 |
| Thomas Ledin | 5 | 5 | 0 | 9.0 |
| Van Morrison | 5 | 5 | 0 | 9.0 |
| Håkan Hellström | 5 | 5 | 0 | 7.0 |
| Sweet | 5 | 5 | 0 | 7.0 |
| Ozzy Osbourne | 23 | 2 | 5 | 2.0 |
| Slayer | 20 | 2 | 5 | 2.2 |
| John Legend | 3 | 3 | 0 | 7.0 |
| Guns N' Roses | 18 | 0 | 6 | 1.9 |
| At the Gates | 6 | 0 | 6 | 3.3 |
| Backyard Babies | 6 | 0 | 6 | 3.0 |
| Danzig | 6 | 0 | 6 | 3.0 |
| T. Rex | 6 | 0 | 6 | 3.0 |
| Blue Öyster Cult | 3 | 2 | 0 | 5.7 |
| The Beatles | 18 | 0 | 5 | 1.9 |
| The Buggles | 4 | 0 | 4 | 5.0 |
| The Soundtrack of Our Lives | 4 | 0 | 4 | 4.0 |
| Bruno Mars | 2 | 1 | 1 | 7.0 |
| DOOM (Mick Gordon) | 3 | 0 | 3 | 5.0 |
| Megadeth | 7 | 0 | 3 | 2.1 |
| Spiritbox | 4 | 0 | 3 | 3.8 |
| Stevie Wonder | 3 | 0 | 3 | 5.0 |
| Prince | 4 | 0 | 3 | 3.5 |
| Speed | 1 | 1 | 0 | 11.0 |
| Helen 55 | 1 | 1 | 0 | 9.0 |
