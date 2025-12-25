import { 
  UserCheck, 
  FileCheck, 
  Clock, 
  MessageSquare,
  Award,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  color: "primary" | "accent" | "success" | "warning";
}

const activities: Activity[] = [
  { id: 1, icon: UserCheck, title: "New Employee Onboarded", description: "David Kim joined Engineering team", time: "10 min ago", color: "success" },
  { id: 2, icon: Calendar, title: "Leave Approved", description: "Vacation request for Emma Wilson", time: "25 min ago", color: "primary" },
  { id: 3, icon: FileCheck, title: "Document Submitted", description: "Q4 Performance reports uploaded", time: "1 hour ago", color: "accent" },
  { id: 4, icon: Award, title: "Recognition Given", description: "Michael Chen received MVP award", time: "2 hours ago", color: "warning" },
  { id: 5, icon: MessageSquare, title: "Feedback Received", description: "New survey response from Marketing", time: "3 hours ago", color: "primary" },
];

const colorClasses = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export const RecentActivity = () => {
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: "350ms" }}>
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-display font-semibold text-lg text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest updates from your organization</p>
      </div>
      
      <div className="divide-y divide-border">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-start gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors"
          >
            <div className={cn("p-2 rounded-lg shrink-0", colorClasses[activity.color])}>
              <activity.icon className="w-4 h-4" />
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
        ))}
      </div>
    </div>
  );
};
