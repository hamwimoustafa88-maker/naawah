// معاينة ثابتة مُصيَّرة على الخادم لصفحات /templates — بلا أي التقاط صورة (لا
// Playwright ولا html-to-image): تعيد استعمال Frame SVG نفسه + توكنات القالب
// الحقيقية (نفس آلية --tpl-accent/--tpl-ink التي يقرأها ObituaryCanvas.tsx فعلياً)
// مع نص عيّنة ثابت، فتُنتج معاينة صادقة بصرياً لكل قالب بلا أي تبعية جديدة، وقابلة
// للفهرسة كـHTML/CSS حقيقي (لا صورة).
import type { TemplateDefinition } from "@/lib/templates/types"

export function TemplatePreviewCard({ template, className }: { template: TemplateDefinition; className?: string }) {
  const { tokens, Frame } = template
  return (
    <div
      className={className}
      style={{
        position: "relative",
        aspectRatio: "794 / 1123",
        width: "100%",
        overflow: "hidden",
        borderRadius: 8,
        background: tokens.bg,
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
        // @ts-expect-error -- متغيّرات CSS مخصّصة للقالب، تُقرأ عبر var() داخل Frame
        "--tpl-bg": tokens.bg,
        "--tpl-ink": tokens.ink,
        "--tpl-accent": tokens.accent,
        "--tpl-muted": tokens.muted,
      }}
    >
      <Frame className="absolute inset-0 h-full w-full" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6%",
          padding: "10%",
          textAlign: "center",
          color: tokens.ink,
        }}
      >
        <span style={{ fontFamily: tokens.bodyFont, fontSize: "5.2%", color: tokens.muted }}>
          إنّا لله وإنّا إليه راجعون
        </span>
        {template.divider && (
          <span style={{ color: tokens.accent, fontSize: "5%" }}>{template.divider}</span>
        )}
        <span style={{ fontFamily: tokens.bodyFont, fontSize: "4.5%", color: tokens.muted }}>
          المرحوم بإذن الله تعالى
        </span>
        <span
          style={{
            fontFamily: tokens.nameFont,
            fontSize: `${(template.nameSizeEm ?? 2.5) * 3.4}%`,
            fontWeight: 700,
            color: tokens.ink,
          }}
        >
          فلان الفلاني
        </span>
      </div>
    </div>
  )
}
