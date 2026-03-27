import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
}

const paddings = { sm: "p-4", md: "p-6", lg: "p-8" };

export function Card({ className = "", padding = "md", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
