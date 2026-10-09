"use client"

// يقلّص حجم الخط تلقائياً (بحث ثنائي) حتى يبقى المحتوى داخل صفحة A4 واحدة.
// يعالج تفاوت كثافة البيانات بين النعوات (من ~١٢ اسماً إلى ~٣٠).
//
// ثلاث مراحل متتالية، كل واحدة أشد "ضرراً" بصرياً من سابقتها — لا تبدأ مرحلة
// إلا بعد فشل ما قبلها في حل الفيض:
// ١) تصغير حجم الخط فقط حتى SOFT_MIN_FONT_PX (١٢px) — الحد "المفضّل" المقروء.
// ٢) الخط مثبَّت على ١٢px، تضييق تباعد الأسطر/الفقرات (--fit-tightness) بدل
//    الاستمرار بتصغير الخط — يستهلكه lineHeight/gap في ObituaryBlocks.tsx.
// ٣) ملاذ أخير: التباعد مثبَّت على أضيق حالة، والخط يستمر بالتصغير متجاوزاً
//    الحد "المفضّل" حتى HARD_MIN_FONT_PX (١٠px) — طُلب صراحةً ألا يُترك المحتوى
//    فائضاً/مقصوصاً (يختفي القسم السفلي بالكامل) إن كان كسر الحد المفضّل قليلاً
//    كفيلاً بإنقاذ الصفحة كلها؛ أفضل من صفحة ناقصة.
// دمج الأسطر القصيرة (كـ"والده"/"شقيقته") في سطر واحد، وتصغير الصورة وهوامش
// الأعلى، معالَجة في ObituaryBlocks.tsx نفسه (خارج هذا الهوك) — انظر تعليقاته.

import { useLayoutEffect, useRef, useState } from "react"

const BASE_FONT_PX = 16
const MAX_SCALE = 1.0
const SOFT_MIN_FONT_PX = 12
const SOFT_MIN_SCALE = SOFT_MIN_FONT_PX / BASE_FONT_PX // 0.75 — الحد المفضّل
const HARD_MIN_FONT_PX = 10
const HARD_MIN_SCALE = HARD_MIN_FONT_PX / BASE_FONT_PX // 0.625 — أقصى كسر مقبول للحد المفضّل

const MAX_TIGHTNESS = 1.0
const MIN_TIGHTNESS = 0.7 // أقصى تضييق مقبول لتباعد الأسطر قبل اللجوء لكسر حد الخط

// ٨ تكرارات على أي من المديين تعطي دقة أدق من أي فرق مرئي، فلا حاجة لتكرارات
// إضافية تُكلّف reflow دون أي أثر بصري.
const ITERATIONS = 8

// حدّ أقصى لعدد "جولات" القياس المتتالية لكل تغيّر بيانات حقيقي واحد — راجع
// تعليق roundRef وحلقة scale/tightness في deps أسفل لسبب الحاجة لأكثر من جولة
// واحدة أصلاً. ٣ كافية عملياً (استقرار العتبات الثلاث الممكنة لكثافة الأقارب في
// ObituaryBlocks.tsx: stacked/paired/flowing) بلا خطر تذبذب لا نهائي — الجولة
// الأخيرة تُطبَّق دائماً على الـDOM مباشرة حتى لو لم تُبلَّغ لحالة React.
const MAX_SETTLE_ROUNDS = 3

export function useAutoFit(deps: unknown[]) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // يُستهلَك من عناصر لها حد أدنى خاص للتصغير يختلف عن حد النص (مثال: صورة الفقيد
  // تتقلّص مع النص لكن بحد أدنى خاص بها. راجع ObituaryBlocks.tsx).
  const [scale, setScale] = useState(MAX_SCALE)
  // مقياس تضييق تباعد الأسطر (١ = طبيعي، ٠.٧ = أضيق ما يُقبل) — يُقرأ عبر
  // var(--fit-tightness) في ObituaryBlocks.tsx لتضييق lineHeight/gap/هوامش الأعلى.
  const [tightness, setTightness] = useState(MAX_TIGHTNESS)
  // عدّاد جولات القياس المتتالية (راجع سبب وجودها في تعليق useLayoutEffect الثاني
  // أسفل) — مرجع لا حالة React عمداً، تغييره لا يجب أن يُسبّب إعادة رسم بنفسه.
  const roundRef = useRef(0)

  // يُصفَّر عدّاد الجولات عند أي تغيّر حقيقي في البيانات المُمرَّرة (deps) — أي
  // محتوى جديد فعلياً يستحق ميزانية جولات كاملة جديدة، لا استهلاك ما تبقّى من
  // ميزانية محتوى سابق. يُنفَّذ قبل useLayoutEffect الثاني أسفل (React يُشغّل
  // تأثيرات المكوّن نفسه بترتيب تعريفها ضمن الالتزام (commit) نفسه).
  useLayoutEffect(() => {
    roundRef.current = 0
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return

    const fits = (fontScale: number, spacingTightness: number) => {
      content.style.fontSize = `${BASE_FONT_PX * fontScale}px`
      content.style.setProperty("--fit-tightness", String(spacingTightness))
      return content.scrollHeight <= container.clientHeight
    }

    // خوارزمية القياس (المراحل الثلاث) — تقيس بنية DOM *الحالية* كما هي، وتُعيد
    // النتيجة بدل تثبيتها في حالة React مباشرة (راجع التعليق أسفل الحلقة).
    const measure = (): [fontScale: number, tightness: number] => {
      if (fits(MAX_SCALE, MAX_TIGHTNESS)) {
        return [MAX_SCALE, MAX_TIGHTNESS]
      }

      // المرحلة ١: تصغير حجم الخط فقط، بلا تضييق تباعد، حتى الحد المفضّل (١٢px)
      let lo = SOFT_MIN_SCALE
      let hi = MAX_SCALE
      for (let i = 0; i < ITERATIONS; i++) {
        const mid = (lo + hi) / 2
        if (fits(mid, MAX_TIGHTNESS)) {
          lo = mid
        } else {
          hi = mid
        }
      }

      if (fits(lo, MAX_TIGHTNESS)) {
        return [lo, MAX_TIGHTNESS]
      }

      // المرحلة ٢: الخط مثبَّت على الحد المفضّل (١٢px) وما زال المحتوى فائضاً —
      // نضيّق تباعد الأسطر تدريجياً بدل كسر الحد المفضّل مباشرة.
      let tlo = MIN_TIGHTNESS
      let thi = MAX_TIGHTNESS
      for (let i = 0; i < ITERATIONS; i++) {
        const tmid = (tlo + thi) / 2
        if (fits(SOFT_MIN_SCALE, tmid)) {
          tlo = tmid
        } else {
          thi = tmid
        }
      }

      if (fits(SOFT_MIN_SCALE, tlo)) {
        return [SOFT_MIN_SCALE, tlo]
      }

      // المرحلة ٣ (ملاذ أخير): التباعد مثبَّت على أضيق حالة، والخط يتابع التصغير
      // متجاوزاً الحد المفضّل حتى الحد الأقصى للكسر (١٠px) — أفضل من ترك القسم
      // السفلي كاملاً مقصوصاً/مخفياً كما في نعوة كثيفة البيانات.
      let flo = HARD_MIN_SCALE
      let fhi = SOFT_MIN_SCALE
      for (let i = 0; i < ITERATIONS; i++) {
        const fmid = (flo + fhi) / 2
        if (fits(fmid, MIN_TIGHTNESS)) {
          flo = fmid
        } else {
          fhi = fmid
        }
      }
      // إن لم يُفلح حتى الحد الأقصى للكسر (١٠px)، يبقى المحتوى فائضاً فعلياً —
      // أفضل من مخالفة كل الحدود الدنيا لمحاولة إخفاء الفيض بلا جدوى.
      return [flo, MIN_TIGHTNESS]
    }

    const [fontScale, spacingTightness] = measure()
    // نُثبّت القيمة في الـDOM دائماً وفوراً (حتى لو بلغنا حدّ الجولات أسفل بلا
    // استقرار تام) — آخر تكرار بحث ثنائي قد يكون اختبر قيمة لا تناسب، وإلا يبقى
    // المحتوى بحجم فائض عند التصدير.
    fits(fontScale, spacingTightness)

    // العطل الجذري الذي يُصلحه ما يلي: بعض المستهلكين (كتلة الأقارب في
    // ObituaryBlocks.tsx عبر relativesDensityMode) يُعيدون تشكيل بنية DOM نفسها
    // اعتماداً على scale النهائي (تكديس فئة بكل سطر ↔ دمجها معاً)، لا حجم الخط
    // فقط. جولة قياس واحدة تقيس بنية العرض *الحالية* (المعتمدة على scale/tightness
    // من الجولة *السابقة*) ثم تُثبّت قيمة جديدة قد تُغيّر تلك البنية ذاتها — فتبقى
    // نتيجة هذه الجولة محسوبة على بنية لم تعد موجودة (مثال حقيقي واجهناه: قيست
    // على شكل "مكدَّس" أطول فاستُنتج خط صغير جداً، ثم تحوّل العرض فعلياً إلى شكل
    // "متدفّق" أقصر بكثير بنفس الخط الصغير — نص مزدحم ظاهرياً رغم فراغ واضح أسفل
    // الصفحة). الحل: scale/tightness أنفسهما ضمن deps هذا الـeffect (أسفل) —
    // فتغييرهما هنا (حين يختلفان عمّا استقرّ عليه آخر مرة) يُعيد تشغيل هذا الـ
    // effect تلقائياً بعد أن يُعيد React رسم البنية المعتمدة عليهما فعلياً
    // (useLayoutEffect يضمن ذلك قبل أي رسم فعلي على الشاشة — بلا وميض مرئي)،
    // فتُقاس البنية الحقيقية الجديدة في الجولة التالية لا القديمة المفترضة.
    // roundRef يحدّ عدد الجولات المتتالية (MAX_SETTLE_ROUNDS) درءاً لأي تذبذب
    // نظري (مثال: تدفّق يفسح فيتحوّل تكديساً فيفيض فيتدفّق مجدداً...).
    const changedFromCommitted = fontScale !== scale || spacingTightness !== tightness
    if (changedFromCommitted && roundRef.current < MAX_SETTLE_ROUNDS) {
      roundRef.current += 1
      setScale(fontScale)
      setTightness(spacingTightness)
    }

    // العطل الجذري الذي يُصلحه ما يلي: القياس أعلاه يُنفَّذ فوراً (useLayoutEffect)
    // وقد يسبق اكتمال تحميل خطوط Google العربية (Amiri/Aref Ruqaa وغيرها) —
    // فيقيس بمقاييس خط بديل (fallback) مختلفة عن الخط الحقيقي، فيستقر على مقياس
    // خاطئ. بلا إعادة قياس لاحقة، يبقى هذا الخطأ ظاهراً حتى يتغيّر أحد عناصر
    // deps (كالنقر على القالب نفسه مجدداً، الذي يستبدل data بمرجع جديد رغم تطابق
    // القيمة) فيعيد المحاولة بعد اكتمال التحميل فيبدو "نموذجاً مختلفاً". الحل:
    // إعادة القياس تلقائياً فور اكتمال تحميل كل الخطوط، بلا انتظار نقرة إضافية.
    let cancelled = false
    const remeasureIfLive = () => {
      if (cancelled || containerRef.current !== container || contentRef.current !== content) return
      // مصدر خارجي (اكتمال خط/صورة، لا تغيّر بيانات) — يستحق ميزانية جولات جديدة
      // كاملة (نفس منطق useLayoutEffect الأول أعلى)، لا مشاركة ما تبقّى من الجولة
      // الحالية إن كانت استُنفدت بالفعل.
      roundRef.current = 0
      const [fs, tn] = measure()
      fits(fs, tn)
      if (fs !== scale || tn !== tightness) {
        roundRef.current += 1
        setScale(fs)
        setTightness(tn)
      }
    }

    // **الشرط `status !== "loaded"` إلزامي، وغيابه كان عطلاً حقيقياً**: `document.fonts.ready`
    // وعدٌ (Promise) يُحسم مرة واحدة عند اكتمال تحميل الخطوط ويبقى محسوماً بعدها للأبد.
    // فبلا هذا الشرط، كان `.then(...)` يُسجَّل في *كل* تشغيل لهذا الـeffect (أي مع كل
    // ضغطة مفتاح)، ولأنه محسوم سلفاً كان ينطلق فوراً كمهمة دقيقة (microtask) في كل مرة.
    // وremeasureIfLive يُصفّر roundRef — أي يُبطِل قاطع الأمان MAX_SETTLE_ROUNDS كلياً:
    // تنفد الجولات الثلاث، ثم تُصفَّر من جديد، فتبدأ ثلاث أخرى… بلا نهاية.
    // هذا لا يُلاحَظ ما دام القياس يستقرّ على قيمة واحدة (fs === scale فلا setState).
    // لكنه يتحوّل إلى **حلقة لا نهائية** متى تذبذب القياس بين قيمتين — وهو ما يحدث
    // تحديداً عند وجود صورة الفقيد: `photoScale = Math.max(scale, 0.6)` في
    // ObituaryBlocks.tsx يجعل ارتفاع الصورة بالبكسل المطلق مشتقاً من ناتج auto-fit
    // نفسه، فيصير الارتفاع المقيس دالةً في scale الذي نحسبه منه (تغذية راجعة).
    // كل دورة تُنفّذ حتى ٢٤ قياس تخطيط متزامناً للصفحة كاملة، فلا يُفلت الخيط
    // الرئيسي أبداً: تتجمّد الصفحة والكيبورد والمتصفح. بلا صورة لا تذبذب ولا تجمّد.
    // بهذا الشرط يُسجَّل المستمع مرة واحدة فقط أثناء التحميل الفعلي للخطوط (وهو
    // الغرض الأصلي المشروح أعلاه)، فيستعيد MAX_SETTLE_ROUNDS دوره كقاطع أمان حقيقي.
    const fontSet = typeof document !== "undefined" ? document.fonts : undefined
    if (fontSet && fontSet.status !== "loaded" && fontSet.ready?.then) {
      fontSet.ready.then(remeasureIfLive)
    }

    // نفس فئة العطل تماماً، لكن مصدرها هنا مخطوطات SVG اليدوية (Calligraphy.tsx):
    // <img> فيها width صريح لكن height:"auto" — فالمتصفح لا يعرف الارتفاع الحقيقي
    // إلا بعد اكتمال تحميل ملف الـSVG فعلياً عبر الشبكة (نسبة أبعاد افتراضية
    // مؤقتة قبل ذلك). القياس أعلاه يُنفَّذ قبل هذا التحميل غالباً، فيُقاس بارتفاع
    // خاطئ لأي مخطوطة (بسملة/آية رئيسية/"إنّا لله") لم تكتمل بعد. نستمع لحدث
    // load/error على كل صورة لم تكتمل بعد ونعيد القياس فور اكتمالها.
    const pendingImages = Array.from(content.querySelectorAll("img")).filter((img) => !img.complete)
    for (const img of pendingImages) {
      img.addEventListener("load", remeasureIfLive)
      img.addEventListener("error", remeasureIfLive)
    }

    return () => {
      cancelled = true
      for (const img of pendingImages) {
        img.removeEventListener("load", remeasureIfLive)
        img.removeEventListener("error", remeasureIfLive)
      }
    }
    // deps: البيانات الخارجية + scale/tightness نفسيهما (راجع التعليق أعلى لسبب
    // الحاجة لهذين تحديداً ضمن deps هذا الـeffect بالذات) — لا حاجة لأي تبعية أخرى.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, scale, tightness])

  return { containerRef, contentRef, scale, tightness }
}
