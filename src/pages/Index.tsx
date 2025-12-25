import { Users, UserCheck, CalendarOff, Building2 } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmployeeList } from "@/components/dashboard/EmployeeList";
import { LeaveRequests } from "@/components/dashboard/LeaveRequests";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DepartmentStats } from "@/components/dashboard/DepartmentStats";
import { useEmployees } from "@/context/EmployeeContext";

const Index = () => {
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

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Employees"
              value={totalEmployees}
              icon={Users}
              iconColor="primary"
              delay={0}
            />
            <StatCard
              title="Present Today"
              value={presentToday}
              icon={UserCheck}
              iconColor="success"
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

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <EmployeeList />
              <LeaveRequests />
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <QuickActions />
              <AttendanceChart />
              <DepartmentStats />
            </div>
          </div>

          {/* Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

