"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;

const SheetTrigger = DialogPrimitive.Trigger;

const SheetClose = DialogPrimitive.Close;

const SheetPortal = DialogPrimitive.Portal;

/* ---------------------------------------------------------------------------
 * Overlay
 * --------------------------------------------------------------------------- */

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

/* ---------------------------------------------------------------------------
 * Content
 *
 * Supports `side` prop for slide direction. Defaults to "right" which is
 * the most common pattern for mobile navigation drawers.
 * --------------------------------------------------------------------------- */

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "top" | "right" | "bottom" | "left";
  /** Accessible title for screen readers. Hidden visually by default. */
  accessibleTitle?: string;
}

const sideStyles: Record<string, string> = {
  top: "inset-x-0 top-0 border-b border-neutral-200 data-[state=open]:animate-sheet-in-top data-[state=closed]:animate-sheet-out-top",
  bottom:
    "inset-x-0 bottom-0 border-t border-neutral-200 data-[state=open]:animate-sheet-in-bottom data-[state=closed]:animate-sheet-out-bottom",
  left: "inset-y-0 left-0 h-full w-3/4 border-r border-neutral-200 sm:max-w-sm data-[state=open]:animate-sheet-in-left data-[state=closed]:animate-sheet-out-left",
  right:
    "inset-y-0 right-0 h-full w-3/4 border-l border-neutral-200 sm:max-w-sm data-[state=open]:animate-sheet-in-right data-[state=closed]:animate-sheet-out-right",
};

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      side = "right",
      className,
      children,
      accessibleTitle = "Navigation menu",
      ...props
    },
    ref,
  ) => (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 gap-4 bg-white p-6 shadow-lg",
          sideStyles[side],
          className,
        )}
        {...props}
      >
        {/* Accessible title (visually hidden) ensures no a11y warnings */}
        <VisuallyHidden.Root asChild>
          <DialogPrimitive.Title>{accessibleTitle}</DialogPrimitive.Title>
        </VisuallyHidden.Root>

        {children}

        {/* Close button */}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1.5 text-neutral-500 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = "SheetContent";

/* ---------------------------------------------------------------------------
 * Header
 * --------------------------------------------------------------------------- */

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-left", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

/* ---------------------------------------------------------------------------
 * Title (visible)
 * --------------------------------------------------------------------------- */

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-subheading font-semibold text-neutral-900",
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

/* ---------------------------------------------------------------------------
 * Description
 * --------------------------------------------------------------------------- */

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-body-sm text-neutral-500", className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

/* ---------------------------------------------------------------------------
 * Footer
 * --------------------------------------------------------------------------- */

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

/* --------------------------------------------------------------------------- */

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
