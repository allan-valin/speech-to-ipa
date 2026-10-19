// Editing the consensus: a list of symbols; every operation returns a new list.

export const insertLeft = (syms, i, s) => [...syms.slice(0, Math.max(i, 0)), s, ...syms.slice(Math.max(i, 0))];
export const insertRight = (syms, i, s) => [...syms.slice(0, i + 1), s, ...syms.slice(i + 1)];
export const swap = (syms, i, s) => syms.map((x, k) => (k === i ? s : x));
// diacritics, length and tone marks join the symbol they modify
export const addMark = (syms, i, mark) => syms.map((x, k) => (k === i ? (x + mark).normalize("NFC") : x));
export const removeAt = (syms, i) => syms.filter((_, k) => k !== i);
