"use client";

import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-4 py-8">
        <span className="grid size-10 place-items-center rounded-md bg-danger-bg text-danger">
          <TriangleAlert aria-hidden="true" className="size-5" />
        </span>
        <div>
          <h1 className="text-heading-2 font-semibold">Não foi possível carregar esta página</h1>
          <p className="mt-2 text-body-sm text-text-muted">Tente novamente. Se o problema continuar, informe a gestão da clínica.</p>
        </div>
        <Button onClick={reset} type="button">Tentar novamente</Button>
      </CardContent>
    </Card>
  );
}
