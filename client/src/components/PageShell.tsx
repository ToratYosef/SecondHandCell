import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageShellProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageShell({
  title,
  description,
  badge,
  actions,
  children,
  className,
}: PageShellProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          {badge && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {badge}
            </span>
          )}
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            {description && (
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function PageCTA({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Button onClick={onClick} className="hover-elevate active-elevate-2">
      {label}
    </Button>
  );
}
