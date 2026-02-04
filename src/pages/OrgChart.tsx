import { useState, useEffect } from "react";
import { Building2, Users, ChevronDown, ChevronRight } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatar_url?: string;
}

interface DepartmentGroup {
  name: string;
  employees: Employee[];
}

const OrgChart = () => {
  const [departments, setDepartments] = useState<DepartmentGroup[]>([]);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, designation, department, avatar_url")
        .eq("status", "active")
        .order("department");

      if (data) {
        // Group by department
        const grouped = data.reduce((acc: Record<string, Employee[]>, emp) => {
          const dept = emp.department || "Unassigned";
          if (!acc[dept]) acc[dept] = [];
          acc[dept].push(emp);
          return acc;
        }, {});

        const deptGroups = Object.entries(grouped).map(([name, employees]) => ({
          name,
          employees,
        }));

        setDepartments(deptGroups);
        // Expand all by default
        setExpandedDepts(new Set(deptGroups.map((d) => d.name)));
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDepartment = (deptName: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptName)) {
      newExpanded.delete(deptName);
    } else {
      newExpanded.add(deptName);
    }
    setExpandedDepts(newExpanded);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const totalEmployees = departments.reduce((sum, d) => sum + d.employees.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <Header />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Organization Chart</h2>
              <p className="text-muted-foreground">Company structure and team hierarchy</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalEmployees}</p>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{departments.length}</p>
                  <p className="text-sm text-muted-foreground">Departments</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(totalEmployees / (departments.length || 1))}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg per Dept</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Org Chart */}
          <div className="space-y-4">
            {loading ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Loading organization chart...</p>
              </Card>
            ) : departments.length > 0 ? (
              departments.map((dept) => (
                <Card key={dept.name} className="shadow-card overflow-hidden">
                  <button
                    onClick={() => toggleDepartment(dept.name)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">{dept.name}</span>
                      <Badge variant="secondary">{dept.employees.length} members</Badge>
                    </div>
                    {expandedDepts.has(dept.name) ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedDepts.has(dept.name) && (
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {dept.employees.map((emp) => (
                        <div
                          key={emp.id}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={emp.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(emp.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{emp.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {emp.designation || "Employee"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No employees found</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrgChart;
