import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

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
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent text-accent-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

const iconBgClasses = {
  primary: "bg-primary/10",
  accent: "bg-accent/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  destructive: "bg-destructive/10",
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
      className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-50 transition-transform duration-300 group-hover:scale-110",
        iconBgClasses[iconColor]
      )} />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-4xl font-display font-bold text-foreground tracking-tight">{value}</p>
          {change && (
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "flex items-center gap-0.5 text-sm font-semibold px-2 py-0.5 rounded-full",
                change.type === "increase" 
                  ? "text-success bg-success/10" 
                  : "text-destructive bg-destructive/10"
              )}>
                {change.type === "increase" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110",
          iconColorClasses[iconColor]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
