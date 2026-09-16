import "server-only";

import { createHash } from "node:crypto";

import { and, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";

import type { TenantContext } from "@/auth/tenant-context";
import { db, executeBatch } from "@/db";
import { importRows, imports, opportunities, patients } from "@/db/schema";
import {
  commitImportSchema,
  importCommitResultSchema,
  normalizedImportRowSchema,
  type CommitImportInput,
  type ImportCommitResult,
  type NormalizedImportRow,
} from "@/schemas/import-persistence";

import { readImportFile, type ImportFile } from "./preview";
import { calculatePriority } from "@/services/priority/calculate-priority";

export class ImportPersistenceError extends Error {
  constructor(message: string, readonly code = "IMPORT_ERROR") {
    super(message);
    this.name = "ImportPersistenceError";
  }
}

function optionalValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function normalizePhone(value: string | undefined) {
  const digits = value?.replace(/\D/g, "") ?? "";

  if (!digits) {
    return undefined;
  }

  if (/^\d{10,11}$/.test(digits)) {
    return `+55${digits}`;
  }

  if (/^55\d{10,11}$/.test(digits)) {
    return `+${digits}`;
  }

  throw new ImportPersistenceError("O telefone possui um formato inválido.", "INVALID_PHONE");
}

function parseMoney(value: string | undefined) {
  const source = value?.trim() ?? "";

  if (!source) {
    return Number.NaN;
  }

  const numeric = source
    .replace(/^R\$\s*/i, "")
    .replace(/\s/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  return Number(numeric);
}

function parseDate(value: string | undefined) {
  const source = value?.trim() ?? "";
  const brazilianDate = source.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (brazilianDate) {
    const [, day, month, year] = brazilianDate;
    const parsedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

    if (
      parsedDate.getUTCFullYear() === Number(year) &&
      parsedDate.getUTCMonth() === Number(month) - 1 &&
      parsedDate.getUTCDate() === Number(day)
    ) {
      return parsedDate;
    }
  }

  const parsedDate = new Date(source);

  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
}

function normalizeNameForMatch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/\s+/g, " ")
    .trim();
}

function extractExternalReference(patientName: string) {
  const match = patientName.match(/\s*\(([^()]{1,160})\)\s*$/);

  return {
    externalReference: match?.[1]?.trim(),
    patientName: patientName.replace(/\s*\([^()]{1,160}\)\s*$/, "").trim(),
  };
}

function sourceFingerprint(row: NormalizedImportRow) {
  return createHash("sha256")
    .update(
      [
        row.externalReference ?? row.phone ?? normalizeNameForMatch(row.patientName),
        normalizeNameForMatch(row.treatment),
        row.budgetDate.toISOString().slice(0, 10),
        row.budgetValue.toFixed(2),
      ].join("|"),
    )
    .digest("hex");
}

function normalizeImportRow(
  headers: string[],
  values: string[],
  mapping: CommitImportInput["mapping"],
) {
  const mappedValues = Object.fromEntries(
    mapping
      .filter((column) => column.field !== "IGNORE")
      .map((column) => [column.field, values[headers.indexOf(column.header)]]),
  );
  const extractedReference = extractExternalReference(
    mappedValues.patient_name ?? "",
  );

  return normalizedImportRowSchema.parse({
    budgetDate: parseDate(mappedValues.budget_date),
    budgetValue: parseMoney(mappedValues.budget_value),
    externalReference:
      optionalValue(mappedValues.external_reference) ?? extractedReference.externalReference,
    notes: optionalValue(mappedValues.notes),
    patientName: extractedReference.patientName,
    phone: normalizePhone(mappedValues.phone),
    rawObjection: optionalValue(mappedValues.raw_objection),
    treatment: optionalValue(mappedValues.treatment),
  });
}

function getSafeImportError(error: unknown) {
  if (error instanceof ImportPersistenceError) {
    return { code: error.code, message: error.message };
  }

  if (error instanceof z.ZodError) {
    return {
      code: "INVALID_ROW",
      message: error.issues[0]?.message ?? "A linha possui dados inválidos.",
    };
  }

  return {
    code: "UNEXPECTED_ERROR",
    message: "Não foi possível processar esta linha.",
  };
}

function hasPatientConflict(
  patient: { name: string; phone: string | null },
  row: NormalizedImportRow,
) {
  return (
    normalizeNameForMatch(patient.name) !== normalizeNameForMatch(row.patientName) ||
    (patient.phone !== null && row.phone !== undefined && patient.phone !== row.phone)
  );
}

async function findExistingPatient(
  tenant: TenantContext,
  row: NormalizedImportRow,
) {
  if (row.externalReference) {
    const [patientByReference] = await db
      .select({ id: patients.id, name: patients.name, phone: patients.phone })
      .from(patients)
      .where(
        and(
          eq(patients.clinicId, tenant.clinicId),
          eq(patients.externalReference, row.externalReference),
        ),
      )
      .limit(1);

    if (patientByReference) {
      if (hasPatientConflict(patientByReference, row)) {
        throw new ImportPersistenceError(
          "A referência externa está associada a dados diferentes de paciente.",
          "PATIENT_CONFLICT",
        );
      }

      return patientByReference;
    }
  }

  if (row.phone) {
    const patientsByPhone = await db
      .select({ id: patients.id, name: patients.name, phone: patients.phone })
      .from(patients)
      .where(and(eq(patients.clinicId, tenant.clinicId), eq(patients.phone, row.phone)))
      .limit(2);

    if (patientsByPhone.length > 1) {
      throw new ImportPersistenceError(
        "O telefone corresponde a mais de um paciente existente.",
        "PATIENT_CONFLICT",
      );
    }

    const [patientByPhone] = patientsByPhone;

    if (patientByPhone) {
      if (hasPatientConflict(patientByPhone, row)) {
        throw new ImportPersistenceError(
          "O telefone está associado a dados diferentes de paciente.",
          "PATIENT_CONFLICT",
        );
      }

      return patientByPhone;
    }
  }

  return undefined;
}

export async function persistImport(
  tenant: TenantContext,
  file: ImportFile,
  input: CommitImportInput,
): Promise<ImportCommitResult> {
  const validatedInput = commitImportSchema.parse(input);
  const parsedFile = await readImportFile(file);
  const mappedHeaders = new Set(validatedInput.mapping.map((column) => column.header));

  if (
    mappedHeaders.size !== validatedInput.mapping.length ||
    validatedInput.mapping.some((column) => !parsedFile.headers.includes(column.header))
  ) {
    throw new ImportPersistenceError("O mapeamento não corresponde às colunas da planilha.", "INVALID_MAPPING");
  }

  const [importRecord] = await db
    .insert(imports)
    .values({
      clinicId: tenant.clinicId,
      columnMapping: validatedInput.mapping,
      fileName: parsedFile.fileName,
      sheetName: parsedFile.sheetName,
      status: "PROCESSING",
      totalRows: parsedFile.rows.length,
      userId: tenant.userId,
    })
    .returning({ id: imports.id });

  let importedRows = 0;
  let skippedRows = 0;
  let failedRows = 0;

  for (const row of parsedFile.rows) {
    let fingerprint: string | undefined;

    try {
      const normalizedRow = normalizeImportRow(
        parsedFile.headers,
        row.values,
        validatedInput.mapping,
      );
      const calculatedFingerprint = sourceFingerprint(normalizedRow);
      fingerprint = calculatedFingerprint;
      const patient = await findExistingPatient(tenant, normalizedRow);
      const [existingOpportunity] = await db
        .select({ id: opportunities.id, patientId: opportunities.patientId })
        .from(opportunities)
        .where(
          and(
            eq(opportunities.clinicId, tenant.clinicId),
            eq(opportunities.sourceFingerprint, calculatedFingerprint),
          ),
        )
        .limit(1);

      const [existingOpportunityForPatient] = patient
        ? await db
            .select({ id: opportunities.id, patientId: opportunities.patientId })
            .from(opportunities)
            .where(
              and(
                eq(opportunities.clinicId, tenant.clinicId),
                eq(opportunities.patientId, patient.id),
                ilike(opportunities.treatment, normalizedRow.treatment),
              ),
            )
            .limit(1)
        : [];

      if (existingOpportunity || existingOpportunityForPatient) {
        const opportunityToSkip = existingOpportunity ?? existingOpportunityForPatient;

        if (!patient || patient.id !== opportunityToSkip.patientId) {
          throw new ImportPersistenceError(
            "Não foi possível confirmar que o orçamento existente pertence ao mesmo paciente. Revise a identificação.",
            "PATIENT_CONFLICT",
          );
        }

        await db.insert(importRows).values({
          clinicId: tenant.clinicId,
          importId: importRecord.id,
          rowNumber: row.rowNumber,
          sourceFingerprint: calculatedFingerprint,
          status: "SKIPPED",
        });
        skippedRows += 1;
        continue;
      }

      const priority = calculatePriority({
        budgetDate: normalizedRow.budgetDate,
        budgetValue: normalizedRow.budgetValue,
      });
      const auditValues = {
        clinicId: tenant.clinicId,
        importId: importRecord.id,
        rowNumber: row.rowNumber,
        sourceFingerprint: calculatedFingerprint,
        status: "IMPORTED" as const,
      };

      if (patient) {
        await executeBatch(db => [
          db.insert(opportunities).values({
            budgetDate: normalizedRow.budgetDate,
            budgetValue: normalizedRow.budgetValue.toFixed(2),
            clinicId: tenant.clinicId,
            notes: normalizedRow.notes ?? null,
            patientId: patient.id,
            rawObjection: normalizedRow.rawObjection ?? null,
            priority: priority.priority,
            priorityScore: priority.score,
            sourceFingerprint: calculatedFingerprint,
            status: "FOLLOW_UP_SCHEDULED",
            treatment: normalizedRow.treatment,
          }),
          db.insert(importRows).values(auditValues),
        ] as const);
      } else {
        const createPatientAndOpportunity = sql`
          WITH created_patient AS (
            INSERT INTO "patients" ("clinic_id", "name", "phone", "external_reference")
            VALUES (${tenant.clinicId}, ${normalizedRow.patientName}, ${normalizedRow.phone ?? null}, ${normalizedRow.externalReference ?? null})
            RETURNING "id"
          )
          INSERT INTO "opportunities" ("clinic_id", "patient_id", "treatment", "budget_value", "budget_date", "raw_objection", "notes", "priority_score", "priority", "source_fingerprint", "status")
          SELECT ${tenant.clinicId}, ${sql.raw('"created_patient"."id"')}, ${normalizedRow.treatment}, ${normalizedRow.budgetValue.toFixed(2)}, ${normalizedRow.budgetDate}, ${normalizedRow.rawObjection ?? null}, ${normalizedRow.notes ?? null}, ${priority.score}, ${priority.priority}, ${calculatedFingerprint}, ${"FOLLOW_UP_SCHEDULED"}
          FROM created_patient
        `;

        await executeBatch(db => [db.execute(createPatientAndOpportunity), db.insert(importRows).values(auditValues)] as const);
      }

      importedRows += 1;
    } catch (error) {
      const safeError = getSafeImportError(error);

      await db.insert(importRows).values({
        clinicId: tenant.clinicId,
        errorCode: safeError.code,
        errorMessage: safeError.message,
        importId: importRecord.id,
        rowNumber: row.rowNumber,
        sourceFingerprint: fingerprint ?? null,
        status: "FAILED",
      });
      failedRows += 1;
    }
  }

  const status = failedRows > 0 ? "COMPLETED_WITH_ERRORS" : "COMPLETED";
  await db
    .update(imports)
    .set({
      completedAt: new Date(),
      failedRows,
      importedRows,
      skippedRows,
      status,
    })
    .where(and(eq(imports.id, importRecord.id), eq(imports.clinicId, tenant.clinicId)));

  return importCommitResultSchema.parse({
    failedRows,
    importId: importRecord.id,
    importedRows,
    skippedRows,
    status,
    totalRows: parsedFile.rows.length,
  });
}
