"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  importColumnMappingSchema,
  importDestinationFields,
  suggestImportField,
  type ImportDestinationField,
  type ImportColumnMapping,
} from "@/schemas/import-mapping";
import { type ImportPreview } from "@/schemas/import-preview";

type ImportColumnMapperProps = {
  onConfirmedMappingChange: (mapping: ImportColumnMapping | null) => void;
  preview: ImportPreview;
};

function getSample(preview: ImportPreview, headerIndex: number) {
  return preview.rows.find((row) => row[headerIndex])?.[headerIndex] || "Sem amostra";
}

export function ImportColumnMapper({ onConfirmedMappingChange, preview }: ImportColumnMapperProps) {
  const initialMapping = useMemo(
    () =>
      Object.fromEntries(
        preview.headers.map((header) => [header, suggestImportField(header)]),
      ) as Record<string, ImportDestinationField>,
    [preview.headers],
  );
  const [mapping, setMapping] = useState(initialMapping);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  function updateMapping(header: string, field: ImportDestinationField) {
    setMapping((current) => ({ ...current, [header]: field }));
    setError(null);
    setIsConfirmed(false);
    onConfirmedMappingChange(null);
  }

  function confirmMapping() {
    const result = importColumnMappingSchema.safeParse(
      preview.headers.map((header) => ({ field: mapping[header], header })),
    );

    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Revise o mapeamento antes de continuar.");
      return;
    }

    setError(null);
    setIsConfirmed(true);
    onConfirmedMappingChange(result.data);
  }

  const mappedFields = Object.values(mapping).filter((field) => field !== "IGNORE");

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Mapeie as colunas</CardTitle>
        <p className="text-body-sm text-text-muted">
          Relacione cada coluna da planilha a um campo do sistema. Campos obrigatórios estão identificados.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[42rem] border-collapse text-left text-body-sm">
            <thead>
              <tr className="border-b border-border bg-surface-secondary text-label text-text-muted">
                <th className="px-3 py-2 font-medium" scope="col">Coluna da planilha</th>
                <th className="px-3 py-2 font-medium" scope="col">Amostra</th>
                <th className="px-3 py-2 font-medium" scope="col">Campo do sistema</th>
              </tr>
            </thead>
            <tbody>
              {preview.headers.map((header, index) => (
                <MappingRow
                  field={mapping[header]}
                  header={header}
                  key={header}
                  mappedFields={mappedFields}
                  onChange={updateMapping}
                  sample={getSample(preview, index)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 sm:hidden">
          {preview.headers.map((header, index) => (
            <div className="space-y-3 rounded-md border border-border p-4" key={header}>
              <div>
                <p className="text-label font-medium text-foreground">{header}</p>
                <p className="mt-1 truncate text-body-sm text-text-muted" title={getSample(preview, index)}>
                  {getSample(preview, index)}
                </p>
              </div>
              <FieldSelect
                field={mapping[header]}
                header={header}
                mappedFields={mappedFields}
                onChange={updateMapping}
              />
            </div>
          ))}
        </div>

        {error ? <p className="text-body-sm text-danger" role="alert">{error}</p> : null}

        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-text-muted">A confirmação não salva dados nesta etapa.</p>
          <Button onClick={confirmMapping} type="button">
            Confirmar mapeamento
          </Button>
        </div>

        {isConfirmed ? (
          <div className="flex gap-3 rounded-md border border-success-border bg-success-bg p-4 text-body-sm text-success" role="status">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <p>Mapeamento confirmado. Revise o resumo abaixo antes de iniciar a importação.</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

type MappingRowProps = {
  field: ImportDestinationField;
  header: string;
  mappedFields: ImportDestinationField[];
  onChange: (header: string, field: ImportDestinationField) => void;
  sample: string;
};

function MappingRow({ field, header, mappedFields, onChange, sample }: MappingRowProps) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="px-3 py-3 font-medium text-foreground">{header}</td>
      <td className="max-w-64 truncate px-3 py-3 text-text-secondary" title={sample}>{sample}</td>
      <td className="w-64 px-3 py-3">
        <FieldSelect field={field} header={header} mappedFields={mappedFields} onChange={onChange} />
      </td>
    </tr>
  );
}

type FieldSelectProps = Omit<MappingRowProps, "sample">;

function FieldSelect({ field, header, mappedFields, onChange }: FieldSelectProps) {
  return (
    <Select onValueChange={(value) => onChange(header, value as ImportDestinationField)} value={field}>
      <SelectTrigger aria-label={`Campo do sistema para a coluna ${header}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="IGNORE">Ignorar coluna</SelectItem>
        {importDestinationFields.map((destination) => {
          const isSelectedElsewhere = destination.value !== field && mappedFields.includes(destination.value);

          return (
            <SelectItem disabled={isSelectedElsewhere} key={destination.value} value={destination.value}>
              <span>{destination.label}</span>
              {destination.required ? <Badge className="ml-2" variant="info">Obrigatório</Badge> : null}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
