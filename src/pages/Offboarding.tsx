import { useState } from "react";
import { UserMinus, Plus, Calendar, CheckSquare, Clock, AlertCircle, FileText } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";

interface OffboardingCase {
  id: string;
  employeeName: string;
  department: string;
  resignationDate: string;
  lastWorkingDate: string;
  status: "in_progress" | "pending_clearance" | "completed";
  progress: number;
  checklist: {
    id: string;
    task: string;
    completed: boolean;
  }[];
}

const statusColors = {
  in_progress: "bg-warning/10 text-warning",
  pending_clearance: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
};

const statusLabels = {
  in_progress: "In Progress",
  pending_clearance: "Pending Clearance",
  completed: "Completed",
};

const Offboarding = () => {
  const { isAdmin, isHR } = useAuth();
  const [cases] = useState<OffboardingCase[]>([]);

  const canManage = isAdmin || isHR;

  const stats = {
    total: cases.length,
    inProgress: cases.filter((c) => c.status === "in_progress").length,
    pendingClearance: cases.filter((c) => c.status === "pending_clearance").length,
    completed: cases.filter((c) => c.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <Header />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Exit Management</h2>
              <p className="text-muted-foreground">Employee offboarding and clearance process</p>
            </div>
            {canManage && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Initiate Offboarding
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserMinus className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Cases</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingClearance}</p>
                  <p className="text-sm text-muted-foreground">Pending Clearance</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Offboarding Cases */}
          <div className="space-y-4">
            {cases.map((offboarding) => (
              <Card key={offboarding.id} className="shadow-card overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{offboarding.employeeName}</h3>
                      <p className="text-muted-foreground">{offboarding.department}</p>
                    </div>
                    <Badge className={statusColors[offboarding.status]}>
                      {statusLabels[offboarding.status]}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Resignation: {new Date(offboarding.resignationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Last Day: {new Date(offboarding.lastWorkingDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Clearance Progress</span>
                      <span className="font-medium">{offboarding.progress}%</span>
                    </div>
                    <Progress value={offboarding.progress} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium text-sm text-foreground">Checklist</p>
                    {offboarding.checklist.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <Checkbox checked={item.completed} disabled />
                        <span className={item.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {canManage && (
                  <div className="px-6 py-3 border-t border-border bg-secondary/30 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm">Update Status</Button>
                  </div>
                )}
              </Card>
            ))}

            {cases.length === 0 && (
              <Card className="p-12 text-center">
                <UserMinus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No offboarding cases</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Offboarding;
