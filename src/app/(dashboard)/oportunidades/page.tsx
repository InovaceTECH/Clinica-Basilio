import { Upload } from "lucide-react";
import Link from "next/link";

import { OpportunityList } from "@/components/opportunities/opportunity-list";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { requireTenantContext } from "@/auth/tenant-session";
import { parseOpportunityListFilters } from "@/schemas/opportunity-list";
import { getTenantOpportunities } from "@/services/opportunities/queries";

export default async function OpportunitiesPage({ searchParams }: PageProps<"/oportunidades">) {
  const [tenant, parameters] = await Promise.all([requireTenantContext(), searchParams]);
  const filters = parseOpportunityListFilters(parameters);
  const result = await getTenantOpportunities(tenant, filters);

  return (
    <>
      <PageHeader
        action={
          <Button asChild>
            <Link href="/importar">
              <Upload aria-hidden="true" />
              Importar planilha
            </Link>
          </Button>
        }
        description="Gerencie pacientes com orçamentos em aberto."
        title="Oportunidades"
      />
      <OpportunityList filters={filters} result={result} />
    </>
  );
}
