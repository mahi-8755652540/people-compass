import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, FileText, Award, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const quickLinks = [
    { icon: Calendar, label: "Apply Leave", href: "/leave-management", color: "text-blue-500" },
    { icon: FileText, label: "My Documents", href: "/documents", color: "text-green-500" },
    { icon: Award, label: "Recognitions", href: "/recognitions", color: "text-yellow-500" },
    { icon: Clock, label: "Calendar", href: "/calendar", color: "text-purple-500" },
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
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
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
