import { useState } from "react";
import { CalendarDays, Plus, Sun, Moon, Star } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: "national" | "religious" | "optional";
  day: string;
}

const typeColors = {
  national: "bg-primary/10 text-primary",
  religious: "bg-accent/10 text-accent",
  optional: "bg-secondary text-secondary-foreground",
};

const typeIcons = {
  national: Star,
  religious: Moon,
  optional: Sun,
};

const Holidays = () => {
  const { isAdmin, isHR } = useAuth();
  const [year] = useState(new Date().getFullYear());
  const [holidays] = useState<Holiday[]>([]);

  const canManage = isAdmin || isHR;

  const stats = {
    total: holidays.length,
    national: holidays.filter((h) => h.type === "national").length,
    religious: holidays.filter((h) => h.type === "religious").length,
    optional: holidays.filter((h) => h.type === "optional").length,
  };

  const upcomingHolidays = holidays
    .filter((h) => new Date(h.date) >= new Date())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <Header />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Holiday Calendar</h2>
              <p className="text-muted-foreground">Company holidays for {year}</p>
            </div>
            {canManage && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Holiday
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Holidays</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.national}</p>
                  <p className="text-sm text-muted-foreground">National</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.religious}</p>
                  <p className="text-sm text-muted-foreground">Religious</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Sun className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.optional}</p>
                  <p className="text-sm text-muted-foreground">Optional</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Holiday List */}
            <div className="lg:col-span-2">
              <Card className="shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-lg text-foreground">All Holidays</h3>
                </div>
                <div className="divide-y divide-border">
                  {holidays.map((holiday) => {
                    const Icon = typeIcons[holiday.type];
                    const isPast = new Date(holiday.date) < new Date();
                    return (
                      <div
                        key={holiday.id}
                        className={`px-6 py-4 flex items-center justify-between ${
                          isPast ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{holiday.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(holiday.date).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}{" "}
                              • {holiday.day}
                            </p>
                          </div>
                        </div>
                        <Badge className={typeColors[holiday.type]}>{holiday.type}</Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Upcoming */}
            <div>
              <Card className="shadow-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-lg text-foreground">Upcoming Holidays</h3>
                </div>
                {upcomingHolidays.length > 0 ? (
                  <div className="p-6 space-y-4">
                    {upcomingHolidays.map((holiday) => {
                      const Icon = typeIcons[holiday.type];
                      const daysUntil = Math.ceil(
                        (new Date(holiday.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <div key={holiday.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                            <span className="text-xs text-muted-foreground">
                              {new Date(holiday.date).toLocaleDateString("en-IN", { month: "short" })}
                            </span>
                            <span className="text-lg font-bold text-primary">
                              {new Date(holiday.date).getDate()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{holiday.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {daysUntil === 0 ? "Today" : `In ${daysUntil} days`}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">No upcoming holidays</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Holidays;
