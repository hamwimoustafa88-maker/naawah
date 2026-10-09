"use client"

// مفتاح الوضع المظلم — مشترك بين الصفحة الرئيسية وترويسة (/create) معاً. لا حالة
// React هنا إطلاقاً: النقر يبدّل data-theme على <html> مباشرة (DOM بحت)، والأيقونة
// المعروضة يحسمها CSS عبر محدِّد الأصل [data-theme="dark"] — فلا فرق بين مخرج
// الخادم والعميل، وبالتالي لا وميض ولا أي احتمال عدم تطابق ترطيب (hydration mismatch).
// انتقاء الألوان الداكنة كلّه محصور بصنف .home-scope في globals.css — أي عنصر يستعمل
// هذا المفتاح يجب أن يكون هو نفسه (أو أحد أسلافه) داخل .home-scope، وإلا لن يتأثر بصرياً.

import { Moon, Sun } from "lucide-react"

const STORAGE_KEY = "home-theme"

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement
    const next = root.dataset.theme === "dark" ? "light" : "dark"
    root.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage قد يكون معطّلاً (تصفّح خاص) — التبديل يبقى يعمل بصرياً لهذه الجلسة فقط
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="التبديل بين المظهر الفاتح والداكن"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--home-border) text-(--home-fg) transition-colors hover:bg-(--home-bg)"
    >
      <Sun size={16} className="hidden [html[data-theme=dark]_&]:block" />
      <Moon size={16} className="[html[data-theme=dark]_&]:hidden" />
    </button>
  )
}
