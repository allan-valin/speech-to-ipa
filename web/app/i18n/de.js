export default {
  dec: ",",
  title: "Sprache → IPA",
  tagline: "Enge phonetische Transkription dessen, was gesagt wurde, nicht dessen, was das Wörterbuch sagt. Alles läuft auf deinem Gerät; der Ton verlässt es nicht.",
  menu: "Menü", close: "Schließen", closed: "Fenster geschlossen.",
  "menu.options": "Optionen", "menu.sources": "Quellen", "menu.help": "Hilfe", "menu.opened": "Menü geöffnet: {tab}.",
  "lang.set": "Sprache: {name}.",
  "instr.title": "Anleitung",
  "instr.1": "Tippe auf <b>▶</b>, um aufzunehmen, und auf <b>■</b>, um zu stoppen.",
  "instr.2": "Beim ersten Mal fragt die App, ob sie die Modelle herunterladen darf (etwa 1,3 GB mit den fünf empfohlenen). Nur das erste Mal dauert.",
  "instr.3": "Der Browser fragt nach dem <b>Mikrofon</b> und eventuell, ob die Seite <b>Daten dauerhaft speichern</b> darf: Erlaube beides. Die Daten sind die Modelle, nicht die Aufnahmen; ohne diese Erlaubnis kann der Browser sie löschen, und sie werden erneut heruntergeladen.",
  "instr.4": "Im Ergebnis <b>tippst du auf die Symbole</b>, um jeden Laut zu hören.",
  "instr.5": "Modelle, Quellen und ausführliche Hilfe: Taste <b>☰</b> oben.",
  "rec.title": "Aufnehmen", "rec.start": "Aufnehmen", "rec.stop": "Stopp", "rec.file": "Audiodatei wählen",
  "rec.recording": "Aufnahme läuft … tippe auf ■, um zu stoppen.", "rec.stopped": "Aufnahme beendet.", "rec.label": "Aufnahme",
  busy: "Warte: Ich transkribiere noch.",
  "mic.title": "Mikrofon", "mic.allow": "Mikrofon erlauben", "mic.note": "Das Mikrofon ist nur eingeschaltet, während du aufnimmst.",
  "mic.st.granted": "Erlaubt.", "mic.st.prompt": "Noch nicht erlaubt.", "mic.st.denied": "Blockiert.", "mic.denied": "Mikrofon nicht erlaubt ({err}). Wie du es freigibst, steht unter ☰ → Optionen.",
  "mic.ok": "Mikrofon erlaubt. Es schaltet sich nur ein, während du aufnimmst.",
  "mic.blocked": "Der Browser hat das Mikrofon blockiert. Zum Freigeben: Tippe auf das Symbol neben der Adresse der Seite → Berechtigungen (oder Website-Einstellungen) → Mikrofon → Erlauben. Auf dem iPhone: Einstellungen → Safari → Mikrofon. Lade die Seite danach neu.",
  "audio.bad": "Ich konnte diesen Ton nicht lesen ({err}).", "audio.got": "{s} Ton. Transkribiere …",
  "audio.silent": "Die Aufnahme ({s}) scheint still zu sein: Das Mikrofon hat fast nichts aufgenommen. Versuch es noch einmal, näher am Mikrofon.",
  "store.bad": "Die Aufnahme konnte nicht im Browser gespeichert werden ({err}).", "store.readBad": "Ich konnte die gespeicherten Aufnahmen nicht lesen ({err}).",
  "file.chosen": "Gewählte Datei: {name}.",
  "opt.lang": "Sprache", "opt.models": "Modelle",
  "opt.modelsNote": "Wir empfehlen die ersten fünf. Die anderen stammen aus demselben Artikel; unter Hilfe steht, warum diese fünf und wann du wechseln solltest. PER und PFER: Fehler im Referenzdatensatz (kleiner ist besser).",
  "opt.recommended": "Empfohlen", "opt.others": "Weitere Modelle aus dem Artikel",
  "opt.total": "{n} Modell(e) ausgewählt, insgesamt {size}.",
  "opt.heavy": "Viele Modelle gleichzeitig können den Browser auf schwächeren Geräten einfrieren lassen. Eins nach dem anderen ist sicherer.",
  "opt.how": "Ausführung", "opt.seq": "Eins nach dem anderen (empfohlen)", "opt.all": "Alle gleichzeitig",
  "opt.seqMsg": "Modus: eins nach dem anderen.", "opt.allMsg": "Modus: alle gleichzeitig.",
  "opt.advanced": "Erweitert", "opt.backend": "Verarbeitung",
  "opt.onMsg": "Eingeschaltet: {what}.", "opt.offMsg": "Ausgeschaltet: {what}.",
  "model.soon": "noch nicht konvertiert", "model.cached": "heruntergeladen", "model.toDownload": "{size} herunterzuladen",
  "model.delete": "löschen", "model.deleted": "{name} aus dem Browser gelöscht ({size} frei).",
  "model.on": "{name} ausgewählt.", "model.off": "{name} abgewählt.",
  "dl.title": "Modelle herunterladen?",
  "dl.text": "Die folgenden Modelle werden auf dein Gerät heruntergeladen, um den Ton zu verarbeiten. Du kannst sie später unter ☰ → Optionen löschen; dort kannst du auch andere Modelle wählen und festlegen, welche heruntergeladen werden (für Ergebnisse brauchst du mindestens eins).",
  "dl.persist": "Wenn der Browser fragt, ob die Seite Daten dauerhaft speichern darf, erlaube es: Das sind diese Modelle.",
  "dl.yes": "Herunterladen und transkribieren", "dl.no": "Jetzt nicht", "dl.total": "Gesamt",
  "dl.declined": "Nichts wurde heruntergeladen. Die Aufnahme ist gespeichert; nutze „Neu berechnen“, wann immer du willst.",
  "run.none": "Kein Modell ausgewählt. Wähle unter ☰ → Optionen mindestens eins aus.",
  "run.allDone": "Die ausgewählten Modelle sind für diese Aufnahme schon gelaufen. Um sie erneut auszuführen, nutze „Neu berechnen“.",
  "run.loading": "Bereite {name} vor ({step}) …", "run.downloading": "Lade {name} herunter ({step}): {got} von {size} MB",
  "run.transcribing": "Transkribiere mit {name} ({step}) …",
  "run.loaded": "{name}: {how}, bereit in {s}.", "run.fromCache": "vom Gerät gelesen", "run.downloaded": "heruntergeladen",
  "run.notStored": "Hat nicht in den Browserspeicher gepasst: Wird beim nächsten Mal erneut heruntergeladen.",
  "run.done": "Fertig: {n} Modell(e) gelaufen.",
  "run.error": "FEHLER: {err}. Wenn der Browser eingefroren ist, versuch „Eins nach dem anderen“ oder weniger Modelle.",
  "res.title": "Ergebnis", "res.tap": "👆 Tippe auf die Symbole, um jeden Laut zu hören",
  "res.wide": "Gleiche Breite für alle Symbole", "res.align": "In Spalten ausrichten",
  "res.edit": "Konsens bearbeiten", "res.play": "Aufnahme anhören", "res.redo": "Neu berechnen",
  "res.redoing": "Neu berechnen: Alle ausgewählten Modelle laufen für diese Aufnahme erneut.",
  "res.runMissing": "Auch ausführen: {names}",
  "res.export": "Exportieren (.zip)", "res.share": "Teilen (z. B. Google Drive)",
  "res.zip": "Die .zip enthält einen Ordner mit dem Ton (WAV), der Transkription jedes Modells, dem Konsens und deiner Bearbeitung (TXT), Zeiten und Alternativen (JSON) und einem TextGrid für Praat.",
  "res.consensus": "Konsens", "res.nothing": "(nichts erkannt)",
  "res.none": "Für diese Aufnahme ist noch kein Modell gelaufen. Tippe auf „Neu berechnen“.",
  "res.working": "Transkribiere …",
  "res.few": "Mit weniger als 3 Modellen ist der Konsens wenig wert.",
  "res.flagged": "{n} von {of} Konsens-Symbol(en) ohne Mehrheit (hervorgehoben). · = Das Modell hat dort nichts gehört.",
  "res.empty": "Kein Ergebnis: {names} (die Aufnahme ist vielleicht zu kurz oder zu leise).",
  "alt.nothing": "nichts", "alt.majority": "Mehrheit.", "alt.noMajority": "Keine Mehrheit.",
  "play.all": "Spiele die Aufnahme ab.", "play.part": "Spiele {a}–{b} s ab.",
  "play.silent": "Spiele die Aufnahme ab, aber sie ist still: Das Mikrofon hat keinen Ton aufgenommen.",
  "play.noTime": "Dieses Symbol hat keine Zeitmarke (WhIPA setzt keine); tippe auf dieselbe Spalte bei einem anderen Modell.",
  "ed.hint": "Tippe auf ein Symbol, um es auszuwählen, und wähle dann, was du tun willst.",
  "ed.left": "← Links einfügen", "ed.swap": "Symbol ersetzen", "ed.right": "Rechts einfügen →",
  "ed.mark": "Diakritikum hinzufügen", "ed.del": "Symbol löschen",
  "ed.save": "Bearbeitung speichern", "ed.cancel": "Abbrechen", "ed.reset": "Zurück zum Konsens",
  "ed.opened": "Editor mit dem Konsens geöffnet.", "ed.empty": "(leer: nutze „Rechts einfügen“)",
  "ed.pick": "Wähle zuerst ein Symbol aus.", "ed.changed": "{a} → {b}", "ed.deleted": "Symbol gelöscht.",
  "ed.saved": "Bearbeitung gespeichert; sie kommt mit in den Export.", "ed.cancelled": "Bearbeitung abgebrochen.",
  "ed.resetDone": "Bearbeitung verworfen; es gilt der Konsens.", "ed.yours": "Deine Bearbeitung",
  "pk.title": "Wähle die Art des Symbols",
  "pk.for.left": "Links einfügen: Art des Symbols", "pk.for.right": "Rechts einfügen: Art des Symbols",
  "pk.for.swap": "Ersetzen durch: Art des Symbols", "pk.for.mark": "Zum Symbol hinzufügen: Art des Zeichens",
  "pk.vowels": "Vokale", "pk.pulmonic": "Konsonanten (pulmonal)", "pk.nonpulmonic": "Nicht-pulmonale Konsonanten",
  "pk.other": "Andere Symbole", "pk.diacritics": "Diakritika", "pk.suprasegmentals": "Suprasegmentalia",
  "pk.tones": "Töne und Wortakzente",
  "pk.vowelNote": "Wie in der IPA-Tabelle: In jedem Paar steht rechts der gerundete Vokal.",
  "pk.consNote": "Wie in der IPA-Tabelle (Revision 2020): In jeder Zelle steht rechts der stimmhafte Laut. Graue Zellen: als unmöglich geltende Artikulationen. Wische seitlich, um alle Spalten zu sehen.",
  "pk.v.h0": "geschlossen", "pk.v.h1": "fast geschlossen", "pk.v.h2": "halbgeschlossen", "pk.v.h3": "mittel", "pk.v.h4": "halboffen",
  "pk.v.h5": "fast offen", "pk.v.h6": "offen",
  "pk.v.b0": "vorne", "pk.v.b1": "fast vorne", "pk.v.b2": "zentral", "pk.v.b3": "fast hinten", "pk.v.b4": "hinten",
  "pk.v.r": "gerundet", "pk.v.u": "ungerundet",
  "exp.nothing": "Nichts zu exportieren: Führe mindestens ein Modell aus.", "exp.saved": "Exportiert: {name}.",
  "exp.cancelled": "Export abgebrochen.", "exp.noPicker": "„Speichern unter“-Dialog nicht verfügbar ({err}); lade die Datei herunter.",
  "exp.downloading": "Lade {name} herunter. Der Browser fragt eventuell, wo gespeichert werden soll.",
  "exp.shared": "Geteilt.", "exp.shareCancelled": "Teilen abgebrochen.", "exp.shareFailed": "Teilen nicht möglich ({err}).",
  "recs.title": "Aufnahmen", "recs.none": "Noch keine Aufnahmen.", "recs.noIpa": "(keine Transkription)",
  "recs.open": "Öffnen", "recs.delete": "Löschen", "recs.opened": "Aufnahme geöffnet.",
  "recs.confirmDelete": "Diese Aufnahme aus dem Browser löschen?", "recs.deleted": "Aufnahme gelöscht.",
  "recs.folder": "Ordner importieren", "recs.zips": ".zip importieren",
  "recs.importHint": "Wähle den Ordner, in dem du die Exporte aufbewahrst (oder die .zip-Dateien selbst): Die Aufnahmen kommen mit ihren Transkriptionen zurück in die Liste.",
  "imp.none": "Keine .zip-, .wav- oder .json-Datei gefunden.", "imp.reading": "Lese {n} Datei(en) …",
  "imp.failed": "Import fehlgeschlagen ({err}).", "imp.done": "Importiert: {added}. Schon in der Liste: {skipped}.",
  "log.title": "Protokoll (was die App getan hat)",
  ready: "Bereit ({threads} Thread(s)).",
  "help.html": `
<h3>Schritt für Schritt</h3>
<ol>
  <li>Tippe auf <b>▶</b>. Beim ersten Mal fragt der Browser nach dem Mikrofon: Erlaube es. Das Mikrofon ist nur eingeschaltet, während du aufnimmst.</li>
  <li>Warte eine halbe Sekunde und sprich. Tippe auf <b>■</b>, um zu stoppen.</li>
  <li>Bei der ersten Transkription zeigt die App, welche Modelle sie herunterladen wird und wie viel Platz sie brauchen. Bestätige, um fortzufahren.
    Wenn der Browser fragt, ob die Seite <b>Daten dauerhaft speichern</b> darf, erlaube es: Das sind die Modelle. So dauert nur das erste Mal.</li>
  <li>Die Leiste zeigt, was gerade passiert: welches Modell heruntergeladen wird (MB) oder transkribiert.</li>
  <li>Im Ergebnis ist jede Zeile ein Modell; die letzte ist der <b>Konsens</b>.</li>
</ol>
<h3>Das Ergebnis lesen</h3>
<ul>
  <li>Die Symbole sind in Spalten ausgerichtet: Derselbe Laut steht in derselben Spalte. <b>·</b> bedeutet, dass dieses Modell dort nichts gehört hat.</li>
  <li>Orange hervorgehoben: keine Mehrheit. Diese Symbole sind mehr als doppelt so oft falsch wie die anderen: Prüfe sie mit dem Ohr.</li>
  <li>Tippe auf ein Symbol, um <b>diesen Abschnitt</b> deiner Aufnahme zu hören und zu sehen, wer wofür gestimmt hat.</li>
  <li>„Gleiche Breite“ macht alle Symbole so breit wie ein m, damit sie leichter zu treffen sind. „In Spalten ausrichten“ kannst du ausschalten, um jede Zeile fortlaufend zu lesen.</li>
</ul>
<h3>Den Konsens bearbeiten</h3>
<ul>
  <li>„Konsens bearbeiten“ öffnet die Transkription. Tippe auf ein Symbol und wähle: links einfügen, ersetzen, rechts einfügen, Diakritikum hinzufügen oder löschen.</li>
  <li>Zuerst wählst du die Art (Vokale, Konsonanten, Diakritika …); jede Art ist wie in der IPA-Tabelle angeordnet.</li>
  <li>„Bearbeitung speichern“ bewahrt deine Fassung auf, die mit exportiert wird; der ursprüngliche Konsens bleibt erhalten.</li>
</ul>
<h3>Aufnahmen, Export und Import</h3>
<ul>
  <li>Die Aufnahmen bleiben im Browser. „Neu berechnen“ führt alle ausgewählten Modelle für diese Aufnahme erneut aus.</li>
  <li>„Exportieren“ erstellt eine .zip mit einem Ordner darin: WAV-Ton, Text, JSON (Zeiten und Alternativen) und TextGrid für Praat.</li>
  <li>Zum Zurückholen: „Ordner importieren“ (wähle den Ordner, in dem du die Exporte aufbewahrst) oder „.zip importieren“.</li>
</ul>
<h3>Dauer</h3>
<ul>
  <li>Es gibt kein technisches Minimum, aber unter ~0,5 s Sprache erkennen die Modelle fast nie etwas. Ein kurzes Wort funktioniert; lass davor und danach etwas Pause.</li>
  <li>Maximum: WhIPA hört nur die ersten 30 s. Die anderen nehmen mehr an, aber lange Aufnahmen belasten den Speicher; nimm lieber Sätze bis 30 s auf.</li>
  <li>Wenn ein Modell „(nichts erkannt)“ zeigt, hör dir die Aufnahme an: Ist sie stumm, hat das Mikrofon keinen Ton aufgenommen.</li>
</ul>
<h3>Die Modelle: warum diese fünf</h3>
<ul>
  <li>Die fünf empfohlenen sind die besten aus dem Artikel im Referenzdatensatz (VoxAngeles, 95 Sprachen), die in einen Browser passen, und sie unterscheiden sich voneinander:
    Unterschiedliche Architekturen und Trainingsdaten irren sich an unterschiedlichen Stellen; wenn sie übereinstimmen, ist das also etwas wert.
    Bei 760 Aufnahmen: Der Konsens liegt bei 47,1 % der Phone falsch, das beste Einzelmodell bei 49,4 %; Symbole mit Mehrheit stimmen zu 69 %, die hervorgehobenen nur zu 27 %.</li>
  <li><b>Wav2Vec2Phoneme</b> ist allein das zweitbeste (PER 53,0), hat aber aus Wörterbuch-Aussprachen (eSpeak) gelernt: Es neigt zur „Lehrbuch“-Aussprache, die diese App vermeiden will. Es wäre der Ersatz für WhIPA, wenn du das in Kauf nimmst. Noch nicht konvertiert.</li>
  <li><b>LoWhIPA comb</b> ist besser als das Basis-WhIPA (77,8 gegenüber 83,7) und gleich groß: ein Kandidat, WhIPA zu ersetzen. Noch nicht konvertiert.</li>
  <li><b>ZIPA large</b> ist verfügbar, war im Referenzdatensatz aber schlechter als das kleine ZIPA (69,1 gegenüber 64,2) und ist viermal so groß: nur als zusätzliche Stimme.</li>
  <li><b>Allophant</b> (71,0) und <b>Allosaurus</b> (91,7, von 2020) dienen eher zum Vergleich. <b>WhIPA large</b> (69,4) hat 1,5 Milliarden Parameter: zu groß für einen Browser.</li>
  <li>Genug Platz? Du kannst alles auswählen. Die Mehrheit ist immer „mehr als die Hälfte der gelaufenen Modelle“; bei einer geraden Zahl von Modellen werden Gleichstände hervorgehoben. Austausche im Konsens sind noch nicht gemessen.</li>
</ul>
<h3>Speicherplatz und Cache</h3>
<ul>
  <li>Die Modelle bleiben im Browser gespeichert. „Löschen“ unter ☰ → Optionen gibt den Platz frei; das Löschen der Browserdaten entfernt sie ebenfalls, und sie werden erneut heruntergeladen.</li>
</ul>
<h3>Quellcode und Offline-Nutzung</h3>
<p>Quellcode und Anleitung zum Ausführen auf deinem Computer: <a href="https://github.com/allan-valin/speech-to-ipa#run-it-locally">github.com/allan-valin/speech-to-ipa</a>.</p>`,
  "src.paper": "Der Artikel hinter der App",
  "src.paperText": "Die Modelle wurden anhand der Ergebnisse ausgewählt von",
  "src.models": "Modelle", "src.model": "Modell", "src.copy": "konvertierte Kopie", "src.license": "Lizenz",
  "src.data": "Daten und Werkzeuge",
  "src.nc": "Nicht kommerzielle Nutzung: Zwei der Modelle stehen unter CC BY-NC-SA 4.0.",
  "src.code": "Quellcode",
  "instr.6": "Sprich in normalem Tempo, nicht zu schnell; Aufnahmen über 1 Sekunde funktionieren besser.",
  "run.reading": "Lade {name} vom Gerät ({step})…",
  "theme.toLight": "Zum hellen Design wechseln",
  "theme.toDark": "Zum dunklen Design wechseln",
  "theme.light": "Helles Design.",
  "theme.dark": "Dunkles Design.",
  "res.wrap": "Zeilenumbruch erlauben",
  "res.scroll": "Transkription seitlich scrollen",
  "recs.exportAll": "Alle exportieren (.zip)",
  "exp.packing": "Packe {n} Aufnahme(n) in ein .zip, jede in einem eigenen Ordner…",
  "recs.rename": "Umbenennen",
  "recs.renamePrompt": "Name für diese Aufnahme (leer = kein Name; wird für die exportierten Dateinamen verwendet):",
  "recs.renameCancelled": "Umbenennen abgebrochen.",
  "recs.renamed": "Umbenannt: {name}.",
  "recs.unnamed": "Name entfernt; die Dateien verwenden die Transkription.",
  "recs.nameHint": "Exportierte Dateien werden nach der Liste benannt: Datum, Dauer und Transkription. Manche Programme verstümmeln IPA-Zeichen in Dateinamen; mit „Umbenennen“ gibst du einen einfachen Namen, der die Transkription im Dateinamen ersetzt (der Inhalt bleibt gleich).",
  "instr.sample": "Ein Beispielergebnis (das isländische Wort „bið“): jede Zeile ist ein Modell, das Band darunter ist der Konsens. θ ist hervorgehoben: keine Mehrheit.",
};
