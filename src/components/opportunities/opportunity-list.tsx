import { ArrowRight, ChevronDown, ClipboardList, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import {
  DataField,
  DataTableFrame,
  DataTablePagination,
  DataTableToolbar,
  EmptyState,
} from "@/components/patterns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const currency = new Intl.NumberFormat("pt-BR", { currency: "BRL", style: "currency" });
const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" });

function formatCurrency(value: string) {
  return currency.format(Number(value));
}

function formatDate(value: Date | null) {
  return value ? date.format(value) : "Não registrado";
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

function describeObjection(item: OpportunityListResult["items"][number]) {
  return (
    item.rawObjection ??
    (item.objectionCategory ? objectionLabels[item.objectionCategory] : "Não informada")
  );
}

export function OpportunityList({
  filters,
  result,
}: {
  filters: OpportunityListFilters;
  result: OpportunityListResult;
}) {
  const hasFilters = Boolean(
    filters.query || filters.status || filters.priority || filters.objection,
  );
  const activeFilterCount = [filters.status, filters.priority, filters.objection].filter(
    Boolean,
  ).length;

  return (
    <section aria-labelledby="opportunities-list-title" className="mt-8 space-y-6">
      <form
        action="/oportunidades"
        className="rounded-lg border border-border bg-surface p-5 shadow-level-1"
        key={JSON.stringify(filters)}
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 basis-56">
            <label className="mb-2 block text-label font-medium" htmlFor="opportunity-query">
              Paciente ou tratamento
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-text-faint"
              />
              <Input
                className="pl-10"
                defaultValue={filters.query}
                id="opportunity-query"
                name="query"
                placeholder="Digite para buscar"
                type="search"
              />
            </div>
          </div>
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
          {hasFilters ? (
            <Button asChild type="button" variant="ghost">
              <Link href="/oportunidades">Limpar</Link>
            </Button>
          ) : null}
        </div>

        <details className="group mt-4" open={activeFilterCount > 0}>
          <summary className="inline-flex w-fit list-none items-center gap-2 rounded-full px-3 py-2 text-body-sm text-text-muted transition-colors duration-200 ease-apple hover:bg-surface-hover hover:text-foreground [&::-webkit-details-marker]:hidden">
            <SlidersHorizontal aria-hidden="true" className="size-4" strokeWidth={1.75} />
            Filtros
            {activeFilterCount > 0 ? (
              <Badge variant="info">{activeFilterCount} ativos</Badge>
            ) : null}
            <ChevronDown
              aria-hidden="true"
              className="size-4 transition-transform duration-200 ease-apple group-open:rotate-180"
              strokeWidth={1.75}
            />
          </summary>
          <div className="mt-3 grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <FilterSelect defaultValue={filters.status} label="Status" name="status">
              <option value="">Todos os status</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect defaultValue={filters.priority} label="Prioridade" name="priority">
              <option value="">Todas as prioridades</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Média</option>
              <option value="LOW">Baixa</option>
            </FilterSelect>
            <FilterSelect defaultValue={filters.objection} label="Objeção" name="objection">
              <option value="">Todas as objeções</option>
              {Object.entries(objectionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </FilterSelect>
            <Button type="submit" variant="secondary">
              Aplicar filtros
            </Button>
          </div>
        </details>
      </form>

      {result.total === 0 ? (
        <EmptyState
          action={
            hasFilters
              ? { label: "Limpar filtros", href: "/oportunidades" }
              : { label: "Importar planilha", href: "/importar" }
          }
          description={
            hasFilters
              ? "Ajuste os filtros para encontrar outras oportunidades."
              : "Importe uma planilha para começar a acompanhar os orçamentos."
          }
          icon={ClipboardList}
          title="Nenhuma oportunidade encontrada"
          titleId="opportunities-list-title"
        />
      ) : (
        <>
          <DataTableToolbar
            hint="Próximos retornos primeiro"
            title={`${result.total.toLocaleString("pt-BR")} ${result.total === 1 ? "oportunidade" : "oportunidades"}`}
            titleId="opportunities-list-title"
          />

          <DataTableFrame className="hidden xl:block">
            <Table
              className="table-fixed"
              scrollLabel="Oportunidades de pacientes — role horizontalmente para ver todas as colunas"
            >
              <TableCaption className="sr-only">
                Oportunidades de pacientes, valores e acompanhamento
              </TableCaption>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-1/5">Paciente / tratamento</TableHead>
                  <TableHead align="right" className="w-[15%]">
                    Orçamento
                  </TableHead>
                  <TableHead className="w-1/5">Prioridade / status</TableHead>
                  <TableHead className="w-[17%]">Objeção</TableHead>
                  <TableHead className="w-[18%]">Contatos</TableHead>
                  <TableHead className="w-[9%]">
                    <span className="sr-only">Ação</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="break-words">
                      <p className="font-semibold">{item.patientName}</p>
                      <p className="mt-1 text-caption text-text-muted">{item.treatment}</p>
                    </TableCell>
                    <TableCell align="right" className="break-words font-medium tabular">
                      {formatCurrency(item.budgetValue)}
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={item.priority} />
                      <p className="mt-2 text-caption text-text-muted">
                        {statusLabels[item.status]}
                      </p>
                    </TableCell>
                    <TableCell className="break-words text-text-secondary">
                      {describeObjection(item)}
                    </TableCell>
                    <TableCell className="text-caption tabular">
                      <p>
                        <span className="text-text-muted">Próximo</span>
                        <br />
                        {item.nextFollowUpAt ? formatDate(item.nextFollowUpAt) : "Não agendado"}
                      </p>
                      <p className="mt-2 text-text-muted">
                        Último: {formatDate(item.lastContactAt)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Link
                        aria-label={`Ver detalhes de ${item.patientName}`}
                        className="inline-flex min-h-9 items-center gap-1 rounded-sm text-label font-medium text-primary hover:underline"
                        href={`/oportunidades/${item.id}`}
                        prefetch={false}
                      >
                        Abrir
                        <ArrowRight aria-hidden="true" className="size-3.5" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DataTableFrame>

          <ul className="grid gap-4 sm:grid-cols-2 xl:hidden">
            {result.items.map(item => (
              <li className="min-w-0" key={item.id}>
                <Card className="h-full">
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words text-body-sm font-semibold">
                          {item.patientName}
                        </h3>
                        <p className="mt-1 break-words text-body-sm text-text-muted">
                          {item.treatment}
                        </p>
                      </div>
                      <PriorityBadge priority={item.priority} />
                    </div>
                    <dl className="grid grid-cols-2 gap-4">
                      <DataField label="Orçamento" value={formatCurrency(item.budgetValue)} />
                      <DataField label="Status" value={statusLabels[item.status]} />
                      <DataField
                        label="Último contato"
                        value={formatDate(item.lastContactAt)}
                      />
                      <DataField
                        label="Próximo retorno"
                        value={item.nextFollowUpAt ? formatDate(item.nextFollowUpAt) : "Não agendado"}
                      />
                      <DataField
                        className="col-span-2"
                        label="Objeção"
                        value={describeObjection(item)}
                      />
                    </dl>
                    <Button asChild className="w-full" variant="secondary">
                      <Link
                        aria-label={`Ver detalhes de ${item.patientName}`}
                        href={`/oportunidades/${item.id}`}
                        prefetch={false}
                      >
                        Ver oportunidade
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>

          <DataTablePagination
            nextHref={
              result.page >= result.totalPages
                ? undefined
                : getPageUrl(filters, result.page + 1)
            }
            page={result.page}
            pageSize={result.pageSize}
            previousHref={result.page === 1 ? undefined : getPageUrl(filters, result.page - 1)}
            totalPages={result.totalPages}
          />
        </>
      )}
    </section>
  );
}

function FilterSelect({
  children,
  defaultValue,
  label,
  name,
}: {
  children: React.ReactNode;
  defaultValue?: string;
  label: string;
  name: string;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-label font-medium" htmlFor={`filter-${name}`}>
        {label}
      </label>
      <select
        className="h-11 w-full appearance-none rounded-md border border-input bg-surface bg-[length:1rem] bg-[position:right_0.875rem_center] bg-no-repeat px-4 pr-10 text-body text-foreground outline-none transition-[border-color,box-shadow] duration-200 ease-apple focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 bg-[image:var(--select-caret)]"
        defaultValue={defaultValue ?? ""}
        id={`filter-${name}`}
        name={name}
      >
        {children}
      </select>
    </div>
  );
}
