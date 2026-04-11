import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-body-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            "flex h-10 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-body-sm text-neutral-900 placeholder:text-neutral-400 transition-colors file:border-0 file:bg-transparent file:text-body-sm file:font-medium focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-red-400 focus:border-red-500 focus:ring-red-500",
            className,
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-caption text-red-500">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
