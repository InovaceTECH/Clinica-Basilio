import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div aria-label="Carregando conteúdo" aria-live="polite" role="status">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton className="h-40 rounded-lg" key={index} />
        ))}
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
