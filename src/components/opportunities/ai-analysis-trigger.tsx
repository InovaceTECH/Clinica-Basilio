"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AiAnalysisTriggerProps = {
  className?: string;
  label?: string;
  opportunityId: string;
  variant?: "default" | "secondary";
};

export function AiAnalysisTrigger({
  className,
  label = "Analisar oportunidade",
  opportunityId,
  variant = "default",
}: AiAnalysisTriggerProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalysis() {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/analyze", {
        body: JSON.stringify({ opportunityId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = await response.json() as { message?: string };

      if (!response.ok) {
        setError(payload.message ?? "Não foi possível gerar a análise agora.");
        return;
      }

      router.refresh();
    } catch {
      setError("Não foi possível gerar a análise agora. Tente novamente em alguns instantes.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-body-sm text-danger" role="alert">{error}</p> : null}
      <Button className={cn("w-full", className)} disabled={isLoading} onClick={handleAnalysis} type="button" variant={variant}>
        {isLoading ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Sparkles aria-hidden="true" />}
        {isLoading ? "Gerando análise..." : label}
      </Button>
    </div>
  );
}
