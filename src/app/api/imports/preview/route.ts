import { AuthorizationError } from "@/auth/authorization";
import { requirePermission } from "@/auth/current-authorization";
import { ImportPreviewError, createImportPreview } from "@/services/imports/preview";

export async function POST(request: Request) {
  try {
    await requirePermission("imports.create");
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { message: "Selecione uma planilha CSV ou XLSX para continuar." },
        { status: 400 },
      );
    }

    const preview = await createImportPreview(file);

    return Response.json(preview);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return Response.json(
        { message: "Você não possui permissão para importar dados." },
        { status: 403 },
      );
    }

    if (error instanceof ImportPreviewError) {
      return Response.json({ message: error.message }, { status: 400 });
    }

    return Response.json(
      { message: "Não foi possível ler a planilha. Tente novamente." },
      { status: 500 },
    );
  }
}
