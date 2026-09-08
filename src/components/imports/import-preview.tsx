"use client";

import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { CheckCircle2, FileSpreadsheet, LoaderCircle, Trash2, TriangleAlert, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImportColumnMapper } from "@/components/imports/import-column-mapper";
import { type ImportColumnMapping } from "@/schemas/import-mapping";
import {
  type ImportCommitResult,
  importCommitResultSchema,
} from "@/schemas/import-persistence";
import { type ImportPreview, importPreviewSchema } from "@/schemas/import-preview";

type PreviewResponse = ImportPreview | { message: string };
type CommitResponse = ImportCommitResult | { message: string };

function formatFileSize(size: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
    style: "unit",
    unit: "megabyte",
    unitDisplay: "narrow",
  }).format(size / (1024 * 1024));
}

export function ImportPreview() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [mapping, setMapping] = useState<ImportColumnMapping | null>(null);
  const [commitResult, setCommitResult] = useState<ImportCommitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [commitError, setCommitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const hasOnlyFailedRows = Boolean(
    commitResult
      && commitResult.status === "COMPLETED_WITH_ERRORS"
      && commitResult.failedRows === commitResult.totalRows,
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setPreview(null);
    setMapping(null);
    setCommitResult(null);
    setError(null);
    setCommitError(null);
  }

  function handleRemoveFile() {
    setFile(null);
    setPreview(null);
    setMapping(null);
    setCommitResult(null);
    setError(null);
    setCommitError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Selecione uma planilha CSV ou XLSX para continuar.");
      return;
    }

    setError(null);
    setPreview(null);
    setMapping(null);
    setCommitResult(null);
    setCommitError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch("/api/imports/preview", {
        body: formData,
        method: "POST",
      });
      const payload = (await response.json()) as PreviewResponse;

      if (!response.ok) {
        setError("message" in payload ? payload.message : "Não foi possível ler a planilha.");
        return;
      }

      const parsedPreview = importPreviewSchema.safeParse(payload);

      if (!parsedPreview.success) {
        setError("A prévia retornada não pôde ser validada. Tente novamente.");
        return;
      }

      setPreview(parsedPreview.data);
    } catch {
      setError("Não foi possível ler a planilha. Verifique sua conexão e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCommit() {
    if (!file || !mapping) {
      setCommitError("Confirme o mapeamento antes de iniciar a importação.");
      return;
    }

    setCommitError(null);
    setCommitResult(null);
    setIsImporting(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("mapping", JSON.stringify(mapping));

      const response = await fetch("/api/imports/commit", {
        body: formData,
        method: "POST",
      });
      const payload = (await response.json()) as CommitResponse;

      if (!response.ok) {
        setCommitError("message" in payload ? payload.message : "Não foi possível concluir a importação.");
        return;
      }

      const parsedResult = importCommitResultSchema.safeParse(payload);

      if (!parsedResult.success) {
        setCommitError("O resultado da importação não pôde ser validado. Tente novamente.");
        return;
      }

      setCommitResult(parsedResult.data);
    } catch {
      setCommitError("Não foi possível concluir a importação. Verifique sua conexão e tente novamente.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>1. Escolha o arquivo</CardTitle>
          <p className="text-body-sm text-text-muted">Envie uma planilha CSV ou XLSX de até 10 MB.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label
              className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface-secondary px-4 py-6 text-center outline-none transition-colors hover:bg-surface-hover has-[:focus-visible]:border-primary has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-primary/15"
              htmlFor="import-file"
            >
              <span className="grid size-10 place-items-center rounded-md bg-info-bg text-info">
                <FileSpreadsheet aria-hidden="true" className="size-5" />
              </span>
              <span className="mt-3 text-body-sm font-medium text-foreground">Selecione uma planilha</span>
              <span className="mt-1 text-caption text-text-muted">CSV ou XLSX</span>
              <Input
                accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="sr-only"
                id="import-file"
                ref={fileInputRef}
                name="file"
                onChange={handleFileChange}
                type="file"
              />
            </label>

            {file ? (
              <div className="flex flex-col gap-3 rounded-md border border-border bg-surface px-3 py-2 text-body-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center justify-between gap-3 sm:flex-1">
                  <span className="min-w-0 truncate font-medium text-foreground">{file.name}</span>
                  <span className="shrink-0 text-text-muted">{formatFileSize(file.size)}</span>
                </div>
                <Button
                  disabled={isLoading || isImporting}
                  onClick={handleRemoveFile}
                  size="sm"
                  type="button"
                  variant="destructive"
                >
                  <Trash2 aria-hidden="true" />
                  Remover arquivo
                </Button>
              </div>
            ) : null}

            {error ? (
              <p aria-live="polite" className="text-body-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}

            <Button disabled={!file || isLoading} type="submit">
              {isLoading ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Upload aria-hidden="true" />}
              {isLoading ? "Lendo planilha..." : "Visualizar dados"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {preview ? (
        <>
        <Card>
          <CardHeader>
            <CardTitle>Prévia dos dados</CardTitle>
            <p className="text-body-sm text-text-muted">
              Aba {preview.sheetName} · exibindo {preview.rows.length} de {preview.totalRows} linhas.
            </p>
          </CardHeader>
          <CardContent>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-max border-collapse text-left text-body-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary text-label text-text-muted">
                    {preview.headers.map((header) => (
                      <th className="px-3 py-2 font-medium" key={header} scope="col">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, rowIndex) => (
                    <tr className="border-b border-border last:border-b-0" key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td className="max-w-64 truncate px-3 py-3 text-text-secondary" key={`${rowIndex}-${cellIndex}`} title={cell}>
                          {cell || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 sm:hidden">
              {preview.rows.map((row, rowIndex) => (
                <div className="rounded-md border border-border p-3" key={rowIndex}>
                  {preview.headers.map((header, cellIndex) => (
                    <div className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-3 py-1" key={header}>
                      <span className="text-caption font-medium text-text-muted">{header}</span>
                      <span className="truncate text-body-sm text-text-secondary" title={row[cellIndex]}>
                        {row[cellIndex] || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <p className="mt-6 text-body-sm text-text-muted">
              Esta etapa mostra apenas uma prévia. Nenhum registro foi salvo.
            </p>
          </CardContent>
        </Card>
        <ImportColumnMapper
          key={`${preview.fileName}-${preview.sheetName}`}
          onConfirmedMappingChange={(confirmedMapping) => {
            setMapping(confirmedMapping);
            setCommitResult(null);
            setCommitError(null);
          }}
          preview={preview}
        />

        {mapping ? (
          <Card>
            <CardHeader>
              <CardTitle>3. Revise e importe</CardTitle>
              <p className="text-body-sm text-text-muted">
                Serão avaliadas {preview.totalRows} linhas. Linhas já importadas serão ignoradas; conflitos e dados inválidos ficarão registrados para revisão.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 text-body-sm sm:grid-cols-3">
                <div className="rounded-md border border-border bg-surface-secondary p-3">
                  <p className="text-text-muted">Arquivo</p>
                  <p className="mt-1 truncate font-medium text-foreground" title={file?.name}>{file?.name}</p>
                </div>
                <div className="rounded-md border border-border bg-surface-secondary p-3">
                  <p className="text-text-muted">Aba</p>
                  <p className="mt-1 font-medium text-foreground">{preview.sheetName}</p>
                </div>
                <div className="rounded-md border border-border bg-surface-secondary p-3">
                  <p className="text-text-muted">Linhas a revisar</p>
                  <p className="mt-1 font-medium text-foreground">{preview.totalRows}</p>
                </div>
              </div>

              {commitError ? <p aria-live="polite" className="text-body-sm text-danger" role="alert">{commitError}</p> : null}

              <Button disabled={isImporting} onClick={handleCommit} type="button">
                {isImporting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <Upload aria-hidden="true" />}
                {isImporting ? "Importando registros..." : `Confirmar e importar ${preview.totalRows} registros`}
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {commitResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Resultado da importação</CardTitle>
              <p className="text-body-sm text-text-muted">
                {commitResult.status === "COMPLETED"
                  ? "A importação foi concluída sem erros."
                  : "A importação foi concluída, mas algumas linhas precisam de revisão."}
              </p>
            </CardHeader>
            <CardContent>
              <div
                className={
                  commitResult.status === "COMPLETED"
                    ? "flex gap-3 rounded-md border border-success-border bg-success-bg p-4 text-body-sm text-success"
                    : hasOnlyFailedRows
                      ? "flex gap-3 rounded-md border border-danger-border bg-danger-bg p-4 text-body-sm text-danger"
                      : "flex gap-3 rounded-md border border-warning-border bg-warning-bg p-4 text-body-sm text-warning"
                }
                role="status"
              >
                {commitResult.status === "COMPLETED" ? (
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                )}
                <p>{commitResult.importedRows} importadas · {commitResult.skippedRows} já existentes · {commitResult.failedRows} com erro.</p>
              </div>
            </CardContent>
          </Card>
        ) : null}
        </>
      ) : null}
    </div>
  );
}
