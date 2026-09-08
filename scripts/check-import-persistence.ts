import assert from "node:assert/strict";
import { Buffer, File } from "node:buffer";
import { randomUUID } from "node:crypto";

import { and, eq, inArray } from "drizzle-orm";
import * as XLSX from "xlsx";

import { parseTenantContext } from "../src/auth/tenant-context";
import { db } from "../src/db";
import {
  clinics,
  importRows,
  imports,
  opportunities,
  patients,
  users,
} from "../src/db/schema";
import { importColumnMappingSchema } from "../src/schemas/import-mapping";
import { persistImport } from "../src/services/imports/persist";

async function checkImportPersistence() {
  const clinicId = randomUUID();
  const managerId = randomUUID();
  const mapping = importColumnMappingSchema.parse([
    { field: "patient_name", header: "Paciente" },
    { field: "phone", header: "Telefone" },
    { field: "treatment", header: "Procedimentos" },
    { field: "budget_value", header: "Valor" },
    { field: "budget_date", header: "Data Criação" },
    { field: "raw_objection", header: "Motivo" },
    { field: "notes", header: "Observações" },
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ["Paciente", "Telefone", "Procedimentos", "Valor", "Data Criação", "Motivo", "Observações"],
      ["Ana da Silva (crm-1)", "(11) 99999-9999", "Implante", "1.200,00", "20/08/2026", "Financeiro", "Retornar em setembro"],
      ["Ana da Silva (crm-1)", "(11) 99999-9999", "Implante", "1.200,00", "20/08/2026", "Financeiro", "Retornar em setembro"],
      [],
      ["Bruno Souza (crm-2)", "(11) 98888-8888", "Avaliação", "", "21/08/2026", "", ""],
      ["Ana Maria (crm-1)", "(11) 97777-7777", "Ortodontia", "900,00", "22/08/2026", "", ""],
      ["Ana Maria (crm-1)", "(11) 97777-7777", "Implante", "1.200,00", "20/08/2026", "", ""],
      ["Carla Silva", "(11) 97777-7777", "Implante", "1.200,00", "20/08/2026", "", ""],
      ["Daniel Silva", "(11) 97777-7777", "Implante", "1.200,00", "20/08/2026", "", ""],
      ["Carla Silva", "(11) 97777-7777", "Implante", "1.200,00", "20/08/2026", "", ""],
      ["Elisa Silva", "", "Implante", "1.200,00", "20/08/2026", "", ""],
      ["Elisa Silva", "", "Implante", "1.200,00", "20/08/2026", "", ""],
      ["Outra pessoa (+5511977777777)", "", "Implante", "1.200,00", "20/08/2026", "", ""],
    ]),
    "Follow Up",
  );
  const file = new File(
    [Buffer.from(XLSX.write(workbook, { bookType: "xlsx", type: "array" }))],
    "importacao-teste.xlsx",
    { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  );

  try {
    await db.insert(clinics).values({ id: clinicId, name: "Import persistence check" });
    await db.insert(users).values({
      id: managerId,
      clinicId,
      name: "Import manager",
      email: `import-${randomUUID()}@example.invalid`,
      role: "MANAGER",
    });

    const tenant = parseTenantContext({
      userId: managerId,
      clinicId,
      role: "MANAGER",
    });
    const result = await persistImport(tenant, file, { mapping });
    const [storedPatient] = await db
      .select({ id: patients.id, externalReference: patients.externalReference, phone: patients.phone })
      .from(patients)
      .where(and(eq(patients.clinicId, clinicId), eq(patients.externalReference, "crm-1")));
    const [storedOpportunity] = await db
      .select({ notes: opportunities.notes, status: opportunities.status })
      .from(opportunities)
      .where(and(eq(opportunities.clinicId, clinicId), eq(opportunities.patientId, storedPatient.id)));
    const rows = await db
      .select({ rowNumber: importRows.rowNumber, status: importRows.status, errorCode: importRows.errorCode })
      .from(importRows)
      .where(and(eq(importRows.importId, result.importId), eq(importRows.clinicId, clinicId)));

    assert.equal(result.totalRows, 11);
    assert.equal(result.importedRows, 3);
    assert.equal(result.skippedRows, 2);
    assert.equal(result.failedRows, 6);
    assert.equal(result.status, "COMPLETED_WITH_ERRORS");
    assert.equal(storedPatient?.externalReference, "crm-1");
    assert.equal(storedPatient?.phone, "+5511999999999");
    assert.equal(storedOpportunity?.notes, "Retornar em setembro");
    assert.equal(storedOpportunity?.status, "FOLLOW_UP_SCHEDULED");
    assert.deepEqual(
      rows
        .map((row) => `${row.rowNumber}:${row.status}`)
        .sort(),
      ["2:IMPORTED", "3:SKIPPED", "5:FAILED", "6:FAILED", "7:FAILED", "8:IMPORTED", "9:FAILED", "10:SKIPPED", "11:IMPORTED", "12:FAILED", "13:FAILED"].sort(),
    );
    for (const rowNumber of [6, 7, 9, 12, 13]) {
      assert.equal(rows.find(row => row.rowNumber === rowNumber)?.errorCode, "PATIENT_CONFLICT");
    }

    console.log("Importação idempotente validada; conflitos de identidade, telefone compartilhado e identificação só por nome exigem revisão.");
  } finally {
    await db.delete(importRows).where(eq(importRows.clinicId, clinicId));
    await db.delete(opportunities).where(eq(opportunities.clinicId, clinicId));
    await db.delete(patients).where(eq(patients.clinicId, clinicId));
    await db.delete(imports).where(eq(imports.clinicId, clinicId));
    await db.delete(users).where(inArray(users.id, [managerId]));
    await db.delete(clinics).where(inArray(clinics.id, [clinicId]));
  }
}

void checkImportPersistence();
