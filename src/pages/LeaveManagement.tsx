import { useState } from "react";
import { Calendar, Check, X, Clock, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaveRequest {
  id: number;
  employee: string;
  avatar: string;
  type: "vacation" | "sick" | "personal" | "maternity";
  startDate: string;
  endDate: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

const leaveRequests: LeaveRequest[] = [
  { id: 1, employee: "Alex Morgan", avatar: "AM", type: "vacation", startDate: "Dec 26, 2025", endDate: "Dec 30, 2025", days: 5, status: "pending", reason: "Family holiday trip" },
  { id: 2, employee: "Lisa Park", avatar: "LP", type: "sick", startDate: "Dec 25, 2025", endDate: "Dec 25, 2025", days: 1, status: "pending", reason: "Not feeling well" },
  { id: 3, employee: "Tom Bradley", avatar: "TB", type: "personal", startDate: "Dec 27, 2025", endDate: "Dec 27, 2025", days: 1, status: "pending", reason: "Personal appointment" },
  { id: 4, employee: "Nina Patel", avatar: "NP", type: "vacation", startDate: "Jan 2, 2026", endDate: "Jan 10, 2026", days: 7, status: "approved", reason: "New Year vacation" },
  { id: 5, employee: "Chris Evans", avatar: "CE", type: "sick", startDate: "Dec 20, 2025", endDate: "Dec 22, 2025", days: 3, status: "approved", reason: "Medical recovery" },
  { id: 6, employee: "Maya Johnson", avatar: "MJ", type: "maternity", startDate: "Jan 15, 2026", endDate: "Apr 15, 2026", days: 90, status: "approved", reason: "Maternity leave" },
  { id: 7, employee: "Ryan Cooper", avatar: "RC", type: "personal", startDate: "Dec 18, 2025", endDate: "Dec 18, 2025", days: 1, status: "rejected", reason: "Personal errand" },
];

const typeStyles = {
  vacation: "bg-primary/10 text-primary border-primary/20",
  sick: "bg-warning/10 text-warning border-warning/20",
  personal: "bg-accent/10 text-accent border-accent/20",
  maternity: "bg-success/10 text-success border-success/20",
};

const statusStyles = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const leaveBalances = [
  { type: "Vacation", used: 8, total: 20, color: "bg-primary" },
  { type: "Sick Leave", used: 2, total: 10, color: "bg-warning" },
  { type: "Personal", used: 1, total: 5, color: "bg-accent" },
];

const LeaveManagement = () => {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filteredRequests = leaveRequests.filter(
    (req) => filter === "all" || req.status === filter
  );

  const pendingCount = leaveRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-64 min-h-screen">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Leave Management</h1>
              <p className="text-muted-foreground">Review and manage employee leave requests</p>
            </div>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaveBalances.map((balance) => (
              <div key={balance.type} className="bg-card rounded-xl p-5 shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-foreground">{balance.type}</h3>
                  <span className="text-sm text-muted-foreground">
                    {balance.used}/{balance.total} days
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", balance.color)}
                    style={{ width: `${(balance.used / balance.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {balance.total - balance.used} days remaining
                </p>
              </div>
            ))}
          </div>

          {/* Calendar Preview */}
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg text-foreground">December 2025</h3>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNum = i - 0 + 1;
                  const isCurrentMonth = dayNum > 0 && dayNum <= 31;
                  const isToday = dayNum === 25;
                  const hasLeave = [26, 27, 28, 29, 30, 25].includes(dayNum);
                  return (
                    <div
                      key={i}
                      className={cn(
                        "p-2 rounded-lg text-sm relative",
                        isCurrentMonth ? "text-foreground" : "text-muted-foreground/30",
                        isToday && "bg-primary text-primary-foreground font-semibold",
                        hasLeave && !isToday && "bg-warning/10"
                      )}
                    >
                      {isCurrentMonth ? dayNum : ""}
                      {hasLeave && !isToday && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-warning" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Leave Requests Table */}
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-semibold text-lg text-foreground">Leave Requests</h3>
                {pendingCount > 0 && (
                  <Badge variant="destructive">{pendingCount} pending</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {(["all", "pending", "approved", "rejected"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border">
              {filteredRequests.map((request) => (
                <div key={request.id} className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {request.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{request.employee}</p>
                        <Badge variant="outline" className={typeStyles[request.type]}>
                          {request.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.startDate} - {request.endDate} • {request.days} day{request.days > 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-muted-foreground/80 mt-1">{request.reason}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={statusStyles[request.status]} variant="secondary">
                        {request.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {request.status === "approved" && <Check className="w-3 h-3 mr-1" />}
                        {request.status === "rejected" && <X className="w-3 h-3 mr-1" />}
                        {request.status}
                      </Badge>

                      {request.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="success">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No leave requests found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaveManagement;
