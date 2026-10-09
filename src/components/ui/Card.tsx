import { cn } from "@/lib/utils/cn"
import { forwardRef, type HTMLAttributes } from "react"

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Card(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn("rounded-xl border border-black/10 bg-white/70 p-4", className)} {...props} />
})

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("mb-3 text-base font-bold text-foreground", className)} {...props} />
}
