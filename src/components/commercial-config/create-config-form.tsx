"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
    <form className="mt-6 space-y-3 rounded-lg border border-border p-4" onSubmit={submit}>
      <input className="h-10 w-full rounded-sm border border-input px-3" name="title" placeholder="Título" required />
      {type === "playbook" ? <>
        <select className="h-10 w-full rounded-sm border border-input px-3" name="category">
          <option value="FINANCIAL">Financeira</option><option value="INDECISION">Indecisão</option>
          <option value="SHARED_DECISION">Decisão compartilhada</option><option value="OTHER">Outra</option>
        </select>
        <Textarea name="objective" placeholder="Objetivo" required />
        <Textarea name="guidelines" placeholder="Diretrizes aprovadas" required />
        <Textarea name="suggestedQuestions" placeholder="Perguntas sugeridas (opcional)" />
      </> : <Textarea name="content" placeholder="Condição comercial aprovada" required />}
      {error ? <p className="text-body-sm text-danger" role="alert">{error}</p> : null}
      <Button disabled={saving} type="submit">{saving ? "Salvando..." : "Adicionar"}</Button>
    </form>
  );
}
