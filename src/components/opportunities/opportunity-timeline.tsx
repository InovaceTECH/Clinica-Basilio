import { ClipboardList, MessageCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";

type OpportunityTimelineProps = {
  budget: { budgetDate: Date; budgetValue: string; treatment: string };
  analyses: Array<{ createdAt: Date; id: string; objectionCategory: string }>;
  interactions: Array<{
    channel: "WHATSAPP" | "PHONE" | "IN_PERSON" | "OTHER";
    createdAt: Date;
    id: string;
    notes: string | null;
    result: "NO_RESPONSE" | "REQUESTED_CALLBACK" | "STILL_THINKING" | "INTERESTED" | "NEGOTIATING" | "RETURN_SCHEDULED" | "PROCEDURE_SCHEDULED" | "CLOSED" | "DECLINED" | "DO_NOT_CONTACT";
    userName: string;
  }>;
};

type TimelineEvent = {
  description: string;
  id: string;
  kind: "analysis" | "budget" | "interaction";
  notes?: string | null;
  occurredAt: Date;
  showTime: boolean;
  title: string;
};

const channelLabels = { WHATSAPP: "WhatsApp", PHONE: "Telefone", IN_PERSON: "Presencial", OTHER: "Outro" } as const;
const objectionLabels: Record<string, string> = { FINANCIAL: "financeira", SHARED_DECISION: "de decisão compartilhada", INDECISION: "de indecisão", COMPARISON: "de comparação", LOW_URGENCY: "de baixa urgência", INSECURITY: "de insegurança", NO_RESPONSE: "de falta de resposta", OTHER: "não categorizada" };
const resultLabels = { NO_RESPONSE: "Não respondeu", REQUESTED_CALLBACK: "Pediu retorno", STILL_THINKING: "Ainda está pensando", INTERESTED: "Interessado", NEGOTIATING: "Negociação em andamento", RETURN_SCHEDULED: "Agendou retorno", PROCEDURE_SCHEDULED: "Agendou procedimento", CLOSED: "Fechou tratamento", DECLINED: "Desistiu", DO_NOT_CONTACT: "Não deseja contato" } as const;

function formatCurrency(value: string) {
  return new Intl.NumberFormat("pt-BR", { currency: "BRL", style: "currency" }).format(Number(value));
}

function formatEventDate(event: TimelineEvent) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    event.showTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium", timeZone: "UTC" },
  ).format(event.occurredAt);
}

export function OpportunityTimeline({ analyses, budget, interactions }: OpportunityTimelineProps) {
  const events: TimelineEvent[] = [
    { id: "budget", kind: "budget" as const, occurredAt: budget.budgetDate, showTime: false, title: "Orçamento registrado", description: `${budget.treatment} · ${formatCurrency(budget.budgetValue)}` },
    ...analyses.map((analysis) => ({ id: `analysis-${analysis.id}`, kind: "analysis" as const, occurredAt: analysis.createdAt, showTime: true, title: "Análise sugerida gerada", description: `Sugestão com foco em objeção ${objectionLabels[analysis.objectionCategory] ?? "não categorizada"}.` })),
    ...interactions.map((interaction) => ({ id: `interaction-${interaction.id}`, kind: "interaction" as const, occurredAt: interaction.createdAt, showTime: true, title: resultLabels[interaction.result], description: `${channelLabels[interaction.channel]} · registrado por ${interaction.userName}`, notes: interaction.notes })),
  ].sort((first, second) => second.occurredAt.getTime() - first.occurredAt.getTime());

  return (
    <CardContent>
      <ol className="space-y-0" aria-label="Eventos da oportunidade, do mais recente ao mais antigo">
        {events.map((event) => {
          const Icon = event.kind === "analysis" ? Sparkles : event.kind === "interaction" ? MessageCircle : ClipboardList;

          return (
            <li className="relative border-l border-border pb-6 pl-6 last:border-l-0 last:pb-0" key={event.id}>
              <span className="absolute -left-2.5 top-0 flex size-5 items-center justify-center rounded-full border border-border bg-surface"><Icon aria-hidden="true" className={`size-3 ${event.kind === "analysis" ? "text-primary" : "text-text-muted"}`} /></span>
              <p className="text-caption text-text-muted">{formatEventDate(event)}</p>
              <p className="mt-1 text-body-sm font-medium text-foreground">{event.title}</p>
              <p className="mt-1 text-body-sm text-text-secondary">{event.description}</p>
              {event.kind === "interaction" ? <Badge className="mt-2" variant="neutral">Contato</Badge> : null}
              {event.notes ? <p className="mt-2 whitespace-pre-wrap text-body-sm text-text-secondary">{event.notes}</p> : null}
            </li>
          );
        })}
      </ol>
    </CardContent>
  );
}
