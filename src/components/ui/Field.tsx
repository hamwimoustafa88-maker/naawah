// عناصر إدخال أساسية موحّدة الشكل — بلا اعتماد على مكتبة خارجية.

import { cn } from "@/lib/utils/cn"
import { ChevronDown } from "lucide-react"
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"

// مُصدَّرة عمداً: FontPicker.tsx (قائمة خطوط مخصّصة بمعاينة hover، بديلة عن <select>
// الأصلي في هذه الحالة تحديداً) تحتاج نفس شكل الحقل القياسي دون تكرار السلسلة.
export const FIELD_BASE =
  "w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-foreground placeholder:text-black/35 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-foreground", className)} {...props} />
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(FIELD_BASE, className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(FIELD_BASE, "min-h-20 resize-y", className)} {...props} />
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  // className يُطبَّق على الحاوية الخارجية (للتحكم بالعرض من الخارج كما كان)،
  // بينما شكل الحقل نفسه ثابت دائماً.
  return (
    <div className={cn("relative", className)}>
      <select className={cn(FIELD_BASE, "w-full appearance-none bg-white pl-8")} {...props}>
        {children}
      </select>
      {/* السهم مثبَّت يسار الحقل (الجهة الختامية في RTL) — pointer-events-none لئلا يحجب النقر */}
      <ChevronDown size={16} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-black/45" />
    </div>
  )
}

export function Checkbox({ className, label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("flex items-center gap-2 text-sm text-foreground cursor-pointer", className)}>
      <input type="checkbox" className="h-4 w-4 rounded border-black/25 accent-accent" {...props} />
      {label}
    </label>
  )
}

export function FieldGroup({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-black/45">{hint}</p>}
    </div>
  )
}
