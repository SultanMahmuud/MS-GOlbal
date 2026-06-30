import type { CSSProperties, ReactNode } from "react";

type BrandTheme = {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  ink: string;
};

export function BrandButton({
  children,
  href,
  theme,
  variant = "primary"
}: {
  children: ReactNode;
  href: string;
  theme: BrandTheme;
  variant?: "primary" | "secondary";
}) {
  const style: CSSProperties =
    variant === "primary"
      ? { background: theme.primary, color: "#ffffff" }
      : { background: "#ffffff", color: theme.primary, border: `1px solid ${theme.primary}` };

  return (
    <a className="brand-button" href={href} style={style}>
      {children}
    </a>
  );
}

export function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-pill">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
