import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import {
  UserPlus,
  CalendarCheck,
  FileText,
  Award,
  Clock,
  Activity,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  color: "primary" | "accent" | "success" | "warning";
}

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

// Sample activities - in real app, this would come from API
const activities: ActivityItem[] = [
  {
    id: 1,
    icon: UserPlus,
    title: "New employee onboarded",
    description: "Sarah Johnson joined Engineering",
    time: "2 hours ago",
    color: "primary",
  },
  {
    id: 2,
    icon: CalendarCheck,
    title: "Leave approved",
    description: "John's vacation request accepted",
    time: "4 hours ago",
    color: "success",
  },
  {
    id: 3,
    icon: FileText,
    title: "Document uploaded",
    description: "Q4 Performance Report added",
    time: "Yesterday",
    color: "accent",
  },
  {
    id: 4,
    icon: Award,
    title: "Recognition given",
    description: "Mike received Team Player award",
    time: "Yesterday",
    color: "warning",
  },
];

export const RecentActivity = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-card rounded-2xl shadow-card overflow-hidden animate-slide-up", className)}
        style={{ animationDelay: "350ms", ...style }}
        {...props}
      >
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/10">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">
                Recent Activity
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">Latest updates from your team</p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className={cn(
                    "p-2 rounded-lg shrink-0 mt-0.5",
                    colorClasses[activity.color]
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{activity.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                <Activity className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

RecentActivity.displayName = "RecentActivity";
