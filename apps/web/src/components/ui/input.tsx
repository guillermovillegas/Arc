import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-none bg-transparent border-0 border-b border-smoke-700 px-0 py-2 font-sans text-body-lg text-bone-100 placeholder:text-taupe-300 ring-offset-background transition-colors duration-[250ms] ease-fai-smooth",
        "focus-visible:outline-none focus-visible:border-champagne-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:bg-transparent file:border-0 file:text-bone-100 file:text-body-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
