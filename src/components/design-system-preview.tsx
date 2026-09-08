"use client";

import { Check, LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const colorTokens = [
  { label: "Primária", className: "bg-primary" },
  { label: "Sucesso", className: "bg-success" },
  { label: "Atenção", className: "bg-warning" },
  { label: "Risco", className: "bg-danger" },
  { label: "Informação", className: "bg-info" },
];

export function DesignSystemPreview() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="max-w-3xl">
          <Badge variant="info">Design System</Badge>
          <h1 className="mt-4 text-heading-1 font-bold">
            Base visual da Clínica Basilico
          </h1>
          <p className="mt-3 text-body text-text-secondary">
            Componentes claros, consistentes e preparados para a rotina de
            recuperação de orçamentos.
          </p>
        </header>

        <section aria-labelledby="tokens-title">
          <Card>
            <CardHeader>
              <CardTitle id="tokens-title">Cores e estados</CardTitle>
              <CardDescription>
                Uma cor estrutural e cores semânticas usadas somente para
                comunicar significado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {colorTokens.map((token) => (
                  <div
                    key={token.label}
                    className="rounded-md border border-border bg-surface-secondary p-3"
                  >
                    <div
                      className={`h-10 rounded-sm ${token.className}`}
                      aria-hidden="true"
                    />
                    <p className="mt-2 text-caption text-text-muted">
                      {token.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge>Nova</Badge>
                <Badge variant="info">A analisar</Badge>
                <Badge variant="warning">Contato pendente</Badge>
                <Badge variant="success">Recuperada</Badge>
                <Badge variant="danger">Perdida</Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="high">Prioridade alta</Badge>
                <Badge variant="medium">Prioridade média</Badge>
                <Badge variant="low">Prioridade baixa</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section aria-labelledby="actions-title">
            <Card className="h-full">
              <CardHeader>
                <CardTitle id="actions-title">Ações</CardTitle>
                <CardDescription>
                  Hierarquia clara para ações principais, secundárias e
                  destrutivas.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-3">
                <Button>
                  <Sparkles aria-hidden="true" />
                  Analisar com IA
                </Button>
                <Button variant="secondary">Editar</Button>
                <Button variant="destructive">Excluir</Button>
                <Button disabled>Indisponível</Button>
                <Button variant="secondary" size="icon" aria-label="Concluído">
                  <Check aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          </section>

          <section aria-labelledby="form-title">
            <Card className="h-full">
              <CardHeader>
                <CardTitle id="form-title">Formulário</CardTitle>
                <CardDescription>
                  Campos com labels, foco visível e dimensões consistentes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className="space-y-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    toast.success("Demonstração salva com sucesso.");
                  }}
                >
                  <div className="space-y-2">
                    <label className="text-label font-medium" htmlFor="patient">
                      Nome do paciente
                    </label>
                    <Input id="patient" placeholder="Digite o nome" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-label font-medium" htmlFor="status">
                      Status
                    </label>
                    <Select>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Nova</SelectItem>
                        <SelectItem value="pending">Contato pendente</SelectItem>
                        <SelectItem value="negotiating">Em negociação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-label font-medium" htmlFor="notes">
                      Observações
                    </label>
                    <Textarea
                      id="notes"
                      placeholder="Registre informações comerciais relevantes"
                    />
                  </div>

                  <Button type="submit">Salvar demonstração</Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>

        <section aria-labelledby="loading-title">
          <Card>
            <CardHeader>
              <CardTitle id="loading-title">Carregamento</CardTitle>
              <CardDescription>
                Feedback discreto para operações assíncronas.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex items-center gap-2 text-body-sm text-text-secondary">
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                Analisando oportunidade...
              </div>
              <div className="space-y-2" aria-label="Conteúdo carregando">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
