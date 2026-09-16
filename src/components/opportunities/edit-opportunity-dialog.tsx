"use client";

import { LoaderCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EditableOpportunity = {
  id: string;
  patientName: string;
  patientPhone: string | null;
  treatment: string;
  budgetValue: string;
  budgetDate: string;
  professionalName: string | null;
  leadSource: string | null;
  rawObjection: string | null;
  notes: string | null;
  objectionCategory: string | null;
};

type OpportunityForm = {
  patientName: string;
  patientPhone: string;
  treatment: string;
  budgetValue: string;
  budgetDate: string;
  professionalName: string;
  leadSource: string;
  rawObjection: string;
  notes: string;
  objectionCategory: string;
};

const objectionCategories = [
  { value: "FINANCIAL", label: "Financeira" },
  { value: "SHARED_DECISION", label: "Decisão compartilhada" },
  { value: "INDECISION", label: "Indecisão" },
  { value: "COMPARISON", label: "Comparação" },
  { value: "LOW_URGENCY", label: "Baixa urgência" },
  { value: "INSECURITY", label: "Insegurança" },
  { value: "NO_RESPONSE", label: "Sem resposta" },
  { value: "OTHER", label: "Outra" },
] as const;

function toForm(opportunity: EditableOpportunity): OpportunityForm {
  return {
    patientName: opportunity.patientName,
    patientPhone: opportunity.patientPhone ?? "",
    treatment: opportunity.treatment,
    budgetValue: opportunity.budgetValue,
    budgetDate: opportunity.budgetDate,
    professionalName: opportunity.professionalName ?? "",
    leadSource: opportunity.leadSource ?? "",
    rawObjection: opportunity.rawObjection ?? "",
    notes: opportunity.notes ?? "",
    objectionCategory: opportunity.objectionCategory ?? "",
  };
}

function parseBudgetValue(value: string) {
  const source = value.replace(/[^\d,.-]/g, "").trim();

  if (source.includes(",")) {
    return Number(source.replace(/\./g, "").replace(",", "."));
  }

  return Number(/^\d{1,3}(?:\.\d{3})+$/.test(source) ? source.replace(/\./g, "") : source);
}

export function EditOpportunityDialog({ opportunity }: { opportunity: EditableOpportunity }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => toForm(opportunity));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateField(field: keyof OpportunityForm, value: string) {
    setForm(current => ({ ...current, [field]: value }));
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setForm(toForm(opportunity));
      setError(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch(`/api/opportunities/${opportunity.id}`, {
        body: JSON.stringify({
          ...form,
          budgetValue: parseBudgetValue(form.budgetValue),
          objectionCategory: form.objectionCategory || undefined,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });
      const payload = await response.json() as { message?: string };

      if (!response.ok) {
        setError(payload.message ?? "Não foi possível salvar as alterações.");
        return;
      }

      setOpen(false);
      toast.success("Oportunidade atualizada.");
      router.refresh();
    } catch {
      setError("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" type="button" variant="secondary">
          <Pencil aria-hidden="true" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl overflow-y-auto p-0 sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-5 sm:p-6">
            <DialogTitle>Editar oportunidade</DialogTitle>
            <DialogDescription>
              Atualize as informações comerciais sem alterar o histórico de contatos ou follow-ups.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 border-t border-border px-5 py-6 sm:px-6">
            <fieldset className="space-y-4">
              <legend className="text-body font-semibold">Dados da oportunidade</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Paciente" required>
                  <Input onChange={event => updateField("patientName", event.target.value)} required value={form.patientName} />
                </Field>
                <Field label="Telefone">
                  <Input inputMode="tel" onChange={event => updateField("patientPhone", event.target.value)} placeholder="(00) 00000-0000" value={form.patientPhone} />
                </Field>
                <Field label="Tratamento" required>
                  <Input onChange={event => updateField("treatment", event.target.value)} required value={form.treatment} />
                </Field>
                <Field label="Valor do orçamento" required>
                  <Input inputMode="decimal" onChange={event => updateField("budgetValue", event.target.value)} required value={form.budgetValue} />
                </Field>
                <Field label="Data do orçamento" required>
                  <Input onChange={event => updateField("budgetDate", event.target.value)} required type="date" value={form.budgetDate} />
                </Field>
                <Field label="Profissional">
                  <Input onChange={event => updateField("professionalName", event.target.value)} value={form.professionalName} />
                </Field>
              </div>
              <Field label="Origem">
                <Input onChange={event => updateField("leadSource", event.target.value)} placeholder="Ex.: Indicação" value={form.leadSource} />
              </Field>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-body font-semibold">Objeção e observações</legend>
              <Field label="Categoria da objeção">
                <select className="h-11 w-full rounded-md border border-input bg-surface px-4 text-body text-foreground outline-none transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20" onChange={event => updateField("objectionCategory", event.target.value)} value={form.objectionCategory}>
                  <option value="">Não informada</option>
                  {objectionCategories.map(category => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select>
              </Field>
              <Field label="Objeção informada">
                <Textarea maxLength={4000} onChange={event => updateField("rawObjection", event.target.value)} placeholder="Descreva a objeção comercial informada pelo paciente." value={form.rawObjection} />
              </Field>
              <Field label="Observações">
                <Textarea maxLength={4000} onChange={event => updateField("notes", event.target.value)} placeholder="Registre somente informações comerciais relevantes." value={form.notes} />
              </Field>
            </fieldset>

            {error ? <p className="text-body-sm text-danger" role="alert">{error}</p> : null}
          </div>

          <DialogFooter className="px-5 sm:px-6">
            <Button disabled={isSaving} onClick={() => setOpen(false)} type="button" variant="secondary">Cancelar</Button>
            <Button disabled={isSaving} type="submit">
              {isSaving ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : null}
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ children, label, required = false }: { children: React.ReactNode; label: string; required?: boolean }) {
  return (
    <label className="block space-y-2 text-label font-medium text-foreground">
      <span>{label}{required ? " *" : ""}</span>
      {children}
    </label>
  );
}
