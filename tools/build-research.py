import json, re, sys
# Bygger src/data/research/research-tones.json. Kör: python3 tools/build-research.py src/data/research/research-tones.json
# Varje post: artist, låt, rattlägen 0–10, originalutrustning och källor. Appen översätter dem med mapping-rules.json.
out = sys.argv[1]
tones = []
def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
def t(artist, song, genre, era, toneType, part, s, amp, guitar, notes, effects, pickup, conf, sources):
    g,b,m,tr,p,r = s
    tones.append(dict(id=f"{slug(artist)}-{slug(song)}-{part}-{toneType}", artist=artist, song=song, genre=genre, era=era,
        toneType=toneType, part=part, ampSettings=dict(gain=g,bass=b,mid=m,treble=tr,presence=p,reverb=r),
        amp=amp, guitar=guitar, notes=notes, effects=effects, pickup=pickup, confidence=conf, sources=sources, url=sources[0]))

# --- Volbeat: Marshall JCM800 + Gibson SG, TS808 som boost (Guitar World rig tour)
VB = ["https://guitarworld.com/features/rig-tour-volbeat-on-the-gear-that-fuels-the-danish-american-rock-n-roll-machine",
      "https://www.uberproaudio.com/who-plays-what/859-volbeat-michael-poulsen-guitar-rig-gear-and-equipment"]
VBA, VBG = "Marshall JCM800", "Gibson SG"
VBN = "Michael Poulsen: \"He likes the old 800s\" (gitarrtekniker). Live idag Kemper + Fractal. Låtnivåns rattlägen är tolkning."
for song, s, fx in [
    ("A Warrior's Call", (7.5,6,6,6.5,6,1.5), ["Ibanez TS808 Tube Screamer"]),
    ("Lola Montez", (7,6,6,6.5,6,2), ["Ibanez TS808 Tube Screamer"]),
    ("Seal the Deal", (7.5,6,5.5,6.5,6,1.5), ["Ibanez TS808 Tube Screamer"]),
    ("The Devil's Bleeding Crown", (8,6.5,5.5,6.5,6,1.5), ["Ibanez TS808 Tube Screamer"]),
    ("Heaven nor Hell", (7,5.5,6,6.5,6,2), []),
    ("Fallen", (6.5,5.5,6,6.5,6,2.5), []),
    ("Doc Holliday", (7,6,6,6.5,6,2), []),
    ("For Evigt", (6.5,5.5,6,6.5,6,2.5), []),
]:
    t("Volbeat", song, "heavy metal", "2010s", "distorted", "riff", s, VBA, VBG, VBN, fx, "bridge humbucker", 0.5, VB)
t("Volbeat", "Sad Man's Tongue", "rockabilly metal", "2000s", "overdriven", "riff", (5.5,5,6,6.5,6,2.5), VBA, VBG,
  VBN + " Rockabilly-delen: lägre gain, kort eko.", ["slapback delay"], "bridge humbucker", 0.45, VB)
t("Volbeat", "Sad Man's Tongue", "rockabilly metal", "2000s", "clean", "clean", (2,5,6,6.5,5,3), VBA, VBG,
  "Intro i Johnny Cash-stil (Ring of Fire-citat). Tolkning: ren ton med slapback.", ["slapback delay"], "neck humbucker", 0.4, VB)

# --- Monster Truck: Marshall JMP 50 (1970-tal) + Traynor 4x12 V30, Gibson SG, Phase 90, wah
MT = ["https://musicradar.com/news/guitars/start-me-up-monster-trucks-jeremy-widerman-640348",
      "https://equipboard.com/pros/jeremy-widerman"]
MTA, MTG = "Marshall JMP 50 (1970s) into Traynor 4x12 Vintage 30 cab", "Gibson SG"
MTN = "Jeremy Widerman: Marshall JMP in i två Traynor 4x12 (MusicRadar). Pedaler enligt Equipboard (ej verifierat). Rattlägen är tolkning."
for song, s, fx, era in [
    ("Sweet Mountain River", (7,6,6.5,6,5.5,1.5), [], "2010s"),
    ("The Lion", (7,6,6.5,6,5.5,1.5), [], "2010s"),
    ("Don't Tell Me How to Live", (7.5,6,6.5,6.5,6,1.5), [], "2010s"),
    ("Old Train", (6.5,6,6.5,6,5.5,2), [], "2010s"),
    ("Seven Seas Blues", (6.5,6,7,6,5.5,2), [], "2010s"),
    ("Righteous Smoke", (7,6,6.5,6,5.5,1.5), [], "2010s"),
]:
    t("Monster Truck", song, "hard rock", era, "distorted", "riff", s, MTA, MTG, MTN, fx, "bridge humbucker", 0.5, MT)
t("Monster Truck", "The Lion", "hard rock", "2010s", "distorted", "solo", (7.5,5.5,7,6.5,6,2), MTA, MTG, MTN,
  ["Dunlop Cry Baby wah"], "bridge humbucker", 0.4, MT)

# --- KISS: Les Paul in i Marshall (Super Lead) på 70-talet; JCM800 på 80-talet
KS = ["https://www.premierguitar.com/artists/ace-frehley-cosmic-space-invasion",
      "https://www.guitarplayer.com/players/ace-frehley-on-five-classic-kiss-era-cuts",
      "https://vintageguitar.com/2870/paul-stanley-and-ace-frehley"]
KSN = "Ace Frehley: Les Paul in i Marshall-stack (Premier Guitar), 100 W JMP Super Lead nämnd (Guitar Player). Låtnivån är tolkning."
for song, s, era, amp in [
    ("Detroit Rock City", (6.5,6,6.5,7,6,2), "1970s", "Marshall Super Lead 100W"),
    ("Rock and Roll All Nite", (6,6,6.5,7,6,2), "1970s", "Marshall Super Lead 100W"),
    ("Love Gun", (6.5,6,6.5,7,6,2), "1970s", "Marshall Super Lead 100W"),
    ("Shout It Out Loud", (6,6,6.5,7,6,2), "1970s", "Marshall Super Lead 100W"),
    ("Strutter", (6,6,6.5,7,6,2), "1970s", "Marshall Super Lead 100W"),
    ("Deuce", (6.5,6,6.5,7,6,2), "1970s", "Marshall Super Lead 100W"),
    ("I Was Made for Lovin' You", (5,5.5,6,7,6,2.5), "1970s", "Marshall Super Lead 100W"),
    ("Lick It Up", (7.5,6,6,7,6.5,2), "1980s", "Marshall JCM800"),
    ("Heaven's on Fire", (7.5,6,6,7,6.5,2.5), "1980s", "Marshall JCM800"),
]:
    t("KISS", song, "hard rock", era, "distorted", "riff", s, amp, "Gibson Les Paul", KSN, [], "bridge humbucker", 0.5, KS)
t("KISS", "Detroit Rock City", "hard rock", "1970s", "distorted", "solo", (7,5.5,7,7,6,2.5), "Marshall Super Lead 100W",
  "Gibson Les Paul", KSN + " Harmonistämmor i solot spelas av två gitarrer.", [], "bridge humbucker", 0.45, KS)

# --- ABBA: Lasse Wellander (Strat, Music Man 112HD), Janne Schaffer (Les Paul -59, Ampeg)
AB = ["https://www.guitarworld.com/features/lasse-wellander-abba-voyage-guitarist",
      "https://www.guitarworld.com/features/abba-janne-schaffer"]
for song, tt, part, s, amp, guitar, pick, note in [
    ("Waterloo", "overdriven", "riff", (4.5,5,6,6.5,5.5,2.5), "Ampeg guitar combo", "Gibson Les Paul (1959)", "bridge humbucker",
     "Janne Schaffer: Les Paul -59 och Ampeg-förstärkare under Waterloo-perioden."),
    ("Mamma Mia", "clean", "clean", (2,5,5.5,6.5,5.5,3), "Music Man 112HD", "Fender Stratocaster", "neck/middle single coil",
     "Lasse Wellander: Music Man 112HD i många år. Låtvalet av förstärkare är tolkning."),
    ("Dancing Queen", "clean", "clean", (2,5,5,6.5,5.5,3.5), "Music Man 112HD", "Fender Stratocaster", "middle single coil",
     "Gitarren ligger lågt i mixen; ren, ljus ton. Tolkning."),
    ("Does Your Mother Know", "overdriven", "riff", (5.5,5.5,6,6.5,6,2.5), "Music Man 112HD", "Fender Stratocaster", "bridge single coil",
     "Rockigaste ABBA-riffet. Tolkning: crunch."),
    ("Summer Night City", "overdriven", "riff", (5,5.5,6,6.5,6,2.5), "Music Man 112HD", "Fender Stratocaster", "bridge single coil",
     "Tolkning: crunch med disco-groove."),
    ("Knowing Me, Knowing You", "overdriven", "solo", (6,5,6.5,6,5.5,3), "Music Man 112HD", "Fender Stratocaster", "neck single coil",
     "Den sjungande gitarrslingan: sustain och lite eko. Tolkning."),
]:
    t("ABBA", song, "pop", "1970s", tt, part, s, amp, guitar, note, ["delay"] if part == "solo" else [], pick, 0.4, AB)

# --- Motörhead: Fast Eddie Clarke, Les Paul i uppskruvad Marshall
MH = ["https://geargods.net/m/how-motorhead-hit-the-jackpot-with-ace-of-spades",
      "https://www.bonedo.de/?p=311230"]
MHN = "Fast Eddie Clarke: Les Paul Standard i uppskruvad Marshall (sekundärkälla). Lemmys bas (Rickenbacker + Marshall Super Bass) står för en stor del av soundet."
for song, era, s in [
    ("Overkill", "1970s", (8,6,6,7,6.5,1.5)),
    ("Bomber", "1970s", (8,6,6,7,6.5,1.5)),
    ("Iron Fist", "1980s", (8,6,5.5,7,6.5,1.5)),
    ("Killed by Death", "1980s", (8,6,5.5,7,6.5,1.5)),
    ("The Chase Is Better Than the Catch", "1980s", (8,6,6,7,6.5,1.5)),
]:
    t("Motörhead", song, "heavy metal", era, "distorted", "riff", s, "Marshall (cranked)", "Gibson Les Paul Standard", MHN, [], "bridge humbucker", 0.4, MH)

# --- Svenska pop/rock-artister utan dokumenterad gitarrutrustning: genretypisk tolkning
def swe(artist, url, rows, note):
    for song, era, tt, part, s, fx, pick in rows:
        t(artist, song, "pop rock", era, tt, part, s, "Unknown", "", note, fx, pick, 0.3, [url])
GT = "Ingen dokumenterad gitarrutrustning hittad (Mats Persson/Per Gessle). Genretypisk tolkning av svensk powerpop – lita mer på örat än på värdena."
swe("Gyllene Tider", "https://en.wikipedia.org/wiki/Gyllene_Tider", [
    ("Sommartider", "1980s", "overdriven", "riff", (4.5,5,6,7,6,2.5), [], "bridge"),
    ("När vi två blir en", "1980s", "overdriven", "riff", (4,5,6,7,6,2.5), [], "bridge"),
    ("Flickorna på TV2", "1980s", "overdriven", "riff", (4.5,5,6,7,6,2), [], "bridge"),
    ("(Dansar inte lika bra som) sjömän", "1980s", "overdriven", "riff", (4,5,6,7,6,2.5), [], "bridge"),
    ("Juni, juli, augusti", "1980s", "clean", "clean", (2.5,5,5.5,7,6,3), ["chorus"], "middle"),
], GT)
MU = "Ingen dokumenterad gitarrutrustning hittad för Magnus Uggla Band. Genretypisk tolkning av 70/80-talets svenska rock/new wave."
swe("Magnus Uggla", "https://en.wikipedia.org/wiki/Magnus_Uggla", [
    ("Varning på stan", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2), [], "bridge humbucker"),
    ("Jag mår illa", "1970s", "distorted", "riff", (6.5,5.5,6,7,6,2), [], "bridge humbucker"),
    ("Jag och min far", "1980s", "clean", "clean", (2.5,5,5.5,6.5,6,3), ["chorus"], "middle"),
    ("Joey Killer", "1980s", "distorted", "riff", (6.5,5.5,5.5,7,6.5,2.5), [], "bridge humbucker"),
    ("Centralstimulerad", "1990s", "distorted", "riff", (6.5,5.5,5.5,7,6.5,2), [], "bridge humbucker"),
], MU)
TL = "Ingen dokumenterad gitarrutrustning hittad. Genretypisk tolkning av svensk pop/rock från 80-talet."
swe("Thomas Ledin", "https://sv.wikipedia.org/wiki/Thomas_Ledin", [
    ("Sommaren är kort", "1980s", "overdriven", "riff", (4.5,5,6,6.5,6,2.5), [], "bridge"),
    ("Just nu!", "1980s", "overdriven", "riff", (5,5,6,6.5,6,2.5), [], "bridge"),
    ("Not Bad at All", "1980s", "overdriven", "riff", (4.5,5,6,6.5,6,2.5), [], "bridge"),
    ("En del av mitt hjärta", "1980s", "clean", "clean", (2.5,5,5.5,6.5,6,3.5), ["chorus"], "middle"),
    ("Genom ett regnigt Europa", "1980s", "overdriven", "riff", (4.5,5,6,6.5,6,3), [], "bridge"),
], TL)

# --- The Buggles: syntpop; Bruce Woolley på gitarr, Vox AC30 nämnd för demon (ej bekräftad för skivan)
BG = ["https://www.inkl.com/news/the-buggles-how-we-made-video-killed-the-radio-star",
      "https://www.pressreader.com/uk/mojo-uk/20170425/283042644384540"]
BGN = "Gitarr: Bruce Woolley. En gammal Vox AC30 nämns i Mojo men kopplad till demon – inte bekräftad för skivan. Gitarren ligger lågt bakom syntarna; tolkning."
for song, tt, part, s, fx in [
    ("Video Killed the Radio Star", "clean", "clean", (3,5,5.5,6.5,6,3), []),
    ("Living in the Plastic Age", "overdriven", "riff", (4.5,5,6,6.5,6,2.5), []),
    ("Clean, Clean", "overdriven", "riff", (5,5,6,6.5,6,2.5), []),
    ("Elstree", "clean", "clean", (2.5,5,5.5,6.5,6,3), ["chorus"]),
]:
    t("The Buggles", song, "synth pop", "1970s", tt, part, s, "Vox AC30", "", BGN, fx, "", 0.3, BG)

# ============ 60/70-tal ============
def many(artist, genre, rows, amp, guitar, note, pickup, conf, src, fx=None):
    for row in rows:
        song, era, tt, part, st = row[:5]
        extra = row[5] if len(row) > 5 else {}
        t(artist, song, genre, era, tt, part, st, extra.get("amp", amp), extra.get("guitar", guitar),
          note + (" " + extra["note"] if "note" in extra else ""), extra.get("fx", fx or []),
          extra.get("pickup", pickup), extra.get("conf", conf), src)

# Queen: Red Special -> treble booster -> Vox AC30 (Normal-kanalen), volymratten styr gain
QU = ["https://brianmayworld.com/BrianMaysound.htm",
      "https://fryerguitars.com/history-of-brian-mays-treble-boosters-and-pedalboard-used-with-queen-from-1970-to-around-1986/",
      "https://www.premierguitar.com/videos/rig-rundown/rig-rundown-queens-brian-may"]
QUN = "Brian May: Red Special -> treble booster (Rangemaster, senare Cornish/Deacon) -> Vox AC30, Normal-kanalen på fullt. Clean fås med gitarrens volymratt. Låtnivån är tolkning."
many("Queen", "rock", [
    ("We Will Rock You", "1970s", "distorted", "solo", (7,5,6.5,6.5,6,2.5)),
    ("Killer Queen", "1970s", "distorted", "solo", (6.5,5,6.5,6.5,6,2.5)),
    ("Tie Your Mother Down", "1970s", "distorted", "riff", (7,5.5,6.5,6.5,6,2)),
    ("Don't Stop Me Now", "1970s", "distorted", "solo", (6.5,5,6.5,6.5,6,2.5)),
    ("Fat Bottomed Girls", "1970s", "distorted", "riff", (6.5,5.5,6.5,6.5,6,2)),
    ("Stone Cold Crazy", "1970s", "distorted", "riff", (7.5,5.5,6.5,6.5,6,1.5)),
    ("Keep Yourself Alive", "1970s", "distorted", "riff", (6.5,5,6.5,6.5,6,2)),
    ("Now I'm Here", "1970s", "distorted", "riff", (7,5.5,6.5,6.5,6,2)),
    ("Brighton Rock", "1970s", "distorted", "solo", (7,5,6.5,6.5,6,2), {"fx": ["Dallas Rangemaster treble booster", "delay"],
        "note": "Solot spelas med eko (May använde två ekon för att spela stämmor med sig själv)."}),
    ("Hammer to Fall", "1980s", "distorted", "riff", (7,5.5,6.5,6.5,6,2)),
    ("I Want It All", "1980s", "distorted", "riff", (7.5,5.5,6.5,6.5,6,2)),
], "Vox AC30 Normal channel", "Brian May Red Special", QUN, "3 single coils (Burns Tri-Sonic)", 0.55, QU,
   ["Dallas Rangemaster treble booster"])

# The Beatles: Vox AC30 (62-66), Vox UL730 (Revolver/Pepper), Fender Twin silverface (68-70)
BE = ["https://guitarworld.com/lessons/tabs-beatles-cant-buy-me-love", "https://www.andertons.co.uk/the-beatles-rig",
      "https://reverb.com/news/Vox-AC-30-Primer", "https://killerrig.com/the-beatles-amp-settings-and-sounds/"]
BEN = "The Beatles: Vox AC30 1962-66, Vox UL730 under Revolver/Sgt. Pepper, silverface Fender Twin från 1968."
many("The Beatles", "rock", [
    ("A Hard Day's Night", "1960s", "overdriven", "riff", (3.5,5,6,7,6,2.5), {"guitar": "Rickenbacker 360/12"}),
    ("I Feel Fine", "1960s", "overdriven", "riff", (4,5,6,7,6,2.5), {"guitar": "Gretsch / Rickenbacker"}),
    ("Help!", "1960s", "overdriven", "riff", (3.5,5,6,7,6,2.5), {"guitar": "Rickenbacker 325"}),
    ("Ticket to Ride", "1960s", "overdriven", "riff", (4,5,6,7,6,2.5), {"guitar": "Rickenbacker 360/12"}),
    ("Paperback Writer", "1960s", "overdriven", "riff", (5,5.5,6,6.5,6,2), {"guitar": "Epiphone Casino"}),
    ("Taxman", "1960s", "distorted", "solo", (4,5,6,6.5,6,2), {"amp": "Vox UL730", "fx": ["Tone Bender fuzz"], "conf": 0.4,
        "note": "Solot: UL730 + Tone Bender (Killer Rig, sekundärkälla)."}),
    ("Revolution", "1960s", "distorted", "riff", (4,5,6,6.5,6,1), {"amp": "Vox", "fx": ["fuzz (Fuzz Face-like)"], "conf": 0.35,
        "guitar": "Epiphone Casino", "note": "Den extrema distorsionen kom från överstyrning i studion – Fuzz Face är ett vanligt närmevärde (forumkälla)."}),
    ("Helter Skelter", "1960s", "distorted", "riff", (7,5.5,6,6.5,6,2), {"amp": "Vox", "conf": 0.4}),
    ("Get Back", "1960s", "clean", "solo", (3,5,6,6.5,6,2), {"amp": "Fender Twin Reverb silverface", "guitar": "Epiphone Casino"}),
    ("Don't Let Me Down", "1960s", "clean", "riff", (3,5,6,6.5,6,2.5), {"amp": "Fender Twin Reverb silverface", "guitar": "Epiphone Casino"}),
], "Vox AC30", "", BEN, "", 0.45, BE)

# Ritchie Blackmore: Strat -> (treble booster / Aiwa TP-1011 från 1974) -> modifierad Marshall Major 200W
RB = ["https://rainbowfanclan.com/news/reports/blackmore_gear.html", "https://www.vintageguitar.com/32424",
      "https://www.bonedo.de/artikel/ritchie-blackmore-biografie-spielweise-equipment-der-gitarrenlegende-workshop/"]
RBN = "Ritchie Blackmore: Stratocaster (urgröpt grepp) -> treble booster (till 1973), Aiwa TP-1011 som förstärkare/eko (1974-92) -> modifierad Marshall Major 200 W. Studioriggen skilde sig från scenriggen."
many("Rainbow", "hard rock", [
    ("Since You Been Gone", "1970s", "distorted", "riff", (6.5,5.5,6,7,6.5,2)),
    ("Stargazer", "1970s", "distorted", "riff", (7,5.5,6,7,6.5,2.5)),
    ("Man on the Silver Mountain", "1970s", "distorted", "riff", (7,5.5,6,7,6.5,2)),
    ("Man on the Silver Mountain", "1970s", "distorted", "solo", (7.5,5,6.5,7,6.5,2.5), {"fx": ["Aiwa tape echo"]}),
    ("Long Live Rock 'n' Roll", "1970s", "distorted", "riff", (7,5.5,6,7,6.5,2)),
    ("Kill the King", "1970s", "distorted", "riff", (7.5,5.5,6,7,6.5,2)),
    ("All Night Long", "1970s", "distorted", "riff", (6.5,5.5,6,7,6.5,2)),
], "Marshall Major 200W (modified)", "Fender Stratocaster", RBN, "bridge single coil", 0.5, RB)
many("Deep Purple", "hard rock", [
    ("Black Night", "1970s", "distorted", "riff", (6.5,5.5,6,7,6.5,2)),
    ("Child in Time", "1970s", "distorted", "solo", (7,5,6.5,7,6.5,2.5)),
    ("Space Truckin'", "1970s", "distorted", "riff", (7,5.5,6,7,6.5,2)),
    ("Woman from Tokyo", "1970s", "distorted", "riff", (6.5,5.5,6,7,6.5,2)),
    ("Hush", "1960s", "overdriven", "riff", (5,5.5,6,7,6,2.5), {"amp": "Vox AC30", "conf": 0.35,
        "note": "1968 – före Marshall Major-eran; förstärkaren är osäker."}),
    ("Perfect Strangers", "1980s", "distorted", "riff", (7,6,5.5,6.5,6.5,2.5), {"amp": "Marshall (Blackmore-modifierad)"}),
], "Marshall Major 200W (modified)", "Fender Stratocaster", RBN, "bridge single coil", 0.5, RB)

# T. Rex: Les Paul -> Rangemaster -> Vox AC30 (förstärkaren ej bekräftad för inspelningarna)
TR = ["https://www.analogman.com/bolan.htm", "https://equipboard.com/marc-bolan",
      "https://guitarplayer.com/news/watch-this-unmissable-film-of-marc-bolan-playing-his-late-50s-gibson-les-paul-with-t-rex-in-the-heyday-of-glam-rock"]
TRN = "Marc Bolan: Les Paul (Chablis-finish) + Rangemaster treble booster. Vox AC30 syns på bilder men är inte bekräftad för inspelningarna."
many("T. Rex", "glam rock", [
    ("Get It On", "1970s", "overdriven", "riff", (5.5,5.5,6,7,6,2.5)),
    ("20th Century Boy", "1970s", "distorted", "riff", (6.5,5.5,6,7,6,2)),
    ("Children of the Revolution", "1970s", "distorted", "riff", (6,5.5,6,7,6,2.5)),
    ("Metal Guru", "1970s", "overdriven", "riff", (5.5,5.5,6,7,6,3)),
    ("Jeepster", "1970s", "overdriven", "riff", (5,5.5,6,7,6,2.5)),
    ("Telegram Sam", "1970s", "overdriven", "riff", (5.5,5.5,6,7,6,2.5)),
], "Vox AC30", "Gibson Les Paul", TRN, "bridge humbucker", 0.4, TR, ["Dallas Rangemaster treble booster"])

# Status Quo: Telecaster -> Vox AC30 / Marshall (JCM800 senare), TS808 som boost
SQ = ["https://www.uberproaudio.com/who-plays-what/588-status-quo-francis-rossi-guitar-rig-gear-and-equipment",
      "https://vintageguitar.com/18470/status-quos-francis-rossi", "https://www.guitarworld.com/amp/features/francis-rossi-telecasters"]
SQN = "Francis Rossi: grön, modifierad Telecaster. Vox AC30 (\"skulle helst bara använda en AC30\") och Marshall-toppar (JCM800 senare). Rick Parfitt: Telecaster."
many("Status Quo", "boogie rock", [
    ("Rockin' All Over the World", "1970s", "overdriven", "riff", (5.5,5.5,6,6.5,6,2)),
    ("Whatever You Want", "1970s", "overdriven", "riff", (6,5.5,6,6.5,6,2)),
    ("Caroline", "1970s", "overdriven", "riff", (5.5,5.5,6,6.5,6,2)),
    ("Down Down", "1970s", "overdriven", "riff", (6,5.5,6,6.5,6,2)),
    ("Paper Plane", "1970s", "overdriven", "riff", (5.5,5.5,6,6.5,6,2)),
    ("In the Army Now", "1980s", "distorted", "riff", (6.5,5.5,6,6.5,6,3), {"amp": "Marshall JCM800", "fx": ["Ibanez TS808 Tube Screamer"]}),
], "Vox AC30", "Fender Telecaster", SQN, "bridge single coil", 0.45, SQ)

# Thin Lizzy: Les Paul -> Marshall JMP 100 + 4x12, MXR Phase 90 (Gorham)
TL2 = ["https://www.guitarworld.com/news/thin-lizzy-scott-gorham-marshall-amps-master-volume",
       "https://vintageguitar.com/3827/scott-gorham", "https://www.guitarworld.com/artists/guitarists/brian-robertson-thin-lizzy-golden-years"]
TLN = "Scott Gorham och Brian Robertson: Les Paul -> Marshall JMP 100 + 4x12, spelade mycket högt. Gorham nämner MXR Phase 90."
many("Thin Lizzy", "hard rock", [
    ("Jailbreak", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2)),
    ("Emerald", "1970s", "distorted", "riff", (7,5.5,6,6.5,6,2)),
    ("Emerald", "1970s", "distorted", "solo", (7.5,5,6.5,6.5,6,2.5)),
    ("Waiting for an Alibi", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2)),
    ("Cowboy Song", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2.5)),
    ("Dancing in the Moonlight", "1970s", "overdriven", "riff", (5,5.5,6,6.5,6,2.5)),
    ("Still in Love with You", "1970s", "distorted", "solo", (7,5,6.5,6,5.5,3)),
    ("Rosalie", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2)),
], "Marshall JMP 100", "Gibson Les Paul", TLN, "bridge humbucker", 0.5, TL2)

# Cheap Trick: debuten på Orange 80W 2x12, annars Marshall
CT = ["https://www.premierguitar.com/cheap-tricks-amazing-journey", "https://guitarplayer.com/players/rick-nielsen-how-i-wrote-cheap-tricks-surrender"]
CTN = "Rick Nielsen: nästan hela debutalbumet (1977) spelades in på en Orange 80 W 2x12-combo; annars Marshall, Vox AC30 och Fender Deluxe Reverb."
many("Cheap Trick", "power pop", [
    ("He's a Whore", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2), {"amp": "Orange 80W 2x12 combo"}),
    ("Hello There", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2)),
    ("I Want You to Want Me", "1970s", "overdriven", "riff", (5.5,5.5,6,6.5,6,2.5)),
    ("Surrender", "1970s", "distorted", "riff", (6,5.5,6,6.5,6,2.5)),
    ("Dream Police", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2.5)),
], "Marshall", "Hamer / Gibson", CTN, "bridge humbucker", 0.4, CT)

# Foreigner: Les Paul Custom -> Marshall 100W + Hiwatt-kabinett med Fane
FO = ["https://www.guitarworld.com/artists/foreigner-40-mick-jones-talks-new-compilation-album-gear-and-autobiography",
      "https://www.woodytone.com/?p=1344", "https://vintageguitar.com/33057/mick-jones"]
FON = "Mick Jones: '57 Les Paul Custom -> Marshall 100 W med Hiwatt-kabinett (Fane-högtalare); Telecaster dubblad ovanpå för glans."
many("Foreigner", "hard rock", [
    ("Feels Like the First Time", "1970s", "distorted", "riff", (6,5.5,6,6.5,6,2)),
    ("Cold as Ice", "1970s", "overdriven", "riff", (5.5,5.5,6,6.5,6,2.5)),
    ("Hot Blooded", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2)),
    ("Double Vision", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2)),
    ("Juke Box Hero", "1980s", "distorted", "riff", (7,6,6,6.5,6,3)),
    ("Urgent", "1980s", "distorted", "riff", (6,5.5,6,6.5,6,2.5)),
], "Marshall 100W with Hiwatt cabinets (Fane speakers)", "Gibson Les Paul Custom", FON, "bridge humbucker", 0.45, FO)

# Blue Öyster Cult
BO = ["https://www.guitarworld.com/gear/the-secrets-behind-the-guitar-tone-on-blue-oyster-cults-dont-fear-the-reaper",
      "https://www.guitarplayer.com/players/how-buck-dharma-wrote-blue-oyster-cults-dont-fear-the-reaper"]
BON = "Buck Dharma: \"aldrig pedaler förr – bara gitarr in i förstärkare\"."
many("Blue Öyster Cult", "hard rock", [
    ("(Don't Fear) The Reaper", "1970s", "overdriven", "riff", (4,5,6,6.5,6,3), {"amp": "Music Man", "guitar": "Gibson ES-175",
        "conf": 0.5, "note": "Inspelad med lånad ES-175 och Music Man-förstärkare (tekniker Shelly Yakus)."}),
    ("Godzilla", "1970s", "distorted", "riff", (6.5,5.5,6,6.5,6,2), {"amp": "Unknown", "conf": 0.3, "note": "Förstärkaren är inte dokumenterad."}),
    ("Burnin' for You", "1980s", "distorted", "riff", (5.5,5.5,6,6.5,6,2.5), {"amp": "Unknown", "conf": 0.3, "note": "Förstärkaren är inte dokumenterad."}),
], "Unknown", "", BON, "bridge humbucker", 0.3, BO)

# Sweet: Andy Scott – ES-335 / Strat, uppskruvad förstärkare (modell okänd)
SW = ["https://www.Guitar.com/features/andy-scotts-es-335/", "https://www.guitarworld.com/artists/guitarists/the-sweet-andy-scott"]
SWN = "Andy Scott: Cherry -61 ES-335 med Bigsby och Stratocaster; ljudet från uppskruvad förstärkare utan fuzz (inspirerad av Blackmore). Förstärkarmodellen är inte dokumenterad."
many("Sweet", "glam rock", [
    ("The Ballroom Blitz", "1970s", "distorted", "riff", (6.5,5.5,6,7,6,2)),
    ("Fox on the Run", "1970s", "distorted", "riff", (6.5,5.5,6,7,6,2.5)),
    ("Block Buster!", "1970s", "distorted", "riff", (6.5,5.5,6,7,6,2)),
    ("Hell Raiser", "1970s", "distorted", "riff", (6.5,5.5,6,7,6,2)),
    ("Teenage Rampage", "1970s", "distorted", "riff", (6.5,5.5,6,7,6,2)),
], "Unknown", "Gibson ES-335", SWN, "bridge humbucker", 0.3, SW)

# ============ Omgång 3 ============
def src(*u): return list(u)

# U2 – The Edge: Vox AC30 + delay (Memory Man / Korg SDD-3000 / TC 2290)
U2 = src("https://www.uberproaudio.com/who-plays-what/158-u2-the-edge-guitar-gear-rig-and-equipment",
         "https://www.musicradar.com/news/u2-edge-interview-rig-tour-guitars", "https://www.musicradar.com/news/guitars/buy-their-sound-the-edge-617654")
U2N = "The Edge: Vox AC30 (1964) på varje album; delay från Deluxe Memory Man, Korg SDD-3000 eller TC 2290 beroende på period. Dotted-eighth-ekot är kärnan – synka Time till låtens tempo."
many("U2", "rock", [
    ("I Will Follow", "1980s", "overdriven", "riff", (4.5,5,6,7,6.5,2.5)),
    ("New Year's Day", "1980s", "overdriven", "riff", (4.5,5,6,7,6.5,2.5)),
    ("Pride (In the Name of Love)", "1980s", "overdriven", "riff", (4.5,5,6,7,6.5,2.5)),
    ("I Still Haven't Found What I'm Looking For", "1980s", "clean", "clean", (3,5,6,7,6.5,3)),
    ("Bad", "1980s", "clean", "clean", (3,5,6,7,6.5,3)),
    ("One", "1990s", "overdriven", "riff", (4,5,6,6.5,6,3), {"fx": []}),
    ("Beautiful Day", "2000s", "distorted", "riff", (6,5.5,6,6.5,6,2.5)),
    ("Vertigo", "2000s", "distorted", "riff", (7,5.5,6,6.5,6,2), {"fx": [], "guitar": "Gibson Explorer", "pickup": "bridge humbucker"}),
    ("Elevation", "2000s", "distorted", "riff", (7,5.5,6,6.5,6,2), {"fx": ["fuzz"]}),
], "Vox AC30", "Fender Stratocaster", U2N, "bridge single coil", 0.5, U2,
   ["MXR Dyna Comp compressor", "Electro-Harmonix Deluxe Memory Man analog delay"])

# Coldplay – Jonny Buckland: Fender Hot Rod DeVille (Twin Reverb på Parachutes), delays, RAT
CP = src("https://uberproaudio.com/who-plays-what/403-coldplay-jonny-buckland-guitar-gear-rig-and-equipment",
         "https://www.showmehowtoplay.com/feature/gear/coldplays_guitar_tech_matt_mcginn")
CPN = "Jonny Buckland: Fender Hot Rod DeVille (Twin Reverb under Parachutes), mycket delay (TC 2290, Line 6 DL4), vintage Pro Co RAT."
many("Coldplay", "alternative rock", [
    ("Shiver", "2000s", "overdriven", "riff", (4.5,5,6,6.5,6,3), {"amp": "Fender Twin Reverb", "fx": ["delay"]}),
    ("In My Place", "2000s", "clean", "riff", (3,5,6,6.5,6,3.5), {"fx": ["digital delay"]}),
    ("Fix You", "2000s", "distorted", "solo", (6,5,6,6.5,6,3.5), {"fx": ["Pro Co RAT", "delay"]}),
    ("Talk", "2000s", "distorted", "riff", (6,5.5,6,6.5,6,3), {"fx": ["Pro Co RAT", "delay"]}),
    ("Speed of Sound", "2000s", "clean", "riff", (3,5,6,6.5,6,3.5), {"fx": ["digital delay"]}),
], "Fender Hot Rod DeVille", "Fender Telecaster", CPN, "bridge single coil", 0.4, CP)

# Gary Moore
GM = src("https://www.guitarworld.com/artists/the-secrets-behind-gary-moores-tone-on-still-got-the-blues",
         "https://www.groundguitar.com/gary-moore-gear", "https://www.woodytone.com/2011/02/09/3-early-gary-moore-phases-and-gear/")
GMN = "Gary Moore, bluesperioden: -59 Les Paul \"Stripe\" -> Marshall Guv'nor -> JTM45-reissue -> 1960B 4x12. 80-talets hårdrock: Marshall (modell varierar)."
many("Gary Moore", "blues rock", [
    ("Walking by Myself", "1990s", "distorted", "riff", (6,6,6.5,6.5,6,2.5)),
    ("Oh Pretty Woman", "1990s", "distorted", "riff", (6.5,6,6.5,6.5,6,2.5)),
    ("Midnight Blues", "1990s", "distorted", "solo", (6.5,5.5,7,6,5.5,3.5)),
    ("Out in the Fields", "1980s", "distorted", "riff", (7.5,6,6,7,6.5,2.5), {"amp": "Marshall", "fx": [], "conf": 0.4}),
    ("Over the Hills and Far Away", "1980s", "distorted", "riff", (7.5,6,6,7,6.5,3), {"amp": "Marshall", "fx": [], "conf": 0.4}),
    ("Empty Rooms", "1980s", "distorted", "solo", (7,5.5,6.5,6.5,6,3.5), {"amp": "Marshall", "fx": ["delay"], "conf": 0.4}),
], "Marshall JTM45 reissue into 1960B cab", "Gibson Les Paul (1959)", GMN, "bridge humbucker", 0.5, GM, ["Marshall Guv'nor"])

# Iron Maiden – Marshall 50W (JMP), Murray: MXR Distortion+
IM = src("https://www.woodytone.com/?p=2393", "https://guitarworld.com/gw-archive/steve-harris-and-dave-murray-iron-maiden-open-1988-guitar-world-interview")
IMN = "Dave Murray / Adrian Smith tidigt: Marshall 50 W-toppar (JMP) med 4x12; Murray med MXR Distortion+. Källäget är tunt – tolkning per låt."
many("Iron Maiden", "heavy metal", [
    ("Wrathchild", "1980s", "distorted", "riff", (7,6,6,7,6.5,2)),
    ("Aces High", "1980s", "distorted", "riff", (7.5,6,6,7,6.5,2)),
    ("2 Minutes to Midnight", "1980s", "distorted", "riff", (7.5,6,6,7,6.5,2)),
    ("Powerslave", "1980s", "distorted", "riff", (7.5,6,6,7,6.5,2)),
    ("Wasted Years", "1980s", "distorted", "riff", (7,6,6,7,6.5,2.5), {"fx": ["chorus"]}),
    ("Can I Play with Madness", "1980s", "distorted", "riff", (7,6,6,7,6.5,2)),
    ("Aces High", "1980s", "distorted", "solo", (8,5.5,6.5,7,6.5,2.5), {"fx": ["MXR Distortion+"]}),
], "Marshall JMP 50", "Fender Stratocaster (humbucker)", IMN, "bridge humbucker", 0.4, IM)

# Audioslave – Tom Morello: Marshall JCM800 2205 (lead-kanalen) + Peavey 4x12, Whammy
AS = src("https://guitargearfinder.com/?p=669", "https://www.premierguitar.com/rig-rundown-tom-morello", "https://mixdownmag.com.au/features/rig-rundown-tom-morello/")
ASN = "Tom Morello: Marshall JCM800 2205 (50 W, bara lead-kanalen) -> Peavey 4x12; DigiTech Whammy WH-1, DD-2/DD-3, Phase 90, Cry Baby."
many("Audioslave", "alternative rock", [
    ("Be Yourself", "2000s", "distorted", "riff", (6.5,6,6,6,6,2)),
    ("I Am the Highway", "2000s", "clean", "clean", (3,5,6,6,6,3)),
    ("Gasoline", "2000s", "distorted", "riff", (7,6,6,6,6,1.5)),
    ("Revelations", "2000s", "distorted", "solo", (7,6,6,6,6,1.5), {"fx": ["DigiTech Whammy"]}),
    ("Doesn't Remind Me", "2000s", "distorted", "riff", (6.5,6,6,6,6,2)),
    ("Original Fire", "2000s", "distorted", "riff", (7,6,6,6,6,2)),
], "Marshall JCM800 2205 into Peavey 4x12 cab", "Fender Telecaster / \"Arm the Homeless\"", ASN, "bridge humbucker", 0.5, AS)

# Lamb of God – Mesa Boogie Mark IV
LG = src("https://www.premierguitar.com/gear/rig-rundown-lamb-of-god", "https://www.guitarcenter.com/riffs/interviews/guitars/mark-morton-lamb-of-god-mesa-boogie")
LGN = "Mark Morton och Willie Adler: Mesa/Boogie Mark IV -> Mesa 4x12 (Morton senare Royal Atlantic/Badlander)."
many("Lamb of God", "groove metal", [
    ("Redneck", "2000s", "distorted", "riff", (8,6.5,5,6.5,6,1)),
    ("Walk with Me in Hell", "2000s", "distorted", "riff", (8,6.5,5,6.5,6,1.5)),
    ("Now You've Got Something to Die For", "2000s", "distorted", "riff", (8,6.5,5,6.5,6,1)),
    ("Ruin", "2000s", "distorted", "riff", (8,6.5,5,6.5,6,1)),
    ("Omerta", "2000s", "distorted", "riff", (8,6.5,5,6.5,6,1.5)),
    ("Black Label", "2000s", "distorted", "riff", (8,6.5,5,6.5,6,1)),
    ("Set to Fail", "2000s", "distorted", "riff", (8,6.5,5,6.5,6,1)),
    ("Ghost Walking", "2010s", "distorted", "riff", (8,6.5,5,6.5,6,1.5)),
], "Mesa Boogie Mark IV", "ESP / Jackson", LGN, "bridge humbucker", 0.5, LG, ["noise gate"])

# Machine Head – Robb Flynn: Peavey 5150/6505 + Marshall 4x12
MHD = src("https://www.guitarworld.com/news/peavey-and-machine-heads-robb-flynn-celebrate-20-years-6505-guitar-amp",
          "https://guitarworld.com/gw-archive/dear-guitar-hero-robb-flynn-and-phil-demmel-machine-head")
MHDN = "Robb Flynn: Peavey 5150/6505 sedan Burn My Eyes (1994), Marshall 4x12-kabinett."
many("Machine Head", "groove metal", [
    ("Davidian", "1990s", "distorted", "riff", (8,6.5,5,6.5,6,1)),
    ("Old", "1990s", "distorted", "riff", (8,6.5,5,6.5,6,1)),
    ("Imperium", "2000s", "distorted", "riff", (8.5,6.5,5,6.5,6,1)),
    ("Aesthetics of Hate", "2000s", "distorted", "riff", (8.5,6.5,5,6.5,6,1)),
    ("Halo", "2000s", "distorted", "riff", (8.5,6.5,5,6.5,6,1.5)),
    ("Locust", "2010s", "distorted", "riff", (8.5,6.5,5,6.5,6,1.5)),
], "Peavey 5150 into Marshall 1960 cab", "ESP / Epiphone Flying V", MHDN, "bridge humbucker (EMG)", 0.5, MHD, ["noise gate"])

# In Flames – Peavey 5150/6505 (Strömblad), Marshall Valvestate som blandförstärkare i studion
IF = src("https://uberproaudio.com/who-plays-what/243-in-flames-jesper-stromblad-guitar-gear-rig-and-equipment",
         "https://www.guitarworld.com/gear/flames-gear-secrets-unveiled-exclusive-video")
IFN = "Jesper Strömblad: Peavey 5150/6505; i studion (Fredman) blandades även en Marshall Valvestate in. EMG 85 (forumkälla)."
many("In Flames", "melodic death metal", [
    ("Cloud Connected", "2000s", "distorted", "riff", (8,6,5.5,6.5,6,1.5)),
    ("Trigger", "2000s", "distorted", "riff", (8,6,5.5,6.5,6,1.5)),
    ("The Quiet Place", "2000s", "distorted", "riff", (8,6,5.5,6.5,6,1.5)),
    ("Take This Life", "2000s", "distorted", "riff", (8.5,6,5.5,6.5,6,1)),
    ("My Sweet Shadow", "2000s", "distorted", "riff", (8,6,5.5,6.5,6,1.5)),
    ("Alias", "2010s", "distorted", "riff", (8,6,5.5,6.5,6,2)),
], "Peavey 5150", "Gibson / ESP", IFN, "bridge humbucker (EMG)", 0.45, IF, ["noise gate"])

# At the Gates – Slaughter of the Soul: Peavey Supreme 160 (Earache-dokumentären)
AG = src("https://equipboard.com/albums/at-the-gates-slaughter-of-the-soul", "https://equipboard.com/pros/anders-bjorler")
AGN = "Anders Björler på Slaughter of the Soul: Peavey Supreme 160 (enligt Earache-dokumentären, via Equipboard)."
many("At the Gates", "melodic death metal", [
    ("Slaughter of the Soul", "1990s", "distorted", "riff", (8.5,6,5.5,6.5,6,1)),
    ("Cold", "1990s", "distorted", "riff", (8.5,6,5.5,6.5,6,1)),
    ("Under a Serpent Sun", "1990s", "distorted", "riff", (8.5,6,5.5,6.5,6,1)),
    ("Suicide Nation", "1990s", "distorted", "riff", (8.5,6,5.5,6.5,6,1)),
    ("World of Lies", "1990s", "distorted", "riff", (8.5,6,5.5,6.5,6,1)),
], "Peavey Supreme 160", "", AGN, "bridge humbucker", 0.45, AG, ["noise gate"])

# Avatar (Göteborg) – Avatar Country-eran: Peavey 5150/Rockmaster + Marshall 1960-kabinett, Kemper; baritonsträngar
AV = src("https://guitarworld.com/artists/swedish-metallers-avatar-unleash-avatar-country-a-concept-album-thats-fit-for-a-king",
         "https://www.musicradar.com/news/guitars/on-the-radar-avatar-602679")
AVN = "Jonas Jarlsby och Tim Öhrström (Avatar Country, 2018): Kemper, Peavey Rockmaster och Peavey 5150 -> Marshall 1960-kabinett; baritonsträngar. Live senare Line 6 POD HD Pro / Kemper."
many("Avatar", "metal", [
    ("Hail the Apocalypse", "2010s", "distorted", "riff", (8,6.5,5.5,6.5,6,1.5)),
    ("The Eagle Has Landed", "2010s", "distorted", "riff", (8,6.5,5.5,6.5,6,1.5)),
    ("Smells Like a Freakshow", "2010s", "distorted", "riff", (8,6.5,5.5,6.5,6,1.5)),
    ("Bloody Angel", "2010s", "distorted", "riff", (7.5,6.5,5.5,6.5,6,2)),
    ("A Statue of the King", "2010s", "distorted", "riff", (8,6.5,5.5,6.5,6,1.5)),
    ("Colossus", "2010s", "distorted", "riff", (8,6.5,5.5,6.5,6,2)),
], "Peavey 5150 into Marshall 1960 cab", "Ibanez (baritone)", AVN, "bridge humbucker", 0.4, AV, ["noise gate"])

# Johnny Cash – Luther Perkins: Fender Esquire, dämpade strängar, ren Fender-förstärkare
JC = src("https://www.premierguitar.com/gear/how-to-get-an-authentic-johnny-cash-luther-perkins-esquire-tone", "https://en.wikipedia.org/wiki/Luther_Perkins")
JCN = "Luther Perkins: Fender Esquire, handflatsdämpning vid stallet (\"boom-chicka-boom\"). Förstärkaren omstridd: tweed-Fender, Super Reverb eller Silvertone 1300."
many("Johnny Cash", "country", [
    ("I Walk the Line", "1950s", "clean", "riff", (2.5,6,5.5,6.5,5.5,2.5)),
    ("Get Rhythm", "1950s", "clean", "riff", (2.5,6,5.5,6.5,5.5,2.5)),
    ("Cry! Cry! Cry!", "1950s", "clean", "riff", (2.5,6,5.5,6.5,5.5,2.5)),
    ("Big River", "1950s", "clean", "riff", (2.5,6,5.5,6.5,5.5,2.5)),
    ("Jackson", "1960s", "clean", "riff", (2.5,6,5.5,6.5,5.5,3), {"amp": "Fender Super Reverb"}),
    ("A Boy Named Sue", "1960s", "clean", "riff", (3,6,5.5,6.5,5.5,3), {"amp": "Fender Super Reverb"}),
], "Fender tweed", "Fender Esquire", JCN, "bridge single coil", 0.45, JC, ["slapback"])

# Elvis Presley – Scotty Moore: Gibson ES-295 / L5, Ray Butts EchoSonic med slapback
EP = src("https://scottymoore.net/echosonic.html", "https://en.wikipedia.org/wiki/Ray_Butts_EchoSonic", "https://scottymoore.net/gibson_guitars_of_scotty_moore.html")
EPN = "Scotty Moore: Gibson ES-295 (tidiga Sun-inspelningar), senare L5 CES; Ray Butts EchoSonic med inbyggt tejpeko – slapbacken är kärnan."
many("Elvis Presley", "rockabilly", [
    ("That's All Right", "1950s", "clean", "riff", (2.5,5.5,6,6.5,5.5,2)),
    ("Mystery Train", "1950s", "clean", "riff", (3,5.5,6,6.5,5.5,2), {"guitar": "Gibson L5 CES"}),
    ("Heartbreak Hotel", "1950s", "overdriven", "solo", (4,5.5,6,6.5,5.5,3), {"guitar": "Gibson L5 CES"}),
    ("Hound Dog", "1950s", "overdriven", "solo", (4.5,5.5,6,6.5,5.5,2), {"guitar": "Gibson L5 CES"}),
    ("Jailhouse Rock", "1950s", "overdriven", "riff", (4,5.5,6,6.5,5.5,2), {"guitar": "Gibson L5 CES"}),
    ("Blue Suede Shoes", "1950s", "overdriven", "riff", (3.5,5.5,6,6.5,5.5,2), {"guitar": "Gibson L5 CES"}),
    ("Don't Be Cruel", "1950s", "clean", "riff", (2.5,5.5,6,6.5,5.5,2.5), {"guitar": "Gibson L5 CES"}),
], "Ray Butts EchoSonic", "Gibson ES-295", EPN, "P-90 (bridge)", 0.5, EP, ["slapback tape echo"])

# Backyard Babies – Dregen: modifierad Fender Bassman (Tommy Folkesson), MXR-boost, Cry Baby
BB = src("https://equipboard.com/pros/dregen")
BBN = "Dregen: Fender Bassman-topp (50 W blackface, modifierad av Tommy Folkesson) fram till 2009, MXR MC401 boost för solon, Cry Baby (Equipboard, ej verifierat)."
many("Backyard Babies", "punk rock", [
    ("Minus Celsius", "1990s", "distorted", "riff", (7,6,6,7,6.5,1.5)),
    ("Look at You", "1990s", "distorted", "riff", (7,6,6,7,6.5,1.5)),
    ("The Clash", "2000s", "distorted", "riff", (7,6,6,7,6.5,1.5)),
    ("Th1rt3en or Nothing", "2000s", "distorted", "riff", (7,6,6,7,6.5,1.5)),
    ("People Like People Like People Like Us", "2000s", "distorted", "riff", (7,6,6,7,6.5,1.5)),
    ("Highlights", "1990s", "distorted", "riff", (7,6,6,7,6.5,1.5)),
], "Fender Bassman (modified)", "Gibson ES-335 / Les Paul", BBN, "bridge humbucker", 0.4, BB)

# Danzig – John Christ: Bedrock 1200 (första albumet), VHT (album 2-3)
DZ = src("https://equipboard.com/john-christ", "https://www.rig-talk.com/forum/threads/danzig-mother-amps.147852/",
         "https://www.guitarworld.com/features/john-christ-danzig")
DZN = "John Christ: Bedrock 1200 på första albumet, B.C. Rich + VHT och Marshall-kabinett på album 2-3 (egna ord via Rig-Talk). Boss OS-2 (ej verifierat)."
many("Danzig", "heavy metal", [
    ("Mother", "1980s", "distorted", "riff", (7,6,6,6.5,6,2), {"amp": "Bedrock 1200 with Marshall cab"}),
    ("Twist of Cain", "1980s", "distorted", "riff", (7,6,6,6.5,6,2), {"amp": "Bedrock 1200 with Marshall cab"}),
    ("Am I Demon", "1980s", "distorted", "riff", (7,6,6,6.5,6,2), {"amp": "Bedrock 1200 with Marshall cab"}),
    ("Her Black Wings", "1990s", "distorted", "riff", (7,6,6,6.5,6,2.5)),
    ("Dirty Black Summer", "1990s", "distorted", "riff", (7,6,6,6.5,6,2)),
    ("How the Gods Kill", "1990s", "distorted", "riff", (7,6,6,6.5,6,3)),
], "VHT with Marshall cab", "B.C. Rich", DZN, "bridge humbucker", 0.4, DZ)

# Utan dokumenterad utrustning – genretypisk tolkning
def unk(artist, genre, url, rows, note, conf=0.3, amp="Unknown", guitar=""):
    many(artist, genre, rows, amp, guitar, note, "bridge humbucker", conf, [url])
unk("Dizzy Mizz Lizzy", "hard rock", "https://en.wikipedia.org/wiki/Dizzy_Mizz_Lizzy", [
    ("Silverflame", "1990s", "distorted", "riff", (6.5,5.5,6,6.5,6,2.5)),
    ("Waterline", "1990s", "distorted", "riff", (6.5,5.5,6,6.5,6,2.5)),
    ("Glory", "1990s", "distorted", "riff", (6.5,5.5,6,6.5,6,2.5)),
    ("Barbedwired Baby's Dream", "1990s", "distorted", "riff", (7,5.5,6,6.5,6,2)),
    ("Love Is a Loser's Game", "1990s", "distorted", "riff", (6.5,5.5,6,6.5,6,2.5)),
    ("Rotator", "1990s", "distorted", "riff", (7,5.5,6,6.5,6,2)),
], "Ingen dokumenterad gitarrutrustning hittad för Tim Christensen. Genretypisk tolkning av melodisk 90-talshårdrock (crunch).")
unk("The Soundtrack of Our Lives", "garage rock", "https://en.wikipedia.org/wiki/The_Soundtrack_of_Our_Lives", [
    ("Sister Surround", "1990s", "overdriven", "riff", (5.5,5.5,6,6.5,6,3)),
    ("Bigtime", "2000s", "overdriven", "riff", (5.5,5.5,6,6.5,6,3)),
    ("Instant Repeater '99", "1990s", "overdriven", "riff", (5.5,5.5,6,6.5,6,3)),
    ("Mind the Gap", "2000s", "overdriven", "riff", (5.5,5.5,6,6.5,6,3)),
], "Ingen dokumenterad utrustning hittad (Ian Person/Mattias Bärjed). Tolkning: 60-talsinspirerad garagerock – AC30-likt crunch.",
   amp="Vox AC30", guitar="")
unk("Danko Jones", "hard rock", "https://en.wikipedia.org/wiki/Danko_Jones", [
    ("First Date", "2000s", "distorted", "riff", (7,6,6,6.5,6,1.5)),
    ("Sticky Situation", "2000s", "distorted", "riff", (7,6,6,6.5,6,1.5)),
    ("Lovercall", "2000s", "distorted", "riff", (7,6,6,6.5,6,1.5)),
    ("Full of Regret", "2010s", "distorted", "riff", (7,6,6,6.5,6,1.5)),
    ("Had Enough", "2000s", "distorted", "riff", (7,6,6,6.5,6,1.5)),
], "Ingen dokumenterad förstärkare hittad för Danko Jones. Genretypisk tolkning: rak hårdrock med Marshall-karaktär.")
unk("Håkan Hellström", "indie pop", "https://equipboard.com/pros/hakan-hellstrom", [
    ("Känn ingen sorg för mig Göteborg", "2000s", "overdriven", "riff", (4.5,5,6,7,6,3)),
    ("Kom igen Lena!", "2000s", "overdriven", "riff", (5,5,6,7,6,2.5)),
    ("Nu kan du få mig så lätt", "2000s", "overdriven", "riff", (4.5,5,6,7,6,3)),
    ("Det är så jag säger det", "2000s", "overdriven", "riff", (5,5,6,7,6,3)),
    ("Ramlar", "2000s", "overdriven", "riff", (4.5,5,6,7,6,3)),
], "Ingen förstärkare dokumenterad. Gitarrer enligt Equipboard (ej verifierat): Vox Mark VI, Telecaster Custom. Tolkning: jangly crunch.",
   guitar="Fender Telecaster / Vox Mark VI")
unk("Van Morrison", "rock", "https://en.wikipedia.org/wiki/Van_Morrison", [
    ("Gloria", "1960s", "overdriven", "riff", (5,5.5,6,6.5,6,2.5)),
    ("Brown Eyed Girl", "1960s", "clean", "riff", (2.5,5,6,6.5,6,3)),
    ("Domino", "1970s", "clean", "riff", (3,5,6,6.5,6,3)),
    ("Wild Night", "1970s", "clean", "riff", (3,5,6,6.5,6,3)),
    ("Moondance", "1970s", "clean", "clean", (2,5.5,6,5.5,5,3)),
], "Ingen dokumenterad gitarrutrustning hittad (studiomusiker på inspelningarna). Genretypisk tolkning.")
unk("John Legend", "soul", "https://en.wikipedia.org/wiki/John_Legend", [
    ("Green Light", "2000s", "clean", "riff", (2.5,5,6,6.5,6,2.5)),
    ("Ordinary People", "2000s", "clean", "clean", (2,5,5.5,6,5.5,3.5)),
    ("All of Me", "2010s", "clean", "clean", (2,5,5.5,6,5.5,3.5)),
], "John Legends låtar är piano- och sångbaserade (All of Me har ingen elgitarr). Detta är ett rent ackompanjemangsljud för att spela låten på gitarr – inte en återskapning.",
   conf=0.2)

# The Haunted – ingen bandspecifik förstärkare dokumenterad
many("The Haunted", "thrash metal", [
    ("Trespass", "1990s", "distorted", "riff", (9,6,5.5,6.5,6,1)),
    ("Hate Song", "2000s", "distorted", "riff", (9,6,5.5,6.5,6,1)),
    ("Bury Your Dead", "2000s", "distorted", "riff", (9,6,5.5,6.5,6,1)),
    ("99", "2000s", "distorted", "riff", (9,6,5.5,6.5,6,1)),
    ("All Against All", "2000s", "distorted", "riff", (9,6,5.5,6.5,6,1)),
    ("The Flood", "2000s", "distorted", "riff", (8.7,6,5.5,6.5,6,1.5)),
    ("No Compromise", "2000s", "distorted", "riff", (9,6,5.5,6.5,6,1)),
], "Unknown", "Gibson / ESP Les Paul Custom",
   "Ingen bandspecifik förstärkare dokumenterad. Patrik Jensen \"svär vid Orange 2x12-kabinett\" (Ola Englund via Equipboard); Anders Björlers Peavey Supreme 160 gäller At the Gates. Genretypisk tolkning av svensk thrash.",
   "bridge humbucker", 0.3, ["https://equipboard.com/pros/patrik-jensen", "https://www.uberproaudio.com/who-plays-what/513-the-haunted-anders-bjoerler-guitar-rig-gear-and-equipment"],
   ["noise gate"])

# ============ Metallica ============
MET = src("https://guitarworld.com/news/metallicas-james-hetfield-and-kirk-hammett-john-petrucci-and-more-on-why-they-love-mesaboogies-mark-ii-amps",
          "https://en.wikipedia.org/wiki/Mesa/Boogie_Mark_IIC%2B", "https://www.groundguitar.com/james-hetfield-guitars-and-gear/james-hetfields-marshall-jmp-2203/")
METN = ("Metallica: Marshall (JCM800 2203) på de två första albumen; Mesa/Boogie Mark IIC+ från Master of Puppets, Hetfields huvudförstärkare "
        "genom ...And Justice for All och återupplivad på Death Magnetic. Svartalbumet: källorna går isär (Mark IIC+, Dual Rectifier, Marshall). "
        "Kirk Hammett: Cry Baby-wah på solon.")
MCL = "Mesa Boogie clean channel"
many("Metallica", "thrash metal", [
    # Kill 'Em All / Ride the Lightning – Marshall
    ("Whiplash", "1980s", "distorted", "riff", (8,6,5,6.5,6,1), {"amp": "Marshall JCM800 2203"}),
    ("Fight Fire with Fire", "1980s", "distorted", "riff", (8,6,5,6.5,6,1), {"amp": "Marshall JCM800 2203"}),
    ("Fade to Black", "1980s", "clean", "clean", (2,5,6,6,5.5,4), {"amp": MCL, "fx": ["chorus"], "pickup": "neck humbucker",
        "note": "Rent intro med chorus – förstärkarkanal och chorus är tolkning."}),
    # Master of Puppets / Justice – Mark IIC+
    ("Master of Puppets", "1980s", "clean", "clean", (2,5,6,6,5.5,4), {"amp": MCL, "pickup": "neck humbucker",
        "note": "Det rena mellanpartiet – tolkning."}),
    ("Welcome Home (Sanitarium)", "1980s", "clean", "clean", (2,5,6,6,5.5,4), {"amp": MCL, "fx": ["chorus"], "pickup": "neck humbucker",
        "note": "Rent intro – chorus är tolkning."}),
    ("Welcome Home (Sanitarium)", "1980s", "distorted", "riff", (7.5,6,5,6.5,6,1.5)),
    ("Battery", "1980s", "clean", "clean", (2,5,5.5,6,5.5,4), {"amp": MCL, "note": "Det harmoniserade intot (på skivan delvis akustiskt) – tolkning."}),
    ("Blackened", "1980s", "distorted", "riff", (8,5,4.5,6.5,6,1)),
    ("Harvester of Sorrow", "1980s", "distorted", "riff", (8,5,4.5,6.5,6,1)),
    ("One", "1980s", "clean", "clean", (2,5,6,6,5.5,4), {"amp": MCL, "fx": ["chorus"], "pickup": "neck humbucker",
        "note": "Rent intro – chorus är tolkning."}),
    # Svarta albumet
    ("The Unforgiven", "1990s", "clean", "clean", (2,5,6,6,5.5,3.5), {"amp": MCL, "pickup": "neck humbucker"}),
    ("The Unforgiven", "1990s", "distorted", "riff", (7,6.5,5,6,6,2)),
    ("Nothing Else Matters", "1990s", "clean", "clean", (2,5,6,6,5.5,3.5), {"amp": MCL, "pickup": "neck humbucker",
        "note": "Arpeggiointrot (originalet spelat på akustisk/ren el) – tolkning."}),
    ("Holier Than Thou", "1990s", "distorted", "riff", (7.5,6.5,5,6,6,1.5)),
    ("Through the Never", "1990s", "distorted", "riff", (7.5,6.5,5,6,6,1.5)),
    ("Of Wolf and Man", "1990s", "distorted", "riff", (7.5,6.5,5,6,6,1.5)),
    # Load / Reload – osäkert
    ("Fuel", "1990s", "distorted", "riff", (7.5,6.5,5.5,6.5,6,1.5), {"amp": "Mesa Boogie Dual Rectifier", "conf": 0.35,
        "note": "Förstärkaren för Load/Reload är inte bekräftad i källorna."}),
    ("The Memory Remains", "1990s", "distorted", "riff", (7,6.5,5.5,6.5,6,2), {"amp": "Mesa Boogie Dual Rectifier", "conf": 0.35,
        "note": "Förstärkaren för Load/Reload är inte bekräftad i källorna."}),
    ("King Nothing", "1990s", "distorted", "riff", (7,6.5,5.5,6.5,6,2), {"amp": "Mesa Boogie Dual Rectifier", "conf": 0.35,
        "note": "Förstärkaren för Load/Reload är inte bekräftad i källorna."}),
    # Death Magnetic / Hardwired
    ("The Day That Never Comes", "2000s", "distorted", "riff", (7.5,6,5,6.5,6,1.5)),
    ("All Nightmare Long", "2000s", "distorted", "riff", (8,6,5,6.5,6,1)),
    ("Cyanide", "2000s", "distorted", "riff", (8,6,5,6.5,6,1)),
    ("Moth Into Flame", "2010s", "distorted", "riff", (8,6,5,6.5,6,1), {"conf": 0.35, "note": "Förstärkaren för Hardwired är inte bekräftad."}),
    ("Hardwired", "2010s", "distorted", "riff", (8,6,5,6.5,6,1), {"conf": 0.35, "note": "Förstärkaren för Hardwired är inte bekräftad."}),
    ("Spit Out the Bone", "2010s", "distorted", "riff", (8,6,5,6.5,6,1), {"conf": 0.35, "note": "Förstärkaren för Hardwired är inte bekräftad."}),
], "Mesa Boogie Mark IIC+", "ESP / Gibson Explorer", METN, "bridge humbucker (EMG)", 0.45, MET, ["noise gate"])

# ============ Ozzy Osbourne ============
RR = src("https://www.guitarworld.com/features/randy-rhoads-crazy-train-tone-secrets",
         "https://guitar.com/features/artist-rigs/gear-used-by-randy-rhoads-blizzard-of-ozz-ozzy-osbourne",
         "https://www.guitarworld.com/features/ozzy-osbourne-randy-rhoads-recording-of-blizzard-of-ozz")
RRN = ("Randy Rhoads: hyrd, omodifierad Marshall JMP 1959 Super Lead MKII (100 W) på Blizzard of Ozz; MXR Distortion+ nästan alltid på, "
       "MXR 10-band EQ (mittenlyft runt 500 Hz), MXR stereo chorus och flanger, Cry Baby.")
many("Ozzy Osbourne", "heavy metal", [
    ("I Don't Know", "1980s", "distorted", "riff", (6.5,5.5,6.5,6.5,6,2)),
    ("Suicide Solution", "1980s", "distorted", "riff", (6.5,5.5,6.5,6.5,6,2)),
    ("Goodbye to Romance", "1980s", "clean", "clean", (2,5,6,6,5.5,3.5), {"fx": ["chorus"], "pickup": "neck humbucker"}),
    ("Goodbye to Romance", "1980s", "distorted", "solo", (6.5,5,7,6.5,6,3)),
    ("Revelation (Mother Earth)", "1980s", "distorted", "riff", (6.5,5.5,6.5,6.5,6,2.5)),
    ("Over the Mountain", "1980s", "distorted", "riff", (6.5,5.5,6.5,6.5,6,2)),
    ("Diary of a Madman", "1980s", "clean", "clean", (2,5,6,6,5.5,3.5), {"fx": ["chorus"], "pickup": "neck humbucker"}),
    ("Diary of a Madman", "1980s", "distorted", "riff", (6.5,5.5,6.5,6.5,6,2)),
    ("You Can't Kill Rock and Roll", "1980s", "distorted", "riff", (6.5,5.5,6.5,6.5,6,2.5)),
], "Marshall JMP 1959 Super Lead", "Gibson Les Paul Custom / Jackson Rhoads", RRN, "bridge humbucker", 0.5, RR, ["MXR Distortion+"])

JL = src("https://en.wikipedia.org/wiki/Jake_E._Lee")
many("Ozzy Osbourne", "heavy metal", [
    ("Bark at the Moon", "1980s", "distorted", "riff", (7.5,6,6,6.5,6.5,2)),
    ("Shot in the Dark", "1980s", "distorted", "riff", (7,6,6,6.5,6.5,2.5), {"fx": ["chorus"]}),
    ("Rock 'n' Roll Rebel", "1980s", "distorted", "riff", (7.5,6,6,6.5,6.5,2)),
], "Marshall", "Charvel (Jake E. Lee)", "Jake E. Lee-eran (1983-86). Ingen förstärkare dokumenterad i källorna jag hittade – Marshall-typ är en tolkning.",
   "bridge humbucker", 0.3, JL)

ZW = src("https://www.guitarworld.com/features/the-secrets-behind-zakk-wyldes-guitar-tone-on-ozzy-osbournes-no-more-tears",
         "https://www.premierguitar.com/articles/20658-no-rest-for-the-wylde")
ZWN = ("Zakk Wylde: No More Tears – två JCM800 2203 (6550-rör) i 1960B 4x12 med G12T-75; Les Paul med EMG. "
       "No Rest for the Wicked spelades in med rackutrustning (Lee Jackson GP-1000-förförstärkare). Phase 90, chorus, Rotovibe, Cry Baby.")
many("Ozzy Osbourne", "heavy metal", [
    ("Miracle Man", "1980s", "distorted", "riff", (8,6,6,6.5,6.5,2), {"amp": "Lee Jackson GP-1000 preamp", "conf": 0.35}),
    ("Crazy Babies", "1980s", "distorted", "riff", (8,6,6,6.5,6.5,2), {"amp": "Lee Jackson GP-1000 preamp", "conf": 0.35}),
    ("Mama, I'm Coming Home", "1990s", "clean", "clean", (2,5,6,6,5.5,3.5), {"fx": ["chorus"]}),
    ("Mama, I'm Coming Home", "1990s", "distorted", "solo", (7.5,5.5,6.5,6.5,6,3)),
    ("Hellraiser", "1990s", "distorted", "riff", (8,6,6,6.5,6.5,2)),
    ("I Don't Want to Change the World", "1990s", "distorted", "riff", (8,6,6,6.5,6.5,2)),
    ("Road to Nowhere", "1990s", "distorted", "riff", (7,6,6,6.5,6.5,3), {"fx": ["chorus"]}),
    ("Desire", "1990s", "distorted", "riff", (8,6,6,6.5,6.5,2), {"fx": ["MXR Phase 90"]}),
    ("Perry Mason", "1990s", "distorted", "riff", (8,6,6,6.5,6.5,2), {"conf": 0.35}),
], "Marshall JCM800 2203 into 1960B cab with G12T 75", "Gibson Les Paul (EMG)", ZWN, "bridge humbucker (EMG 81)", 0.45, ZW, ["noise gate"])

# ============ Black Sabbath ============
BS = src("https://www.guitarplayer.com/guitarists/tony-iommi-modified-treble-booster-thrown-out",
         "https://www.musicradar.com/artists/tony-iommi-secret-to-black-sabbath-electric-guitar-tone",
         "https://equipboard.com/albums/black-sabbath-paranoid")
BSN = ("Tony Iommi: Gibson SG -> modifierad Dallas Rangemaster -> Laney Supergroup (Normal-kanalen) från Paranoid till sent 80-tal. "
       "Paranoid-ljudet: basen nedvriden, mitten/diskant/presence på max. Från Master of Reality stämt ned 1,5 ton (C#).")
many("Black Sabbath", "heavy metal", [
    ("The Wizard", "1970s", "distorted", "riff", (6.5,3,8.5,8,8,2), {"fx": ["Dallas Rangemaster treble booster", "Cry Baby wah"]}),
    ("Behind the Wall of Sleep", "1970s", "distorted", "riff", (6.5,3,8.5,8,8,2)),
    ("Electric Funeral", "1970s", "distorted", "riff", (7,3,8.5,8,8,2), {"fx": ["Dallas Rangemaster treble booster", "wah"]}),
    ("Hand of Doom", "1970s", "distorted", "riff", (7,3,8.5,8,8,2)),
    ("Lord of This World", "1970s", "distorted", "riff", (7,3.5,8.5,8,8,2), {"note": "Nedstämt C#."}),
    ("Into the Void", "1970s", "distorted", "riff", (7,3.5,8.5,8,8,2), {"note": "Nedstämt C#."}),
    ("After Forever", "1970s", "distorted", "riff", (6.5,3.5,8.5,8,8,2), {"note": "Nedstämt C#."}),
    ("Snowblind", "1970s", "distorted", "riff", (7,3.5,8.5,8,8,2.5), {"note": "Nedstämt C#."}),
    ("Supernaut", "1970s", "distorted", "riff", (7,3.5,8.5,8,8,2), {"note": "Nedstämt C#."}),
    ("Wheels of Confusion", "1970s", "distorted", "riff", (7,3.5,8.5,8,8,2.5), {"note": "Nedstämt C#."}),
    ("Sabbath Bloody Sabbath", "1970s", "distorted", "riff", (7,4,8,8,8,2)),
    ("Symptom of the Universe", "1970s", "distorted", "riff", (7.5,4,8,8,8,2)),
    ("Hole in the Sky", "1970s", "distorted", "riff", (7,4,8,8,8,2)),
    ("Neon Knights", "1980s", "distorted", "riff", (7.5,4.5,7.5,7.5,7.5,2), {"note": "Dio-eran (Heaven and Hell, 1980)."}),
    ("Heaven and Hell", "1980s", "distorted", "riff", (7.5,4.5,7.5,7.5,7.5,2.5), {"note": "Dio-eran (Heaven and Hell, 1980)."}),
    ("Die Young", "1980s", "distorted", "riff", (7.5,4.5,7.5,7.5,7.5,2.5), {"note": "Dio-eran (Heaven and Hell, 1980)."}),
    ("The Mob Rules", "1980s", "distorted", "riff", (7.5,4.5,7.5,7.5,7.5,2), {"note": "Dio-eran (Mob Rules, 1981)."}),
    ("Paranoid", "1970s", "distorted", "solo", (7,3,8.5,8,8,2.5), {"fx": ["Dallas Rangemaster treble booster", "wah"],
        "note": "Solot (filtrerat genom wah/ringmodulator i studion) – wah är en approximation."}),
], "Laney Supergroup", "Gibson SG", BSN, "bridge P-90/humbucker", 0.55, BS, ["Dallas Rangemaster treble booster"])

# ============ Judas Priest ============
JP = src("https://guitarworld.com/gw-archive/kk-downing-and-glenn-tipton-judas-priest-talk-gear-1984-guitar-world-interview",
         "https://www.musicradar.com/news/guitars/judas-priests-glenn-tipton-and-kk-downing-talk-british-steel-248758",
         "https://equipboard.com/k-k-downing", "https://www.woodytone.com/?p=2157")
JPN = ("K.K. Downing och Glenn Tipton: Marshall-toppar (50 W runt 1980, JCM800/Super Lead senare), Marshall 4x12. "
       "Downing runt 1980: Pete Cornish-bräda med MXR Phase 100, Cry Baby och Echoplex. Tipton senare Engl. Flying V / Strat / SG.")
many("Judas Priest", "heavy metal", [
    ("Victim of Changes", "1970s", "distorted", "riff", (6.5,5.5,6.5,7,6.5,2.5)),
    ("Diamonds and Rust", "1970s", "distorted", "riff", (6,5.5,6.5,7,6.5,2.5)),
    ("Exciter", "1970s", "distorted", "riff", (7,5.5,6.5,7,6.5,2)),
    ("Hell Bent for Leather", "1970s", "distorted", "riff", (7,5.5,6.5,7,6.5,2)),
    ("Living After Midnight", "1980s", "distorted", "riff", (6.5,5.5,6.5,7,6.5,2)),
    ("Metal Gods", "1980s", "distorted", "riff", (7,5.5,6.5,7,6.5,2)),
    ("United", "1980s", "distorted", "riff", (6.5,5.5,6.5,7,6.5,2.5)),
    ("You've Got Another Thing Comin'", "1980s", "distorted", "riff", (7,5.5,6.5,7,6.5,2)),
    ("Electric Eye", "1980s", "distorted", "riff", (7.5,5.5,6.5,7,6.5,2)),
    ("Screaming for Vengeance", "1980s", "distorted", "riff", (7.5,5.5,6.5,7,6.5,2)),
    ("Freewheel Burning", "1980s", "distorted", "riff", (7.5,5.5,6.5,7,6.5,2)),
    ("Painkiller", "1990s", "distorted", "riff", (9,6,6,7,6.5,1.5), {"fx": ["noise gate"], "conf": 0.4,
        "note": "Painkiller (1990): mycket hög gain – exakt förstärkare för albumet är inte bekräftad."}),
    ("A Touch of Evil", "1990s", "distorted", "riff", (8.5,6,6,7,6.5,2.5), {"fx": ["noise gate"], "conf": 0.4}),
    ("Night Crawler", "1990s", "distorted", "riff", (8.5,6,6,7,6.5,2.5), {"fx": ["noise gate"], "conf": 0.4}),
    ("Electric Eye", "1980s", "distorted", "solo", (8,5,7,7,6.5,2.5), {"fx": ["Cry Baby wah"]}),
], "Marshall", "Gibson Flying V / Fender Stratocaster", JPN, "bridge humbucker", 0.45, JP)

# ============ Guns N' Roses ============
GNR = src("https://guitarworld.com/features/slash-appetite-reconstruction",
          "https://www.guitarworld.com/features/slashs-guitar-gear-everything-you-need-to-nail-the-guns-n-roses-legends-sound",
          "https://musicradar.com/news/the-story-of-slashs-signature-marshall-amps-and-how-they-capture-his-classic-tones")
GNRN = ("Slash på Appetite for Destruction: Kris Derrig-kopia av en -59 Les Paul -> hyrd, modifierad Marshall Super Lead (S.I.R. #39) "
        "med Vintage 30-kabinett. Use Your Illusion: Marshall (modell inte bekräftad i källorna). Cry Baby på solon.")
many("Guns N' Roses", "hard rock", [
    ("Nightrain", "1980s", "distorted", "riff", (7.5,6,6.5,6.5,6,2)),
    ("It's So Easy", "1980s", "distorted", "riff", (7.5,6,6.5,6.5,6,2)),
    ("Out ta Get Me", "1980s", "distorted", "riff", (7.5,6,6.5,6.5,6,2)),
    ("My Michelle", "1980s", "distorted", "riff", (7.5,6,6.5,6.5,6,2)),
    ("Rocket Queen", "1980s", "distorted", "riff", (7.5,6,6.5,6.5,6,2)),
    ("Think About You", "1980s", "distorted", "riff", (7,6,6.5,6.5,6,2)),
    ("Sweet Child O' Mine", "1980s", "distorted", "solo", (7.5,5.5,7,6.5,6,2.5), {"fx": ["Cry Baby wah"],
        "note": "Wah-delen av solot."}),
    ("You Could Be Mine", "1990s", "distorted", "riff", (8,6,6.5,6.5,6,2), {"amp": "Marshall", "conf": 0.4}),
    ("Live and Let Die", "1990s", "distorted", "riff", (7.5,6,6.5,6.5,6,2.5), {"amp": "Marshall", "conf": 0.4}),
    ("Civil War", "1990s", "distorted", "riff", (7.5,6,6.5,6.5,6,2.5), {"amp": "Marshall", "conf": 0.4}),
    ("Estranged", "1990s", "distorted", "solo", (7.5,5.5,7,6.5,6,3.5), {"amp": "Marshall", "conf": 0.4, "fx": ["delay"]}),
    ("Yesterdays", "1990s", "distorted", "riff", (7,6,6.5,6.5,6,2.5), {"amp": "Marshall", "conf": 0.4}),
], "Marshall Super Lead (modded S.I.R. rental)", "Gibson Les Paul (Derrig '59 replica)", GNRN, "bridge humbucker", 0.5, GNR)

# ============ Def Leppard ============
DL = src("https://www.guitarworld.com/gw-archive/interview-phil-collen-making-def-leppards-hysteria",
         "https://guitar.com/features/artist-rigs/gear-used-by-phil-collen-steve-clark-def-leppard-hysteria",
         "https://www.guitarworld.com/features/phil-collen-on-def-leppard-pyromania")
DLN = ("Steve Clark: Marshall JCM-toppar på de tre första albumen. Phil Collen på Pyromania: Marshall JMP utan mastervolym. "
       "Hysteria: 99 % av gitarrerna genom en Tom Scholz Rockman (Gallien-Krueger för feedbackpartier).")
HY = "Tom Scholz Rockman"
HYFX = ["compressor", "chorus", "delay"]
many("Def Leppard", "hard rock", [
    ("Let It Go", "1980s", "distorted", "riff", (6.5,5.5,6.5,6.5,6,2), {"amp": "Marshall JCM800"}),
    ("Bringin' On the Heartbreak", "1980s", "clean", "clean", (2.5,5,6,6.5,6,3.5), {"amp": "Marshall JCM800", "fx": ["chorus"], "pickup": "neck"}),
    ("Bringin' On the Heartbreak", "1980s", "distorted", "riff", (6.5,5.5,6.5,6.5,6,2.5), {"amp": "Marshall JCM800"}),
    ("Photograph", "1980s", "distorted", "riff", (7,5.5,6.5,7,6.5,2.5)),
    ("Rock of Ages", "1980s", "distorted", "riff", (7,5.5,6.5,7,6.5,2.5)),
    ("Foolin'", "1980s", "distorted", "riff", (6.5,5.5,6.5,7,6.5,3)),
    ("Too Late for Love", "1980s", "distorted", "riff", (6.5,5.5,6.5,7,6.5,3)),
    ("Stagefright", "1980s", "distorted", "riff", (7,5.5,6.5,7,6.5,2)),
    ("Animal", "1980s", "distorted", "riff", (6.5,5,6,7,6.5,3), {"amp": HY, "fx": HYFX}),
    ("Hysteria", "1980s", "clean", "clean", (3,5,6,7,6.5,3.5), {"amp": HY, "fx": HYFX}),
    ("Armageddon It", "1980s", "distorted", "riff", (6.5,5,6,7,6.5,3), {"amp": HY, "fx": HYFX}),
    ("Rocket", "1980s", "distorted", "riff", (6.5,5,6,7,6.5,3), {"amp": HY, "fx": HYFX}),
    ("Love Bites", "1980s", "clean", "clean", (3,5,6,7,6.5,4), {"amp": HY, "fx": HYFX}),
    ("Women", "1980s", "distorted", "riff", (6.5,5,6,7,6.5,3), {"amp": HY, "fx": HYFX}),
], "Marshall JMP", "Gibson Les Paul / Fender Stratocaster", DLN, "bridge humbucker", 0.5, DL)

ds = dict(source="Egen research (sammanställd vid utveckling – appen använder ingen AI)",
          sourceUrl="", homepage="", license="Egen sammanställning; källor anges per post",
          attribution="Egen research – källor per låt",
          importedAt="2026-11-10", count=len(tones), tones=tones)
json.dump(ds, open(out, "w"), ensure_ascii=False, indent=2)
print(len(tones), "tones")
