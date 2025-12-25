import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import {
  UserCheck,
  FileCheck,
  Clock,
  MessageSquare,
  Award,
  Calendar,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  color: "primary" | "accent" | "success" | "warning";
}

const activities: Activity[] = [];

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export const RecentActivity = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-card rounded-xl shadow-card overflow-hidden animate-slide-up", className)}
        style={{ animationDelay: "350ms", ...style }}
        {...props}
      >
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-display font-semibold text-lg text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates from your organization</p>
        </div>

        <div className="divide-y divide-border">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors"
              >
                <div className={cn("p-2 rounded-lg shrink-0", colorClasses[activity.color])}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{activity.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Clock className="w-3 h-3" />
                  {activity.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

RecentActivity.displayName = "RecentActivity";


