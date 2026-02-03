import { useState, useEffect } from "react";
import { Clock, LogIn, LogOut, Users, UserCheck, UserX, Calendar, ChevronLeft, ChevronRight, MapPin, Camera, Eye, CheckCircle } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, addDays, subDays } from "date-fns";
import { AttendanceDetailDialog } from "@/components/attendance/AttendanceDetailDialog";
import { AttendanceCaptureDialog } from "@/components/dashboard/AttendanceCaptureDialog";

interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  photo_url: string | null;
  latitude: number | null;
  longitude: number | null;
  location_address: string | null;
  notes: string | null;
  profiles?: {
    name: string;
    email: string;
    department: string | null;
    avatar_url: string | null;
  };
}

const statusStyles: Record<string, string> = {
  present: "bg-success/10 text-success",
  absent: "bg-destructive/10 text-destructive",
  late: "bg-warning/10 text-warning",
  "half-day": "bg-accent/10 text-accent",
};

const Attendance = () => {
  const { isAdmin, isHR, user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [captureDialogOpen, setCaptureDialogOpen] = useState(false);
  const [captureType, setCaptureType] = useState<"check-in" | "check-out">("check-in");

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const todayStr = format(new Date(), "yyyy-MM-dd");

  // Fetch today's attendance for current user
  const { data: todayAttendance, refetch: refetchTodayAttendance } = useQuery({
    queryKey: ["my-attendance-today", todayStr, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("employee_attendance")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", todayStr)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const isPunchedIn = !!todayAttendance?.check_in && !todayAttendance?.check_out;
  const hasPunchedOut = !!todayAttendance?.check_out;

  // Fetch all attendance records for selected date (admin/HR only)
  const { data: records = [], isLoading } = useQuery({
    queryKey: ["attendance", dateStr],
    queryFn: async () => {
      const { data: attendanceData, error } = await supabase
        .from("employee_attendance")
        .select("*")
        .eq("date", dateStr)
        .order("check_in", { ascending: true });

      if (error) throw error;

      // Fetch profiles for all user_ids
      const userIds = attendanceData.map(a => a.user_id);
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, name, email, department, avatar_url")
        .in("id", userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      return attendanceData.map(record => ({
        ...record,
        profiles: profilesMap.get(record.user_id) || null,
      })) as AttendanceRecord[];
    },
    enabled: isAdmin || isHR,
  });

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const lateCount = records.filter((r) => r.status === "late").length;
  const halfDayCount = records.filter((r) => r.status === "half-day").length;

  const handlePunchIn = () => {
    if (!user?.id) {
      toast.error("Please login to punch in");
      return;
    }
    setCaptureType("check-in");
    setCaptureDialogOpen(true);
  };

  const handlePunchOut = () => {
    if (!user?.id) {
      toast.error("Please login to punch out");
      return;
    }
    setCaptureType("check-out");
    setCaptureDialogOpen(true);
  };

  const handleCaptureComplete = async (photoUrl: string, latitude: number, longitude: number, address?: string) => {
    if (!user?.id) return;

    try {
      const currentTime = format(new Date(), "HH:mm:ss");
      
      if (captureType === "check-in") {
        // Determine status based on check-in time (9:30 AM as threshold)
        const now = new Date();
        const lateThreshold = new Date();
        lateThreshold.setHours(9, 30, 0, 0);
        const status = now > lateThreshold ? "late" : "present";

        const { error } = await supabase
          .from("employee_attendance")
          .insert({
            user_id: user.id,
            date: todayStr,
            check_in: currentTime,
            status,
            photo_url: photoUrl,
            latitude,
            longitude,
            location_address: address || null,
          });

        if (error) throw error;
        toast.success(`Punched in at ${format(new Date(), "hh:mm a")}`);
      } else {
        // Update existing record with check-out
        const { error } = await supabase
          .from("employee_attendance")
          .update({
            check_out: currentTime,
          })
          .eq("user_id", user.id)
          .eq("date", todayStr);

        if (error) throw error;
        toast.success(`Punched out at ${format(new Date(), "hh:mm a")}`);
      }

      // Refresh attendance data
      refetchTodayAttendance();
      queryClient.invalidateQueries({ queryKey: ["attendance", todayStr] });
    } catch (error: any) {
      console.error("Attendance error:", error);
      toast.error(error.message || "Failed to save attendance");
    }
  };

  const handleViewDetails = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setDetailDialogOpen(true);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
              {hasPunchedOut ? (
                <Button variant="outline" disabled className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Attendance Completed
                </Button>
              ) : !isPunchedIn ? (
                <Button variant="default" onClick={handlePunchIn} className="gap-2 bg-success hover:bg-success/90">
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
          {isPunchedIn && todayAttendance?.check_in && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-success">You are currently punched in</p>
                <p className="text-sm text-success/80">Started at {todayAttendance.check_in}</p>
              </div>
              {todayAttendance.location_address && (
                <div className="flex items-center gap-2 text-sm text-success/80">
                  <MapPin className="w-4 h-4" />
                  <span className="max-w-xs truncate">{todayAttendance.location_address}</span>
                </div>
              )}
            </div>
          )}

          {hasPunchedOut && todayAttendance && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-primary">Today's attendance completed</p>
                <p className="text-sm text-primary/80">
                  Check-in: {todayAttendance.check_in} | Check-out: {todayAttendance.check_out}
                </p>
              </div>
            </div>
          )}

          {/* Stats Grid - Only for Admin/HR */}
          {(isAdmin || isHR) && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl p-5 shadow-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{records.length}</p>
                      <p className="text-sm text-muted-foreground">Total Records</p>
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
                      <p className="text-sm text-muted-foreground">Present</p>
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
                      <p className="text-sm text-muted-foreground">Absent</p>
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
                    <h3 className="font-display font-semibold text-lg text-foreground">Attendance Records</h3>
                    <Badge variant="secondary">
                      {format(selectedDate, "EEEE, MMM d, yyyy")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
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
                        <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Location</th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Photo</th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {records.map((record) => (
                        <tr key={record.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                                {record.profiles?.name?.charAt(0) || "?"}
                              </div>
                              <span className="font-medium text-foreground">{record.profiles?.name || "Unknown"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{record.profiles?.department || "—"}</td>
                          <td className="px-6 py-4">
                            {record.check_in ? (
                              <span className="text-sm text-foreground">{record.check_in}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {record.check_out ? (
                              <span className="text-sm text-foreground">{record.check_out}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {record.location_address ? (
                              <div className="flex items-center gap-1 text-sm text-foreground max-w-[150px]">
                                <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                                <span className="truncate">{record.location_address}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {record.photo_url ? (
                              <div className="flex items-center gap-1">
                                <Camera className="w-4 h-4 text-success" />
                                <span className="text-xs text-success">Captured</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={cn("capitalize", statusStyles[record.status] || "")} variant="secondary">
                              {record.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(record)}
                              className="gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {isLoading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading attendance records...</p>
                  </div>
                )}

                {!isLoading && records.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No attendance records found for this date.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <AttendanceDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        record={selectedRecord}
      />

      {/* Attendance Capture Dialog */}
      {user?.id && (
        <AttendanceCaptureDialog
          open={captureDialogOpen}
          onOpenChange={setCaptureDialogOpen}
          onCapture={handleCaptureComplete}
          userId={user.id}
          type={captureType}
        />
      )}
    </div>
  );
};

export default Attendance;
