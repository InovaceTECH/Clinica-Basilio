import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  title: string;
  description: string;
  /** Trilha de navegação. O último item é tratado como a página atual. */
  breadcrumbs?: Crumb[];
  /** Etiqueta curta acima do título, ex.: status ou categoria. */
  badge?: React.ReactNode;
  /** Ação principal à direita. */
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  breadcrumbs,
  badge,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <BreadcrumbItem key={`${crumb.label}-${index}`}>
                  {isLast || !crumb.href ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {badge ? <div className="mb-2 flex flex-wrap items-center gap-2">{badge}</div> : null}
          <h1 className="break-words text-heading-1 font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2.5 max-w-2xl text-body text-text-muted">{description}</p>
        </div>
        {action ? <div className="shrink-0 sm:pt-1">{action}</div> : null}
      </header>
    </div>
  );
}
