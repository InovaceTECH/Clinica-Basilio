import { PageHeader } from "@/components/layout/page-header";
import { ImportPreview } from "@/components/imports/import-preview";

export default function ImportPage() {
  return (
    <>
      <PageHeader
        description="Envie uma planilha, confira o mapeamento e revise os dados antes de importar."
        title="Importar dados"
      />
      <ImportPreview />
    </>
  );
}
