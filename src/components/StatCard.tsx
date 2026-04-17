import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sublabel?: string;
  tone?: "primary" | "success" | "warning" | "navy";
}

const toneClass: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "icon-chip",
  success: "icon-chip icon-chip-success",
  warning: "icon-chip icon-chip-warning",
  navy: "icon-chip icon-chip-navy",
};

export function StatCard({ icon: Icon, label, value, sublabel, tone = "primary" }: StatCardProps) {
  return (
    <Card className="border-border bg-card shadow-none">
      <CardContent className="flex items-start gap-3 p-5">
        <div className={toneClass[tone]}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="eyebrow">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {sublabel && <p className="mt-0.5 text-xs text-muted-foreground">{sublabel}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
