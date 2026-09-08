import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Tabela alinhada ao design system do projeto. Server Component: não há estado
 * nem efeitos aqui, então tabelas longas não viram JavaScript no cliente.
 *
 * A região de rolagem recebe `tabIndex`/`role` para permanecer acessível ao
 * teclado quando o conteúdo transborda horizontalmente.
 */
function Table({
  className,
  containerClassName,
  scrollLabel,
  ...props
}: React.ComponentProps<"table"> & {
  containerClassName?: string;
  /** Rótulo da região rolável; obrigatório quando a tabela pode transbordar. */
  scrollLabel?: string;
}) {
  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full overflow-x-auto", containerClassName)}
      {...(scrollLabel ? { role: "region", "aria-label": scrollLabel, tabIndex: 0 } : {})}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom border-collapse text-left text-body-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("text-caption font-medium tracking-wide text-text-muted uppercase [&_tr]:border-b [&_tr]:border-border", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-border font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border transition-colors duration-200 ease-apple last:border-b-0",
        "hover:bg-surface-hover focus-within:bg-surface-hover",
        "data-[state=selected]:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  align = "left",
  sticky = false,
  ...props
}: Omit<React.ComponentProps<"th">, "align"> & {
  align?: "left" | "right" | "center";
  /** Fixa a coluna à esquerda durante a rolagem horizontal. */
  sticky?: boolean;
}) {
  return (
    <th
      data-slot="table-head"
      scope="col"
      className={cn(
        "px-4 py-3.5 align-middle first:pl-6 last:pr-6",
        align === "right" && "text-right",
        align === "center" && "text-center",
        sticky && "sticky left-0 z-20 bg-surface",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  align = "left",
  sticky = false,
  ...props
}: Omit<React.ComponentProps<"td">, "align"> & {
  align?: "left" | "right" | "center";
  sticky?: boolean;
}) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-5 align-top first:pl-6 last:pr-6",
        align === "right" && "text-right",
        align === "center" && "text-center",
        sticky && "sticky left-0 z-10 bg-surface",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-body-sm text-text-muted", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
