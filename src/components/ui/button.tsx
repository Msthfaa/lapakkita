import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A943E] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#186049] text-[#ECE8AF] shadow hover:bg-[#124b39] transition-all",
        destructive:
          "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
        outline:
          "border border-[#186049]/25 dark:border-[#186049]/40 bg-white/80 dark:bg-[#0f1915] shadow-2xs hover:bg-[#186049]/5 dark:hover:bg-[#186049]/20 text-[#186049] dark:text-white",
        secondary:
          "bg-[#ECE8AF]/30 dark:bg-[#186049]/30 text-[#186049] dark:text-white shadow-2xs hover:bg-[#ECE8AF]/50 dark:hover:bg-[#186049]/50",
        accent:
          "bg-[#D98327] text-white shadow hover:bg-[#c0721e] active:scale-[0.98] transition-all",
        green:
          "bg-[#4A943E] text-white shadow hover:bg-[#3d7c33] transition-all",
        ghost:
          "hover:bg-[#186049]/10 text-neutral-700 dark:text-neutral-300 hover:text-[#186049] dark:hover:text-white",
        link: "text-[#186049] dark:text-white underline-offset-4 hover:underline hover:text-[#D98327]",
        whatsapp:
          "bg-[#25D366] text-white shadow hover:bg-[#1EBE5D] font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
