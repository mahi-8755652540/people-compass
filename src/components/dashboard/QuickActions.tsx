import { 
  UserPlus, 
  FileSpreadsheet, 
  CalendarPlus, 
  ClipboardList,
  Gift,
  Award
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  color: "primary" | "accent" | "success" | "warning";
}

const actions: QuickAction[] = [
  { icon: UserPlus, label: "Add Employee", description: "Onboard new team member", color: "primary" },
  { icon: CalendarPlus, label: "Schedule Event", description: "Create team activity", color: "accent" },
  { icon: FileSpreadsheet, label: "Run Payroll", description: "Process monthly payroll", color: "success" },
  { icon: ClipboardList, label: "Performance", description: "Review evaluations", color: "warning" },
  { icon: Gift, label: "Birthdays", description: "3 this month", color: "accent" },
  { icon: Award, label: "Recognitions", description: "Celebrate wins", color: "primary" },
];

const colorClasses = {
  primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  accent: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
  success: "bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground",
  warning: "bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground",
};

export const QuickActions = () => {
  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-slide-up" style={{ animationDelay: "150ms" }}>
      <h3 className="font-display font-semibold text-lg text-foreground mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={action.label}
            className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/60 transition-all duration-200 text-left"
          >
            <div className={cn("p-2 rounded-lg transition-all duration-200", colorClasses[action.color])}>
              <action.icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{action.label}</p>
              <p className="text-xs text-muted-foreground truncate">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
