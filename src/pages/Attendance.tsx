import { useState } from "react";
import { Clock, LogIn, LogOut, Users, UserCheck, UserX, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AttendanceRecord {
  id: number;
  employee: string;
  avatar: string;
  department: string;
  checkIn: string | null;
  checkOut: string | null;
  status: "present" | "absent" | "late" | "half-day";
  workHours: string;
}

const initialAttendanceRecords: AttendanceRecord[] = [
  { id: 1, employee: "Michael Chen", avatar: "MC", department: "Engineering", checkIn: "09:02 AM", checkOut: "06:15 PM", status: "present", workHours: "9h 13m" },
  { id: 2, employee: "Emma Wilson", avatar: "EW", department: "Product", checkIn: "08:45 AM", checkOut: "05:30 PM", status: "present", workHours: "8h 45m" },
  { id: 3, employee: "James Rodriguez", avatar: "JR", department: "Design", checkIn: "09:35 AM", checkOut: "06:00 PM", status: "late", workHours: "8h 25m" },
  { id: 4, employee: "Sophia Turner", avatar: "ST", department: "Human Resources", checkIn: "08:55 AM", checkOut: null, status: "present", workHours: "4h 30m" },
  { id: 5, employee: "David Kim", avatar: "DK", department: "Analytics", checkIn: null, checkOut: null, status: "absent", workHours: "0h" },
  { id: 6, employee: "Olivia Martinez", avatar: "OM", department: "Marketing", checkIn: "09:00 AM", checkOut: "01:00 PM", status: "half-day", workHours: "4h 0m" },
  { id: 7, employee: "William Brown", avatar: "WB", department: "Sales", checkIn: "08:30 AM", checkOut: null, status: "present", workHours: "5h 0m" },
  { id: 8, employee: "Ava Johnson", avatar: "AJ", department: "Engineering", checkIn: "09:10 AM", checkOut: "06:30 PM", status: "present", workHours: "9h 20m" },
];

const statusStyles = {
  present: "bg-success/10 text-success",
  absent: "bg-destructive/10 text-destructive",
  late: "bg-warning/10 text-warning",
  "half-day": "bg-accent/10 text-accent",
};

const Attendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<string | null>(null);

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const lateCount = records.filter((r) => r.status === "late").length;
  const halfDayCount = records.filter((r) => r.status === "half-day").length;

  const handlePunchIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setPunchInTime(timeStr);
    setIsPunchedIn(true);
    toast.success(`Punched in at ${timeStr}`);
  };

  const handlePunchOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setIsPunchedIn(false);
    toast.success(`Punched out at ${timeStr}`);
    setPunchInTime(null);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Update time every second
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64 min-h-screen">
        <h1 className="sr-only">Attendance Tracking</h1>
        <Header />

        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Attendance</h2>
              <p className="text-muted-foreground">Track and manage employee attendance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <p className="text-sm text-muted-foreground">Current Time</p>
                <p className="font-display text-xl font-semibold text-foreground">{currentTime}</p>
              </div>
              {!isPunchedIn ? (
                <Button variant="default" onClick={handlePunchIn} className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Punch In
                </Button>
              ) : (
                <Button variant="destructive" onClick={handlePunchOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Punch Out
                </Button>
              )}
            </div>
          </div>

          {/* Punch Status Card */}
          {isPunchedIn && punchInTime && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="font-medium text-success">You are currently punched in</p>
                <p className="text-sm text-success/80">Started at {punchInTime}</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{records.length}</p>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{presentCount}</p>
                  <p className="text-sm text-muted-foreground">Present Today</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{absentCount}</p>
                  <p className="text-sm text-muted-foreground">Absent Today</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{lateCount + halfDayCount}</p>
                  <p className="text-sm text-muted-foreground">Late / Half-day</p>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg text-foreground">Today's Attendance</h3>
                <Badge variant="secondary">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </Badge>
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

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Employee</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Department</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Check In</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Check Out</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Work Hours</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                            {record.avatar}
                          </div>
                          <span className="font-medium text-foreground">{record.employee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{record.department}</td>
                      <td className="px-6 py-4">
                        {record.checkIn ? (
                          <span className="text-sm text-foreground">{record.checkIn}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {record.checkOut ? (
                          <span className="text-sm text-foreground">{record.checkOut}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{record.workHours}</td>
                      <td className="px-6 py-4">
                        <Badge className={cn("capitalize", statusStyles[record.status])} variant="secondary">
                          {record.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {records.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No attendance records found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Attendance;
