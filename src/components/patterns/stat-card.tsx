import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type Trend = {
  /** Variação já formatada, ex.: "+12%". */
  value: string;
  direction: "up" | "down" | "flat";
  /** Contexto curto, ex.: "vs. mês anterior". */
  label?: string;
  /** Para métricas onde cair é bom (ex.: perdas), inverte a cor. */
  invert?: boolean;
};

export type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean; strokeWidth?: number }>;
  trend?: Trend;
  href?: string;
  className?: string;
};

const trendTone = {
  positive: "text-success",
  negative: "text-danger",
  neutral: "text-text-muted",
} as const;

function resolveTone(trend: Trend) {
  if (trend.direction === "flat") return trendTone.neutral;
  const isGood = trend.invert ? trend.direction === "down" : trend.direction === "up";
  return isGood ? trendTone.positive : trendTone.negative;
}

/**
 * Métrica isolada, no formato bento: cartão próprio, cantos generosos e o
 * número como elemento dominante. Com `href`, o cartão inteiro vira alvo e
 * ganha uma elevação sutil no hover.
 */
export function StatCard({ label, value, detail, icon: Icon, trend, href, className }: StatCardProps) {
  const TrendIcon = trend?.direction === "down" ? TrendingDownIcon : TrendingUpIcon;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <dt className="text-body-sm text-text-muted">{label}</dt>
        {Icon ? (
          <span
            aria-hidden="true"
            className="grid size-8 shrink-0 place-items-center rounded-sm bg-surface-hover text-text-muted transition-colors duration-200 ease-apple group-hover:bg-accent group-hover:text-accent-foreground"
          >
            <Icon aria-hidden className="size-4" strokeWidth={1.75} />
          </span>
        ) : null}
      </div>
      <dd className="mt-4 break-words text-heading-1 font-semibold tracking-tight tabular">
        {value}
      </dd>
      {trend || detail ? (
        <dd className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-text-muted">
          {trend ? (
            <span className={cn("inline-flex items-center gap-1 font-medium tabular", resolveTone(trend))}>
              {trend.direction === "flat" ? null : (
                <TrendIcon aria-hidden="true" className="size-3.5" strokeWidth={2} />
              )}
              {trend.value}
              {trend.label ? <span className="sr-only"> {trend.label}</span> : null}
            </span>
          ) : null}
          {trend?.label ? <span aria-hidden="true">{trend.label}</span> : null}
          {detail ? <span>{detail}</span> : null}
        </dd>
      ) : null}
    </>
  );

  const base =
    "group relative min-w-0 rounded-lg border border-border bg-surface p-5 shadow-level-1 transition-[box-shadow,transform] duration-300 ease-apple";

  if (!href) {
    return <div className={cn(base, className)}>{body}</div>;
  }

  return (
    <div className={cn(base, "hover:-translate-y-0.5 hover:shadow-level-2", className)}>
      {body}
      <Link
        className="absolute inset-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        href={href}
      >
        <span className="sr-only">{label}</span>
      </Link>
    </div>
  );
}

/**
 * Grade bento de métricas: cartões independentes com respiro entre eles, em
 * vez de uma faixa dividida. Renderiza um `<dl>`, então os filhos devem ser
 * `StatCard`.
 */
export function StatGrid({
  children,
  columns = 4,
  label,
  className,
}: {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  label: string;
  className?: string;
}) {
  const columnClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 xl:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
  }[columns];

  return (
    <section aria-label={label}>
      <dl className={cn("grid grid-cols-1 gap-4", columnClass, className)}>{children}</dl>
    </section>
  );
}
