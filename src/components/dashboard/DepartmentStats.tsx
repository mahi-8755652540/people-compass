import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface Department {
  name: string;
  employees: number;
  color: string;
  percentage: number;
}

const departments: Department[] = [
  { name: "Engineering", employees: 45, color: "bg-primary", percentage: 35 },
  { name: "Design", employees: 18, color: "bg-accent", percentage: 14 },
  { name: "Marketing", employees: 24, color: "bg-success", percentage: 19 },
  { name: "Sales", employees: 32, color: "bg-warning", percentage: 25 },
  { name: "HR", employees: 9, color: "bg-destructive", percentage: 7 },
];

export const DepartmentStats = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, style, ...props }, ref) => {
    const totalEmployees = departments.reduce((acc, d) => acc + d.employees, 0);

    return (
      <div
        ref={ref}
        className={cn("bg-card rounded-2xl shadow-card p-6 animate-slide-up", className)}
        style={{ animationDelay: "300ms", ...style }}
        {...props}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">
              Department Overview
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">Team distribution</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display font-bold text-foreground">{totalEmployees}</p>
            <p className="text-xs text-muted-foreground">Total employees</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          {departments.map((dept, index) => (
            <div key={dept.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2.5 h-2.5 rounded-full", dept.color)} />
                  <span className="text-sm font-medium text-foreground">{dept.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{dept.employees}</span>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {dept.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700 ease-out",
                    dept.color
                  )}
                  style={{ 
                    width: `${dept.percentage}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

DepartmentStats.displayName = "DepartmentStats";
