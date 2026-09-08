import { PageHeader } from "@/components/layout/page-header";
import { requireTenantContext } from "@/auth/tenant-session"; import { CreateConfigForm } from "@/components/commercial-config/create-config-form"; import { getCommercialRules } from "@/services/commercial-config/queries";

export default async function SettingsPage() { const rules=await getCommercialRules(await requireTenantContext());
  return (
    <>
      <PageHeader
        description="Gerencie as informações da clínica e as regras comerciais autorizadas."
        title="Configurações"
      />
      <CreateConfigForm type="rule"/><div className="mt-6 space-y-3">{rules.map(rule=><article className="rounded-lg border border-border p-4" key={rule.id}><p className="font-medium">{rule.title}</p><p className="mt-2 text-body-sm text-text-secondary">{rule.content}</p></article>)}</div>
    </>
  );
}
