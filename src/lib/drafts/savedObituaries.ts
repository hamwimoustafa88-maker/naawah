// تخزين النعوات داخل متصفح المستخدم عبر IndexedDB — لا localStorage، لأن صورة الفقيد
// (data URL) تتجاوز بسهولة حدّه (~٥ ميجابايت). لا شيء هنا يصل لأي خادم.

import type { ObituaryData } from "@/lib/obituary/types"

export interface SavedObituary {
  /** نفس archiveKey في editorStore — هوية واحدة للنعوة محلياً وفي الأرشيف. */
  id: string
  data: ObituaryData
  /** آخر تعديل أو فتح — أحدث قيمة هي النعوة التي تُستعاد عند إعادة فتح المحرر. */
  lastUsedAt: number
}

const DB_NAME = "naawah-obituaries"
const STORE_NAME = "obituaries"

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: "id" })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function runInStore<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode)
      const request = action(transaction.objectStore(STORE_NAME))
      transaction.oncomplete = () => resolve(request.result)
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
  } finally {
    db.close()
  }
}

/** كل النعوات المحفوظة، الأحدث استعمالاً أولاً. */
export async function listSavedObituaries(): Promise<SavedObituary[]> {
  const all = await runInStore<SavedObituary[]>("readonly", (store) => store.getAll())
  return all.sort((a, b) => b.lastUsedAt - a.lastUsedAt)
}

export async function saveObituary(obituary: SavedObituary): Promise<void> {
  await runInStore("readwrite", (store) => store.put(obituary))
}

export async function deleteSavedObituary(id: string): Promise<void> {
  await runInStore("readwrite", (store) => store.delete(id))
}

let durableStorageRequested = false

/** يطلب من المتصفح عدم حذف البيانات تلقائياً عند ضيق المساحة — مرة واحدة لكل جلسة. */
export function requestDurableStorage(): void {
  if (durableStorageRequested) return
  durableStorageRequested = true
  void navigator.storage?.persist?.().catch(() => {})
}
