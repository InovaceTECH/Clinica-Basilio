"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateConfigForm({ type }: { type: "rule" | "playbook" }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/commercial-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, type }),
      });
      if (!response.ok) {
        setError("Não foi possível salvar. Revise os campos e tente novamente.");
        return;
      }
      form.reset();
      toast.success("Configuração salva.");
      router.refresh();
    } catch {
      setError("Não foi possível salvar. Verifique sua conexão e tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="mt-6 space-y-4 rounded-lg border border-border bg-surface p-4 sm:p-6" onSubmit={submit}>
      <div className="space-y-2">
        <label className="text-label font-medium text-foreground" htmlFor={`${type}-title`}>Título</label>
        <Input id={`${type}-title`} name="title" placeholder="Ex.: Parcelamento aprovado" required />
      </div>
      {type === "playbook" ? <>
        <div className="space-y-2">
          <label className="text-label font-medium text-foreground" htmlFor="playbook-category">Categoria da objeção</label>
          <select className="h-10 w-full rounded-sm border border-input bg-surface px-3 text-base outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15" id="playbook-category" name="category">
          <option value="FINANCIAL">Financeira</option>
          <option value="SHARED_DECISION">Decisão compartilhada</option>
          <option value="INDECISION">Indecisão</option>
          <option value="COMPARISON">Comparação</option>
          <option value="LOW_URGENCY">Baixa urgência</option>
          <option value="INSECURITY">Insegurança</option>
          <option value="NO_RESPONSE">Sem resposta</option>
          <option value="OTHER">Outra</option>
        </select>
        </div>
        <FormTextarea id="playbook-objective" label="Objetivo" name="objective" placeholder="O que esta estratégia deve alcançar" required />
        <FormTextarea id="playbook-guidelines" label="Diretrizes aprovadas" name="guidelines" placeholder="Como a equipe deve conduzir a abordagem" required />
        <FormTextarea id="playbook-questions" label="Perguntas sugeridas" name="suggestedQuestions" placeholder="Perguntas que podem ajudar na conversa" optional />
      </> : <FormTextarea id="rule-content" label="Condição comercial aprovada" name="content" placeholder="Descreva a condição que a IA poderá utilizar" required />}
      {error ? <p aria-live="polite" className="text-body-sm text-danger" role="alert">{error}</p> : null}
      <Button disabled={saving} type="submit">{saving ? "Salvando..." : "Adicionar"}</Button>
    </form>
  );
}

function FormTextarea({ id, label, name, optional = false, placeholder, required = false }: { id: string; label: string; name: string; optional?: boolean; placeholder: string; required?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-label font-medium text-foreground" htmlFor={id}>
        {label}{optional ? <span className="font-normal text-text-muted"> (opcional)</span> : null}
      </label>
      <Textarea id={id} name={name} placeholder={placeholder} required={required} />
    </div>
  );
}
