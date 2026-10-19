export default {
  dec: ",",
  title: "Parole → IPA",
  tagline: "Transcription phonétique étroite de ce qui a été dit, pas de ce que dit le dictionnaire. Tout tourne sur votre appareil ; l’audio ne le quitte pas.",
  menu: "Menu", close: "Fermer", closed: "Fenêtre fermée.",
  "menu.options": "Options", "menu.sources": "Sources", "menu.help": "Aide", "menu.opened": "Menu ouvert : {tab}.",
  "lang.set": "Langue : {name}.",
  "instr.title": "Mode d’emploi",
  "instr.1": "Touchez <b>▶</b> pour enregistrer et <b>■</b> pour arrêter.",
  "instr.2": "La première fois, l’application demande si elle peut télécharger les modèles (environ 1,3 Go avec les cinq recommandés). Seule la première fois est longue.",
  "instr.3": "Le navigateur va demander le <b>microphone</b> et peut demander si le site peut <b>stocker des données de façon permanente</b> : acceptez les deux. Ces données sont les modèles, pas les enregistrements ; sans cela, le navigateur peut les effacer et ils seront retéléchargés.",
  "instr.4": "Dans le résultat, <b>touchez les symboles</b> pour écouter chaque son.",
  "instr.5": "Modèles, sources et aide détaillée : bouton <b>☰</b> en haut.",
  "rec.title": "Enregistrer", "rec.start": "Enregistrer", "rec.stop": "Arrêter", "rec.file": "Choisir un fichier audio",
  "rec.recording": "Enregistrement… touchez ■ pour arrêter.", "rec.stopped": "Enregistrement terminé.", "rec.label": "Enregistrement",
  busy: "Patientez : la transcription est encore en cours.",
  "mic.title": "Microphone", "mic.allow": "Autoriser le microphone", "mic.note": "Le microphone n’est actif que pendant l’enregistrement.",
  "mic.st.granted": "Autorisé.", "mic.st.prompt": "Pas encore autorisé.", "mic.st.denied": "Bloqué.", "mic.denied": "Microphone non autorisé ({err}). Voyez comment l’activer dans ☰ → Options.",
  "mic.ok": "Microphone autorisé. Il ne s’active que pendant l’enregistrement.",
  "mic.blocked": "Le navigateur a bloqué le microphone. Pour l’autoriser : touchez l’icône à côté de l’adresse du site → Autorisations (ou Paramètres du site) → Microphone → Autoriser. Sur iPhone : Réglages → Safari → Microphone. Rechargez ensuite la page.",
  "audio.bad": "Impossible de lire cet audio ({err}).", "audio.got": "{s} d’audio. Transcription…",
  "audio.silent": "L’enregistrement ({s}) semble silencieux : le microphone n’a presque rien capté. Réessayez, plus près du microphone.",
  "store.bad": "L’enregistrement n’a pas pu être stocké dans le navigateur ({err}).", "store.readBad": "Impossible de lire les enregistrements stockés ({err}).",
  "file.chosen": "Fichier choisi : {name}.",
  "opt.lang": "Langue", "opt.models": "Modèles",
  "opt.modelsNote": "Nous recommandons les cinq premiers. Les autres viennent du même article ; voyez dans Aide pourquoi ces cinq et quand en changer. PER et PFER : erreurs sur le jeu de référence (plus bas = meilleur).",
  "opt.recommended": "Recommandés", "opt.others": "Autres modèles de l’article",
  "opt.total": "{n} modèle(s) coché(s), {size} au total.",
  "opt.heavy": "Beaucoup de modèles à la fois peuvent bloquer le navigateur sur les appareils modestes. Les exécuter un par un est plus sûr.",
  "opt.how": "Exécution", "opt.seq": "Un par un (recommandé)", "opt.all": "Tous en même temps",
  "opt.seqMsg": "Mode : un par un.", "opt.allMsg": "Mode : tous en même temps.",
  "opt.advanced": "Avancé", "opt.backend": "Traitement",
  "opt.onMsg": "Activé : {what}.", "opt.offMsg": "Désactivé : {what}.",
  "model.soon": "pas encore converti", "model.cached": "téléchargé", "model.toDownload": "{size} à télécharger",
  "model.delete": "supprimer", "model.deleted": "{name} supprimé du navigateur ({size} libérés).",
  "model.on": "{name} coché.", "model.off": "{name} décoché.",
  "dl.title": "Télécharger les modèles ?",
  "dl.text": "Les modèles ci-dessous seront téléchargés sur votre appareil pour traiter l’audio. Vous pourrez les supprimer plus tard dans ☰ → Options, où vous pouvez aussi choisir d’autres modèles et lesquels télécharger (il en faut au moins un pour obtenir des résultats).",
  "dl.persist": "Si le navigateur demande si le site peut stocker des données de façon permanente, acceptez : ce sont ces modèles.",
  "dl.yes": "Télécharger et transcrire", "dl.no": "Pas maintenant", "dl.total": "Total",
  "dl.declined": "Rien n’a été téléchargé. L’enregistrement est conservé ; utilisez « Tout refaire » quand vous voudrez.",
  "run.none": "Aucun modèle coché. Cochez-en au moins un dans ☰ → Options.",
  "run.allDone": "Les modèles cochés ont déjà tourné sur cet enregistrement. Pour les relancer, utilisez « Tout refaire ».",
  "run.loading": "Préparation de {name} ({step})…", "run.downloading": "Téléchargement de {name} ({step}) : {got} sur {size} Mo",
  "run.transcribing": "Transcription avec {name} ({step})…",
  "run.loaded": "{name} : {how}, prêt en {s}.", "run.fromCache": "lu depuis l’appareil", "run.downloaded": "téléchargé",
  "run.notStored": "Trop volumineux pour le stockage du navigateur : il sera retéléchargé la prochaine fois.",
  "run.done": "Terminé : {n} modèle(s) ont tourné.",
  "run.error": "ERREUR : {err}. Si le navigateur s’est bloqué, essayez « Un par un » ou moins de modèles.",
  "res.title": "Résultat", "res.tap": "👆 Touchez les symboles pour écouter chaque son",
  "res.wide": "Même largeur pour tous les symboles", "res.align": "Aligner en colonnes",
  "res.edit": "Modifier le consensus", "res.play": "Écouter l’enregistrement", "res.redo": "Tout refaire",
  "res.redoing": "Tout refaire : tous les modèles cochés tournent à nouveau sur cet enregistrement.",
  "res.runMissing": "Lancer aussi : {names}",
  "res.export": "Exporter (.zip)", "res.share": "Partager (ex. : Google Drive)",
  "res.zip": "Le .zip contient un dossier avec l’audio (WAV), la transcription de chaque modèle, le consensus et votre modification (TXT), les temps et alternatives (JSON) et un TextGrid pour Praat.",
  "res.consensus": "Consensus", "res.nothing": "(rien de reconnu)",
  "res.none": "Aucun modèle n’a encore tourné sur cet enregistrement. Touchez « Tout refaire ».",
  "res.working": "Transcription…",
  "res.few": "Avec moins de 3 modèles, le consensus vaut peu.",
  "res.flagged": "{n} symbole(s) du consensus sur {of} sans majorité (en surbrillance). · = le modèle n’a rien entendu à cet endroit.",
  "res.empty": "Aucun résultat : {names} (l’enregistrement est peut-être trop court ou trop faible).",
  "alt.nothing": "rien", "alt.majority": "Majorité.", "alt.noMajority": "Pas de majorité.",
  "play.all": "Lecture de l’enregistrement.", "play.part": "Lecture de {a} à {b} s.",
  "play.silent": "Lecture de l’enregistrement, mais il est silencieux : le microphone n’a capté aucun son.",
  "play.noTime": "Ce symbole n’a pas de temps marqué (WhIPA n’en marque pas) ; touchez la même colonne dans un autre modèle.",
  "ed.hint": "Touchez un symbole pour le sélectionner, puis choisissez l’action.",
  "ed.left": "← Insérer à gauche", "ed.swap": "Remplacer le symbole", "ed.right": "Insérer à droite →",
  "ed.mark": "Ajouter un diacritique", "ed.del": "Supprimer le symbole",
  "ed.save": "Enregistrer la modification", "ed.cancel": "Annuler", "ed.reset": "Revenir au consensus",
  "ed.opened": "Éditeur ouvert avec le consensus.", "ed.empty": "(vide : utilisez « Insérer à droite »)",
  "ed.pick": "Sélectionnez d’abord un symbole.", "ed.changed": "{a} → {b}", "ed.deleted": "Symbole supprimé.",
  "ed.saved": "Modification enregistrée ; elle sera incluse dans l’export.", "ed.cancelled": "Modification annulée.",
  "ed.resetDone": "Modification abandonnée ; le consensus s’applique.", "ed.yours": "Votre modification",
  "pk.title": "Choisissez le type de symbole",
  "pk.for.left": "Insérer à gauche : type de symbole", "pk.for.right": "Insérer à droite : type de symbole",
  "pk.for.swap": "Remplacer par : type de symbole", "pk.for.mark": "Ajouter au symbole : type de signe",
  "pk.vowels": "Voyelles", "pk.pulmonic": "Consonnes (pulmonaires)", "pk.nonpulmonic": "Consonnes non pulmonaires",
  "pk.other": "Autres symboles", "pk.diacritics": "Diacritiques", "pk.suprasegmentals": "Suprasegmentaux",
  "pk.tones": "Tons et accents de mot",
  "pk.vowelNote": "Comme dans le tableau de l’API : dans chaque paire, la voyelle arrondie est à droite.",
  "pk.consNote": "Comme dans le tableau de l’API (révision 2020) : dans chaque case, la sonore est à droite. Cases grises : articulations jugées impossibles. Faites défiler latéralement pour voir toutes les colonnes.",
  "pk.v.h0": "fermée", "pk.v.h1": "pré-fermée", "pk.v.h2": "mi-fermée", "pk.v.h3": "moyenne", "pk.v.h4": "mi-ouverte",
  "pk.v.h5": "pré-ouverte", "pk.v.h6": "ouverte",
  "pk.v.b0": "antérieure", "pk.v.b1": "quasi antérieure", "pk.v.b2": "centrale", "pk.v.b3": "quasi postérieure", "pk.v.b4": "postérieure",
  "pk.v.r": "arrondie", "pk.v.u": "non arrondie",
  "exp.nothing": "Rien à exporter : lancez au moins un modèle.", "exp.saved": "Exporté : {name}.",
  "exp.cancelled": "Export annulé.", "exp.noPicker": "Fenêtre « Enregistrer sous » indisponible ({err}) ; téléchargement du fichier.",
  "exp.downloading": "Téléchargement de {name}. Le navigateur peut demander où l’enregistrer.",
  "exp.shared": "Partagé.", "exp.shareCancelled": "Partage annulé.", "exp.shareFailed": "Impossible de partager ({err}).",
  "recs.title": "Enregistrements", "recs.none": "Aucun enregistrement pour l’instant.", "recs.noIpa": "(pas de transcription)",
  "recs.open": "Ouvrir", "recs.delete": "Supprimer", "recs.opened": "Enregistrement ouvert.",
  "recs.confirmDelete": "Supprimer cet enregistrement du navigateur ?", "recs.deleted": "Enregistrement supprimé.",
  "recs.folder": "Importer un dossier", "recs.zips": "Importer des .zip",
  "recs.importHint": "Choisissez le dossier où vous gardez les exports (ou les .zip eux-mêmes) : les enregistrements reviennent dans la liste avec leurs transcriptions.",
  "imp.none": "Aucun fichier .zip, .wav ou .json trouvé.", "imp.reading": "Lecture de {n} fichier(s)…",
  "imp.failed": "Importation impossible ({err}).", "imp.done": "Importés : {added}. Déjà dans la liste : {skipped}.",
  "log.title": "Journal (ce que l’application a fait)",
  ready: "Prêt ({threads} thread(s)).",
  "help.html": `
<h3>Pas à pas</h3>
<ol>
  <li>Touchez <b>▶</b>. La première fois, le navigateur demande le microphone : acceptez. Le microphone n’est actif que pendant l’enregistrement.</li>
  <li>Attendez une demi-seconde et parlez. Touchez <b>■</b> pour arrêter.</li>
  <li>À la première transcription, l’application indique quels modèles elle va télécharger et leur taille. Acceptez pour continuer.
    Si le navigateur demande si le site peut <b>stocker des données de façon permanente</b>, acceptez : ce sont les modèles. Ainsi, seule la première fois est longue.</li>
  <li>La barre indique ce qui se passe : quel modèle est en cours de téléchargement (Mo) ou de transcription.</li>
  <li>Dans le résultat, chaque ligne est un modèle ; la dernière est le <b>consensus</b>.</li>
</ol>
<h3>Lire le résultat</h3>
<ul>
  <li>Les symboles sont alignés en colonnes : le même son est dans la même colonne. <b>·</b> signifie que ce modèle n’a rien entendu à cet endroit.</li>
  <li>En surbrillance orange : pas de majorité. Ces symboles se trompent plus de deux fois plus que les autres : vérifiez à l’oreille.</li>
  <li>Touchez un symbole pour <b>écouter ce passage</b> de votre enregistrement et voir qui a voté pour quoi.</li>
  <li>« Même largeur » donne à tous les symboles la largeur d’un m, plus faciles à toucher. « Aligner en colonnes » peut être désactivé pour lire chaque ligne d’un seul tenant.</li>
</ul>
<h3>Modifier le consensus</h3>
<ul>
  <li>« Modifier le consensus » ouvre la transcription. Touchez un symbole et choisissez : insérer à gauche, remplacer, insérer à droite, ajouter un diacritique ou supprimer.</li>
  <li>Vous choisissez d’abord le type (voyelles, consonnes, diacritiques…) ; chaque type est disposé comme dans le tableau de l’API.</li>
  <li>« Enregistrer la modification » conserve votre version, incluse dans l’export ; le consensus d’origine reste disponible.</li>
</ul>
<h3>Enregistrements, export et import</h3>
<ul>
  <li>Les enregistrements restent dans le navigateur. « Tout refaire » relance tous les modèles cochés sur cet enregistrement.</li>
  <li>« Exporter » crée un .zip contenant un dossier : audio WAV, texte, JSON (temps et alternatives) et TextGrid pour Praat.</li>
  <li>Pour les récupérer : « Importer un dossier » (choisissez le dossier où vous gardez les exports) ou « Importer des .zip ».</li>
</ul>
<h3>Durée</h3>
<ul>
  <li>Il n’y a pas de minimum technique, mais en dessous de ~0,5 s de parole les modèles ne reconnaissent presque jamais rien. Un mot court fonctionne ; laissez un blanc avant et après.</li>
  <li>Maximum : WhIPA n’écoute que les 30 premières secondes. Les autres acceptent davantage, mais les longs enregistrements pèsent sur la mémoire ; préférez des phrases de 30 s au plus.</li>
  <li>Si un modèle affiche « (rien de reconnu) », écoutez l’enregistrement : s’il est muet, le microphone n’a capté aucun son.</li>
</ul>
<h3>Les modèles : pourquoi ces cinq</h3>
<ul>
  <li>Les cinq recommandés sont les meilleurs de l’article sur le jeu de référence (VoxAngeles, 95 langues) qui tiennent dans un navigateur, et ils diffèrent les uns des autres :
    des architectures et des données d’entraînement différentes se trompent à des endroits différents, donc quand ils concordent, cela vaut quelque chose.
    Sur 760 enregistrements : le consensus se trompe sur 47,1 % des phones contre 49,4 % pour le meilleur modèle seul ; les symboles majoritaires sont justes à 69 %, ceux en surbrillance à 27 % seulement.</li>
  <li><b>Wav2Vec2Phoneme</b> est le deuxième meilleur seul (PER 53,0), mais il a appris sur des prononciations de dictionnaire (eSpeak) : il tend vers la prononciation « de manuel », ce que cette application veut éviter. Il remplacerait WhIPA si vous l’acceptez. Pas encore converti.</li>
  <li><b>LoWhIPA comb</b> est meilleur que WhIPA de base (77,8 contre 83,7) et de même taille : candidat pour remplacer WhIPA. Pas encore converti.</li>
  <li><b>ZIPA large</b> est disponible, mais sur le jeu de référence il a fait moins bien que le petit ZIPA (69,1 contre 64,2) et il est 4 fois plus gros : seulement comme voix supplémentaire.</li>
  <li><b>Allophant</b> (71,0) et <b>Allosaurus</b> (91,7, de 2020) servent plutôt à la comparaison. <b>WhIPA large</b> (69,4) a 1,5 milliard de paramètres : trop gros pour un navigateur.</li>
  <li>Vous avez de la place ? Vous pouvez tout cocher. La majorité est toujours « plus de la moitié des modèles qui ont tourné » ; avec un nombre pair de modèles, les égalités sont mises en surbrillance. Les remplacements ne sont pas encore mesurés dans le consensus.</li>
</ul>
<h3>Espace et cache</h3>
<ul>
  <li>Les modèles restent stockés dans le navigateur. « Supprimer » dans ☰ → Options libère l’espace ; effacer les données du navigateur les supprime aussi, et ils seront retéléchargés.</li>
</ul>
<h3>Code et utilisation hors ligne</h3>
<p>Code source et instructions pour l’exécuter sur votre ordinateur : <a href="https://github.com/allan-valin/speech-to-ipa#run-it-locally">github.com/allan-valin/speech-to-ipa</a>.</p>`,
  "src.paper": "L’article derrière l’application",
  "src.paperText": "Les modèles ont été choisis d’après les résultats de",
  "src.models": "Modèles", "src.model": "modèle", "src.copy": "copie convertie", "src.license": "licence",
  "src.data": "Données et outils",
  "src.nc": "Usage non commercial : deux des modèles sont sous CC BY-NC-SA 4.0.",
  "src.code": "Code source",
  "instr.6": "Parlez à un rythme normal, sans vous presser ; les enregistrements de plus d'une seconde marchent mieux.",
  "run.reading": "Lecture de {name} depuis l'appareil ({step})…",
  "theme.toLight": "Passer au thème clair",
  "theme.toDark": "Passer au thème sombre",
  "theme.light": "Thème clair.",
  "theme.dark": "Thème sombre.",
};
