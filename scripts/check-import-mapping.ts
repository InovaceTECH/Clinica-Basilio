import assert from "node:assert/strict";

import {
  importColumnMappingSchema,
  suggestImportField,
} from "../src/schemas/import-mapping";

const headers = [
  "Paciente",
  "Telefone",
  "Procedimentos",
  "Valor",
  "Data Criação",
  "Motivo",
  "Observações",
];

const suggestedMapping = headers.map((header) => ({
  field: suggestImportField(header),
  header,
}));

assert.equal(importColumnMappingSchema.safeParse(suggestedMapping).success, true);
assert.equal(
  importColumnMappingSchema.safeParse([
    { field: "patient_name", header: "Paciente" },
    { field: "patient_name", header: "Cliente" },
  ]).success,
  false,
);
assert.equal(
  importColumnMappingSchema.safeParse([
    { field: "patient_name", header: "Paciente" },
    { field: "IGNORE", header: "Telefone" },
  ]).success,
  false,
);

console.log("Sugestão e validação de mapeamento de colunas aprovadas.");
