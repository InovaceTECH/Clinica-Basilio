import "server-only";

import * as XLSX from "xlsx";

import {
  importFileMetadataSchema,
  type ImportPreview,
} from "@/schemas/import-preview";

const supportedExtensions = new Set(["csv", "xlsx"]);
const supportedMimeTypes = new Set([
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);
const maxRows = 10_000;
const maxColumns = 100;
const previewRowCount = 20;
const maxCellLength = 500;

export type ImportFile = {
  name: string;
  size: number;
  type: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

export type ParsedImportFile = {
  fileName: string;
  sheetName: string;
  headers: string[];
  rows: Array<{
    rowNumber: number;
    values: string[];
  }>;
};

export class ImportPreviewError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImportPreviewError";
  }
}

function getExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function normalizeCell(value: unknown) {
  return String(value ?? "").trim().slice(0, maxCellLength);
}

function normalizeHeaders(values: unknown[]) {
  const counts = new Map<string, number>();

  return values.map((value, index) => {
    const baseHeader = normalizeCell(value) || `Coluna ${index + 1}`;
    const count = (counts.get(baseHeader) ?? 0) + 1;
    counts.set(baseHeader, count);

    return count === 1 ? baseHeader : `${baseHeader} (${count})`;
  });
}

function getFirstNonEmptyRowIndex(rows: unknown[][]) {
  return rows.findIndex((row) => row.some((cell) => normalizeCell(cell) !== ""));
}

export async function readImportFile(file: ImportFile): Promise<ParsedImportFile> {
  const metadata = importFileMetadataSchema.parse({
    name: file.name,
    size: file.size,
    type: file.type,
  });
  const extension = getExtension(metadata.name);

  if (!supportedExtensions.has(extension)) {
    throw new ImportPreviewError("Selecione um arquivo CSV ou XLSX.");
  }

  if (metadata.type && !supportedMimeTypes.has(metadata.type)) {
    throw new ImportPreviewError("O tipo do arquivo selecionado não é suportado.");
  }

  let workbook: XLSX.WorkBook;

  try {
    workbook = XLSX.read(await file.arrayBuffer(), {
      cellDates: true,
      raw: false,
      type: "array",
    });
  } catch {
    throw new ImportPreviewError("Não foi possível ler este arquivo. Verifique o formato e tente novamente.");
  }

  const sheetName = workbook.SheetNames.find((name) => workbook.Sheets[name]?.["!ref"]);

  if (!sheetName) {
    throw new ImportPreviewError("A planilha não possui dados para visualizar.");
  }

  const worksheet = workbook.Sheets[sheetName];
  const rangeReference = worksheet["!ref"];

  if (!rangeReference) {
    throw new ImportPreviewError("A planilha não possui dados para visualizar.");
  }

  const range = XLSX.utils.decode_range(rangeReference);
  const rowCount = range.e.r - range.s.r + 1;
  const columnCount = range.e.c - range.s.c + 1;

  if (rowCount > maxRows || columnCount > maxColumns) {
    throw new ImportPreviewError(
      "A planilha excede o limite de 10.000 linhas ou 100 colunas para prévia.",
    );
  }

  const values = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    blankrows: true,
    defval: "",
    header: 1,
    raw: false,
  });
  const headerRowIndex = getFirstNonEmptyRowIndex(values);

  if (headerRowIndex === -1) {
    throw new ImportPreviewError("A planilha não possui cabeçalhos para importar.");
  }

  const headers = normalizeHeaders(values[headerRowIndex]);
  const dataRows = values
    .slice(headerRowIndex + 1)
    .map((row, rowIndex) => ({
      rowNumber: range.s.r + headerRowIndex + rowIndex + 2,
      values: headers.map((_, index) => normalizeCell(row[index])),
    }))
    .filter((row) => row.values.some((cell) => cell !== ""));

  return {
    fileName: metadata.name,
    sheetName,
    headers,
    rows: dataRows,
  };
}

export async function createImportPreview(file: ImportFile): Promise<ImportPreview> {
  const parsedFile = await readImportFile(file);

  return {
    fileName: parsedFile.fileName,
    headers: parsedFile.headers,
    rows: parsedFile.rows.slice(0, previewRowCount).map((row) => row.values),
    sheetName: parsedFile.sheetName,
    totalRows: parsedFile.rows.length,
  };
}
