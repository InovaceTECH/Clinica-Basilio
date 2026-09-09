import { ClipboardList, Search } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { OpportunityListFilters } from "@/schemas/opportunity-list";
import type { getTenantOpportunities } from "@/services/opportunities/queries";

type OpportunityListResult = Awaited<ReturnType<typeof getTenantOpportunities>>;

const statusLabels = {
  NEW: "Nova",
  TO_ANALYZE: "A analisar",
  CONTACT_PENDING: "Contato pendente",
  CONTACTED: "Contatada",
  WAITING_PATIENT: "Aguardando paciente",
  FOLLOW_UP_SCHEDULED: "Follow-up agendado",
  NEGOTIATING: "Em negociação",
  RECOVERED: "Recuperada",
  LOST: "Perdida",
  DO_NOT_CONTACT: "Não contatar",
} as const;

const objectionLabels = {
  FINANCIAL: "Financeira",
  SHARED_DECISION: "Decisão compartilhada",
  INDECISION: "Indecisão",
  COMPARISON: "Comparação",
  LOW_URGENCY: "Baixa urgência",
  INSECURITY: "Insegurança",
  NO_RESPONSE: "Sem resposta",
  OTHER: "Outra",
} as const;

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(Number(value));
}

function formatDate(value: Date | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(value);
}

function getPageUrl(filters: OpportunityListFilters, page: number) {
  const parameters = new URLSearchParams();

  if (filters.query) parameters.set("query", filters.query);
  if (filters.status) parameters.set("status", filters.status);
  if (filters.priority) parameters.set("priority", filters.priority);
  if (filters.objection) parameters.set("objection", filters.objection);
  if (page > 1) parameters.set("page", String(page));

  const queryString = parameters.toString();
  return queryString ? `/oportunidades?${queryString}` : "/oportunidades";
}

function PriorityBadge({ priority }: { priority: "HIGH" | "MEDIUM" | "LOW" }) {
  const content = {
    HIGH: { label: "Alta", variant: "high" as const },
    MEDIUM: { label: "Média", variant: "medium" as const },
    LOW: { label: "Baixa", variant: "low" as const },
  }[priority];

  return <Badge variant={content.variant}>{content.label}</Badge>;
}

export function OpportunityList({ filters, result }: { filters: OpportunityListFilters; result: OpportunityListResult }) {
  const hasFilters = Boolean(filters.query || filters.status || filters.priority || filters.objection);

  return (
    <section className="mt-8 space-y-6" aria-labelledby="opportunities-list-title">
      <form action="/oportunidades" className="grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="sr-only" htmlFor="opportunity-query">Buscar oportunidades</label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
            <Input defaultValue={filters.query} id="opportunity-query" name="query" placeholder="Buscar paciente ou tratamento" className="pl-9" />
          </div>
        </div>
        <FilterSelect defaultValue={filters.status} label="Status" name="status">
          <option value="">Todos os status</option>
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </FilterSelect>
        <FilterSelect defaultValue={filters.priority} label="Prioridade" name="priority">
          <option value="">Todas as prioridades</option>
          <option value="HIGH">Alta</option>
          <option value="MEDIUM">Média</option>
          <option value="LOW">Baixa</option>
        </FilterSelect>
        <FilterSelect defaultValue={filters.objection} label="Objeção" name="objection">
          <option value="">Todas as objeções</option>
          {Object.entries(objectionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </FilterSelect>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
          <Button type="submit">Aplicar filtros</Button>
          {hasFilters ? <Button asChild type="button" variant="secondary"><Link href="/oportunidades">Limpar</Link></Button> : null}
        </div>
      </form>

      {result.total === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-4 py-8">
            <span className="grid size-10 place-items-center rounded-md bg-info-bg text-info"><ClipboardList aria-hidden="true" className="size-5" /></span>
            <div>
              <h2 id="opportunities-list-title" className="text-heading-3 font-semibold text-foreground">Nenhuma oportunidade encontrada</h2>
              <p className="mt-2 text-body-sm text-text-muted">
                {hasFilters ? "Ajuste os filtros para encontrar outras oportunidades." : "Importe uma planilha para começar a acompanhar os orçamentos."}
              </p>
            </div>
            {!hasFilters ? <Button asChild><Link href="/importar">Importar planilha</Link></Button> : null}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <h2 id="opportunities-list-title" className="text-heading-3 font-semibold text-foreground">Oportunidades</h2>
            <p className="text-body-sm text-text-muted">{result.total} {result.total === 1 ? "resultado" : "resultados"}</p>
          </div>

          <Card className="hidden overflow-hidden xl:block">
            <CardContent className="p-0">
              <table className="w-full border-collapse text-left text-body-sm">
                <thead className="bg-surface-secondary text-label text-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium" scope="col">Paciente</th>
                    <th className="px-4 py-3 font-medium" scope="col">Tratamento</th>
                    <th className="px-4 py-3 font-medium" scope="col">Valor</th>
                    <th className="hidden px-4 py-3 font-medium 2xl:table-cell" scope="col">Objeção</th>
                    <th className="px-4 py-3 font-medium" scope="col">Prioridade</th>
                    <th className="px-4 py-3 font-medium" scope="col">Status</th>
                    <th className="hidden px-4 py-3 font-medium 2xl:table-cell" scope="col">Último contato</th>
                    <th className="px-4 py-3 font-medium" scope="col">Próximo follow-up</th>
                    <th className="px-4 py-3 font-medium" scope="col">Ação</th>
                  </tr>
                </thead>
                <tbody>{result.items.map((item) => <tr className="border-t border-border" key={item.id}>
                  <td className="max-w-44 px-4 py-4 font-medium text-foreground">{item.patientName}</td>
                  <td className="max-w-48 px-4 py-4 text-text-secondary">{item.treatment}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-text-secondary">{formatCurrency(item.budgetValue)}</td>
                  <td className="hidden max-w-48 px-4 py-4 text-text-secondary 2xl:table-cell">{item.rawObjection ?? (item.objectionCategory ? objectionLabels[item.objectionCategory] : "—")}</td>
                  <td className="px-4 py-4"><PriorityBadge priority={item.priority} /></td>
                  <td className="px-4 py-4"><Badge variant="neutral">{statusLabels[item.status]}</Badge></td>
                  <td className="hidden whitespace-nowrap px-4 py-4 text-text-secondary 2xl:table-cell">{formatDate(item.lastContactAt)}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-text-secondary">{formatDate(item.nextFollowUpAt)}</td>
                  <td className="px-4 py-4"><Button asChild size="sm" variant="secondary"><Link href={`/oportunidades/${item.id}`}>Ver detalhes</Link></Button></td>
                </tr>)}</tbody>
              </table>
            </CardContent>
          </Card>

          <div className="space-y-3 xl:hidden">
            {result.items.map((item) => <Card key={item.id}><CardContent className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3"><div><h3 className="font-medium text-foreground">{item.patientName}</h3><p className="mt-1 text-body-sm text-text-muted">{item.treatment}</p></div><PriorityBadge priority={item.priority} /></div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-body-sm"><Detail label="Valor" value={formatCurrency(item.budgetValue)} /><Detail label="Status" value={statusLabels[item.status]} /><Detail label="Objeção" value={item.rawObjection ?? (item.objectionCategory ? objectionLabels[item.objectionCategory] : "—")} /><Detail label="Próximo follow-up" value={formatDate(item.nextFollowUpAt)} /></dl>
              <Button asChild className="w-full" variant="secondary"><Link href={`/oportunidades/${item.id}`}>Ver detalhes</Link></Button>
            </CardContent></Card>)}
          </div>

          <nav aria-label="Paginação de oportunidades" className="flex items-center justify-between gap-4">
            <p className="text-body-sm text-text-muted">Página {result.page} de {result.totalPages}</p>
            <div className="flex gap-2">
              {result.page === 1 ? <Button disabled variant="secondary">Anterior</Button> : <Button asChild variant="secondary"><Link href={getPageUrl(filters, result.page - 1)}>Anterior</Link></Button>}
              {result.page >= result.totalPages ? <Button disabled variant="secondary">Próxima</Button> : <Button asChild variant="secondary"><Link href={getPageUrl(filters, result.page + 1)}>Próxima</Link></Button>}
            </div>
          </nav>
        </>
      )}
    </section>
  );
}

function FilterSelect({ children, defaultValue, label, name }: { children: React.ReactNode; defaultValue?: string; label: string; name: string }) {
  return <div><label className="sr-only" htmlFor={`filter-${name}`}>{label}</label><select className="h-10 w-full rounded-sm border border-input bg-surface px-3 text-base text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15" defaultValue={defaultValue ?? ""} id={`filter-${name}`} name={name}>{children}</select></div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-caption text-text-muted">{label}</dt><dd className="mt-1 line-clamp-2 text-text-secondary">{value}</dd></div>;
}
