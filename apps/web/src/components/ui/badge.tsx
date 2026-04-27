import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-label uppercase tracking-[0.28em] font-medium",
  {
    variants: {
      variant: {
        default: "border-transparent bg-bone-100 text-smoke-900",
        accent: "border-transparent bg-champagne-400 text-smoke-900",
        outline: "border-smoke-700 text-bone-200",
        muted: "border-transparent bg-smoke-800 text-taupe-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
