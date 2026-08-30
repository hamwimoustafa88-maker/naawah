"use client"

// بوتوم-شيت عام قابل لإعادة الاستعمال — خلفية شفافة داكنة (تُبقي المعاينة الحية
// ظاهرة خلفها جزئياً) + لوحة تنزلق من الأسفل. لا اعتماد على مكتبة خارجية (لا Radix/Headless
// مثبَّتة في المشروع) — نفس أسلوب TextSettingsPanel.tsx (إغلاق بالنقر خارجاً + Esc) لكن
// بتصميم بوتوم-شيت كامل الشاشة بدل بوب-أوفر صغير، ومع حركة انزلاق دخول/خروج بسيطة.

import { useEffect, useState, type ReactNode } from "react"
import { ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils/cn"

export function BottomSheet({
  open,
  onClose,
  title,
  onBack,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  /** إن مُرِّرت، يظهر سهم رجوع بدل ترك اللوحة على القائمة الرئيسية فقط. */
  onBack?: () => void
  children: ReactNode
  /** شريط سفلي ثابت (لا يتمرّر مع المحتوى) — يُستعمل لأزرار "السابق/التالي"
   * للتنقّل المباشر بين الأقسام بلا رجوع للقائمة الرئيسية في كل مرة. */
  footer?: ReactNode
}) {
  // mounted: العنصر موجود في الـDOM (لإتاحة حركة الخروج قبل الإزالة الفعلية).
  // entered: الحالة البصرية "مفتوح تماماً" (translate-y-0) — تُفعَّل بعد إطار واحد من التركيب.
  const [mounted, setMounted] = useState(open)
  const [entered, setEntered] = useState(false)
  const [prevOpen, setPrevOpen] = useState(open)

  // ضبط الحالة أثناء التصيير نفسه (بلا useEffect وبلا ref) عند تغيّر open — النمط
  // الموصى به من مستندات React لتفادي setState متزامن داخل effect (يمنع تصييرات
  // متتالية غير ضرورية). الإزالة الفعلية من الـDOM بعد الإغلاق تُترك لحدث onTransitionEnd أدناه.
  if (prevOpen !== open) {
    setPrevOpen(open)
    if (open) setMounted(true)
    else setEntered(false)
  }

  useEffect(() => {
    if (!open) return
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [open])

  // شبكة أمان للإزالة من الـDOM بعد الإغلاق: onTransitionEnd أدناه هو المسار
  // المعتاد، لكنه *لا* يُضمَن إطلاقه فعلياً على كل جهاز/متصفح (مثال حقيقي: إعداد
  // "تقليل الحركة" على النظام قد يُلغي مدة الانتقال CSS بالكامل فيُسقِط الحدث نهائياً) —
  // بلا هذه الشبكة، يبقى العنصر مُركَّباً للأبد. المهلة هنا أطول قليلاً من مدة
  // الانتقال (٢٠٠مل ث) لتفادي التعارض مع onTransitionEnd في المسار الطبيعي.
  useEffect(() => {
    if (open) return
    const timeout = setTimeout(() => setMounted(false), 300)
    return () => clearTimeout(timeout)
  }, [open])

  // ارتفاع الكيبورد الظاهر حالياً (px) — يُستعمل لرفع اللوحة فوقه تماماً. مقصور
  // على هذا المكوّن وحده عمداً (لا حلّ عام على مستوى الصفحة عبر meta
  // interactiveWidget): جُرِّب ذاك أولاً فعلاً وتسبّب بتعليق حقيقي على الجهاز —
  // إجبار Chrome على إعادة تخطيط layout viewport للصفحة *كاملة* (بما فيها معاينة
  // الكانفاس الحيّة الثقيلة أسفل الصفحة) عند كل حرف يُكتَب فتح/أغلق تلميحات لوحة
  // المفاتيح. الحل هنا يقرأ VisualViewport API (يُبلَّغ فيها المتصفح فعلياً بارتفاع
  // الكيبورد بلا أي تغيير في layout viewport العام) ويُحرّك عنصر اللوحة نفسه فقط
  // عبر transform — صفر أثر على بقية شجرة الصفحة.
  const [keyboardInset, setKeyboardInset] = useState(0)

  useEffect(() => {
    if (!open) return
    const vv = window.visualViewport
    if (!vv) return
    const updateInset = () => {
      // الفرق بين ارتفاع نافذة التخطيط الكامل وارتفاع المنطقة المرئية الفعلية
      // (+ إزاحتها العلوية إن انزلقت الصفحة لأعلى لإظهار الحقل المركَّز) هو
      // تقريباً ارتفاع الكيبورد المُغطّى؛ Math.max يمنع رقماً سالباً وقت تكبير/تصغير
      // بالقرص (pinch-zoom) بلا كيبورد مفتوح أصلاً.
      const inset = window.innerHeight - vv.height - vv.offsetTop
      setKeyboardInset(Math.max(0, Math.round(inset)))
    }
    updateInset()
    vv.addEventListener("resize", updateInset)
    vv.addEventListener("scroll", updateInset)
    return () => {
      vv.removeEventListener("resize", updateInset)
      vv.removeEventListener("scroll", updateInset)
      setKeyboardInset(0)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)

    // قفل تمرير الصفحة خلف اللوحة — لكن فقط طالما اللوحة ظاهرة فعلياً (الجذر
    // أدناه lg:hidden). MobileEditorView يبقى مُركَّباً دائماً حتى على سطح
    // المكتب (تخفيه lg:hidden عبر CSS فقط، لا يُلغي تركيبه)، وsheetOpen يبدأ
    // true دائماً — فبلا هذا الشرط كان تمرير صفحة /create كاملة على سطح
    // المكتب يُقفَل بصمت من أول تحميل (عطل حقيقي صادفناه: "يختفي scroll أحياناً"،
    // يظهر فقط حين يطول محتوى النموذج عن ارتفاع الشاشة فيحاول المستخدم التمرير).
    // مستمع resize (لا فحص مرة واحدة فقط) لتغطية عبور حافة ١٠٢٤px حيّاً واللوحة
    // ما زالت مفتوحة (تكبير/تصغير نافذة المتصفح بلا إعادة تحميل).
    const desktopQuery = window.matchMedia("(min-width: 1024px)")
    const prevOverflow = document.body.style.overflow
    const syncOverflow = () => {
      document.body.style.overflow = desktopQuery.matches ? prevOverflow : "hidden"
    }
    syncOverflow()
    desktopQuery.addEventListener("change", syncOverflow)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      desktopQuery.removeEventListener("change", syncOverflow)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!mounted) return null

  return (
    <div
      className={cn("fixed inset-0 z-50 lg:hidden", entered ? "pointer-events-auto" : "pointer-events-none")}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={cn("absolute inset-0 bg-black/50 transition-opacity duration-200", entered ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <div
        className="absolute inset-x-0 bottom-0 flex max-h-[86vh] flex-col rounded-t-2xl bg-white shadow-2xl transition-transform duration-200 ease-out"
        style={{
          paddingBottom: keyboardInset > 0 ? 0 : "env(safe-area-inset-bottom)",
          // إغلاق/فتح اللوحة (انزلاق كامل الطول) ورفعها فوق الكيبورد (keyboardInset)
          // كلاهما بترجمة (translate) واحدة مدمجة هنا — لا صنف Tailwind منفصل
          // (translate-y-0/translate-y-full) لتفادي تعارض تحريكَين مستقلَّين على نفس
          // transform. راجع تعليق keyboardInset أعلى لسبب اعتماد VisualViewport API
          // هنا حصراً بدل حل عام على مستوى الصفحة.
          transform: entered ? `translateY(-${keyboardInset}px)` : "translateY(100%)",
        }}
        onTransitionEnd={(e) => {
          // نزيل اللوحة من الـDOM فقط بعد اكتمال حركة الانزلاق للخارج فعلياً
          // (لا فور تغيّر open) — بلا هذا الشرط تُقطع حركة الإغلاق منتصفها.
          if (e.propertyName === "transform" && !open) setMounted(false)
        }}
      >
        <div className="flex shrink-0 items-center justify-center pt-2.5">
          <div className="h-1.5 w-10 rounded-full bg-black/15" />
        </div>
        <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-4 py-3">
          {onBack ? (
            <button type="button" onClick={onBack} aria-label="رجوع" className="text-black/50 hover:text-black/80">
              <ChevronRight size={20} />
            </button>
          ) : (
            <span className="w-5" />
          )}
          <p className="text-sm font-bold text-foreground">{title}</p>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="text-black/50 hover:text-black/80">
            <X size={20} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4">{children}</div>
        {footer && <div className="shrink-0 border-t border-black/10 px-4 py-3">{footer}</div>}
      </div>
    </div>
  )
}
