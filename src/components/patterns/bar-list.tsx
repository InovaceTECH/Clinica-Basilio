import { cn } from "@/lib/utils";

export type BarListItem = {
  id: string;
  label: string;
  /** Valor bruto usado para dimensionar a barra. */
  value: number;
  /** Valor já formatado exibido ao lado do rótulo. */
  display?: string;
  /** Linha auxiliar sob a barra, ex.: total em reais. */
  detail?: string;
  tone?: "primary" | "success" | "warning" | "danger" | "muted";
};

const toneClass = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  muted: "bg-primary/55",
} as const;

/**
 * Distribuição horizontal em HTML/CSS — sem biblioteca de gráficos, sem
 * JavaScript no cliente. As barras são decorativas; o número fica no texto.
 */
export function BarList({
  items,
  as = "ul",
  scale = "max",
  className,
}: {
  items: BarListItem[];
  as?: "ul" | "ol";
  /** `max` compara com o maior item; `sum` mostra participação no total. */
  scale?: "max" | "sum";
  className?: string;
}) {
  const List = as;
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(1, ...items.map(item => item.value));
  const denominator = scale === "sum" ? Math.max(1, total) : max;

  return (
    <List className={cn("space-y-5", className)}>
      {items.map(item => {
        const ratio = Math.min(1, item.value / denominator);
        return (
          <li key={item.id}>
            <div className="flex items-start justify-between gap-3 text-body-sm">
              <span className="min-w-0 break-words font-medium">{item.label}</span>
              {item.display ? (
                <span className="shrink-0 tabular text-text-muted">{item.display}</span>
              ) : null}
            </div>
            <div
              aria-hidden="true"
              className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-hover"
            >
              <div
                className={cn("h-full rounded-full transition-[width] duration-500 ease-apple", toneClass[item.tone ?? "primary"])}
                style={{ width: `${ratio * 100}%` }}
              />
            </div>
            {item.detail ? (
              <p className="mt-1.5 text-caption tabular text-text-muted">{item.detail}</p>
            ) : null}
          </li>
        );
      })}
    </List>
  );
}
