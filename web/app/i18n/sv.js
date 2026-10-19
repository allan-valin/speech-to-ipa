// Svenska: same keys as pt.js (the reference).
export default {
  dec: ",",
  title: "Tal → IPA",
  tagline: "Snäv fonetisk transkription av det som sades, inte av det som ordboken säger. Allt körs på din enhet; ljudet lämnar den aldrig.",
  menu: "Meny", close: "Stäng", closed: "Fönstret stängt.",
  "menu.options": "Alternativ", "menu.sources": "Källor", "menu.help": "Hjälp", "menu.opened": "Meny öppen: {tab}.",
  "lang.set": "Språk: {name}.",
  "instr.title": "Instruktioner",
  "instr.1": "Tryck på <b>▶</b> för att spela in och på <b>■</b> för att stoppa.",
  "instr.2": "Första gången frågar appen innan den laddar ner modellerna (cirka 1,3 GB för de fem rekommenderade). Bara första gången går långsamt.",
  "instr.3": "Webbläsaren ber om <b>mikrofonen</b> och kan fråga om webbplatsen får <b>lagra data permanent</b>: tillåt båda. Datan är modellerna, inte dina inspelningar; utan det kan webbläsaren radera dem och då laddas de ner igen.",
  "instr.4": "I resultatet kan du <b>trycka på symbolerna</b> för att höra varje ljud.",
  "instr.5": "Modeller, källor och utförlig hjälp: knappen <b>☰</b> högst upp.",
  "rec.title": "Spela in", "rec.start": "Spela in", "rec.stop": "Stoppa", "rec.file": "Välj en ljudfil",
  "rec.recording": "Spelar in… tryck på ■ för att stoppa.", "rec.stopped": "Inspelningen stoppad.", "rec.label": "Inspelning",
  busy: "Vänta: transkriberar fortfarande.",
  "mic.title": "Mikrofon", "mic.allow": "Tillåt mikrofonen", "mic.note": "Mikrofonen är på bara medan du spelar in.",
  "mic.st.granted": "Tillåten.", "mic.st.prompt": "Inte tillåten än.", "mic.st.denied": "Blockerad.", "mic.denied": "Mikrofonen är inte tillåten ({err}). Se hur du tillåter den i ☰ → Alternativ.",
  "mic.ok": "Mikrofonen tillåten. Den slås på bara medan du spelar in.",
  "mic.blocked": "Webbläsaren blockerade mikrofonen. För att tillåta den: tryck på ikonen bredvid webbplatsens adress → Behörigheter (eller Webbplatsinställningar) → Mikrofon → Tillåt. På iPhone: Inställningar → Safari → Mikrofon. Ladda sedan om sidan.",
  "audio.bad": "Kunde inte läsa det här ljudet ({err}).", "audio.got": "{s} ljud. Transkriberar…",
  "audio.silent": "Inspelningen ({s}) verkar vara tyst: mikrofonen fångade nästan ingenting. Försök igen, närmare mikrofonen.",
  "store.bad": "Inspelningen kunde inte sparas i webbläsaren ({err}).", "store.readBad": "Kunde inte läsa de sparade inspelningarna ({err}).",
  "file.chosen": "Vald fil: {name}.",
  "opt.lang": "Språk", "opt.models": "Modeller",
  "opt.modelsNote": "Vi rekommenderar de fem första. De andra kommer från samma artikel; se Hjälp för varför just dessa fem och när du kan byta. PER och PFER: fel på referensmängden (lägre är bättre).",
  "opt.recommended": "Rekommenderade", "opt.others": "Andra modeller från artikeln",
  "opt.total": "{n} modell(er) valda, {size} totalt.",
  "opt.heavy": "Många modeller samtidigt kan få webbläsaren att krascha på svagare enheter. En i taget är säkrare.",
  "opt.how": "Hur de körs", "opt.seq": "En i taget (rekommenderas)", "opt.all": "Alla på en gång",
  "opt.seqMsg": "Läge: en i taget.", "opt.allMsg": "Läge: alla på en gång.",
  "opt.advanced": "Avancerat", "opt.backend": "Bearbetning",
  "opt.onMsg": "På: {what}.", "opt.offMsg": "Av: {what}.",
  "model.soon": "inte konverterad än", "model.cached": "nedladdad", "model.toDownload": "{size} att ladda ner",
  "model.delete": "radera", "model.deleted": "{name} raderad från webbläsaren ({size} frigjort).",
  "model.on": "{name} vald.", "model.off": "{name} avmarkerad.",
  "dl.title": "Ladda ner modellerna?",
  "dl.text": "Modellerna nedan laddas ner till din enhet för att bearbeta ljudet. Du kan radera dem senare i ☰ → Alternativ, där du också kan välja andra modeller och vilka som ska laddas ner (minst en behövs för att se resultat).",
  "dl.persist": "Om webbläsaren frågar om webbplatsen får lagra data permanent, tillåt det: det gäller de här modellerna.",
  "dl.yes": "Ladda ner och transkribera", "dl.no": "Inte nu", "dl.total": "Totalt",
  "dl.declined": "Ingenting laddades ner. Inspelningen är sparad; använd ”Gör om från början” när du vill.",
  "run.none": "Ingen modell vald. Välj minst en i ☰ → Alternativ.",
  "run.allDone": "De valda modellerna har redan körts på den här inspelningen. För att köra dem igen, använd ”Gör om från början”.",
  "run.loading": "Förbereder {name} ({step})…", "run.downloading": "Laddar ner {name} ({step}): {got} av {size} MB",
  "run.transcribing": "Transkriberar med {name} ({step})…",
  "run.loaded": "{name}: {how}, klar på {s}.", "run.fromCache": "läst från enheten", "run.downloaded": "nedladdad",
  "run.notStored": "Fick inte plats i webbläsarens lagring: den laddas ner igen nästa gång.",
  "run.done": "Klart: {n} modell(er) kördes.",
  "run.error": "FEL: {err}. Om webbläsaren kraschade, prova ”En i taget” eller färre modeller.",
  "res.title": "Resultat", "res.tap": "👆 Tryck på symbolerna för att höra varje ljud",
  "res.wide": "Samma bredd för alla symboler", "res.align": "Justera i kolumner",
  "res.edit": "Redigera konsensus", "res.play": "Spela upp inspelningen", "res.redo": "Gör om från början",
  "res.redoing": "Gör om från början: alla valda modeller körs igen på den här inspelningen.",
  "res.runMissing": "Kör även: {names}",
  "res.export": "Exportera (.zip)", "res.share": "Dela (t.ex. Google Drive)",
  "res.zip": ".zip-filen innehåller en mapp med ljudet (WAV), varje modells transkription, konsensus och din redigering (TXT), tider och alternativ (JSON) och en TextGrid för Praat.",
  "res.consensus": "Konsensus", "res.nothing": "(ingenting igenkänt)",
  "res.none": "Ingen modell har körts på den här inspelningen än. Tryck på ”Gör om från början”.",
  "res.working": "Transkriberar…",
  "res.few": "Med färre än 3 modeller betyder konsensus lite.",
  "res.flagged": "{n} av {of} konsensussymbol(er) utan majoritet (markerade). · = modellen hörde ingenting där.",
  "res.empty": "Inget resultat: {names} (inspelningen kan vara för kort eller för tyst).",
  "alt.nothing": "ingenting", "alt.majority": "Majoritet.", "alt.noMajority": "Ingen majoritet.",
  "play.all": "Spelar upp inspelningen.", "play.part": "Spelar upp {a}–{b} s.",
  "play.silent": "Spelar upp inspelningen, men den är tyst: mikrofonen fångade inget ljud.",
  "play.noTime": "Den här symbolen har ingen tid (WhIPA markerar inte det); tryck på samma kolumn i en annan modell.",
  "ed.hint": "Tryck på en symbol för att markera den och välj sedan vad du vill göra.",
  "ed.left": "← Infoga till vänster", "ed.swap": "Byt symbol", "ed.right": "Infoga till höger →",
  "ed.mark": "Lägg till diakritiskt tecken", "ed.del": "Radera symbol",
  "ed.save": "Spara redigering", "ed.cancel": "Avbryt", "ed.reset": "Tillbaka till konsensus",
  "ed.opened": "Redigeraren öppen med konsensus.", "ed.empty": "(tom: använd ”Infoga till höger”)",
  "ed.pick": "Markera en symbol först.", "ed.changed": "{a} → {b}", "ed.deleted": "Symbolen raderad.",
  "ed.saved": "Redigeringen sparad; den följer med i exporten.", "ed.cancelled": "Redigeringen avbruten.",
  "ed.resetDone": "Redigeringen kasserad; konsensus gäller.", "ed.yours": "Din redigering",
  "pk.title": "Välj typ av symbol",
  "pk.for.left": "Infoga till vänster: typ av symbol", "pk.for.right": "Infoga till höger: typ av symbol",
  "pk.for.swap": "Byt mot: typ av symbol", "pk.for.mark": "Lägg till på symbolen: typ av tecken",
  "pk.vowels": "Vokaler", "pk.pulmonic": "Konsonanter (pulmoniska)", "pk.nonpulmonic": "Icke-pulmoniska konsonanter",
  "pk.other": "Andra symboler", "pk.diacritics": "Diakritiska tecken", "pk.suprasegmentals": "Suprasegmentalia",
  "pk.tones": "Toner och ordaccenter",
  "pk.vowelNote": "Som i IPA-diagrammet: där symbolerna står i par är den högra rundad.",
  "pk.consNote": "Som i IPA-diagrammet (revisionen 2020): i varje ruta står den tonande till höger. Grå rutor: artikulationer som bedöms omöjliga. Scrolla i sidled för att se alla kolumner.",
  "pk.v.h0": "sluten", "pk.v.h1": "nästan sluten", "pk.v.h2": "halvsluten", "pk.v.h3": "mellan", "pk.v.h4": "halvöppen",
  "pk.v.h5": "nästan öppen", "pk.v.h6": "öppen",
  "pk.v.b0": "främre", "pk.v.b1": "nästan främre", "pk.v.b2": "central", "pk.v.b3": "nästan bakre", "pk.v.b4": "bakre",
  "pk.v.r": "rundad", "pk.v.u": "orundad",
  "exp.nothing": "Inget att exportera: kör minst en modell.", "exp.saved": "Exporterad: {name}.",
  "exp.cancelled": "Exporten avbruten.", "exp.noPicker": "Fönstret ”Spara som” är inte tillgängligt ({err}); laddar ner filen.",
  "exp.downloading": "Laddar ner {name}. Webbläsaren kan fråga var den ska sparas.",
  "exp.shared": "Delad.", "exp.shareCancelled": "Delningen avbruten.", "exp.shareFailed": "Kunde inte dela ({err}).",
  "recs.title": "Inspelningar", "recs.none": "Inga inspelningar än.", "recs.noIpa": "(ingen transkription)",
  "recs.open": "Öppna", "recs.delete": "Radera", "recs.opened": "Inspelningen öppnad.",
  "recs.confirmDelete": "Radera den här inspelningen från webbläsaren?", "recs.deleted": "Inspelningen raderad.",
  "recs.folder": "Importera mapp", "recs.zips": "Importera .zip",
  "recs.importHint": "Välj mappen där du sparar dina exporter (eller själva .zip-filerna): inspelningarna kommer tillbaka till listan med sina transkriptioner.",
  "imp.none": "Ingen .zip, .wav eller .json hittades.", "imp.reading": "Läser {n} fil(er)…",
  "imp.failed": "Kunde inte importera ({err}).", "imp.done": "Importerade: {added}. Redan i listan: {skipped}.",
  "log.title": "Logg (vad appen gjorde)",
  ready: "Klar ({threads} tråd(ar)).",
  "help.html": `
<h3>Steg för steg</h3>
<ol>
  <li>Tryck på <b>▶</b>. Första gången ber webbläsaren om mikrofonen: tillåt den. Mikrofonen är på bara medan du spelar in.</li>
  <li>Vänta en halv sekund och tala. Tryck på <b>■</b> för att stoppa.</li>
  <li>Vid den första transkriptionen visar appen vilka modeller den ska ladda ner och hur mycket plats de tar. Godkänn för att fortsätta.
    Om webbläsaren frågar om webbplatsen får <b>lagra data permanent</b>, tillåt det: det är modellerna. Då går bara första gången långsamt.</li>
  <li>Förloppsindikatorn visar vad som händer: vilken modell som laddas ner (MB) eller transkriberar.</li>
  <li>I resultatet är varje rad en modell; den sista raden är <b>konsensus</b>.</li>
</ol>
<h3>Att läsa resultatet</h3>
<ul>
  <li>Symbolerna står i kolumner: samma ljud hamnar i samma kolumn. <b>·</b> betyder att den modellen inte hörde något där.</li>
  <li>Markerat i orange: ingen majoritet. Dessa symboler är fel mer än dubbelt så ofta som de andra: kontrollera dem med örat.</li>
  <li>Tryck på en symbol för att <b>höra det avsnittet</b> av din inspelning och se vem som röstade på vad.</li>
  <li>”Samma bredd” gör varje symbol lika bred som ett m, så de blir lättare att trycka på. ”Justera i kolumner” kan stängas av för att läsa varje rad som löpande text.</li>
</ul>
<h3>Redigera konsensus</h3>
<ul>
  <li>”Redigera konsensus” öppnar transkriptionen. Tryck på en symbol och välj: infoga till vänster, byt, infoga till höger, lägg till ett diakritiskt tecken eller radera.</li>
  <li>Först väljer du typ (vokaler, konsonanter, diakritiska tecken…); varje typ är ordnad som i IPA-diagrammet.</li>
  <li>”Spara redigering” behåller din version, som följer med i exporten; den ursprungliga konsensus finns också kvar.</li>
</ul>
<h3>Inspelningar, export och import</h3>
<ul>
  <li>Inspelningarna stannar i webbläsaren. ”Gör om från början” kör alla valda modeller igen på den inspelningen.</li>
  <li>”Exportera” skapar en .zip med en mapp inuti: WAV-ljud, text, JSON (tider och alternativ) och en TextGrid för Praat.</li>
  <li>För att få tillbaka dem: ”Importera mapp” (välj mappen där du sparar dina exporter) eller ”Importera .zip”.</li>
</ul>
<h3>Längd</h3>
<ul>
  <li>Det finns inget tekniskt minimum, men under ~0,5 s tal känner modellerna sällan igen något. Ett kort ord fungerar; lämna en andning före och efter.</li>
  <li>Maximum: WhIPA hör bara de första 30 s. De andra tar mer, men långa inspelningar belastar minnet; håll dig till fraser på upp till 30 s.</li>
  <li>Om en modell visar ”(ingenting igenkänt)”, spela upp inspelningen: om den är tyst fångade mikrofonen inget ljud.</li>
</ul>
<h3>Modellerna: varför just dessa fem</h3>
<ul>
  <li>De fem rekommenderade är artikelns bästa på referensmängden (VoxAngeles, 95 språk) som får plats i en webbläsare, och de skiljer sig från varandra:
    olika arkitekturer och träningsdata gör fel på olika ställen, så när de är överens betyder det något.
    På 760 inspelningar får konsensus 47,1 % av fonerna fel mot 49,4 % för den bästa enskilda modellen; symboler med majoritet är rätt 69 % av gångerna, markerade bara 27 %.</li>
  <li><b>Wav2Vec2Phoneme</b> är näst bäst på egen hand (PER 53,0), men den lärde sig från ordboksuttal (eSpeak): den drar åt ”läroboksuttalet”, vilket den här appen vill undvika. Den skulle ersätta WhIPA om du accepterar det. Inte konverterad än.</li>
  <li><b>LoWhIPA comb</b> är bättre än WhIPA base (77,8 mot 83,7) i samma storlek: en kandidat att ersätta WhIPA. Inte konverterad än.</li>
  <li><b>ZIPA large</b> finns, men på referensmängden gick den sämre än lilla ZIPA (69,1 mot 64,2) och den är 4 gånger större: bara som en extra röst.</li>
  <li><b>Allophant</b> (71,0) och <b>Allosaurus</b> (91,7, från 2020) är mest till för jämförelse. <b>WhIPA large</b> (69,4) har 1,5 miljarder parametrar: för stor för en webbläsare.</li>
  <li>Har du plats? Välj allt. Majoriteten är alltid ”mer än hälften av modellerna som kördes”; med ett jämnt antal modeller markeras oavgjorda. Byten är ännu inte uppmätta i konsensus.</li>
</ul>
<h3>Utrymme och cache</h3>
<ul>
  <li>Modellerna sparas i webbläsaren. ”Radera” i ☰ → Alternativ frigör utrymmet; att rensa webbläsarens data raderar dem också, och då laddas de ner igen.</li>
</ul>
<h3>Källkod och offlineanvändning</h3>
<p>Källkod och hur du kör appen på din egen dator: <a href="https://github.com/allan-valin/speech-to-ipa#run-it-locally">github.com/allan-valin/speech-to-ipa</a>.</p>`,
  "src.paper": "Artikeln bakom appen",
  "src.paperText": "Modellerna valdes utifrån resultaten i",
  "src.models": "Modeller", "src.model": "modell", "src.copy": "konverterad kopia", "src.license": "licens",
  "src.data": "Data och verktyg",
  "src.nc": "Icke-kommersiell användning: två av modellerna är CC BY-NC-SA 4.0.",
  "src.code": "Källkod",
  "instr.6": "Tala i normal takt, inte för snabbt; inspelningar längre än 1 sekund fungerar bättre.",
  "run.reading": "Läser {name} från enheten ({step})…",
  "theme.toLight": "Byt till ljust tema",
  "theme.toDark": "Byt till mörkt tema",
  "theme.light": "Ljust tema.",
  "theme.dark": "Mörkt tema.",
};
