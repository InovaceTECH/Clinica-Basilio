import { z } from "zod";

import { AuthorizationError } from "@/auth/authorization";
import { requirePermission } from "@/auth/current-authorization";
import { commitImportSchema } from "@/schemas/import-persistence";
import {
  ImportPersistenceError,
  persistImport,
} from "@/services/imports/persist";
import { ImportPreviewError } from "@/services/imports/preview";

export async function POST(request: Request) {
  try {
    const tenant = await requirePermission("imports.create");
    const formData = await request.formData();
    const file = formData.get("file");
    const mapping = formData.get("mapping");

    if (!(file instanceof File)) {
      return Response.json(
        { message: "Selecione uma planilha CSV ou XLSX para continuar." },
        { status: 400 },
      );
    }

    if (typeof mapping !== "string") {
      return Response.json(
        { message: "Confirme o mapeamento das colunas antes de importar." },
        { status: 400 },
      );
    }

    const result = await persistImport(
      tenant,
      file,
      commitImportSchema.parse({ mapping: JSON.parse(mapping) }),
    );

    return Response.json(result);
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return Response.json(
        { message: "Você não possui permissão para importar dados." },
        { status: 403 },
      );
    }

    if (
      error instanceof ImportPersistenceError ||
      error instanceof ImportPreviewError ||
      error instanceof z.ZodError ||
      error instanceof SyntaxError
    ) {
      return Response.json(
        { message: "Revise o arquivo e o mapeamento antes de importar." },
        { status: 400 },
      );
    }

    return Response.json(
      { message: "Não foi possível concluir a importação. Tente novamente." },
      { status: 500 },
    );
  }
}
