import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { requireTenantContext } from "@/auth/tenant-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { AiAnalysisTrigger } from "@/components/opportunities/ai-analysis-trigger";
import { AiAnalysisCard } from "@/components/opportunities/ai-analysis-card";
import { OpportunityTimeline } from "@/components/opportunities/opportunity-timeline";
import { RegisterInteractionDialog } from "@/components/opportunities/register-interaction-dialog";
import { FollowUpPanel } from "@/components/opportunities/follow-up-panel";
import { getOpportunityAnalysisHistory } from "@/services/ai/queries";
import { getOpportunityInteractionHistory } from "@/services/interactions/queries";
import { getPendingFollowUps } from "@/services/follow-ups/queries";
import { getTenantOpportunityById } from "@/services/opportunities/queries";

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
  return new Intl.NumberFormat("pt-BR", { currency: "BRL", style: "currency" }).format(Number(value));
}

function formatDate(value: Date | null) {
  return value ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(value) : "Não informado";
}

function formatPhone(value: string | null) {
  if (!value) return "Não informado";

  const digits = value.replace(/\D/g, "").replace(/^55/, "");
  return digits.length === 11 ? `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}` : value;
}

function PriorityBadge({ priority }: { priority: "HIGH" | "MEDIUM" | "LOW" }) {
  const content = {
    HIGH: { label: "Alta", variant: "high" as const },
    MEDIUM: { label: "Média", variant: "medium" as const },
    LOW: { label: "Baixa", variant: "low" as const },
  }[priority];

  return <Badge variant={content.variant}>{content.label}</Badge>;
}

export default async function OpportunityPage({ params }: PageProps<"/oportunidades/[opportunityId]">) {
  const { opportunityId } = await params;
  const parsedId = z.uuid().safeParse(opportunityId);

  if (!parsedId.success) notFound();

  const tenant = await requireTenantContext();
  const opportunity = await getTenantOpportunityById(tenant, parsedId.data);

  if (!opportunity) notFound();
  const [analyses, interactions, followUps] = await Promise.all([
    getOpportunityAnalysisHistory(tenant, opportunity.id),
    getOpportunityInteractionHistory(tenant, opportunity.id),
    getPendingFollowUps(tenant, opportunity.id),
  ]);
  const analysis = analyses[0] ?? null;

  const objection = opportunity.rawObjection ?? (opportunity.objectionCategory ? objectionLabels[opportunity.objectionCategory] : "Não informada");

  return (
    <>
      <PageHeader
        action={<Button asChild variant="secondary"><Link href="/oportunidades"><ArrowLeft aria-hidden="true" />Voltar para oportunidades</Link></Button>}
        description={`${opportunity.treatment} · orçamento de ${formatCurrency(opportunity.budgetValue)}`}
        title={opportunity.patientName}
      />

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da oportunidade</CardTitle>
              <CardDescription>Informações comerciais do orçamento e do paciente.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <Detail label="Paciente" value={opportunity.patientName} />
                <Detail label="Telefone" value={formatPhone(opportunity.patientPhone)} />
                <Detail label="Tratamento" value={opportunity.treatment} />
                <Detail label="Valor do orçamento" value={formatCurrency(opportunity.budgetValue)} />
                <Detail label="Data do orçamento" value={formatDate(opportunity.budgetDate)} />
                <Detail label="Profissional" value={opportunity.professionalName ?? "Não informado"} />
                <Detail label="Origem" value={opportunity.leadSource ?? "Não informada"} />
                <Detail label="Último contato" value={formatDate(opportunity.lastContactAt)} />
                <Detail label="Próximo follow-up" value={formatDate(opportunity.nextFollowUpAt)} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objeção e observações</CardTitle>
              <CardDescription>Contexto comercial informado no orçamento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div><p className="text-label text-text-muted">Objeção</p><p className="mt-1 text-body text-text-secondary">{objection}</p></div>
              <div><p className="text-label text-text-muted">Observações</p><p className="mt-1 whitespace-pre-wrap text-body text-text-secondary">{opportunity.notes ?? "Nenhuma observação registrada."}</p></div>
            </CardContent>
          </Card>

        </div>

        <aside className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prioridade e status</CardTitle>
              <CardDescription>Visão rápida para orientar a próxima ação.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-3"><span className="text-body-sm text-text-muted">Prioridade</span><PriorityBadge priority={opportunity.priority} /></div>
              <div className="flex items-center justify-between gap-3"><span className="text-body-sm text-text-muted">Status</span><Badge variant="neutral">{statusLabels[opportunity.status]}</Badge></div>
              <div className="flex items-center justify-between gap-3"><span className="text-body-sm text-text-muted">Score atual</span><span className="text-body-sm font-medium text-foreground">{opportunity.priorityScore}/100</span></div>
            </CardContent>
          </Card>

          {analysis ? (
            <AiAnalysisCard analysis={analysis} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles aria-hidden="true" className="size-4 text-primary" />Análise da IA</CardTitle>
                <CardDescription>Estratégia e abordagem sugeridas aparecerão aqui.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-body-sm text-text-muted">A análise será gerada a partir do orçamento, da objeção e do histórico de contatos, sempre como apoio à decisão da equipe.</p>
                <AiAnalysisTrigger opportunityId={opportunity.id} />
              </CardContent>
            </Card>
          )}

          <Card><CardHeader><CardTitle>Próxima ação</CardTitle><CardDescription>Agende e acompanhe os retornos desta oportunidade.</CardDescription></CardHeader><CardContent><FollowUpPanel followUps={followUps} opportunityId={opportunity.id} /></CardContent></Card>
        </aside>
        <Card className="min-w-0 xl:col-span-2">
          <CardHeader>
            <CardTitle>Linha do tempo</CardTitle>
            <CardDescription>Orçamento, análises e contatos em ordem cronológica.</CardDescription>
            <CardAction><RegisterInteractionDialog opportunityId={opportunity.id} /></CardAction>
          </CardHeader>
          <OpportunityTimeline analyses={analyses} budget={opportunity} interactions={interactions} />
        </Card>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-label text-text-muted">{label}</dt><dd className="mt-1 break-words text-body-sm text-text-secondary">{value}</dd></div>;
}
