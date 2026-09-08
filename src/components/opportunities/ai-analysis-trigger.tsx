"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AiAnalysisTrigger({ opportunityId }: { opportunityId: string }) {
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
      <Button className="w-full" disabled={isLoading} onClick={handleAnalysis} type="button">
        {isLoading ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Sparkles aria-hidden="true" />}
        {isLoading ? "Gerando análise..." : "Analisar oportunidade"}
      </Button>
    </div>
  );
}
