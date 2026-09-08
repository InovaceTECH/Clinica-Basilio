import { Skeleton } from "@/components/ui/skeleton";

/**
 * Espelha a estrutura das telas do painel: cabeçalho, grade bento de
 * indicadores e listagem. Estático, sem animação, para não competir com o
 * conteúdo real.
 */
export default function Loading() {
  return (
    <div aria-label="Carregando conteúdo" className="space-y-8" role="status">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(cell => (
          <div
            className="space-y-4 rounded-lg border border-border bg-surface p-5 shadow-level-1"
            key={cell}
          >
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-8 rounded-sm" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 shadow-level-1">
        <Skeleton className="mb-6 h-11 w-full rounded-md" />
        <div className="space-y-5">
          {[1, 2, 3, 4, 5].map(row => (
            <Skeleton className="h-14 w-full rounded-md" key={row} />
          ))}
        </div>
      </div>

      <span className="sr-only">Carregando conteúdo. Aguarde.</span>
    </div>
  );
}
