"use client";

import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
};

const objectionLabels: Record<string, string> = {
  FINANCIAL: "Financeira", SHARED_DECISION: "Decisão compartilhada", INDECISION: "Indecisão",
  COMPARISON: "Comparação", LOW_URGENCY: "Baixa urgência", INSECURITY: "Insegurança",
  NO_RESPONSE: "Sem resposta", OTHER: "Outra",
};

export function AiAnalysisCard({ analysis }: AiAnalysisCardProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(analysis.suggestedMessage);
      setCopyError(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_000);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  }

  return (
    <Card className="border-primary/25">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Sparkles aria-hidden="true" className="size-4 text-primary" />Análise sugerida</CardTitle>
        <CardDescription>Revise a sugestão antes de entrar em contato. A decisão é sempre da equipe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div><p className="text-label text-text-muted">Possível objeção</p><Badge className="mt-2" variant="info">{objectionLabels[analysis.objectionCategory] ?? "Outra"}</Badge></div>
        <AnalysisSection label="Contexto" value={analysis.contextAnalysis} />
        <AnalysisSection label="Objetivo do contato" value={analysis.contactGoal} />
        <AnalysisSection label="Estratégia recomendada" value={analysis.strategy} />
        <AnalysisSection label="Abordagem sugerida" value={analysis.suggestedApproach} />
        <div className="rounded-md border border-border bg-surface-secondary p-4"><p className="text-label text-text-muted">Mensagem sugerida</p><p className="mt-2 whitespace-pre-wrap text-body text-text-secondary">{analysis.suggestedMessage}</p><Button className="mt-4" onClick={copyMessage} size="sm" type="button" variant="secondary">{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? "Mensagem copiada" : "Copiar mensagem"}</Button>{copyError ? <p className="mt-2 text-body-sm text-destructive" role="status">Não foi possível copiar. Selecione a mensagem e copie manualmente.</p> : null}</div>
        <AnalysisSection label="Próxima ação recomendada" value={analysis.nextAction} />
        <p className="text-body-sm text-text-muted">Sugestão de retorno: em {analysis.suggestedFollowUpDays} {analysis.suggestedFollowUpDays === 1 ? "dia" : "dias"}. O follow-up não é agendado automaticamente.</p>
      </CardContent>
    </Card>
  );
}

function AnalysisSection({ label, value }: { label: string; value: string }) {
  return <div><p className="text-label text-text-muted">{label}</p><p className="mt-1 text-body text-text-secondary">{value}</p></div>;
}
