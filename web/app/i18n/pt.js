// Português (Brasil): the reference; every other language has the same keys.
export default {
  dec: ",",
  title: "Fala → IPA",
  tagline: "Transcrição fonética estreita do que foi dito, não do que o dicionário diz. Tudo roda no seu aparelho; o áudio não sai daqui.",
  menu: "Menu", close: "Fechar", closed: "Janela fechada.",
  "menu.options": "Opções", "menu.sources": "Fontes", "menu.help": "Ajuda", "menu.opened": "Menu aberto: {tab}.",
  "lang.set": "Idioma: {name}.",
  "instr.title": "Instruções",
  "instr.1": "Toque em <b>▶</b> para gravar e em <b>■</b> para parar.",
  "instr.2": "Na primeira vez, o app pergunta se pode baixar os modelos (cerca de 1,3 GB com os cinco recomendados). Só a primeira vez demora.",
  "instr.3": "O navegador vai pedir o <b>microfone</b> e pode perguntar se o site pode <b>guardar dados permanentemente</b>: aceite os dois. Os dados são os modelos, não as gravações; sem isso, o navegador pode apagá-los e eles serão baixados de novo.",
  "instr.4": "No resultado, <b>toque nos símbolos</b> para ouvir cada som.",
  "instr.5": "Modelos, fontes e ajuda detalhada: botão <b>☰</b> no alto.",
  "rec.title": "Gravar", "rec.start": "Gravar", "rec.stop": "Parar", "rec.file": "Escolher arquivo de áudio",
  "rec.recording": "Gravando… toque em ■ para parar.", "rec.stopped": "Gravação encerrada.", "rec.label": "Gravação",
  busy: "Espere: ainda estou transcrevendo.",
  "mic.title": "Microfone", "mic.allow": "Permitir microfone", "mic.note": "O microfone só fica ligado enquanto você grava.",
  "mic.st.granted": "Autorizado.", "mic.st.prompt": "Ainda não autorizado.", "mic.st.denied": "Bloqueado.", "mic.denied": "Microfone não autorizado ({err}). Veja como liberar em ☰ → Opções.",
  "mic.ok": "Microfone autorizado. Ele só liga enquanto você grava.",
  "mic.blocked": "O navegador bloqueou o microfone. Para liberar: toque no ícone ao lado do endereço do site → Permissões (ou Configurações do site) → Microfone → Permitir. No iPhone: Ajustes → Safari → Microfone. Depois recarregue a página.",
  "audio.bad": "Não consegui ler esse áudio ({err}).", "audio.got": "{s} de áudio. Transcrevendo…",
  "audio.silent": "A gravação ({s}) parece estar em silêncio: o microfone captou quase nada. Tente de novo, mais perto do microfone.",
  "store.bad": "A gravação não pôde ser guardada no navegador ({err}).", "store.readBad": "Não consegui ler as gravações guardadas ({err}).",
  "file.chosen": "Arquivo escolhido: {name}.",
  "opt.lang": "Idioma", "opt.models": "Modelos",
  "opt.modelsNote": "Recomendamos os cinco primeiros. Os outros vêm do mesmo artigo; veja em Ajuda por que estes cinco e quando trocar. PER e PFER: erros no conjunto de referência (menor é melhor).",
  "opt.recommended": "Recomendados", "opt.others": "Outros modelos do artigo",
  "opt.total": "{n} modelo(s) marcado(s), {size} no total.",
  "opt.heavy": "Muitos modelos juntos podem travar o navegador em aparelhos mais fracos. Rodar um de cada vez é mais seguro.",
  "opt.how": "Como rodar", "opt.seq": "Um de cada vez (recomendado)", "opt.all": "Todos ao mesmo tempo",
  "opt.seqMsg": "Modo: um de cada vez.", "opt.allMsg": "Modo: todos ao mesmo tempo.",
  "opt.advanced": "Avançado", "opt.backend": "Processamento",
  "opt.onMsg": "Ligado: {what}.", "opt.offMsg": "Desligado: {what}.",
  "model.soon": "indisponível", "model.cached": "baixado", "model.toDownload": "{size} a baixar",
  "model.delete": "apagar", "model.deleted": "{name} apagado do navegador ({size} liberados).",
  "model.on": "{name} marcado.", "model.off": "{name} desmarcado.",
  "dl.title": "Baixar os modelos?",
  "dl.text": "Os modelos abaixo serão baixados para o seu aparelho para processar o áudio. Você pode apagá-los depois em ☰ → Opções, onde também pode escolher outros modelos e quais baixar (é preciso pelo menos um para ver resultados).",
  "dl.persist": "Se o navegador perguntar se o site pode guardar dados permanentemente, aceite: são estes modelos.",
  "dl.yes": "Baixar e transcrever", "dl.no": "Agora não", "dl.total": "Total",
  "dl.declined": "Nada foi baixado. A gravação ficou guardada; use \"Refazer do zero\" quando quiser.",
  "run.none": "Nenhum modelo marcado. Marque pelo menos um em ☰ → Opções.",
  "run.allDone": "Os modelos marcados já rodaram nesta gravação. Para rodar de novo, use \"Refazer do zero\".",
  "run.loading": "Preparando {name} ({step})…", "run.downloading": "Baixando {name} ({step}): {got} de {size} MB",
  "run.transcribing": "Transcrevendo com {name} ({step})…",
  "run.loaded": "{name}: {how}, pronto em {s}.", "run.fromCache": "lido do aparelho", "run.downloaded": "baixado",
  "run.notStored": "Não coube no armazenamento do navegador: será baixado de novo da próxima vez.",
  "run.done": "Pronto: {n} modelo(s) rodaram.",
  "run.error": "ERRO: {err}. Se o navegador travou, tente \"Um de cada vez\" ou menos modelos.",
  "res.title": "Resultado", "res.tap": "👆 Toque nos símbolos para ouvir cada som",
  "res.wide": "Mesma largura para todos os símbolos", "res.align": "Alinhar em colunas",
  "res.edit": "Editar consenso", "res.play": "Ouvir gravação", "res.redo": "Refazer do zero",
  "res.redoing": "Refazendo do zero: todos os modelos marcados rodam de novo nesta gravação.",
  "res.runMissing": "Rodar também: {names}",
  "res.export": "Exportar (.zip)", "res.share": "Compartilhar (ex.: Google Drive)",
  "res.zip": "O .zip traz uma pasta com o áudio (WAV), a transcrição de cada modelo, o consenso e a sua edição (TXT), tempos e alternativas (JSON) e um TextGrid para o Praat.",
  "res.consensus": "Consenso", "res.nothing": "(nada reconhecido)",
  "res.none": "Nenhum modelo rodou nesta gravação ainda. Toque em \"Refazer do zero\".",
  "res.working": "Transcrevendo…",
  "res.few": "Com menos de 3 modelos, o consenso vale pouco.",
  "res.flagged": "{n} de {of} símbolo(s) do consenso sem maioria (destacados). · = o modelo não ouviu nada ali.",
  "res.empty": "Sem resultado: {names} (a gravação pode estar curta ou baixa demais).",
  "alt.nothing": "nada", "alt.majority": "Maioria.", "alt.noMajority": "Sem maioria.",
  "play.all": "Tocando a gravação.", "play.part": "Tocando {a}–{b} s.",
  "play.silent": "Tocando a gravação, mas ela está em silêncio: o microfone não captou som.",
  "play.noTime": "Este símbolo não tem tempo marcado (WhIPA não marca); toque na mesma coluna em outro modelo.",
  "ed.hint": "Toque num símbolo para selecioná-lo e escolha o que fazer.",
  "ed.left": "← Inserir à esquerda", "ed.swap": "Trocar símbolo", "ed.right": "Inserir à direita →",
  "ed.mark": "Adicionar diacrítico", "ed.del": "Apagar símbolo",
  "ed.save": "Salvar edição", "ed.cancel": "Cancelar", "ed.reset": "Voltar ao consenso",
  "ed.opened": "Editor aberto com o consenso.", "ed.empty": "(vazio: use \"Inserir à direita\")",
  "ed.pick": "Selecione um símbolo primeiro.", "ed.changed": "{a} → {b}", "ed.deleted": "Símbolo apagado.",
  "ed.saved": "Edição salva; ela entra na exportação.", "ed.cancelled": "Edição cancelada.",
  "ed.resetDone": "Edição descartada; vale o consenso.", "ed.yours": "Sua edição",
  "pk.title": "Escolha o tipo de símbolo",
  "pk.for.left": "Inserir à esquerda: tipo de símbolo", "pk.for.right": "Inserir à direita: tipo de símbolo",
  "pk.for.swap": "Trocar por: tipo de símbolo", "pk.for.mark": "Adicionar ao símbolo: tipo de marca",
  "pk.vowels": "Vogais", "pk.pulmonic": "Consoantes (pulmonares)", "pk.nonpulmonic": "Consoantes não pulmonares",
  "pk.other": "Outros símbolos", "pk.diacritics": "Diacríticos", "pk.suprasegmentals": "Suprassegmentais",
  "pk.tones": "Tons e acentos de palavra",
  "pk.vowelNote": "Como no quadro do IPA: em cada par, à direita fica a vogal arredondada.",
  "pk.consNote": "Como no quadro do IPA (revisão de 2020): em cada célula, à direita fica a sonora. Células cinza: articulações julgadas impossíveis. Role para o lado para ver todas as colunas.",
  "pk.v.h0": "fechada", "pk.v.h1": "quase fechada", "pk.v.h2": "meio fechada", "pk.v.h3": "média", "pk.v.h4": "meio aberta",
  "pk.v.h5": "quase aberta", "pk.v.h6": "aberta",
  "pk.v.b0": "anterior", "pk.v.b1": "quase anterior", "pk.v.b2": "central", "pk.v.b3": "quase posterior", "pk.v.b4": "posterior",
  "pk.v.r": "arredondada", "pk.v.u": "não arredondada",
  "exp.nothing": "Nada para exportar: rode pelo menos um modelo.", "exp.saved": "Exportado: {name}.",
  "exp.cancelled": "Exportação cancelada.", "exp.noPicker": "Janela \"salvar como\" indisponível ({err}); baixando o arquivo.",
  "exp.downloading": "Baixando {name}. O navegador pode perguntar onde salvar.",
  "exp.shared": "Compartilhado.", "exp.shareCancelled": "Compartilhamento cancelado.", "exp.shareFailed": "Não deu para compartilhar ({err}).",
  "recs.title": "Gravações", "recs.none": "Nenhuma gravação ainda.", "recs.noIpa": "(sem transcrição)",
  "recs.open": "Abrir", "recs.delete": "Apagar", "recs.opened": "Gravação aberta.",
  "recs.confirmDelete": "Apagar esta gravação do navegador?", "recs.deleted": "Gravação apagada.",
  "recs.folder": "Importar pasta", "recs.zips": "Importar .zip",
  "recs.importHint": "Escolha a pasta onde você guarda as exportações (ou os próprios .zip): as gravações voltam para a lista com as transcrições.",
  "imp.none": "Nenhum .zip, .wav ou .json encontrado.", "imp.reading": "Lendo {n} arquivo(s)…",
  "imp.failed": "Não consegui importar ({err}).", "imp.done": "Importadas: {added}. Já estavam na lista: {skipped}.",
  "log.title": "Registro (o que o app fez)",
  ready: "Pronto ({threads} thread(s)).",
  "help.html": `
<h3>Passo a passo</h3>
<ol>
  <li>Toque em <b>▶</b>. Na primeira vez o navegador pede o microfone: aceite. O microfone só liga enquanto você grava.</li>
  <li>Espere meio segundo e fale. Toque em <b>■</b> para parar.</li>
  <li>Na primeira transcrição, o app mostra quais modelos vai baixar e quanto ocupam. Aceite para continuar.
    Se o navegador perguntar se o site pode <b>guardar dados permanentemente</b>, aceite: são os modelos. Assim só a primeira vez demora.</li>
  <li>A barra mostra o que está acontecendo: qual modelo está sendo baixado (MB) ou transcrevendo.</li>
  <li>No resultado, cada linha é um modelo; a última é o <b>consenso</b>.</li>
</ol>
<h3>Lendo o resultado</h3>
<ul>
  <li>Os símbolos ficam alinhados em colunas: o mesmo som fica na mesma coluna. <b>·</b> quer dizer que aquele modelo não ouviu nada ali.</li>
  <li>Destacado em laranja: sem maioria. Esses símbolos erram mais que o dobro dos outros: confira de ouvido.</li>
  <li>Toque num símbolo para <b>ouvir aquele trecho</b> da sua gravação e ver quem votou em quê.</li>
  <li>"Mesma largura" deixa todos os símbolos do tamanho de um m, mais fáceis de tocar. "Alinhar em colunas" pode ser desligado para ler cada linha corrida.</li>
</ul>
<h3>Editar o consenso</h3>
<ul>
  <li>"Editar consenso" abre a transcrição. Toque num símbolo e escolha: inserir à esquerda, trocar, inserir à direita, adicionar diacrítico ou apagar.</li>
  <li>Primeiro você escolhe o tipo (vogais, consoantes, diacríticos…); cada tipo aparece arrumado como no quadro do IPA.</li>
  <li>"Salvar edição" guarda a sua versão, que vai junto na exportação; o consenso original continua lá.</li>
</ul>
<h3>Gravações, exportar e importar</h3>
<ul>
  <li>As gravações ficam no navegador. "Refazer do zero" roda de novo todos os modelos marcados naquela gravação.</li>
  <li>"Exportar" cria um .zip com uma pasta dentro: áudio WAV, texto, JSON (tempos e alternativas) e TextGrid para o Praat.</li>
  <li>Para trazer de volta: "Importar pasta" (escolha a pasta onde você guarda as exportações) ou "Importar .zip".</li>
</ul>
<h3>Duração</h3>
<ul>
  <li>Não há mínimo técnico, mas abaixo de ~0,5 s de fala os modelos quase nunca reconhecem algo. Uma palavra curta funciona; deixe um respiro antes e depois.</li>
  <li>Máximo: o WhIPA só ouve os primeiros 30 s. Os outros aceitam mais, mas gravações longas pesam na memória; prefira frases de até 30 s.</li>
  <li>Se um modelo mostra "(nada reconhecido)", ouça a gravação: se estiver muda, o microfone não captou som.</li>
</ul>
<h3>Os modelos: por que estes cinco</h3>
<ul>
  <li>Os cinco recomendados são os melhores do artigo no conjunto de referência (VoxAngeles, 95 línguas) que cabem num navegador, e são diferentes entre si:
    arquiteturas e dados de treino diferentes erram em lugares diferentes, então quando concordam isso vale alguma coisa.
    Em 760 gravações: o consenso erra 47,1% dos fones contra 49,4% do melhor modelo sozinho; símbolos com maioria acertam 69%, os destacados só 27%.</li>
  <li><b>Wav2Vec2Phoneme</b> é o segundo melhor sozinho (PER 53,0) e, no lugar do WhIPA, deixa o consenso um pouco melhor (46,0 contra 47,1 de PER em 760 gravações) e o destaque mais confiável (destacados acertam só 22%). Mas aprendeu com pronúncias de dicionário (eSpeak): tende à pronúncia "de livro", o que este app quer evitar. A escolha é sua.</li>
  <li><b>LoWhIPA comb</b> é melhor que o WhIPA base (75,8 contra 79,3 de PER no app) e do mesmo tamanho; no lugar do WhIPA, o consenso melhora um pouco (46,7 contra 47,1) sem perder nada.</li>
  <li><b>ZIPA large</b> está disponível, mas no conjunto de referência foi pior que o ZIPA pequeno (69,1 contra 64,2) e é 4 vezes maior: só como voto extra.</li>
  <li><b>Allophant</b> (71,0) e <b>Allosaurus</b> (91,7, de 2020) servem mais para comparação. O <b>WhIPA large</b> (69,4) tem 1,5 bilhão de parâmetros: grande demais para um navegador.</li>
  <li>Tem espaço? Pode marcar tudo. A maioria é sempre "mais da metade dos modelos que rodaram"; com número par de modelos, empates ficam destacados. Com os 9 menores (todos menos o ZIPA large), símbolos com maioria acertam 74% (contra 69%), mas um terço fica destacado.</li>
</ul>
<h3>Espaço e cache</h3>
<ul>
  <li>Os modelos ficam guardados no navegador. "Apagar" em ☰ → Opções libera o espaço; limpar os dados do navegador também apaga, e eles serão baixados de novo.</li>
</ul>
<h3>Código e uso offline</h3>
<p>Código-fonte e instruções para rodar no seu computador: <a href="https://github.com/allan-valin/speech-to-ipa#run-it-locally">github.com/allan-valin/speech-to-ipa</a>.</p>`,
  "src.paper": "O artigo por trás do app",
  "src.paperText": "Os modelos foram escolhidos com os resultados de",
  "src.models": "Modelos", "src.model": "modelo", "src.copy": "cópia convertida", "src.license": "licença",
  "src.data": "Dados e ferramentas",
  "src.nc": "Uso não comercial: dois dos modelos são CC BY-NC-SA 4.0.",
  "src.code": "Código-fonte",
  "instr.6": "Fale em ritmo normal, sem pressa; gravações de mais de 1 segundo funcionam melhor.",
  "run.reading": "Lendo {name} do aparelho ({step})…",
  "theme.toLight": "Mudar para tema claro",
  "theme.toDark": "Mudar para tema escuro",
  "theme.light": "Tema claro.",
  "theme.dark": "Tema escuro.",
  "res.wrap": "Permitir quebra de linha",
  "res.scroll": "Rolar a transcrição para os lados",
  "recs.exportAll": "Exportar todas (.zip)",
  "exp.packing": "Juntando {n} gravação(ões) num .zip, cada uma na sua pasta…",
  "recs.rename": "Renomear",
  "recs.renamePrompt": "Nome desta gravação (vazio = sem nome; usado no nome dos arquivos exportados):",
  "recs.renameCancelled": "Renomeação cancelada.",
  "recs.renamed": "Renomeada: {name}.",
  "recs.unnamed": "Nome removido; os arquivos usam a transcrição.",
  "recs.nameHint": "Os arquivos exportados recebem o nome da lista: data, duração e a transcrição. Alguns programas estragam os símbolos do IPA no nome; use \"Renomear\" para dar um nome simples, que substitui a transcrição no nome do arquivo (o conteúdo não muda).",
  "instr.sample": "Exemplo de resultado (a palavra islandesa “bið”): cada linha é um modelo, a faixa de baixo é o consenso. θ está destacado: sem maioria.",
};
