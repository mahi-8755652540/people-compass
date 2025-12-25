import * as React from "react";
import { cn } from "@/lib/utils";

interface Department {
  name: string;
  employees: number;
  color: string;
  percentage: number;
}

const departments: Department[] = [
  { name: "Engineering", employees: 82, color: "bg-primary", percentage: 33 },
  { name: "Product", employees: 34, color: "bg-accent", percentage: 14 },
  { name: "Design", employees: 28, color: "bg-success", percentage: 11 },
  { name: "Marketing", employees: 42, color: "bg-warning", percentage: 17 },
  { name: "Sales", employees: 38, color: "bg-destructive", percentage: 15 },
  { name: "Others", employees: 24, color: "bg-muted-foreground", percentage: 10 },
];

export const DepartmentStats = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("bg-card rounded-xl shadow-card p-6 animate-slide-up", className)}
      style={{ animationDelay: "400ms", ...style }}
      {...props}
    >
      <h3 className="font-display font-semibold text-lg text-foreground mb-4">Department Overview</h3>

      {/* Stacked Bar */}
      <div className="flex h-4 rounded-full overflow-hidden mb-6">
        {departments.map((dept) => (
          <div
            key={dept.name}
            className={cn("h-full transition-all duration-300 hover:opacity-80", dept.color)}
            style={{ width: `${dept.percentage}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {departments.map((dept) => (
          <div key={dept.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={cn("w-3 h-3 rounded-full", dept.color)} />
              <span className="text-sm text-foreground">{dept.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">{dept.employees}</span>
              <span className="text-xs text-muted-foreground w-8 text-right">{dept.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

DepartmentStats.displayName = "DepartmentStats";

