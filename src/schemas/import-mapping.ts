import { z } from "zod";

export const importDestinationFieldSchema = z.enum([
  "IGNORE",
  "patient_name",
  "phone",
  "treatment",
  "budget_value",
  "budget_date",
  "raw_objection",
  "notes",
  "external_reference",
]);

export type ImportDestinationField = z.infer<typeof importDestinationFieldSchema>;

export const importDestinationFields: ReadonlyArray<{
  value: Exclude<ImportDestinationField, "IGNORE">;
  label: string;
  required?: boolean;
}> = [
  { value: "patient_name", label: "Nome do paciente", required: true },
  { value: "phone", label: "Telefone" },
  { value: "treatment", label: "Procedimento", required: true },
  { value: "budget_value", label: "Valor do orçamento", required: true },
  { value: "budget_date", label: "Data do orçamento", required: true },
  { value: "raw_objection", label: "Objeção" },
  { value: "notes", label: "Observações" },
  { value: "external_reference", label: "Referência externa" },
];

const requiredImportDestinationFields = importDestinationFields
  .filter((field) => field.required)
  .map((field) => field.value);

export const importColumnMappingSchema = z
  .array(
    z.object({
      field: importDestinationFieldSchema,
      header: z.string().trim().min(1).max(500),
    }),
  )
  .min(1)
  .superRefine((columns, context) => {
    const mappedFields = columns
      .map((column) => column.field)
      .filter((field) => field !== "IGNORE");
    const duplicates = mappedFields.filter(
      (field, index) => mappedFields.indexOf(field) !== index,
    );

    if (duplicates.length > 0) {
      context.addIssue({
        code: "custom",
        message: "Cada campo do sistema pode ser associado a apenas uma coluna.",
      });
    }

    const missingFields = requiredImportDestinationFields.filter(
      (field) => !mappedFields.includes(field),
    );

    if (missingFields.length > 0) {
      const labels = importDestinationFields
        .filter((field) => missingFields.includes(field.value))
        .map((field) => field.label);

      context.addIssue({
        code: "custom",
        message: `Mapeie os campos obrigatórios: ${labels.join(", ")}.`,
      });
    }
  });

export type ImportColumnMapping = z.infer<typeof importColumnMappingSchema>;

function normalizeHeader(header: string) {
  return header
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function suggestImportField(header: string): ImportDestinationField {
  const normalizedHeader = normalizeHeader(header);

  if (normalizedHeader === "paciente" || normalizedHeader === "cliente") {
    return "patient_name";
  }
  if (normalizedHeader.includes("telefone") || normalizedHeader.includes("celular")) {
    return "phone";
  }
  if (normalizedHeader.includes("procedimento") || normalizedHeader.includes("tratamento")) {
    return "treatment";
  }
  if (normalizedHeader === "valor" || normalizedHeader === "valor do orcamento") {
    return "budget_value";
  }
  if (normalizedHeader === "data criacao" || normalizedHeader === "data do orcamento") {
    return "budget_date";
  }
  if (normalizedHeader === "motivo" || normalizedHeader.includes("objecao")) {
    return "raw_objection";
  }
  if (normalizedHeader.includes("observacao")) {
    return "notes";
  }
  if (normalizedHeader.includes("referencia") || normalizedHeader.includes("crm")) {
    return "external_reference";
  }

  return "IGNORE";
}
