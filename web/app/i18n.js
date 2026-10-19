// Interface languages: Brazilian Portuguese (the app's own), then the languages of the
// countries where the models' authors work, in respect for whose work the app runs on.
import pt from "./i18n/pt.js";
import en from "./i18n/en.js";
import de from "./i18n/de.js";
import ja from "./i18n/ja.js";
import fr from "./i18n/fr.js";
import it from "./i18n/it.js";
import sv from "./i18n/sv.js";
import el from "./i18n/el.js";

export const LANGS = [
  { code: "pt-BR", short: "PT", name: "Português (Brasil)", flag: "br", dict: pt },
  { code: "en", short: "EN", name: "English", flag: "us", dict: en },
  { code: "de", short: "DE", name: "Deutsch", flag: "de", dict: de },
  { code: "ja", short: "日本", name: "日本語", flag: "jp", dict: ja },
  { code: "fr", short: "FR", name: "Français", flag: "fr", dict: fr },
  { code: "it", short: "IT", name: "Italiano", flag: "it", dict: it },
  { code: "sv", short: "SV", name: "Svenska", flag: "se", dict: sv },
  { code: "el", short: "ΕΛ", name: "Ελληνικά", flag: "gr", dict: el },
];

let cur = LANGS[0];
export const lang = () => cur.code;

/** Pick a language by code; without one, the browser's language if we have it, else pt-BR. */
export function setLang(code) {
  const want = code || (globalThis.navigator?.languages || []).find(l => LANGS.some(x => x.code === l || x.code === l.split("-")[0])) || "pt-BR";
  cur = LANGS.find(x => x.code === want) || LANGS.find(x => x.code === want.split("-")[0]) || LANGS[0];
  if (globalThis.document) document.documentElement.lang = cur.code;
}

/** Translated text; {name} placeholders filled from `vars`. Missing keys fall back to English, then Portuguese. */
export function t(key, vars = {}, fallback = key) {
  const s = cur.dict[key] ?? en[key] ?? pt[key] ?? fallback;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

/** Fill elements marked data-i18n (text), data-i18n-html (markup) and data-i18n-title. */
export function applyStatic(root) {
  // the page's own (Portuguese) text is kept as the fallback, in case a cached dictionary is older
  for (const el of root.querySelectorAll("[data-i18n]")) {
    el.dataset.orig ??= el.textContent;
    el.textContent = t(el.dataset.i18n, {}, el.dataset.orig);
  }
  for (const el of root.querySelectorAll("[data-i18n-html]")) {
    el.dataset.orig ??= el.innerHTML;
    el.innerHTML = t(el.dataset.i18nHtml, {}, el.dataset.orig);
  }
  for (const el of root.querySelectorAll("[data-i18n-title]")) {
    el.dataset.origTitle ??= el.title;
    el.title = t(el.dataset.i18nTitle, {}, el.dataset.origTitle);
  }
  document.title = t("title");
}

export const helpHtml = () => t("help.html");

export function sourcesHtml(models) {
  const a = (url, text) => `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
  return `<h3>${t("src.paper")}</h3>
<p>${t("src.paperText")} ${a("https://github.com/allan-valin/phonetic-eval/blob/main/paper/speech_to_ipa_survey.pdf",
    "Allan Valin. <i>A Comparative Survey and Evaluation of Language-Agnostic Speech-to-IPA Transcription Systems</i>")}
  (${a("https://github.com/allan-valin/phonetic-eval", "phonetic-eval")}).</p>
<h3>${t("src.models")}</h3>
<ul class="sources">${models.map(m => `<li><b>${m.name}</b>: ${a(m.paper.url, m.paper.cite)}.
  ${a(m.source, t("src.model"))} · ${a(m.licenseUrl, `${t("src.license")} ${m.license}`)}${m.copy ? ` · ${a(m.copy, t("src.copy"))}` : ""}</li>`).join("")}</ul>
<h3>${t("src.data")}</h3>
<ul class="sources">
  <li>VoxAngeles: ${a("https://arxiv.org/abs/2403.19509", "Chodroff, Pažon, Baker, Moran. Phonetic Segmentation of the UCLA Phonetics Lab Archive. LREC-COLING 2024")}.</li>
  <li>${a("https://www.internationalphoneticassociation.org/content/ipa-chart", "IPA Chart")} (International Phonetic Association, 2020, CC BY-SA 3.0).</li>
  <li>${a("https://onnxruntime.ai/", "ONNX Runtime Web")} (MIT) · ${a("https://github.com/gzuidhof/coi-serviceworker", "coi-serviceworker")} (MIT) · ${a("https://github.com/lipis/flag-icons", "flag-icons")} (MIT).</li>
</ul>
<p>${t("src.nc")} ${a("https://github.com/allan-valin/speech-to-ipa", t("src.code"))}.</p>`;
}
