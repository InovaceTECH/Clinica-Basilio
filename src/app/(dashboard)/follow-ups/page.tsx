import Link from "next/link";
import { followUpFiltersSchema } from "@/schemas/follow-up";

import { PageHeader } from "@/components/layout/page-header";
import { requireTenantContext } from "@/auth/tenant-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClinicUsers, getFollowUps } from "@/services/follow-ups/queries";

export default async function FollowUpsPage({ searchParams }: PageProps<"/follow-ups">) {
  const params = followUpFiltersSchema.parse(await searchParams); const tenant = await requireTenantContext();
  const [items, users] = await Promise.all([getFollowUps(tenant, { ...params, date: params.date ? new Date(`${params.date}T00:00:00`) : undefined }), getClinicUsers(tenant)]);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const overdue = items.filter((item) => item.scheduledAt < today);
  const dueToday = items.filter((item) => item.scheduledAt >= today && item.scheduledAt < tomorrow);
  const upcoming = items.filter((item) => item.scheduledAt >= tomorrow);
  return (
    <>
      <PageHeader
        description="Organize contatos atrasados, de hoje e os próximos retornos."
        title="Follow-ups"
      />
      <form className="mt-6 grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-4"><select className="h-10 rounded-sm border border-input bg-surface px-3" defaultValue={params.assignedUserId ?? ""} name="assignedUserId"><option value="">Todos responsáveis</option>{users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}</select><input className="h-10 rounded-sm border border-input bg-surface px-3" defaultValue={params.date ?? ""} name="date" type="date"/><select className="h-10 rounded-sm border border-input bg-surface px-3" defaultValue={params.status ?? "PENDING"} name="status"><option value="PENDING">Pendentes</option><option value="COMPLETED">Concluídos</option><option value="CANCELED">Cancelados</option></select><button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground" type="submit">Filtrar</button></form>
      <div className="mt-8 space-y-6">{[["Atrasados", overdue, "border-danger/40"], ["Hoje", dueToday, "border-warning/40"], ["Próximos", upcoming, "border-border"]].map(([title, group, border]) => <Card key={title as string}><CardHeader><CardTitle>{title as string}</CardTitle><CardDescription>{(group as typeof items).length} follow-up(s) pendente(s).</CardDescription></CardHeader><CardContent className="space-y-3">{(group as typeof items).length ? (group as typeof items).map(item => <Link className={`block rounded-md border p-4 hover:bg-surface-hover ${border}`} href={`/oportunidades/${item.opportunityId}`} key={item.id}><p className="text-body-sm font-medium">{item.patientName}</p><p className="mt-1 text-body-sm text-text-secondary">{item.reason}</p><p className="mt-1 text-caption text-text-muted">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(item.scheduledAt)}</p></Link>) : <p className="text-body-sm text-text-muted">Nenhum follow-up nesta seção.</p>}</CardContent></Card>)}</div>
    </>
  );
}
