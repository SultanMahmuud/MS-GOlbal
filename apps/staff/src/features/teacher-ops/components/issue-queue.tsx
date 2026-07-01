import { AlertTriangle, CheckCircle2, Clock4 } from "lucide-react";
import { Badge } from "@/features/teacher-ops/components/ui/badge";
import type { Issue } from "@/features/teacher-ops/lib/types";
import { statusLabel } from "@/features/teacher-ops/lib/utils";

const priorityTone = {
  high: "danger",
  medium: "warning",
  low: "neutral",
} as const;

export function IssueQueue({ issues }: { issues: Issue[] }) {
  return (
    <div className="space-y-3">
      {issues.map((issue) => {
        const Icon =
          issue.status === "resolved"
            ? CheckCircle2
            : issue.priority === "high"
              ? AlertTriangle
              : Clock4;
        return (
          <article
            key={issue.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-start gap-3">
              <span className="rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-slate-950 dark:text-zinc-50">{issue.title}</h3>
                  <Badge tone={priorityTone[issue.priority]}>
                    {issue.priority}
                  </Badge>
                  <Badge tone={issue.status === "resolved" ? "success" : "info"}>
                    {statusLabel(issue.status)}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">{issue.description}</p>
                <p className="mt-3 text-xs text-slate-500 dark:text-zinc-500">
                  {issue.studentName ? `${issue.studentName} - ` : ""}
                  {issue.source} - {issue.createdAt}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
