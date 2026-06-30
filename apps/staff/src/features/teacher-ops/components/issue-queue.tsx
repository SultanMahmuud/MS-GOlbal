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
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="flex items-start gap-3">
              <span className="rounded-md border border-zinc-800 bg-zinc-900 p-2 text-zinc-300">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-zinc-50">{issue.title}</h3>
                  <Badge tone={priorityTone[issue.priority]}>
                    {issue.priority}
                  </Badge>
                  <Badge tone={issue.status === "resolved" ? "success" : "info"}>
                    {statusLabel(issue.status)}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-zinc-400">{issue.description}</p>
                <p className="mt-3 text-xs text-zinc-600">
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
