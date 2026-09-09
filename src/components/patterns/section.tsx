import { cn } from "@/lib/utils";

/**
 * Bloco de conteúdo com cabeçalho opcional. Usa `<section>` rotulada, para que
 * leitores de tela naveguem entre as áreas da página.
 */
export function Section({
  title,
  description,
  action,
  children,
  headingLevel = 2,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  headingLevel?: 2 | 3;
  className?: string;
  contentClassName?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const id = `section-${title.toLowerCase().replace(/[^a-z0-9]+/gi, "-")}`;

  return (
    <section aria-labelledby={id} className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Heading className="text-heading-3 font-semibold tracking-tight" id={id}>
            {title}
          </Heading>
          {description ? (
            <p className="mt-1 text-body-sm text-text-muted">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
