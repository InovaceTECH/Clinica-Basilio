"use client";

import { LoaderCircle, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const channels = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PHONE", label: "Telefone" },
  { value: "IN_PERSON", label: "Presencial" },
  { value: "OTHER", label: "Outro" },
] as const;

const results = [
  { value: "NO_RESPONSE", label: "Não respondeu" },
  { value: "REQUESTED_CALLBACK", label: "Pediu retorno" },
  { value: "STILL_THINKING", label: "Ainda está pensando" },
  { value: "INTERESTED", label: "Interessado" },
  { value: "NEGOTIATING", label: "Negociação em andamento" },
  { value: "RETURN_SCHEDULED", label: "Agendou retorno" },
  { value: "PROCEDURE_SCHEDULED", label: "Agendou procedimento" },
  { value: "CLOSED", label: "Fechou tratamento" },
  { value: "DECLINED", label: "Desistiu" },
  { value: "DO_NOT_CONTACT", label: "Não deseja contato" },
] as const;

export function RegisterInteractionDialog({ opportunityId }: { opportunityId: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [channel, setChannel] = useState("");
  const [result, setResult] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function resetForm() {
    setChannel("");
    setResult("");
    setNotes("");
    setError(null);
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!channel || !result) {
      setError("Selecione o canal e o resultado do contato.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/interactions", {
        body: JSON.stringify({ channel, notes, opportunityId, result }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = await response.json() as { message?: string };

      if (!response.ok) {
        setError(payload.message ?? "Não foi possível registrar o contato.");
        return;
      }

      closeDialog();
      toast.success("Contato registrado.");
      router.refresh();
    } catch {
      setError("Não foi possível registrar o contato. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <Button onClick={() => dialogRef.current?.showModal()} size="sm" type="button">
        <Plus aria-hidden="true" />Registrar contato
      </Button>
      <dialog
        aria-labelledby="register-interaction-title"
        className="w-[calc(100%-2rem)] max-w-lg rounded-lg border border-border bg-surface p-0 text-foreground shadow-level-2 backdrop:bg-black/40"
        onClose={resetForm}
        ref={dialogRef}
      >
        <form className="space-y-5 p-5 sm:p-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-heading-2 font-semibold" id="register-interaction-title">Registrar contato</h2>
            <p className="mt-1 text-body-sm text-text-muted">Documente o retorno da conversa para orientar o próximo passo.</p>
          </div>
          <div className="space-y-2">
            <label className="text-label text-foreground" htmlFor="interaction-channel">Canal</label>
            <select aria-invalid={Boolean(error && !channel)} className="h-10 w-full rounded-sm border border-input bg-surface px-3 text-base text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 aria-invalid:border-danger" id="interaction-channel" onChange={(event) => setChannel(event.target.value)} required value={channel}>
              <option disabled value="">Selecione o canal</option>
              {channels.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-label text-foreground" htmlFor="interaction-result">Resultado</label>
            <select aria-invalid={Boolean(error && !result)} className="h-10 w-full rounded-sm border border-input bg-surface px-3 text-base text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/15 aria-invalid:border-danger" id="interaction-result" onChange={(event) => setResult(event.target.value)} required value={result}>
              <option disabled value="">Selecione o resultado</option>
              {results.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-label text-foreground" htmlFor="interaction-notes">Observação <span className="font-normal text-text-muted">(opcional)</span></label>
            <Textarea id="interaction-notes" maxLength={4000} onChange={(event) => setNotes(event.target.value)} placeholder="Registre apenas informações comerciais relevantes." value={notes} />
          </div>
          {error ? <p className="text-body-sm text-danger" role="alert">{error}</p> : null}
          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <Button disabled={isSaving} onClick={closeDialog} type="button" variant="secondary">Cancelar</Button>
            <Button disabled={isSaving} type="submit">{isSaving ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}{isSaving ? "Salvando..." : "Salvar contato"}</Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
