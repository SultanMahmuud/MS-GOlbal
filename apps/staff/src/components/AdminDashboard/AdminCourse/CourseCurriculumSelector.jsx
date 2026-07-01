"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getApiBaseUrl, getBrandHeaders } from "@/lib/brand-config";

const statusClass = {
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
};

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const countItems = (curriculum) =>
  (curriculum?.semesters || []).reduce(
    (semesterTotal, semester) =>
      semesterTotal +
      (semester.modules || []).reduce(
        (moduleTotal, module) => moduleTotal + (module.items || []).length,
        0
      ),
    0
  );

export default function CourseCurriculumSelector({
  selectedCurriculumId,
  setSelectedCurriculumId,
}) {
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCurriculums() {
      setLoading(true);
      try {
        const response = await fetch(`${getApiBaseUrl()}/curriculums?status=all`, {
          headers: { ...getBrandHeaders(), ...getAuthHeaders() },
          cache: "no-store",
        });
        const body = await response.json();
        if (!response.ok || body?.success === false) {
          throw new Error(body?.error || "Could not load curriculums");
        }
        if (isMounted) {
          setCurriculums(body.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Could not load curriculums");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCurriculums();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedCurriculum = useMemo(
    () => curriculums.find((item) => item._id === selectedCurriculumId),
    [curriculums, selectedCurriculumId]
  );

  return (
    <section className="mb-6 rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Central Curriculum
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">
            Select paid learning curriculum
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Course page public information stays separate. Students see this selected
            curriculum after purchase or assignment.
          </p>
        </div>
        <Link
          href="/dashboard/admin/curriculum-management"
          className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800"
        >
          Open Builder
        </Link>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div>
          <label className="text-sm font-medium text-slate-700">Existing curriculum</label>
          <select
            value={selectedCurriculumId || ""}
            onChange={(event) => setSelectedCurriculumId(event.target.value)}
            className="mt-2 h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">No central curriculum selected</option>
            {curriculums.map((curriculum) => (
              <option key={curriculum._id} value={curriculum._id}>
                {curriculum.title} - v{curriculum.version || 1} ({curriculum.status})
              </option>
            ))}
          </select>
          {loading ? <p className="mt-2 text-xs text-slate-500">Loading curriculums...</p> : null}
          {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-3">
          {selectedCurriculum ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {selectedCurriculum.title}
                </p>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] ${
                    statusClass[selectedCurriculum.status] || statusClass.draft
                  }`}
                >
                  {selectedCurriculum.status}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {(selectedCurriculum.semesters || []).length} semester,{" "}
                {countItems(selectedCurriculum)} lesson items
              </p>
            </>
          ) : (
            <p className="text-sm leading-6 text-slate-500">
              Choose a central curriculum, or keep using the legacy embedded
              curriculum below during migration.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
