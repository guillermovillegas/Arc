import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-smoke-700 rounded-sm", className)}
      {...props}
    />
  );
}

export { Skeleton };
