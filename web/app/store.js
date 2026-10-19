// Recordings kept in the browser (IndexedDB): 16 kHz audio plus each model's
// transcription, so a model can be added to an old recording later.

const DB = "ipa-recordings", STORE = "recordings";

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(mode, fn) {
  return open().then(db => new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode), req = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(req?.result);
    t.onerror = () => reject(t.error);
  }));
}

export const save = rec => tx("readwrite", s => s.put(rec));
export const get = id => tx("readonly", s => s.get(id));
export const remove = id => tx("readwrite", s => s.delete(id));
export async function list() {
  const all = (await tx("readonly", s => s.getAll())) || [];
  return all.sort((a, b) => b.created - a.created);
}
