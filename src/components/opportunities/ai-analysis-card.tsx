import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { AiAnalysisTrigger } from "@/components/opportunities/ai-analysis-trigger";
import { CopyMessageButton } from "@/components/opportunities/copy-message-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AiAnalysisCardProps = {
  analysis: {
    objectionCategory: string;
    contextAnalysis: string;
    contactGoal: string;
    strategy: string;
    suggestedApproach: string;
    suggestedMessage: string;
    nextAction: string;
    suggestedFollowUpDays: number;
  };
  isOutdated: boolean;
  opportunityId: string;
};

const objectionLabels: Record<string, string> = {
  FINANCIAL: "Financeira", SHARED_DECISION: "Decisão compartilhada", INDECISION: "Indecisão",
  COMPARISON: "Comparação", LOW_URGENCY: "Baixa urgência", INSECURITY: "Insegurança",
  NO_RESPONSE: "Sem resposta", OTHER: "Outra",
};

export function AiAnalysisCard({ analysis, isOutdated, opportunityId }: AiAnalysisCardProps) {
  return (
    <Card className="border-primary/25">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Sparkles aria-hidden="true" className="size-4 text-primary" />Análise sugerida</CardTitle>
        <CardDescription>Revise a sugestão antes de entrar em contato. A decisão é sempre da equipe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {isOutdated ? (
          <div className="rounded-md border border-warning-border bg-warning-bg p-4" role="status">
            <p className="text-body-sm font-medium text-foreground">Dados atualizados desde esta análise</p>
            <p className="mt-1 text-body-sm text-text-secondary">Gere uma nova análise para considerar as informações comerciais mais recentes.</p>
          </div>
        ) : null}
        <div><p className="text-label text-text-muted">Possível objeção</p><Badge className="mt-2" variant="info">{objectionLabels[analysis.objectionCategory] ?? "Outra"}</Badge></div>
        <AnalysisSection label="Objetivo do contato" value={analysis.contactGoal} />
        <div className="rounded-md bg-surface-secondary p-4"><h3 className="text-label font-medium">Mensagem sugerida</h3><p className="mt-2 break-words whitespace-pre-wrap text-body-sm leading-relaxed text-text-secondary">{analysis.suggestedMessage}</p><CopyMessageButton message={analysis.suggestedMessage} /></div>
        <AnalysisSection label="Próxima ação recomendada" value={analysis.nextAction} />
        <details className="border-t border-border pt-3">
          <summary className="rounded-sm py-2 text-body-sm font-medium">Entender a análise e a estratégia</summary>
          <div className="mt-3 space-y-5">
            <AnalysisSection label="Contexto" value={analysis.contextAnalysis} />
            <AnalysisSection label="Estratégia recomendada" value={analysis.strategy} />
            <AnalysisSection label="Abordagem sugerida" value={analysis.suggestedApproach} />
          </div>
        </details>
        <p className="text-body-sm text-text-muted">Sugestão de retorno: em {analysis.suggestedFollowUpDays} {analysis.suggestedFollowUpDays === 1 ? "dia" : "dias"}. O follow-up não é agendado automaticamente.</p>
        <AiAnalysisTrigger label="Gerar nova análise" opportunityId={opportunityId} variant="secondary" />
      </CardContent>
    </Card>
  );
}

function AnalysisSection({ label, value }: { label: string; value: string }) {
  return <div><h3 className="text-label font-medium">{label}</h3><p className="mt-1 break-words text-body-sm leading-relaxed text-text-secondary">{value}</p></div>;
}
