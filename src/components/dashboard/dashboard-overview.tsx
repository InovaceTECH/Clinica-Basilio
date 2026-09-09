import {
  ArrowRight,
  BanknoteIcon,
  CalendarClock,
  ClipboardListIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { BarList, EmptyState, StatCard, StatGrid, type BarListItem } from "@/components/patterns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { getDashboardBreakdown, getDashboardKpis } from "@/services/dashboard/queries";

type DashboardProps = {
  kpis: Awaited<ReturnType<typeof getDashboardKpis>>;
  breakdown: Awaited<ReturnType<typeof getDashboardBreakdown>>;
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const percent = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 1 });

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

export function DashboardOverview({ kpis, breakdown }: DashboardProps) {
  const totalObjections = breakdown.objections.reduce(
    (total, item) => total + Number(item.count),
    0,
  );

  const objectionItems: BarListItem[] = breakdown.objections.map(item => {
    const count = Number(item.count);
    return {
      id: item.category ?? "NONE",
      label: item.category ? (objectionLabels[item.category] ?? item.category) : "Não informada",
      value: count,
      display: `${count} · ${percent.format(count / Math.max(1, totalObjections))}`,
      detail: `${currency.format(Number(item.value))} em orçamentos`,
    };
  });

  const funnelItems: BarListItem[] = [
    { id: "open", label: "Em aberto", value: breakdown.funnel.open },
    { id: "worked", label: "Trabalhadas", value: breakdown.funnel.worked },
    { id: "responded", label: "Responderam", value: breakdown.funnel.responded },
    { id: "negotiating", label: "Em negociação ou recuperadas", value: breakdown.funnel.negotiating },
    { id: "recovered", label: "Recuperadas", value: breakdown.funnel.recovered, tone: "success" },
  ].map(stage => ({
    ...stage,
    tone: (stage.tone ?? "muted") as BarListItem["tone"],
    display: stage.value.toLocaleString("pt-BR"),
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Visão geral"
        description="Um panorama dos orçamentos e do acompanhamento dos pacientes."
        action={
          <Button asChild>
            <Link href="/oportunidades">
              Ver oportunidades
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <StatGrid label="Indicadores de recuperação">
        <StatCard
          detail="Oportunidades para acompanhar"
          href="/oportunidades"
          icon={ClipboardListIcon}
          label="Orçamentos em aberto"
          value={kpis.openCount.toLocaleString("pt-BR")}
        />
        <StatCard
          detail="Em orçamentos recuperáveis"
          icon={BanknoteIcon}
          label="Valor potencial"
          value={currency.format(Number(kpis.potentialValue))}
        />
        <StatCard
          detail={`${kpis.recoveredCount} oportunidades recuperadas`}
          icon={TrendingUpIcon}
          label="Receita recuperada"
          value={currency.format(Number(kpis.recoveredValue))}
        />
        <StatCard
          detail="Sobre todas as oportunidades"
          icon={TargetIcon}
          label="Taxa de recuperação"
          value={percent.format(kpis.recoveryRate)}
        />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>O que impede o fechamento?</CardTitle>
            <CardDescription>Objeções registradas em todas as oportunidades.</CardDescription>
          </CardHeader>
          <CardContent>
            {totalObjections === 0 ? (
              <BreakdownEmpty />
            ) : (
              <BarList items={objectionItems} scale="sum" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funil de recuperação</CardTitle>
            <CardDescription>Volume registrado em cada etapa do acompanhamento.</CardDescription>
          </CardHeader>
          <CardContent>
            {funnelItems.every(stage => stage.value === 0) ? (
              <BreakdownEmpty />
            ) : (
              <BarList as="ol" items={funnelItems} />
            )}
          </CardContent>
        </Card>
      </div>

      <section
        aria-label="Continuar atendimento"
        className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-level-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-sm bg-accent text-accent-foreground"><CalendarClock aria-hidden="true" className="size-5" strokeWidth={1.75} /></span>
          <div>
            <h2 className="text-body font-semibold">Continue o acompanhamento</h2>
            <p className="mt-1 text-body-sm text-text-muted">
              Confira os retornos de hoje e os contatos que precisam de atenção.
            </p>
          </div>
        </div>
        <Button asChild variant="secondary">
          <Link href="/follow-ups">
            Abrir follow-ups
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

function BreakdownEmpty() {
  return (
    <EmptyState
      action={{ label: "Importar planilha", href: "/importar" }}
      description="Importe os orçamentos e registre os contatos para acompanhar os resultados."
      title="Ainda não há dados para este painel"
      titleAs="p"
      variant="inline"
    />
  );
}
