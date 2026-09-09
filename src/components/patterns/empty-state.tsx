import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Action = { label: string; href: string };

export type EmptyStateProps = {
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean; strokeWidth?: number }>;
  title: string;
  description: string;
  action?: Action;
  secondaryAction?: Action;
  /** `panel` desenha moldura própria; `inline` assume que já está dentro de um card. */
  variant?: "panel" | "inline";
  /** Usa <h2> por padrão; ajuste conforme a hierarquia da página. */
  titleAs?: "h2" | "h3" | "p";
  titleId?: string;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "panel",
  titleAs: Title = "h2",
  titleId,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 px-6 py-12 text-center",
        variant === "panel" && "rounded-lg border border-border bg-surface shadow-level-1",
        className,
      )}
    >
      {Icon ? (
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-full bg-surface-hover text-text-muted"
        >
          <Icon aria-hidden className="size-6" strokeWidth={1.5} />
        </span>
      ) : null}
      <div className="max-w-md">
        <Title className="text-heading-3 font-semibold tracking-tight" id={titleId}>
          {title}
        </Title>
        <p className="mt-2 text-body-sm text-text-muted">{description}</p>
      </div>
      {action || secondaryAction ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {action ? (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button asChild variant="ghost">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
