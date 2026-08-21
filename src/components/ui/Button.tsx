import { cn } from "@/lib/utils/cn"
import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-[var(--accent)] text-white hover:opacity-90",
  secondary: "bg-black/5 text-[var(--foreground)] hover:bg-black/10",
  outline: "border border-black/15 text-[var(--foreground)] hover:bg-black/5",
  ghost: "text-[var(--foreground)] hover:bg-black/5",
}

const SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  )
}
