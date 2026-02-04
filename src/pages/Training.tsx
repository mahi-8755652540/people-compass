import { useState } from "react";
import { GraduationCap, Plus, Calendar, Users, Clock, CheckCircle, BookOpen } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

interface Training {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  startDate: string;
  participants: number;
  maxParticipants: number;
  status: "upcoming" | "ongoing" | "completed";
  progress: number;
}

const statusColors = {
  upcoming: "bg-primary/10 text-primary",
  ongoing: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
};

const Training = () => {
  const { isAdmin, isHR } = useAuth();
  const [trainings] = useState<Training[]>([
    {
      id: "1",
      title: "Safety & Compliance Training",
      description: "Mandatory safety protocols and workplace compliance guidelines",
      instructor: "External Trainer",
      duration: "4 hours",
      startDate: "2024-02-15",
      participants: 25,
      maxParticipants: 50,
      status: "ongoing",
      progress: 60,
    },
    {
      id: "2",
      title: "Leadership Development Program",
      description: "Management skills and team leadership training for senior staff",
      instructor: "HR Department",
      duration: "8 hours",
      startDate: "2024-02-20",
      participants: 10,
      maxParticipants: 15,
      status: "upcoming",
      progress: 0,
    },
    {
      id: "3",
      title: "Technical Skills Workshop",
      description: "Advanced technical training for engineering team",
      instructor: "Tech Lead",
      duration: "6 hours",
      startDate: "2024-01-10",
      participants: 20,
      maxParticipants: 20,
      status: "completed",
      progress: 100,
    },
  ]);

  const canManage = isAdmin || isHR;

  const stats = {
    total: trainings.length,
    ongoing: trainings.filter((t) => t.status === "ongoing").length,
    upcoming: trainings.filter((t) => t.status === "upcoming").length,
    completed: trainings.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <Header />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Training Management</h2>
              <p className="text-muted-foreground">Manage employee training programs and certifications</p>
            </div>
            {canManage && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Training
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Programs</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.ongoing}</p>
                  <p className="text-sm text-muted-foreground">Ongoing</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.upcoming}</p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Training List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainings.map((training) => (
              <Card key={training.id} className="p-6 shadow-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className={statusColors[training.status]}>{training.status}</Badge>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{training.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{training.description}</p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{training.participants}/{training.maxParticipants} participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{training.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(training.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {training.status !== "upcoming" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{training.progress}%</span>
                    </div>
                    <Progress value={training.progress} className="h-2" />
                  </div>
                )}

                <Button variant="outline" className="w-full mt-4">
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Training;
