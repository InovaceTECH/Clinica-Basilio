import { redirect } from "next/navigation";

import { getAuthenticatedHomePath, hasPermission } from "@/auth/authorization";
import { PageHeader } from "@/components/layout/page-header";
import { requireTenantContext } from "@/auth/tenant-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardBreakdown, getDashboardKpis } from "@/services/dashboard/queries";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const objectionLabels: Record<string, string> = {
  FINANCIAL: "Financeira",
  SHARED_DECISION: "Decisão compartilhada",
  INDECISION: "Indecisão",
  COMPARISON: "Comparação",
  LOW_URGENCY: "Baixa urgência",
  INSECURITY: "Insegurança",
  NO_RESPONSE: "Sem resposta",
  OTHER: "Outra",
};
export default async function DashboardPage() {
  const tenant = await requireTenantContext();
  if (!hasPermission(tenant, "dashboard.read")) {
    redirect(getAuthenticatedHomePath(tenant));
  }
  const [kpis, breakdown] = await Promise.all([getDashboardKpis(tenant), getDashboardBreakdown(tenant)]);
  const items = [["Orçamentos em aberto", String(kpis.openCount), "Oportunidades ainda recuperáveis"], ["Valor potencial", currency.format(Number(kpis.potentialValue)), "Valor dos orçamentos em aberto"], ["Oportunidades recuperadas", String(kpis.recoveredCount), "Tratamentos marcados como recuperados"], ["Receita recuperada", currency.format(Number(kpis.recoveredValue)), "Valor efetivamente recuperado"], ["Taxa de recuperação", `${(kpis.recoveryRate * 100).toFixed(1).replace(".", ",")}%`, "Recuperadas sobre o total de oportunidades"]];
  return (
    <>
      <PageHeader
        description="Acompanhe os principais indicadores da recuperação de orçamentos."
        title="Dashboard"
      />
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(([title, value, description]) => <Card key={title}><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent><p className="text-heading-1 font-semibold text-foreground">{value}</p></CardContent></Card>)}</section>
      <section className="mt-6 grid gap-6 xl:grid-cols-2"><Card><CardHeader><CardTitle>Principais objeções</CardTitle><CardDescription>Quantidade, participação e valor potencial.</CardDescription></CardHeader><CardContent className="space-y-3">{breakdown.objections.length === 0 ? <p className="text-body-sm text-text-muted">Nenhuma objeção foi registrada ainda.</p> : breakdown.objections.map(item => <div className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0" key={item.category ?? "NONE"}><div><p className="text-body-sm font-medium">{item.category ? objectionLabels[item.category] ?? "Outra" : "Não informada"}</p><p className="text-caption text-text-muted">{item.count} oportunidade(s)</p></div><p className="text-body-sm text-text-secondary">{currency.format(Number(item.value))}</p></div>)}</CardContent></Card><Card><CardHeader><CardTitle>Funil de recuperação</CardTitle><CardDescription>Etapas comerciais registradas no sistema.</CardDescription></CardHeader><CardContent className="space-y-3">{[["Abertas",breakdown.funnel.open],["Trabalhadas",breakdown.funnel.worked],["Responderam",breakdown.funnel.responded],["Em negociação",breakdown.funnel.negotiating],["Recuperadas",breakdown.funnel.recovered]].map(([label,value])=><div className="flex items-center justify-between rounded-md bg-surface-secondary px-3 py-2" key={label as string}><span className="text-body-sm text-text-secondary">{label}</span><strong className="text-body-sm">{value}</strong></div>)}</CardContent></Card></section>
    </>
  );
}
