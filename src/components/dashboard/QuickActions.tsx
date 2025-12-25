import { 
  UserPlus, 
  FileSpreadsheet, 
  CalendarPlus, 
  ClipboardList,
  Gift,
  Award,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  description: string;
  color: "primary" | "accent" | "success" | "warning";
  route?: string;
  action?: () => void;
}

const colorClasses = {
  primary: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
  accent: "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground",
  success: "bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground",
  warning: "bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground",
};

const borderColors = {
  primary: "hover:border-primary/30",
  accent: "hover:border-accent/30",
  success: "hover:border-success/30",
  warning: "hover:border-warning/30",
};

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions: QuickAction[] = [
    { icon: UserPlus, label: "Add Employee", description: "Onboard new member", color: "primary", route: "/employees" },
    { icon: CalendarPlus, label: "Schedule Event", description: "Create activity", color: "accent", route: "/calendar" },
    { icon: FileSpreadsheet, label: "Run Payroll", description: "Process salaries", color: "success", route: "/payroll" },
    { icon: ClipboardList, label: "Performance", description: "Review team", color: "warning", route: "/performance" },
    { icon: Gift, label: "Birthdays", description: "3 this month", color: "accent", action: () => toast.info("No birthdays this month") },
    { icon: Award, label: "Recognitions", description: "Celebrate wins", color: "primary", route: "/recognitions" },
  ];

  const handleAction = (action: QuickAction) => {
    if (action.action) {
      action.action();
    } else if (action.route) {
      navigate(action.route);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: "150ms" }}>
      <div className="px-6 py-5 border-b border-border">
        <h3 className="font-display font-semibold text-lg text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Common tasks at your fingertips</p>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleAction(action)}
              className={cn(
                "group flex items-center gap-4 p-4 rounded-xl border border-transparent bg-secondary/30 hover:bg-secondary/60 transition-all duration-200 text-left",
                borderColors[action.color]
              )}
            >
              <div className={cn(
                "p-2.5 rounded-xl transition-all duration-200 shrink-0",
                colorClasses[action.color]
              )}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{action.label}</p>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
