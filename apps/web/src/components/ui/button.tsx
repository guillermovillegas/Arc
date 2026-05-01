import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm uppercase tracking-[0.3em] text-[0.6875rem] font-medium ring-offset-background transition-all duration-[250ms] ease-fai-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary: bone-100 surface, smoke-900 ink — main CTA on dark
        primary:
          "bg-bone-100 text-smoke-900 border border-bone-100 hover:bg-champagne-400 hover:border-champagne-400",
        // Ghost: transparent on dark with taupe border, bone text
        ghost:
          "bg-transparent text-bone-100 border border-taupe-500 hover:border-bone-100 hover:text-champagne-400",
        // Accent: champagne surface — for "soon" / hero highlight CTAs
        accent:
          "bg-champagne-400 text-smoke-900 border border-champagne-400 hover:bg-champagne-500 hover:border-champagne-500",
        // Outline: hairline border, transparent fill, bone-200 text
        outline:
          "bg-transparent text-bone-200 border border-smoke-700 hover:border-champagne-400 hover:text-champagne-400",
        // Destructive: oxblood, used sparingly
        destructive:
          "bg-oxblood-500 text-bone-100 border border-oxblood-500 hover:bg-oxblood-500/90",
        // Link: tracked, no border, no padding
        link:
          "text-champagne-400 underline-offset-4 hover:underline tracking-normal normal-case text-[0.875rem] p-0 border-0",
        // Default — alias of primary
        default:
          "bg-bone-100 text-smoke-900 border border-bone-100 hover:bg-champagne-400 hover:border-champagne-400",
      },
      size: {
        default: "px-6 py-4",
        sm: "px-4 py-2",
        lg: "px-8 py-5 text-[0.75rem]",
        xl: "px-10 py-6 text-[0.8125rem]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
