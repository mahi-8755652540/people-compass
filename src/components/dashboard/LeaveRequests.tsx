import { Calendar, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LeaveRequest {
  id: number;
  employee: string;
  avatar: string;
  type: "vacation" | "sick" | "personal";
  startDate: string;
  endDate: string;
  days: number;
  status: "pending" | "approved" | "rejected";
}

const leaveRequests: LeaveRequest[] = [];

const typeStyles = {
  vacation: "bg-primary/10 text-primary border-primary/20",
  sick: "bg-warning/10 text-warning border-warning/20",
  personal: "bg-accent/10 text-accent border-accent/20",
};

const statusIcons = {
  pending: Clock,
  approved: Check,
  rejected: X,
};

export const LeaveRequests = () => {
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">Leave Requests</h3>
            <p className="text-sm text-muted-foreground">5 pending approvals</p>
          </div>
        </div>
        <Button variant="outline" size="sm">Manage</Button>
      </div>
      
      <div className="divide-y divide-border">
        {leaveRequests.map((request) => {
          const StatusIcon = statusIcons[request.status];
          return (
            <div key={request.id} className="px-6 py-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {request.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{request.employee}</p>
                    <Badge variant="outline" className={typeStyles[request.type]}>
                      {request.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {request.startDate} - {request.endDate} • {request.days} day{request.days > 1 ? 's' : ''}
                  </p>
                </div>
                
                {request.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="success" className="h-8">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Badge variant={request.status === "approved" ? "default" : "destructive"} className="capitalize">
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {request.status}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
