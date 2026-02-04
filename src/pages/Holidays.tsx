import { useState } from "react";
import { CalendarDays, Plus, Sun, Moon, Star, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const holidays2026: Holiday[] = [
  { id: "1", name: "Republic Day", date: "2026-01-26", type: "national", day: "Monday" },
  { id: "2", name: "Maha Shivaratri", date: "2026-02-15", type: "religious", day: "Sunday" },
  { id: "3", name: "Holi", date: "2026-03-10", type: "religious", day: "Tuesday" },
  { id: "4", name: "Good Friday", date: "2026-04-03", type: "optional", day: "Friday" },
  { id: "5", name: "Ram Navami", date: "2026-04-06", type: "religious", day: "Monday" },
  { id: "6", name: "Mahavir Jayanti", date: "2026-04-09", type: "religious", day: "Thursday" },
  { id: "7", name: "Buddha Purnima", date: "2026-05-12", type: "religious", day: "Tuesday" },
  { id: "8", name: "Eid ul-Fitr", date: "2026-03-21", type: "religious", day: "Saturday" },
  { id: "9", name: "Eid ul-Adha", date: "2026-05-28", type: "religious", day: "Thursday" },
  { id: "10", name: "Independence Day", date: "2026-08-15", type: "national", day: "Saturday" },
  { id: "11", name: "Janmashtami", date: "2026-08-25", type: "religious", day: "Tuesday" },
  { id: "12", name: "Milad un-Nabi", date: "2026-09-05", type: "religious", day: "Saturday" },
  { id: "13", name: "Gandhi Jayanti", date: "2026-10-02", type: "national", day: "Friday" },
  { id: "14", name: "Dussehra", date: "2026-10-02", type: "religious", day: "Friday" },
  { id: "15", name: "Diwali", date: "2026-10-20", type: "religious", day: "Tuesday" },
  { id: "16", name: "Bhai Dooj", date: "2026-10-22", type: "optional", day: "Thursday" },
  { id: "17", name: "Guru Nanak Jayanti", date: "2026-11-08", type: "religious", day: "Sunday" },
  { id: "18", name: "Christmas", date: "2026-12-25", type: "religious", day: "Friday" },
];

const Holidays = () => {
  const { isAdmin, isHR } = useAuth();
  const [year] = useState(2026);
  const [holidays, setHolidays] = useState<Holiday[]>(
    holidays2026.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [newHoliday, setNewHoliday] = useState({
    name: "",
    type: "optional" as "national" | "religious" | "optional",
  });

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

  const handleAddHoliday = () => {
    if (!newHoliday.name.trim()) {
      toast.error("Please enter holiday name");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    const holiday: Holiday = {
      id: Date.now().toString(),
      name: newHoliday.name.trim(),
      date: format(selectedDate, "yyyy-MM-dd"),
      type: newHoliday.type,
      day: dayNames[selectedDate.getDay()],
    };

    setHolidays(
      [...holidays, holiday].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
    toast.success(`${holiday.name} added successfully!`);
    setDialogOpen(false);
    setNewHoliday({ name: "", type: "optional" });
    setSelectedDate(undefined);
  };

  const handleDeleteHoliday = (id: string) => {
    const holiday = holidays.find((h) => h.id === id);
    setHolidays(holidays.filter((h) => h.id !== id));
    toast.success(`${holiday?.name} deleted`);
  };

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
              <Button onClick={() => setDialogOpen(true)}>
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
                        <div className="flex items-center gap-2">
                          <Badge className={typeColors[holiday.type]}>{holiday.type}</Badge>
                          {canManage && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteHoliday(holiday.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
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

      {/* Add Holiday Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Holiday</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Holiday Name</Label>
              <Input
                placeholder="e.g., Diwali"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={newHoliday.type}
                onValueChange={(value: "national" | "religious" | "optional") =>
                  setNewHoliday({ ...newHoliday, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="religious">Religious</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHoliday}>Add Holiday</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Holidays;
