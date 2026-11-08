"use client"

import { useEffect } from "react"
import { listSavedObituaries, requestDurableStorage, saveObituary } from "@/lib/drafts/savedObituaries"
import type { ObituaryData } from "@/lib/obituary/types"
import { createEmptyData, useEditorStore } from "@/store/editorStore"

// قصيرة عمداً: Chrome يلغي كتابة IndexedDB التي تبدأ أثناء تدمير الصفحة (إغلاق/إعادة تحميل)،
// فهذه المهلة هي النافذة الوحيدة التي قد يضيع فيها آخر تعديل.
const SAVE_DELAY_MS = 200

// القالب مستثنى: فتح /create?template=… يغيّره قبل أي كتابة، وذلك لا يجعل النعوة تستحق الحفظ.
const blankFingerprint = (data: ObituaryData) => JSON.stringify({ ...data, templateId: "" })
const BLANK_OBITUARY = blankFingerprint(createEmptyData())

/** يستعيد آخر نعوة عند فتح المحرر، ثم يحفظ كل تعديل تلقائياً في المتصفح. */
export function useObituaryAutosave() {
  useEffect(() => {
    const { getState, setState, subscribe } = useEditorStore
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | undefined
    // نعوة حُفظت سابقاً تبقى تُحفظ حتى لو أُفرغت حقولها، كي لا يعود النص الممسوح عند إعادة الفتح.
    let storedId: string | undefined

    const save = () => {
      clearTimeout(timer)
      timer = undefined
      const { data, archiveKey } = getState()
      if (!archiveKey) return
      if (storedId !== archiveKey && blankFingerprint(data) === BLANK_OBITUARY) return
      storedId = archiveKey
      saveObituary({ id: archiveKey, data, lastUsedAt: Date.now() })
        .then(() => {
          setState({ draftSaveFailed: false })
          requestDurableStorage()
        })
        .catch((err) => {
          console.error(err)
          setState({ draftSaveFailed: true })
        })
    }

    const flush = () => {
      if (timer !== undefined) save()
    }
    // الجوال قد يقتل الصفحة بلا إنذار بعد إخفائها، فلا ننتظر انتهاء المهلة.
    const flushWhenHidden = () => {
      if (document.visibilityState === "hidden") flush()
    }

    const unsubscribe = subscribe((state, previous) => {
      if (state.data === previous.data) return
      clearTimeout(timer)
      timer = setTimeout(save, SAVE_DELAY_MS)
    })
    document.addEventListener("visibilitychange", flushWhenHidden)
    window.addEventListener("pagehide", flush)

    listSavedObituaries()
      .catch((err) => {
        console.error(err)
        return []
      })
      .then((saved) => {
        if (cancelled) return
        const latest = saved[0]
        if (latest) getState().openObituary(latest.id, latest.data)
        else if (!getState().archiveKey) getState().regenerateArchiveKey()
        setState({ draftsReady: true })
      })

    return () => {
      cancelled = true
      unsubscribe()
      document.removeEventListener("visibilitychange", flushWhenHidden)
      window.removeEventListener("pagehide", flush)
      flush()
      setState({ draftsReady: false })
    }
  }, [])
}
