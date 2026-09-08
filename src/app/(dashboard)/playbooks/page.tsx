import { PageHeader } from "@/components/layout/page-header";
import { requireTenantContext } from "@/auth/tenant-session"; import { CreateConfigForm } from "@/components/commercial-config/create-config-form"; import { getPlaybooks } from "@/services/commercial-config/queries";

export default async function PlaybooksPage() { const playbooks=await getPlaybooks(await requireTenantContext());
  return (
    <>
      <PageHeader
        description="Consulte estratégias aprovadas para lidar com as principais objeções comerciais."
        title="Playbooks"
      />
      <CreateConfigForm type="playbook"/><div className="mt-6 space-y-3">{playbooks.map(p=><article className="rounded-lg border border-border p-4" key={p.id}><p className="font-medium">{p.title}</p><p className="text-body-sm text-text-muted">{p.category} · {p.active?"Ativo":"Inativo"}</p><p className="mt-2 text-body-sm">{p.objective}</p></article>)}</div>
    </>
  );
}
