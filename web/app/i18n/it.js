// Italiano: same keys as pt.js (the reference).
export default {
  dec: ",",
  title: "Parlato → IPA",
  tagline: "Trascrizione fonetica stretta di ciò che è stato detto, non di ciò che dice il dizionario. Tutto gira sul tuo dispositivo; l'audio non esce da qui.",
  menu: "Menu", close: "Chiudi", closed: "Finestra chiusa.",
  "menu.options": "Opzioni", "menu.sources": "Fonti", "menu.help": "Aiuto", "menu.opened": "Menu aperto: {tab}.",
  "lang.set": "Lingua: {name}.",
  "instr.title": "Istruzioni",
  "instr.1": "Tocca <b>▶</b> per registrare e <b>■</b> per fermare.",
  "instr.2": "La prima volta, l'app ti chiede se può scaricare i modelli (circa 1,3 GB per i cinque consigliati). Solo la prima volta è lenta.",
  "instr.3": "Il browser ti chiederà il <b>microfono</b> e potrebbe chiedere se il sito può <b>salvare dati in modo permanente</b>: accetta entrambi. I dati sono i modelli, non le tue registrazioni; senza questo permesso il browser potrebbe cancellarli e verrebbero scaricati di nuovo.",
  "instr.4": "Nel risultato, <b>tocca i simboli</b> per ascoltare ogni suono.",
  "instr.5": "Modelli, fonti e aiuto dettagliato: il pulsante <b>☰</b> in alto.",
  "rec.title": "Registra", "rec.start": "Registra", "rec.stop": "Ferma", "rec.file": "Scegli un file audio",
  "rec.recording": "Registrazione in corso… tocca ■ per fermare.", "rec.stopped": "Registrazione terminata.", "rec.label": "Registrazione",
  busy: "Aspetta: sto ancora trascrivendo.",
  "mic.title": "Microfono", "mic.allow": "Consenti il microfono", "mic.note": "Il microfono è acceso solo mentre registri.",
  "mic.st.granted": "Consentito.", "mic.st.prompt": "Non ancora consentito.", "mic.st.denied": "Bloccato.", "mic.denied": "Microfono non consentito ({err}). Vedi come consentirlo in ☰ → Opzioni.",
  "mic.ok": "Microfono consentito. Si accende solo mentre registri.",
  "mic.blocked": "Il browser ha bloccato il microfono. Per consentirlo: tocca l'icona accanto all'indirizzo del sito → Autorizzazioni (o Impostazioni sito) → Microfono → Consenti. Su iPhone: Impostazioni → Safari → Microfono. Poi ricarica la pagina.",
  "audio.bad": "Impossibile leggere questo audio ({err}).", "audio.got": "{s} di audio. Trascrizione in corso…",
  "audio.silent": "La registrazione ({s}) sembra silenziosa: il microfono non ha captato quasi nulla. Riprova, più vicino al microfono.",
  "store.bad": "Impossibile salvare la registrazione nel browser ({err}).", "store.readBad": "Impossibile leggere le registrazioni salvate ({err}).",
  "file.chosen": "File scelto: {name}.",
  "opt.lang": "Lingua", "opt.models": "Modelli",
  "opt.modelsNote": "Ti consigliamo i primi cinque. Gli altri vengono dallo stesso articolo; vedi in Aiuto perché questi cinque e quando cambiarli. PER e PFER: errori sull'insieme di riferimento (più basso è meglio).",
  "opt.recommended": "Consigliati", "opt.others": "Altri modelli dell'articolo",
  "opt.total": "{n} modello/i selezionato/i, {size} in totale.",
  "opt.heavy": "Molti modelli insieme possono bloccare il browser sui dispositivi meno potenti. Eseguirne uno alla volta è più sicuro.",
  "opt.how": "Come eseguire", "opt.seq": "Uno alla volta (consigliato)", "opt.all": "Tutti insieme",
  "opt.seqMsg": "Modalità: uno alla volta.", "opt.allMsg": "Modalità: tutti insieme.",
  "opt.advanced": "Avanzate", "opt.backend": "Elaborazione",
  "opt.onMsg": "Attivato: {what}.", "opt.offMsg": "Disattivato: {what}.",
  "model.soon": "non ancora convertito", "model.cached": "scaricato", "model.toDownload": "{size} da scaricare",
  "model.delete": "elimina", "model.deleted": "{name} eliminato dal browser ({size} liberati).",
  "model.on": "{name} selezionato.", "model.off": "{name} deselezionato.",
  "dl.title": "Scaricare i modelli?",
  "dl.text": "I modelli qui sotto verranno scaricati sul tuo dispositivo per elaborare l'audio. Puoi eliminarli in seguito in ☰ → Opzioni, dove puoi anche scegliere altri modelli e quali scaricare (ne serve almeno uno per vedere i risultati).",
  "dl.persist": "Se il browser chiede se il sito può salvare dati in modo permanente, accetta: si tratta di questi modelli.",
  "dl.yes": "Scarica e trascrivi", "dl.no": "Non ora", "dl.total": "Totale",
  "dl.declined": "Non è stato scaricato nulla. La registrazione è salvata; usa «Rifai da capo» quando vuoi.",
  "run.none": "Nessun modello selezionato. Selezionane almeno uno in ☰ → Opzioni.",
  "run.allDone": "I modelli selezionati hanno già elaborato questa registrazione. Per eseguirli di nuovo, usa «Rifai da capo».",
  "run.loading": "Preparazione di {name} ({step})…", "run.downloading": "Download di {name} ({step}): {got} di {size} MB",
  "run.transcribing": "Trascrizione con {name} ({step})…",
  "run.loaded": "{name}: {how}, pronto in {s}.", "run.fromCache": "letto dal dispositivo", "run.downloaded": "scaricato",
  "run.notStored": "Non è entrato nello spazio di archiviazione del browser: verrà scaricato di nuovo la prossima volta.",
  "run.done": "Fatto: {n} modello/i eseguito/i.",
  "run.error": "ERRORE: {err}. Se il browser si è bloccato, prova «Uno alla volta» o meno modelli.",
  "res.title": "Risultato", "res.tap": "👆 Tocca i simboli per ascoltare ogni suono",
  "res.wide": "Stessa larghezza per tutti i simboli", "res.align": "Allinea in colonne",
  "res.edit": "Modifica il consenso", "res.play": "Ascolta la registrazione", "res.redo": "Rifai da capo",
  "res.redoing": "Rifaccio da capo: tutti i modelli selezionati vengono eseguiti di nuovo su questa registrazione.",
  "res.runMissing": "Esegui anche: {names}",
  "res.export": "Esporta (.zip)", "res.share": "Condividi (es. Google Drive)",
  "res.zip": "Lo .zip contiene una cartella con l'audio (WAV), la trascrizione di ogni modello, il consenso e la tua modifica (TXT), tempi e alternative (JSON) e un TextGrid per Praat.",
  "res.consensus": "Consenso", "res.nothing": "(nulla riconosciuto)",
  "res.none": "Nessun modello ha ancora elaborato questa registrazione. Tocca «Rifai da capo».",
  "res.working": "Trascrizione in corso…",
  "res.few": "Con meno di 3 modelli il consenso vale poco.",
  "res.flagged": "{n} di {of} simbolo/i del consenso senza maggioranza (evidenziati). · = il modello non ha sentito nulla lì.",
  "res.empty": "Nessun risultato: {names} (la registrazione potrebbe essere troppo corta o troppo bassa).",
  "alt.nothing": "nulla", "alt.majority": "Maggioranza.", "alt.noMajority": "Nessuna maggioranza.",
  "play.all": "Riproduzione della registrazione.", "play.part": "Riproduzione {a}–{b} s.",
  "play.silent": "Riproduzione della registrazione, ma è silenziosa: il microfono non ha captato alcun suono.",
  "play.noTime": "Questo simbolo non ha tempi (WhIPA non li segna); tocca la stessa colonna in un altro modello.",
  "ed.hint": "Tocca un simbolo per selezionarlo, poi scegli cosa fare.",
  "ed.left": "← Inserisci a sinistra", "ed.swap": "Sostituisci simbolo", "ed.right": "Inserisci a destra →",
  "ed.mark": "Aggiungi diacritico", "ed.del": "Elimina simbolo",
  "ed.save": "Salva modifica", "ed.cancel": "Annulla", "ed.reset": "Torna al consenso",
  "ed.opened": "Editor aperto con il consenso.", "ed.empty": "(vuoto: usa «Inserisci a destra»)",
  "ed.pick": "Seleziona prima un simbolo.", "ed.changed": "{a} → {b}", "ed.deleted": "Simbolo eliminato.",
  "ed.saved": "Modifica salvata; finisce nell'esportazione.", "ed.cancelled": "Modifica annullata.",
  "ed.resetDone": "Modifica scartata; vale il consenso.", "ed.yours": "La tua modifica",
  "pk.title": "Scegli il tipo di simbolo",
  "pk.for.left": "Inserisci a sinistra: tipo di simbolo", "pk.for.right": "Inserisci a destra: tipo di simbolo",
  "pk.for.swap": "Sostituisci con: tipo di simbolo", "pk.for.mark": "Aggiungi al simbolo: tipo di segno",
  "pk.vowels": "Vocali", "pk.pulmonic": "Consonanti (polmonari)", "pk.nonpulmonic": "Consonanti non polmonari",
  "pk.other": "Altri simboli", "pk.diacritics": "Diacritici", "pk.suprasegmentals": "Soprasegmentali",
  "pk.tones": "Toni e accenti di parola",
  "pk.vowelNote": "Come nella tabella IPA: dove i simboli compaiono in coppia, quello a destra è la vocale arrotondata.",
  "pk.consNote": "Come nella tabella IPA (revisione 2020): in ogni casella, a destra c'è la sonora. Caselle grigie: articolazioni ritenute impossibili. Scorri di lato per vedere tutte le colonne.",
  "pk.v.h0": "chiusa", "pk.v.h1": "quasi chiusa", "pk.v.h2": "semichiusa", "pk.v.h3": "media", "pk.v.h4": "semiaperta",
  "pk.v.h5": "quasi aperta", "pk.v.h6": "aperta",
  "pk.v.b0": "anteriore", "pk.v.b1": "quasi anteriore", "pk.v.b2": "centrale", "pk.v.b3": "quasi posteriore", "pk.v.b4": "posteriore",
  "pk.v.r": "arrotondata", "pk.v.u": "non arrotondata",
  "exp.nothing": "Niente da esportare: esegui almeno un modello.", "exp.saved": "Esportato: {name}.",
  "exp.cancelled": "Esportazione annullata.", "exp.noPicker": "Finestra «Salva con nome» non disponibile ({err}); scarico il file.",
  "exp.downloading": "Download di {name}. Il browser potrebbe chiederti dove salvarlo.",
  "exp.shared": "Condiviso.", "exp.shareCancelled": "Condivisione annullata.", "exp.shareFailed": "Impossibile condividere ({err}).",
  "recs.title": "Registrazioni", "recs.none": "Ancora nessuna registrazione.", "recs.noIpa": "(nessuna trascrizione)",
  "recs.open": "Apri", "recs.delete": "Elimina", "recs.opened": "Registrazione aperta.",
  "recs.confirmDelete": "Eliminare questa registrazione dal browser?", "recs.deleted": "Registrazione eliminata.",
  "recs.folder": "Importa cartella", "recs.zips": "Importa .zip",
  "recs.importHint": "Scegli la cartella dove tieni le tue esportazioni (o i file .zip stessi): le registrazioni tornano nell'elenco con le loro trascrizioni.",
  "imp.none": "Nessun .zip, .wav o .json trovato.", "imp.reading": "Lettura di {n} file…",
  "imp.failed": "Impossibile importare ({err}).", "imp.done": "Importate: {added}. Già nell'elenco: {skipped}.",
  "log.title": "Registro (cosa ha fatto l'app)",
  ready: "Pronto ({threads} thread).",
  "help.html": `
<h3>Passo per passo</h3>
<ol>
  <li>Tocca <b>▶</b>. La prima volta il browser ti chiede il microfono: accetta. Il microfono è acceso solo mentre registri.</li>
  <li>Aspetta mezzo secondo e parla. Tocca <b>■</b> per fermare.</li>
  <li>Alla prima trascrizione l'app ti mostra quali modelli scaricherà e quanto spazio occupano. Accetta per continuare.
    Se il browser chiede se il sito può <b>salvare dati in modo permanente</b>, accetta: sono i modelli. Così solo la prima volta è lenta.</li>
  <li>La barra mostra cosa sta succedendo: quale modello si sta scaricando (MB) o sta trascrivendo.</li>
  <li>Nel risultato ogni riga è un modello; l'ultima riga è il <b>consenso</b>.</li>
</ol>
<h3>Leggere il risultato</h3>
<ul>
  <li>I simboli sono allineati in colonne: lo stesso suono sta nella stessa colonna. <b>·</b> significa che quel modello non ha sentito nulla lì.</li>
  <li>Evidenziati in arancione: nessuna maggioranza. Questi simboli sono sbagliati più del doppio delle volte rispetto agli altri: controllali a orecchio.</li>
  <li>Tocca un simbolo per <b>ascoltare quel tratto</b> della tua registrazione e vedere chi ha votato cosa.</li>
  <li>«Stessa larghezza» rende ogni simbolo largo come una m, più facile da toccare. «Allinea in colonne» si può disattivare per leggere ogni riga come testo continuo.</li>
</ul>
<h3>Modificare il consenso</h3>
<ul>
  <li>«Modifica il consenso» apre la trascrizione. Tocca un simbolo e scegli: inserisci a sinistra, sostituisci, inserisci a destra, aggiungi un diacritico o elimina.</li>
  <li>Prima scegli il tipo (vocali, consonanti, diacritici…); ogni tipo è disposto come nella tabella IPA.</li>
  <li>«Salva modifica» conserva la tua versione, che finisce nell'esportazione; resta anche il consenso originale.</li>
</ul>
<h3>Registrazioni, esportazione e importazione</h3>
<ul>
  <li>Le registrazioni restano nel browser. «Rifai da capo» esegue di nuovo tutti i modelli selezionati su quella registrazione.</li>
  <li>«Esporta» crea uno .zip con una cartella dentro: audio WAV, testo, JSON (tempi e alternative) e un TextGrid per Praat.</li>
  <li>Per riportarle indietro: «Importa cartella» (scegli la cartella dove tieni le tue esportazioni) o «Importa .zip».</li>
</ul>
<h3>Durata</h3>
<ul>
  <li>Non c'è un minimo tecnico, ma sotto i ~0,5 s di parlato i modelli raramente riconoscono qualcosa. Una parola breve funziona; lascia un respiro prima e dopo.</li>
  <li>Massimo: WhIPA ascolta solo i primi 30 s. Gli altri accettano di più, ma le registrazioni lunghe pesano sulla memoria; resta su frasi fino a 30 s.</li>
  <li>Se un modello mostra «(nulla riconosciuto)», ascolta la registrazione: se è muta, il microfono non ha captato alcun suono.</li>
</ul>
<h3>I modelli: perché questi cinque</h3>
<ul>
  <li>I cinque consigliati sono i migliori dell'articolo sull'insieme di riferimento (VoxAngeles, 95 lingue) che entrano in un browser, e sono diversi tra loro:
    architetture e dati di addestramento diversi sbagliano in punti diversi, quindi quando concordano significa qualcosa.
    Su 760 registrazioni il consenso sbaglia il 47,1% dei foni contro il 49,4% del miglior modello singolo; i simboli con maggioranza sono giusti il 69% delle volte, quelli evidenziati solo il 27%.</li>
  <li><b>Wav2Vec2Phoneme</b> è il secondo migliore da solo (PER 53,0), ma ha imparato da pronunce di dizionario (eSpeak): tende alla pronuncia «da manuale», che questa app vuole evitare. Sostituirebbe WhIPA se lo accetti. Non ancora convertito.</li>
  <li><b>LoWhIPA comb</b> è migliore di WhIPA base (77,8 contro 83,7) con la stessa dimensione: candidato a sostituire WhIPA. Non ancora convertito.</li>
  <li><b>ZIPA large</b> è disponibile, ma sull'insieme di riferimento è andato peggio di ZIPA piccolo (69,1 contro 64,2) ed è 4 volte più grande: solo come voto in più.</li>
  <li><b>Allophant</b> (71,0) e <b>Allosaurus</b> (91,7, del 2020) servono soprattutto per confronto. <b>WhIPA large</b> (69,4) ha 1,5 miliardi di parametri: troppo grande per un browser.</li>
  <li>Hai spazio? Seleziona tutto. La maggioranza è sempre «più della metà dei modelli eseguiti»; con un numero pari di modelli, i pareggi vengono evidenziati. Sostituzioni non ancora misurate nel consenso.</li>
</ul>
<h3>Spazio e cache</h3>
<ul>
  <li>I modelli restano salvati nel browser. «Elimina» in ☰ → Opzioni libera lo spazio; anche cancellare i dati del browser li elimina, e verranno scaricati di nuovo.</li>
</ul>
<h3>Codice sorgente e uso offline</h3>
<p>Codice sorgente e istruzioni per eseguirlo sul tuo computer: <a href="https://github.com/allan-valin/speech-to-ipa#run-it-locally">github.com/allan-valin/speech-to-ipa</a>.</p>`,
  "src.paper": "L'articolo dietro l'app",
  "src.paperText": "I modelli sono stati scelti in base ai risultati di",
  "src.models": "Modelli", "src.model": "modello", "src.copy": "copia convertita", "src.license": "licenza",
  "src.data": "Dati e strumenti",
  "src.nc": "Uso non commerciale: due dei modelli sono CC BY-NC-SA 4.0.",
  "src.code": "Codice sorgente",
  "instr.6": "Parla a ritmo normale, senza fretta; le registrazioni di più di 1 secondo funzionano meglio.",
  "run.reading": "Lettura di {name} dal dispositivo ({step})…",
  "theme.toLight": "Passa al tema chiaro",
  "theme.toDark": "Passa al tema scuro",
  "theme.light": "Tema chiaro.",
  "theme.dark": "Tema scuro.",
  "res.wrap": "Consenti di andare a capo",
  "res.scroll": "Scorri la trascrizione in orizzontale",
};
