import { PageHeader } from "@/components/layout/page-header";
import { requireTenantContext } from "@/auth/tenant-session"; import { CreateConfigForm } from "@/components/commercial-config/create-config-form"; import { getPlaybooks } from "@/services/commercial-config/queries";

const categoryLabels: Record<string, string> = { FINANCIAL: "Financeira", SHARED_DECISION: "Decisão compartilhada", INDECISION: "Indecisão", COMPARISON: "Comparação", LOW_URGENCY: "Baixa urgência", INSECURITY: "Insegurança", NO_RESPONSE: "Sem resposta", OTHER: "Outra" };

export default async function PlaybooksPage() { const playbooks=await getPlaybooks(await requireTenantContext());
  return (
    <>
      <PageHeader
        description="Consulte estratégias aprovadas para lidar com as principais objeções comerciais."
        title="Playbooks"
      />
      <CreateConfigForm type="playbook"/><div className="mt-6 space-y-3">{playbooks.length === 0 ? <p className="rounded-lg border border-border bg-surface p-6 text-body-sm text-text-muted">Nenhum playbook cadastrado. Adicione a primeira estratégia aprovada acima.</p> : playbooks.map(p=><article className="rounded-lg border border-border bg-surface p-4" key={p.id}><p className="font-medium">{p.title}</p><p className="text-body-sm text-text-muted">{categoryLabels[p.category] ?? "Outra"} · {p.active?"Ativo":"Inativo"}</p><p className="mt-2 text-body-sm">{p.objective}</p></article>)}</div>
    </>
  );
}
