import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#186049] text-[#ECE8AF] hover:bg-[#124b39]",
        secondary:
          "border-[#ECE8AF]/30 dark:border-white/[0.08] bg-[#ECE8AF]/15 dark:bg-white/[0.04] text-[#186049] dark:text-[#ECE8AF]",
        destructive:
          "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
        outline: "text-[#186049] dark:text-[#ECE8AF] border-[#186049]/30 dark:border-[#186049]/40 bg-transparent",
        success:
          "border-[#4A943E]/30 bg-[#4A943E]/15 text-[#4A943E] dark:text-[#6ec961]",
        warning:
          "border-[#D98327]/30 bg-[#D98327]/15 text-[#D98327] dark:text-[#f7a348]",
        danger:
          "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
        forest:
          "border-[#186049]/30 bg-[#186049]/15 text-[#186049] dark:text-[#ECE8AF]",
        amber:
          "border-[#D98327]/30 bg-[#D98327]/15 text-[#D98327] dark:text-[#f7a348]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
