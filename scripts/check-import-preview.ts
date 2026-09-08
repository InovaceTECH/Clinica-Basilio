import assert from "node:assert/strict";
import { File } from "node:buffer";
import { readFile } from "node:fs/promises";

import * as XLSX from "xlsx";

import { createImportPreview } from "../src/services/imports/preview";

async function checkImportPreview() {
  const csvPreview = await createImportPreview(
    new File(["Cliente;Telefone;Valor\nAna;11999999999;1200"], "clientes.csv", {
      type: "text/csv",
    }),
  );

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["Paciente", "Procedimentos", "Valor"],
    ["Paciente de teste", "Avaliação", 1200],
  ]);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Follow Up");
  const workbookBytes = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const xlsxPreview = await createImportPreview(
    new File([workbookBytes], "clientes.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  );

  assert.deepEqual(csvPreview.headers, ["Cliente", "Telefone", "Valor"]);
  assert.equal(csvPreview.totalRows, 1);
  assert.equal(xlsxPreview.sheetName, "Follow Up");
  assert.deepEqual(xlsxPreview.headers, ["Paciente", "Procedimentos", "Valor"]);
  assert.equal(xlsxPreview.totalRows, 1);

  const samplePath = process.env.IMPORT_PREVIEW_SAMPLE_PATH;

  if (samplePath) {
    const sampleFile = new File([await readFile(samplePath)], "amostra.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const samplePreview = await createImportPreview(sampleFile);

    assert.ok(samplePreview.headers.length > 0);
    assert.ok(samplePreview.totalRows > 0);
  }

  console.log("Leitura e prévia de CSV e XLSX validadas sem persistência.");
}

void checkImportPreview();
