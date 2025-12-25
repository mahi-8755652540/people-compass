import { Users, UserCheck, CalendarOff, Building2, Award } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmployeeList } from "@/components/dashboard/EmployeeList";
import { LeaveRequests } from "@/components/dashboard/LeaveRequests";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { DepartmentStats } from "@/components/dashboard/DepartmentStats";
import { useEmployees } from "@/context/EmployeeContext";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { role } = useAuth();
  
  // Redirect staff and contractor to their own dashboard
  if (role === "staff" || role === "contractor") {
    return <Navigate to="/my-dashboard" replace />;
  }
  const { employees } = useEmployees();
  const totalEmployees = employees.length;
  const presentToday = employees.filter((e) => e.status === "active").length;
  const onLeave = employees.filter((e) => e.status === "away").length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64 min-h-screen">
        <h1 className="sr-only">HRMS Dashboard</h1>
        <Header />

        <div className="p-8">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 mb-8 animate-fade-in">
            <div className="relative z-10">
              <h2 className="font-display text-2xl font-bold text-primary-foreground mb-2">
                Welcome to HR Dashboard
              </h2>
              <p className="text-primary-foreground/80 max-w-xl">
                Manage your workforce efficiently. Track attendance, handle leave requests, and stay on top of HR operations.
              </p>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20">
              <Award className="w-32 h-32" />
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-primary-foreground/10" />
            <div className="absolute right-20 -top-10 w-24 h-24 rounded-full bg-primary-foreground/10" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Employees"
              value={totalEmployees}
              icon={Users}
              iconColor="primary"
              change={{ value: 12, type: "increase" }}
              delay={0}
            />
            <StatCard
              title="Present Today"
              value={presentToday}
              icon={UserCheck}
              iconColor="success"
              change={{ value: 5, type: "increase" }}
              delay={50}
            />
            <StatCard
              title="On Leave"
              value={onLeave}
              icon={CalendarOff}
              iconColor="warning"
              delay={100}
            />
            <StatCard
              title="Departments"
              value="12"
              icon={Building2}
              iconColor="accent"
              delay={150}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Column - Wider */}
            <div className="xl:col-span-8 space-y-6">
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AttendanceChart />
                <DepartmentStats />
              </div>
              
              {/* Employee List */}
              <EmployeeList />
              
              {/* Leave Requests */}
              <LeaveRequests />
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="xl:col-span-4 space-y-6">
              <QuickActions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
