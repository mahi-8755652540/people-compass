import { useState, useEffect } from "react";
import { Building2, Users, ChevronDown, ChevronRight, Crown, Shield, User, HardHat } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface OrgEmployee {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatar_url?: string;
  role: string;
}

const roleOrder: Record<string, number> = {
  admin: 0,
  hr: 1,
  staff: 2,
  contractor: 3,
};

const roleConfig: Record<string, { label: string; icon: typeof Crown; color: string }> = {
  admin: { label: "Admin", icon: Crown, color: "text-yellow-500" },
  hr: { label: "HR", icon: Shield, color: "text-blue-500" },
  staff: { label: "Staff", icon: User, color: "text-emerald-500" },
  contractor: { label: "Contractor", icon: HardHat, color: "text-orange-500" },
};

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const EmployeeNode = ({ emp, isRoot }: { emp: OrgEmployee; isRoot?: boolean }) => {
  const config = roleConfig[emp.role] || roleConfig.staff;
  const Icon = config.icon;

  return (
    <div className={`flex flex-col items-center ${isRoot ? "" : ""}`}>
      <div
        className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
          isRoot
            ? "border-primary bg-primary/5 shadow-md min-w-[180px]"
            : "border-border bg-card hover:border-primary/40 min-w-[160px]"
        }`}
      >
        <div className="relative mb-2">
          <Avatar className={`${isRoot ? "h-14 w-14" : "h-11 w-11"} ring-2 ring-background`}>
            <AvatarImage src={emp.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {getInitials(emp.name)}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border-2 border-background flex items-center justify-center`}>
            <Icon className={`w-3 h-3 ${config.color}`} />
          </div>
        </div>
        <p className={`font-semibold text-foreground text-center leading-tight ${isRoot ? "text-sm" : "text-xs"}`}>
          {emp.name}
        </p>
        <p className="text-xs text-muted-foreground text-center mt-0.5 leading-tight">
          {emp.designation || config.label}
        </p>
        {emp.department && (
          <Badge variant="secondary" className="mt-1.5 text-[10px] px-1.5 py-0">
            {emp.department}
          </Badge>
        )}
      </div>
    </div>
  );
};

const ConnectorLine = ({ type }: { type: "vertical" | "horizontal-group" }) => {
  if (type === "vertical") {
    return (
      <div className="flex justify-center">
        <div className="w-0.5 h-8 bg-border" />
      </div>
    );
  }
  return null;
};

const OrgChart = () => {
  const [employees, setEmployees] = useState<OrgEmployee[]>([]);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, designation, department, avatar_url, status")
        .eq("status", "active");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return;
      }

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        return;
      }

      const roleMap = new Map(roles?.map((r) => [r.user_id, r.role]) || []);

      const mapped: OrgEmployee[] = (profiles || []).map((p) => ({
        id: p.id,
        name: p.name,
        designation: p.designation || "",
        department: p.department || "General",
        avatar_url: p.avatar_url || undefined,
        role: roleMap.get(p.id) || "staff",
      }));

      setEmployees(mapped);

      // Expand all departments by default
      const depts = new Set(mapped.filter((e) => e.role === "staff" || e.role === "contractor").map((e) => e.department));
      setExpandedDepts(depts);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDept = (dept: string) => {
    setExpandedDepts((prev) => {
      const next = new Set(prev);
      next.has(dept) ? next.delete(dept) : next.add(dept);
      return next;
    });
  };

  // Categorize employees
  const admins = employees.filter((e) => e.role === "admin");
  const hrs = employees.filter((e) => e.role === "hr");
  const staffByDept = employees
    .filter((e) => e.role === "staff")
    .reduce((acc: Record<string, OrgEmployee[]>, e) => {
      if (!acc[e.department]) acc[e.department] = [];
      acc[e.department].push(e);
      return acc;
    }, {});
  const contractors = employees.filter((e) => e.role === "contractor");

  const departments = Object.keys(staffByDept).sort();
  const totalEmployees = employees.length;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <Header />
        <div className="p-6 space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Organization Chart</h2>
            <p className="text-muted-foreground">Company structure and team hierarchy</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{totalEmployees}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{admins.length}</p>
                  <p className="text-xs text-muted-foreground">Admins</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{hrs.length}</p>
                  <p className="text-xs text-muted-foreground">HR</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{departments.length}</p>
                  <p className="text-xs text-muted-foreground">Departments</p>
                </div>
              </div>
            </Card>
          </div>

          {loading ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Loading organization chart...</p>
            </Card>
          ) : employees.length === 0 ? (
            <Card className="p-12 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No employees found</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px] flex flex-col items-center py-6">
                {/* Level 1: Admins */}
                {admins.length > 0 && (
                  <>
                    <div className="flex gap-6 justify-center flex-wrap">
                      {admins.map((a) => (
                        <EmployeeNode key={a.id} emp={a} isRoot />
                      ))}
                    </div>
                    <ConnectorLine type="vertical" />
                  </>
                )}

                {/* Level 2: HR */}
                {hrs.length > 0 && (
                  <>
                    <div className="flex gap-6 justify-center flex-wrap">
                      {hrs.map((h) => (
                        <EmployeeNode key={h.id} emp={h} />
                      ))}
                    </div>
                    <ConnectorLine type="vertical" />
                  </>
                )}

                {/* Level 3: Departments with Staff */}
                {departments.length > 0 && (
                  <div className="w-full space-y-3">
                    {/* Horizontal connector bar */}
                    <div className="flex justify-center mb-2">
                      <div className="flex items-start gap-0">
                        <div className="border-t-2 border-border" style={{ width: `${Math.min(departments.length * 250, 900)}px` }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {departments.map((dept) => (
                        <Card key={dept} className="shadow-card overflow-hidden">
                          <button
                            onClick={() => toggleDept(dept)}
                            className="w-full px-4 py-3 flex items-center justify-between bg-secondary/30 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-sm text-foreground">{dept}</span>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {staffByDept[dept].length}
                              </Badge>
                            </div>
                            {expandedDepts.has(dept) ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>

                          {expandedDepts.has(dept) && (
                            <div className="p-3 space-y-2">
                              {staffByDept[dept].map((emp) => (
                                <div
                                  key={emp.id}
                                  className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                                >
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage src={emp.avatar_url || undefined} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                      {getInitials(emp.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-foreground truncate">{emp.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {emp.designation || "Employee"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level 4: Contractors */}
                {contractors.length > 0 && (
                  <>
                    <ConnectorLine type="vertical" />
                    <Card className="shadow-card overflow-hidden w-full max-w-3xl">
                      <div className="px-4 py-3 bg-orange-500/5 border-b border-border flex items-center gap-2">
                        <HardHat className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-sm text-foreground">Contractors / Site Supervisors</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {contractors.length}
                        </Badge>
                      </div>
                      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {contractors.map((emp) => (
                          <div
                            key={emp.id}
                            className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                          >
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={emp.avatar_url || undefined} />
                              <AvatarFallback className="bg-orange-500/10 text-orange-500 text-xs">
                                {getInitials(emp.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">{emp.name}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {emp.designation || "Site Supervisor"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrgChart;
