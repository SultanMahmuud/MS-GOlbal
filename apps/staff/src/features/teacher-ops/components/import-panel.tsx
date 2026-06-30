"use client";

import { useState } from "react";
import { DatabaseZap, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { Button } from "@/features/teacher-ops/components/ui/button";

type ImportResult = {
  sheetName: string;
  teacher: { id: string; name: string };
  summary: {
    studentCount: number;
    progressRows: number;
    bookedSlots: number;
  };
};

export function ImportPanel() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/teacher-ops/import-sheet", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setResult(await response.json());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <p className="text-sm text-zinc-500">Import tool</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
          Validate teacher profile workbook
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Upload the current Google Sheet export once. The parser reads the
          teacher profile, student roster, schedule grid, and progress notes into
          the normalized app shape.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-6"
      >
        <div className="flex items-start gap-4">
          <span className="rounded-md border border-zinc-800 bg-zinc-900 p-3 text-emerald-300">
            <FileSpreadsheet className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <label className="block text-sm font-medium text-zinc-200">
              XLSX file
            </label>
            <input
              name="file"
              type="file"
              accept=".xlsx"
              required
              className="mt-3 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:text-zinc-100"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Validate import
          </Button>
          <p className="text-xs text-zinc-500">
            Production mode should save validated rows to Supabase inside one
            transaction.
          </p>
        </div>
      </form>

      {error ? (
        <div className="mt-4 rounded-lg border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {result ? (
        <section className="mt-6 rounded-lg border border-emerald-800 bg-emerald-950/30 p-5">
          <div className="flex items-center gap-2 text-emerald-200">
            <DatabaseZap className="h-5 w-5" />
            <h2 className="font-semibold">Import shape validated</h2>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-4">
            <div>
              <dt className="text-xs text-zinc-500">Sheet</dt>
              <dd className="mt-1 font-medium text-zinc-50">{result.sheetName}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Teacher</dt>
              <dd className="mt-1 font-medium text-zinc-50">
                {result.teacher.name || result.teacher.id}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Students</dt>
              <dd className="mt-1 font-medium text-zinc-50">
                {result.summary.studentCount}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Booked slots</dt>
              <dd className="mt-1 font-medium text-zinc-50">
                {result.summary.bookedSlots}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}
    </div>
  );
}
