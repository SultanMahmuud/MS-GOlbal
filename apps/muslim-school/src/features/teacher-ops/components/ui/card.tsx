import type { ReactNode } from "react";
import { cn } from "@/features/teacher-ops/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950/80",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  eyebrow,
  action,
  className,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-zinc-800",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-base font-semibold text-slate-950 dark:text-zinc-50">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
