# Kvalitetsskanning av låtdatan

Genererad 2026-11-25 av `npm run scan-quality` – regelbaserad, utan webb och utan AI.
Poängen visar hur svagt eller motsägelsefullt underlaget är (högre = mer misstänkt), inte hur bra presetet låter.

**1547 låtar skannade** (handskrivna låtar ingår inte): **70 hög risk** (6+), **328 medel** (3–5), **1149 låg** (0–2).

## Regler som slog till

| Regel | Delar |
|---|---|
| sources | 539 |
| confidence | 504 |
| missing | 386 |
| amp-fallback | 267 |
| hedges | 183 |
| generic | 39 |
| type-gain | 10 |
| era | 9 |
| bass-gear | 6 |
| bass-amp-model | 5 |
| rickenbacker | 3 |
| genre-gain | 1 |

## Motsägelser (34) – troliga fel att rätta först

Regler som tyder på faktiska fel: basutrustning, fel epok, ren del på high gain-modell, gain som inte passar.

| Regel | Artist – Låt | Del | AMP | Skäl |
|---|---|---|---|---|
| bass-amp-model | LINKIN PARK – Given Up | distorted/distorted | Classic Bass | gitarrdelen fick basförstärkaren Classic Bass (original "Ampeg SVT-CL head through Ampeg 8x10 cabinets") |
| bass-amp-model | Nirvana – Breed | distorted/distorted | Classic Bass | gitarrdelen fick basförstärkaren Classic Bass (original "Ampeg SVT (likely SVT-II or SVT Classic, era-correct for Nevermind sessions)") |
| bass-amp-model | Steely Dan – Reelin in the Years | solo/distorted | Classic Bass | gitarrdelen fick basförstärkaren Classic Bass (original "Ampeg SVT (a bass amp!) — 1963 Fender Stratocaster with a PAF humbucker in the neck") |
| bass-amp-model | Tame Impala – Let It Happen | distorted/distorted | Classic Bass | gitarrdelen fick basförstärkaren Classic Bass (original "Unknown studio amp (likely Ampeg SVT or similar vintage-style tube amp, but not confirmed)") |
| bass-amp-model | Type O Negative – Black No. 1 | clean/clean | Classic Bass | gitarrdelen fick basförstärkaren Classic Bass (original "Ampeg SVT (likely SVT Classic, 1970s-80s era, studio use)") |
| bass-gear | Dire Straits – Money for Nothing | riff/distorted | UK 800 | basutrustning i gitarrens data (gitarr "1958 Gibson Les Paul Standard", förstärkare "Laney amplifier (exact model not confirmed, but cited as used in studio); some sources mention Ampeg SVT-VR or Marshall JTM45, but Laney is most directly cited for the studio riff recording") |
| bass-gear | Local H – Bound for the Floor | riff/distorted | Match OD | basutrustning i gitarrens data (gitarr "Gibson SG Standard (modified with additional bass pickup for lower strings)", förstärkare "Matchless Superchief 120 Head into Marshall cabinets (guitar); Ampeg bass amp (for bass pickup); Vox AC15 (sometimes blended live, but not confirmed for studio)") |
| bass-gear | Red Hot Chile Peppers – Give it Away | clean/clean | L-Star CL | basutrustning i gitarrens data (gitarr "", förstärkare "Gallien‑Krueger 800RB head with Mesa/Boogie bass cabinet") |
| bass-gear | Royal Blood – Figure It Out | riff/distorted | UK 800 | basutrustning i gitarrens data (gitarr "bass + octave/fuzz (Mike Kerr)", förstärkare "Marshall / Mesa") |
| bass-gear | Royal Blood – Little Monster | riff/distorted | UK 800 | basutrustning i gitarrens data (gitarr "bass + octave/fuzz (Mike Kerr)", förstärkare "Marshall / Mesa") |
| bass-gear | The Beatles – She Loves You (Mono Version) | riff/distorted | Foxy 30TB | basutrustning i gitarrens data (gitarr "1962 Höfner 500/1 Violin Bass (Paul McCartney), 1962 Gretsch Duo Jet (George Harrison), 1958 Rickenbacker 325 (John Lennon)", förstärkare "Vox AC30 (all guitars, studio recording)") |
| era | Cheap Trick – He's a Whore | riff/distorted | Juice R100 | Juice R100 (modern high gain) för en inspelning från 1970-talet |
| rickenbacker | Creedence Clearwater Revival – Born on the Bayou | riff/distorted | Dark DLX | "Rickenbacker" utan modellnummer – kan vara en basgitarr (gitarr "Rickenbacker (John Fogerty)") |
| era | Lynyrd Skynyrd – Free Bird | riff/distorted | EV 51 | EV 51 (modern high gain) för en inspelning från 1970-talet |
| era | Lynyrd Skynyrd – Sweet Home Alabama | riff/distorted | EV 51 | EV 51 (modern high gain) för en inspelning från 1970-talet |
| era | Lynyrd Skynyrd – Simple Man | riff/distorted | EV 51 | EV 51 (modern high gain) för en inspelning från 1970-talet |
| era | Santana – Europa | solo/distorted | Mess2C+ 1 | Mess2C+ 1 (modern high gain) för en inspelning från 1970-talet |
| era | Santana – Oye Como Va | riff/distorted | Mess2C+ 1 | Mess2C+ 1 (modern high gain) för en inspelning från 1970-talet |
| era | Santana – Samba Pa Ti | riff/distorted | Mess2C+ 1 | Mess2C+ 1 (modern high gain) för en inspelning från 1970-talet |
| era | Santana – Black Magic Woman | solo/overdriven | Mess4 LD | Mess4 LD (modern high gain) för en inspelning från 1970-talet |
| genre-gain | Speed – KILL CAP | riff/distorted | UK 45 | metal men bara gain 4.5/10 |
| rickenbacker | The Beatles – I Feel Fine | riff/overdriven | Foxy 30TB | "Rickenbacker" utan modellnummer – kan vara en basgitarr (gitarr "Gretsch / Rickenbacker") |
| era | The Knack – My Sharona | riff/distorted | Mess4 LD | Mess4 LD (modern high gain) för en inspelning från 1970-talet |
| rickenbacker | Tom Petty – Runnin Down a Dream | riff/distorted | UK SLP | "Rickenbacker" utan modellnummer – kan vara en basgitarr (gitarr "Fender / Rickenbacker") |
| type-gain | Beck – Loser | riff/distorted | UK SLP | distad del men bara gain 3/10 |
| type-gain | Boredline – Lounge | riff/distorted | Dark Twin | distad del men bara gain 3/10 |
| type-gain | David Guetta – Titanium (feat. Sia) | riff/distorted | Dark Twin | distad del men bara gain 3/10 |
| type-gain | Eagles – Take It Easy | riff/distorted | Dark Twin | distad del men bara gain 3/10 |
| type-gain | Gov't Mule – Soulshine | solo/distorted | UK SLP | distad del men bara gain 3/10 |
| type-gain | Indochine – LAventurier | riff/distorted | Dark Twin | distad del men bara gain 3/10 |
| type-gain | John Mayer – Gravity | riff/distorted | Match CL | distad del men bara gain 3/10 |
| type-gain | late night drive home – Stress Relief | riff/distorted | Dark DLX | distad del men bara gain 3/10 |
| type-gain | Led Zeppelin – Kashmir | riff/distorted | Knights CL+ | distad del men bara gain 3/10 |
| type-gain | Red Hot Chili Peppers – Under the Bridge | riff/distorted | UK 900 | distad del men bara gain 3/10 |

## Topp 30 mest misstänkta låtar (svagast underlag)

| # | Poäng | Artist – Låt | Källa | AMP | Skäl |
|---|---|---|---|---|---|
| 1 | 9 | Danko Jones – First Date | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 2 | 9 | Danko Jones – Sticky Situation | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 3 | 9 | Danko Jones – Lovercall | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 4 | 9 | Danko Jones – Full of Regret | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 5 | 9 | Danko Jones – Had Enough | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 6 | 9 | Dizzy Mizz Lizzy – Silverflame | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 7 | 9 | Dizzy Mizz Lizzy – Waterline | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 8 | 9 | Dizzy Mizz Lizzy – Glory | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 9 | 9 | Dizzy Mizz Lizzy – Barbedwired Baby's Dream | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 10 | 9 | Dizzy Mizz Lizzy – Love Is a Loser's Game | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 11 | 9 | Dizzy Mizz Lizzy – Rotator | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 12 | 9 | Gyllene Tider – Sommartider | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 13 | 9 | Gyllene Tider – När vi två blir en | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 14 | 9 | Gyllene Tider – Flickorna på TV2 | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 15 | 9 | Gyllene Tider – (Dansar inte lika bra som) sjömän | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 16 | 9 | Gyllene Tider – Juni, juli, augusti | egen research | Dark Twin | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 17 | 9 | Magnus Uggla – Varning på stan | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 18 | 9 | Magnus Uggla – Jag mår illa | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 19 | 9 | Magnus Uggla – Jag och min far | egen research | Dark Twin | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 20 | 9 | Magnus Uggla – Joey Killer | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 21 | 9 | Magnus Uggla – Centralstimulerad | egen research | UK SLP | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 22 | 9 | Pugh Rogefeldt – Hog Farm | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 23 | 9 | Thomas Ledin – Sommaren är kort | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 24 | 9 | Thomas Ledin – Just nu! | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 25 | 9 | Thomas Ledin – Not Bad at All | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 26 | 9 | Thomas Ledin – En del av mitt hjärta | egen research | Dark Twin | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 27 | 9 | Thomas Ledin – Genom ett regnigt Europa | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 28 | 9 | Van Morrison – Gloria | egen research | UK 45 | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 29 | 9 | Van Morrison – Brown Eyed Girl | egen research | Dark Twin | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |
| 30 | 9 | Van Morrison – Domino | egen research | Dark Twin | låg säkerhet i källan (0.3); förstärkaren ("Unknown") matchade ingen regel – modellen valdes efter gain/genre; genretypisk tolkning – ingen utrustning dokumenterad; gitarr saknas |

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
| The Beatles | 18 | 0 | 7 | 2.2 |
| Guns N' Roses | 18 | 0 | 6 | 1.9 |
| At the Gates | 6 | 0 | 6 | 3.3 |
| Backyard Babies | 6 | 0 | 6 | 3.0 |
| Danzig | 6 | 0 | 6 | 3.0 |
| T. Rex | 6 | 0 | 6 | 3.0 |
| Blue Öyster Cult | 3 | 2 | 0 | 5.7 |
| The Buggles | 4 | 0 | 4 | 5.0 |
| Santana | 5 | 0 | 4 | 3.4 |
| The Soundtrack of Our Lives | 4 | 0 | 4 | 4.0 |
| Tame Impala | 4 | 1 | 1 | 3.5 |
| DOOM (Mick Gordon) | 3 | 0 | 3 | 5.0 |
| Megadeth | 7 | 0 | 3 | 2.1 |
| Spiritbox | 4 | 0 | 3 | 3.8 |
| Stevie Wonder | 3 | 0 | 3 | 5.0 |
| Prince | 4 | 0 | 3 | 3.5 |
| LINKIN PARK | 12 | 0 | 3 | 1.0 |
