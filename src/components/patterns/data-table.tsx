import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsUpDownIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Moldura de listagem. Envolve `<Table>` (ou os cards do layout compacto) com
 * borda, cantos e fundo consistentes.
 */
export function DataTableFrame({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-table-frame"
      className={cn("overflow-hidden rounded-lg border border-border bg-surface shadow-level-1", className)}
      {...props}
    />
  );
}

/**
 * Linha acima da listagem: contagem à esquerda, contexto ou ações à direita.
 * `title` vira o cabeçalho acessível da seção.
 */
export function DataTableToolbar({
  title,
  titleId,
  hint,
  children,
  className,
}: {
  title: string;
  titleId?: string;
  hint?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2", className)}>
      <h2 className="text-heading-3 font-semibold tracking-tight" id={titleId}>
        {title}
      </h2>
      <div className="flex items-center gap-2">
        {hint ? <p className="text-caption text-text-muted">{hint}</p> : null}
        {children}
      </div>
    </div>
  );
}

/**
 * Cabeçalho ordenável baseado em link — a ordenação acontece no servidor via
 * query string, então funciona sem JavaScript e preserva o histórico.
 */
export function DataTableSortLink({
  href,
  label,
  state = "none",
  className,
}: {
  href: string;
  label: string;
  state?: "asc" | "desc" | "none";
  className?: string;
}) {
  const Icon = state === "asc" ? ArrowUpIcon : state === "desc" ? ArrowDownIcon : ChevronsUpDownIcon;

  return (
    <Link
      aria-label={
        state === "none"
          ? `Ordenar por ${label}`
          : `Ordenado por ${label}, ${state === "asc" ? "crescente" : "decrescente"}. Inverter ordem`
      }
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-sm text-label font-medium transition-colors duration-150",
        state === "none" ? "text-text-muted hover:text-foreground" : "text-foreground",
        className,
      )}
      href={href}
      scroll={false}
    >
      {label}
      <Icon
        aria-hidden="true"
        className={cn("size-3.5", state === "none" && "opacity-50")}
        strokeWidth={2}
      />
    </Link>
  );
}

/**
 * Paginação anterior/próxima. Recebe URLs prontas para que a página dona dos
 * filtros decida como serializá-los.
 */
export function DataTablePagination({
  page,
  totalPages,
  pageSize,
  previousHref,
  nextHref,
  className,
}: {
  page: number;
  totalPages: number;
  pageSize?: number;
  previousHref?: string;
  nextHref?: string;
  className?: string;
}) {
  return (
    <nav
      aria-label="Paginação"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 pt-2",
        className,
      )}
    >
      <p className="text-caption tabular text-text-muted">
        Página {page} de {totalPages}
        {pageSize ? ` · até ${pageSize} por página` : ""}
      </p>
      <div className="flex gap-2">
        {previousHref ? (
          <Button asChild size="sm" variant="secondary">
            <Link href={previousHref}>
              <ChevronLeftIcon aria-hidden="true" />
              Anterior
            </Link>
          </Button>
        ) : (
          <Button disabled size="sm" variant="secondary">
            <ChevronLeftIcon aria-hidden="true" />
            Anterior
          </Button>
        )}
        {nextHref ? (
          <Button asChild size="sm" variant="secondary">
            <Link href={nextHref}>
              Próxima
              <ChevronRightIcon aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button disabled size="sm" variant="secondary">
            Próxima
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        )}
      </div>
    </nav>
  );
}

/**
 * Par rótulo/valor usado no layout de cartão das telas estreitas.
 */
export function DataField({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-caption text-text-muted">{label}</dt>
      <dd className="mt-1 break-words text-body-sm text-text-secondary">{value}</dd>
    </div>
  );
}
