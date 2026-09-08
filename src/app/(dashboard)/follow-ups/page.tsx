import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";

import { followUpFiltersSchema } from "@/schemas/follow-up";
import { PageHeader } from "@/components/layout/page-header";
import { requireTenantContext } from "@/auth/tenant-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getClinicUsers, getFollowUps } from "@/services/follow-ups/queries";

const dateFormat = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });
const statusLabels = { PENDING: "pendentes", COMPLETED: "concluídos", CANCELED: "cancelados" };

export default async function FollowUpsPage({ searchParams }: PageProps<"/follow-ups">) {
  const params = followUpFiltersSchema.parse(await searchParams);
  const tenant = await requireTenantContext();
  const [items, users] = await Promise.all([
    getFollowUps(tenant, { ...params, date: params.date ? new Date(params.date + "T00:00:00") : undefined }),
    getClinicUsers(tenant),
  ]);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const isPending = (params.status ?? "PENDING") === "PENDING";
  const groups = [
    { title: isPending ? "Atrasados" : "Datas anteriores", items: items.filter(item => item.scheduledAt < today), empty: isPending ? "Nenhum contato atrasado." : "Nenhum retorno em datas anteriores.", urgent: isPending },
    { title: "Hoje", items: items.filter(item => item.scheduledAt >= today && item.scheduledAt < tomorrow), empty: "Nenhum retorno para hoje.", urgent: false },
    { title: "Próximos", items: items.filter(item => item.scheduledAt >= tomorrow), empty: "Nenhum retorno futuro nesta seleção.", urgent: false },
  ];
  return (
    <>
      <PageHeader description="Organize os contatos e acompanhe cada retorno do paciente." title="Follow-ups" />
      <form className="mt-8 grid items-end gap-4 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]" key={JSON.stringify(params)}>
        <div className="min-w-0"><label className="mb-2 block text-label font-medium" htmlFor="follow-up-owner">Responsável</label><select className="h-10 w-full rounded-sm border border-input bg-surface px-3 text-body-sm" id="follow-up-owner" defaultValue={params.assignedUserId ?? ""} name="assignedUserId"><option value="">Todos os responsáveis</option>{users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}</select></div>
        <div className="min-w-0"><label className="mb-2 block text-label font-medium" htmlFor="follow-up-date">Data do retorno</label><Input id="follow-up-date" defaultValue={params.date ?? ""} name="date" type="date" /></div>
        <div className="min-w-0"><label className="mb-2 block text-label font-medium" htmlFor="follow-up-status">Status</label><select className="h-10 w-full rounded-sm border border-input bg-surface px-3 text-body-sm" id="follow-up-status" defaultValue={params.status ?? "PENDING"} name="status"><option value="PENDING">Pendentes</option><option value="COMPLETED">Concluídos</option><option value="CANCELED">Cancelados</option></select></div>
        <div className="flex gap-2"><Button variant="secondary" type="submit">Aplicar filtros</Button>{params.assignedUserId || params.date || params.status && params.status !== "PENDING" ? <Button asChild variant="ghost"><Link href="/follow-ups">Limpar</Link></Button> : null}</div>
      </form>
      <div className="mt-8 space-y-8">
        {groups.map(group => (
          <section key={group.title} aria-label={group.title}>
            <div className="mb-3 flex items-center gap-2"><h2 className={group.urgent && group.items.length ? "text-body font-semibold text-danger" : "text-body font-semibold"}>{group.title}</h2><span className="text-caption text-text-muted tabular-nums">{group.items.length} {statusLabels[params.status ?? "PENDING"]}</span></div>
            {group.items.length ? (
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
                {group.items.map(item => (
                  <li key={item.id}>
                    <Link prefetch={false} className="flex items-center justify-between gap-4 px-4 py-4 transition-colors duration-150 hover:bg-surface-secondary sm:px-5" href={"/oportunidades/" + item.opportunityId}>
                      <div className="min-w-0"><p className="break-words text-body-sm font-semibold">{item.patientName}</p><p className="mt-1 break-words text-body-sm text-text-muted">{item.reason}</p><p className="mt-2 flex items-center gap-2 text-caption text-text-muted tabular-nums"><CalendarClock aria-hidden="true" className="size-3.5 shrink-0" /><time dateTime={item.scheduledAt.toISOString()}>{dateFormat.format(item.scheduledAt)}</time></p></div>
                      <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="border-t border-border py-5 text-body-sm text-text-muted">{group.empty}</p>}
          </section>
        ))}
      </div>
    </>
  );
}
