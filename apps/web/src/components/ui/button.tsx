import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950 focus-visible:ring-neutral-900",
        primary:
          "bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950 focus-visible:ring-neutral-900",
        secondary:
          "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-150 focus-visible:ring-neutral-400",
        outline:
          "border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100 focus-visible:ring-neutral-400",
        ghost:
          "bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 active:bg-neutral-150 focus-visible:ring-neutral-400",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-500",
        link: "text-neutral-900 underline-offset-4 hover:underline focus-visible:ring-neutral-400",
        // Arc brand variants
        arc:
          "bg-espresso-800 text-ivory-100 hover:bg-espresso-900 active:bg-espresso-950 focus-visible:ring-espresso-500",
        brass:
          "bg-brass-500 text-espresso-900 hover:bg-brass-600 hover:text-ivory-100 active:bg-brass-700 focus-visible:ring-brass-500",
        "arc-outline":
          "border border-espresso-300 bg-transparent text-espresso-800 hover:bg-ivory-200 hover:border-espresso-500 active:bg-ivory-300 focus-visible:ring-espresso-400",
        "arc-ghost":
          "bg-transparent text-ivory-100 border border-ivory-100/30 hover:bg-ivory-100/10 hover:border-ivory-100/60 focus-visible:ring-ivory-100/50",
      },
      size: {
        default: "h-10 rounded-xl px-4 text-[0.875rem] leading-[1.5] gap-2",
        sm: "h-8 rounded-xl px-3 text-[0.875rem] leading-[1.5] gap-1.5",
        lg: "h-12 rounded-xl px-6 text-[1rem] leading-[1.6] gap-2",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
