"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-md",
      "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showClose?: boolean;
  /** Removes default padding so callers can lay the content out themselves. */
  bare?: boolean;
}

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, showClose = true, bare = false, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    {/* A centring wrapper avoids transform-based centring, which would fight
        the scale keyframes. pointer-events pass through to the overlay so
        clicking the backdrop still dismisses. */}
    <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-4">
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "glass glass-overlay pointer-events-auto relative w-full max-w-lg",
          !bare && "p-7",
          "data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out",
          className,
        )}
        {...props}
      >
        <span className="glass-rim" aria-hidden />
        {children}
        {showClose ? (
          <DialogPrimitive.Close
            className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-[var(--fg-muted)] transition-colors hover:bg-white/10 hover:text-[var(--fg)]"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </div>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = "DialogContent";

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-6 space-y-1.5 pr-8", className)} {...props} />;
}
