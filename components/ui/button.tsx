"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-gold-bright to-gold text-[#241a06] font-semibold shadow-[0_10px_30px_-8px_rgba(245,184,78,0.65)] hover:shadow-[0_16px_40px_-8px_rgba(245,184,78,0.8)] hover:-translate-y-0.5",
        secondary:
          "border border-[var(--glass-border)] bg-white/10 text-[var(--fg)] backdrop-blur-xl hover:bg-white/20 hover:-translate-y-0.5 dark:bg-white/8 dark:hover:bg-white/14",
        ghost:
          "text-[var(--fg-muted)] hover:bg-white/10 hover:text-[var(--fg)] dark:hover:bg-white/8",
        outline:
          "border border-[var(--glass-border)] text-[var(--fg)] hover:bg-white/10 dark:hover:bg-white/8",
        danger:
          "bg-danger/90 text-white hover:bg-danger shadow-[0_10px_30px_-10px_rgba(239,68,68,0.7)]",
      },
      size: {
        sm: "h-8 px-3.5 text-[13px] [&_svg]:size-3.5",
        md: "h-10 px-5 [&_svg]:size-4",
        lg: "h-12 px-7 text-[15px] [&_svg]:size-[18px]",
        icon: "size-10 [&_svg]:size-[18px]",
        "icon-sm": "size-8 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
