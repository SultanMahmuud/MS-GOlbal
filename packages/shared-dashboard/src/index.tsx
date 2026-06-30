import type { ReactNode } from "react";

export function StudentDashboardShell({
  brandName,
  children
}: {
  brandName: string;
  children: ReactNode;
}) {
  return (
    <main className="student-dashboard-shell">
      <header>
        <p>Student Dashboard</p>
        <h1>{brandName}</h1>
      </header>
      {children}
    </main>
  );
}
