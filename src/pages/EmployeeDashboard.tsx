import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, FileText, Award, Bell, User, CalendarCheck, CalendarX, Timer, Palmtree, Stethoscope, Coffee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, format, getDaysInMonth, isWeekend, eachDayOfInterval, isBefore } from "date-fns";

const EmployeeDashboard = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  // Fetch leave balance from database
  const { data: leaveBalances, isLoading: loadingLeave } = useQuery({
    queryKey: ["leave-balance", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const currentYear = new Date().getFullYear();
      const { data, error } = await supabase
        .from("leave_balance")
        .select("*")
        .eq("user_id", user.id)
        .eq("year", currentYear);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch attendance for current month
  const { data: attendanceData, isLoading: loadingAttendance } = useQuery({
    queryKey: ["employee-attendance", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const now = new Date();
      const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
      const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");
      
      const { data, error } = await supabase
        .from("employee_attendance")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", monthStart)
        .lte("date", monthEnd);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate attendance summary
  const getAttendanceSummary = () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const today = new Date();
    
    // Count working days (excluding weekends) up to today
    const daysToCheck = eachDayOfInterval({ 
      start: monthStart, 
      end: isBefore(today, endOfMonth(now)) ? today : endOfMonth(now) 
    });
    const workingDaysSoFar = daysToCheck.filter(day => !isWeekend(day)).length;
    
    // Total working days in month
    const allDaysInMonth = eachDayOfInterval({ start: monthStart, end: endOfMonth(now) });
    const totalWorkingDays = allDaysInMonth.filter(day => !isWeekend(day)).length;

    const present = attendanceData?.filter(a => a.status === "present").length || 0;
    const late = attendanceData?.filter(a => a.status === "late").length || 0;
    const absent = workingDaysSoFar - present - late;

    return {
      present: present + late, // Late counts as present
      absent: Math.max(0, absent),
      late,
      workingDays: totalWorkingDays,
      workingDaysSoFar,
    };
  };

  const attendanceSummary = getAttendanceSummary();

  // Map leave balance data
  const getLeaveData = (type: string) => {
    const balance = leaveBalances?.find(lb => lb.leave_type === type);
    return {
      total: balance?.total_days || 0,
      used: balance?.used_days || 0,
      remaining: (balance?.total_days || 0) - (balance?.used_days || 0),
    };
  };

  const quickLinks = [
    { icon: Calendar, label: "Apply Leave", href: "/leave", color: "text-blue-500" },
    { icon: FileText, label: "My Documents", href: "/documents", color: "text-green-500" },
    { icon: Award, label: "Recognitions", href: "/recognitions", color: "text-yellow-500" },
    { icon: Clock, label: "Calendar", href: "/calendar", color: "text-purple-500" },
  ];

  const leaveTypes = [
    { label: "Annual Leave", icon: Palmtree, ...getLeaveData("annual"), color: "bg-blue-500" },
    { label: "Sick Leave", icon: Stethoscope, ...getLeaveData("sick"), color: "bg-red-500" },
    { label: "Casual Leave", icon: Coffee, ...getLeaveData("casual"), color: "bg-amber-500" },
  ];

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {profile?.name || "Employee"}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your personal dashboard overview
            </p>
          </div>

          {/* Leave Balance & Attendance Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Leave Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palmtree className="h-5 w-5 text-green-500" />
                  Leave Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingLeave ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : leaveBalances && leaveBalances.length > 0 ? (
                  <>
                    {leaveTypes.map((leave) => (
                      <div key={leave.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <leave.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{leave.label}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {leave.remaining} / {leave.total} days
                          </span>
                        </div>
                        <Progress 
                          value={leave.total > 0 ? (leave.remaining / leave.total) * 100 : 0} 
                          className="h-2"
                        />
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => navigate("/leave")}
                    >
                      Apply for Leave
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No leave balance found</p>
                    <p className="text-xs mt-1">Contact HR to set up your leave balance</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendance Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-primary" />
                  This Month's Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAttendance ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <CalendarCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">{attendanceSummary.present}</p>
                        <p className="text-xs text-muted-foreground">Present</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                        <CalendarX className="h-6 w-6 text-red-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</p>
                        <p className="text-xs text-muted-foreground">Absent</p>
                      </div>
                      <div className="text-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                        <Timer className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-amber-600">{attendanceSummary.late}</p>
                        <p className="text-xs text-muted-foreground">Late</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Attendance Rate</span>
                        <span className="font-medium">
                          {attendanceSummary.workingDaysSoFar > 0 
                            ? Math.round((attendanceSummary.present / attendanceSummary.workingDaysSoFar) * 100) 
                            : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={attendanceSummary.workingDaysSoFar > 0 
                          ? (attendanceSummary.present / attendanceSummary.workingDaysSoFar) * 100 
                          : 0} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        {attendanceSummary.workingDays - attendanceSummary.workingDaysSoFar} working days remaining this month
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{profile?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{profile?.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{profile?.department || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Designation</p>
                  <p className="font-medium">{profile?.designation || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    profile?.status === "active" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  }`}>
                    {profile?.status || "-"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {quickLinks.map((link) => (
              <Card 
                key={link.label} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(link.href)}
              >
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <link.icon className={`h-8 w-8 ${link.color} mb-2`} />
                  <p className="font-medium text-sm">{link.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Company Holiday Notice</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Office will remain closed on 26th January for Republic Day.
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Salary Credit</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    December salary has been credited to your account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
