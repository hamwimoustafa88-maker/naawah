"use client"

import { useEffect } from "react"
import { useEditorStore } from "@/store/editorStore"

const MAX_HISTORY = 50
// الضغطات المتتالية تُعدّ تعديلاً واحداً، وإلا تراجع الزر حرفاً حرفاً.
const BURST_GAP_MS = 500

function isTextField(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
}

/** يسجّل لقطات التراجع ويربط Ctrl+Z / Ctrl+Y خارج حقول النص، التي تحتفظ بتراجعها الأصلي. */
export function useObituaryHistory() {
  useEffect(() => {
    const { getState, setState, subscribe } = useEditorStore
    let baseline = getState().data
    let burstActive = false
    let timer: ReturnType<typeof setTimeout> | undefined

    const endBurst = () => {
      clearTimeout(timer)
      burstActive = false
      baseline = getState().data
    }

    const unsubscribe = subscribe((state, previous) => {
      if (state.archiveKey !== previous.archiveKey) {
        endBurst()
        setState({ past: [], future: [] })
        return
      }
      if (state.data === previous.data) return
      // undo/redo يبدّلان السجل مع البيانات، فلا يُسجَّلان كتعديل جديد.
      if (state.past !== previous.past || state.future !== previous.future) {
        endBurst()
        return
      }
      if (!burstActive) {
        burstActive = true
        setState({ past: [...state.past, baseline].slice(-MAX_HISTORY), future: [] })
      }
      clearTimeout(timer)
      timer = setTimeout(endBurst, BURST_GAP_MS)
    })

    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || isTextField(event.target)) return
      // code لا key: الحرف المُبلَّغ يختلف مع لوحة المفاتيح العربية.
      const wantsRedo = event.code === "KeyY" || (event.code === "KeyZ" && event.shiftKey)
      if (event.code !== "KeyZ" && !wantsRedo) return
      event.preventDefault()
      if (wantsRedo) getState().redo()
      else getState().undo()
    }
    document.addEventListener("keydown", onKeyDown)

    return () => {
      clearTimeout(timer)
      unsubscribe()
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])
}
