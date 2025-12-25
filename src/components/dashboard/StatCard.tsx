import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: LucideIcon;
  iconColor?: "primary" | "accent" | "success" | "warning" | "destructive";
  delay?: number;
}

const iconColorClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor = "primary",
  delay = 0 
}: StatCardProps) => {
  return (
    <div 
      className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-display font-bold text-foreground">{value}</p>
          {change && (
            <div className="flex items-center gap-1">
              <span className={cn(
                "text-sm font-medium",
                change.type === "increase" ? "text-success" : "text-destructive"
              )}>
                {change.type === "increase" ? "+" : "-"}{Math.abs(change.value)}%
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconColorClasses[iconColor])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
