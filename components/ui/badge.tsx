import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
  {
    variants: {
      tone: {
        neutral:
          "border-[var(--glass-border)] bg-white/8 text-[var(--fg-muted)]",
        gold: "border-gold/30 bg-gold/12 text-gold",
        success: "border-success/30 bg-success/12 text-success",
        info: "border-info/30 bg-info/12 text-info",
        danger: "border-danger/30 bg-danger/12 text-danger",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { badgeVariants };
