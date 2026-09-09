"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigationTrail } from "@/components/layout/navigation-items";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Barra fixa do conteúdo: alterna a navegação, mostra a trilha da rota atual e
 * concentra a busca global. Fica `sticky` para permanecer alcançável em listas
 * longas.
 */
export function AppTopbar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  const pathname = usePathname();
  const trail = navigationTrail(pathname);

  return (
    <header className="glass glass-edge sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-glass-border px-3 sm:px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator className="mr-1 hidden !h-4 sm:block" orientation="vertical" />

      {trail.length > 0 ? (
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            {trail.map((crumb, index) => {
              const isLast = index === trail.length - 1;
              return (
                <BreadcrumbItem
                  key={`${crumb.label}-${index}`}
                  className={index === 0 ? "hidden sm:inline-flex" : "min-w-0"}
                >
                  {isLast || !("href" in crumb) || !crumb.href ? (
                    <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink asChild>
                        <Link className="truncate" href={crumb.href}>
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator className={index === 0 ? "hidden sm:block" : ""} />
                    </>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      <div className="ml-auto flex items-center gap-2">
        <Button
          className="hidden w-60 justify-start gap-2.5 px-4 font-normal text-text-muted lg:inline-flex"
          onClick={onOpenCommandPalette}
          size="sm"
          type="button"
          variant="secondary"
        >
          <SearchIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
          <span className="flex-1 text-left">Buscar…</span>
          <kbd className="pointer-events-none rounded-xs bg-surface px-1.5 py-0.5 font-mono text-caption shadow-level-1">
            ⌘K
          </kbd>
        </Button>
        <Button
          aria-label="Buscar"
          className="lg:hidden"
          onClick={onOpenCommandPalette}
          size="icon"
          type="button"
          variant="ghost"
        >
          <SearchIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </Button>
      </div>
    </header>
  );
}
