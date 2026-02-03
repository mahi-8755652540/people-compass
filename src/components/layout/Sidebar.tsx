import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  Settings, 
  ChevronLeft,
  Building2,
  UserCircle,
  Briefcase,
  PieChart,
  Bell,
  HardHat,
  ListTodo
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { useEmployees } from "@/context/EmployeeContext";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

type AppRole = "admin" | "hr" | "staff" | "contractor";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  allowedRoles?: AppRole[];
}

const roleLabels: Record<string, { label: string; color: string }> = {
  admin: { label: "👑 Admin", color: "text-destructive" },
  hr: { label: "🧑‍💼 HR", color: "text-primary" },
  staff: { label: "👷 Staff", color: "text-accent" },
  contractor: { label: "🏗️ Site Supervisor", color: "text-warning" },
};

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { employees } = useEmployees();
  const { profile, role } = useAuth();

  const onLeaveCount = employees.filter((e) => e.status === "away").length;

  const mainNavItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/", allowedRoles: ["admin", "hr"] },
    { icon: LayoutDashboard, label: "My Dashboard", href: "/my-dashboard", allowedRoles: ["staff", "contractor"] },
    { icon: Users, label: "Employees", href: "/employees", badge: employees.length || undefined, allowedRoles: ["admin", "hr"] },
    { icon: Calendar, label: "Leave Management", href: "/leave", badge: onLeaveCount || undefined, allowedRoles: ["admin", "hr", "staff"] },
    { icon: Clock, label: "Attendance", href: "/attendance", allowedRoles: ["admin", "hr", "contractor"] },
    { icon: Briefcase, label: "Recruitment", href: "/recruitment", badge: 12, allowedRoles: ["admin", "hr"] },
    { icon: ListTodo, label: "Tasks", href: "/tasks" },
    { icon: FileText, label: "Documents", href: "/documents", allowedRoles: ["admin", "hr"] },
    { icon: PieChart, label: "Reports", href: "/reports", allowedRoles: ["admin", "hr"] },
    { icon: HardHat, label: "Labour Management", href: "/labour", allowedRoles: ["admin", "contractor"] },
  ];

  const bottomNavItems: NavItem[] = [
    { icon: Bell, label: "Notifications", href: "/notifications", badge: 3 },
    { icon: Settings, label: "Settings", href: "/settings", allowedRoles: ["admin"] },
  ];

  const isActive = (href: string) => {
    if (href === "/" || href === "/my-dashboard") {
      return location.pathname === "/" || location.pathname === "/my-dashboard";
    }
    return location.pathname.startsWith(href);
  };

  const canAccess = (item: NavItem) => {
    // Allow access if no role restrictions or if role is still loading
    if (!item.allowedRoles) return true;
    if (!role) return true; // Allow access while role is loading - RLS will protect data
    return item.allowedRoles.includes(role);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <img src="/favicon.png" alt="SSS Core App" className="w-10 h-10 object-contain" />
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-display font-bold text-lg text-sidebar-foreground">SSS Core</h1>
            <p className="text-xs text-sidebar-foreground/60">Employee Management</p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainNavItems.filter(canAccess).map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
              isActive(item.href) 
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0", isActive(item.href) && "drop-shadow-sm")} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.badge !== undefined && (
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full",
                    isActive(item.href) 
                      ? "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground" 
                      : "bg-sidebar-accent text-sidebar-foreground/80"
                  )}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        {bottomNavItems.filter(canAccess).map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              isActive(item.href) 
                ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-destructive text-destructive-foreground">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 px-3 py-3 mt-4 rounded-lg bg-sidebar-accent/50",
          collapsed && "justify-center"
        )}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            {profile?.name ? (
              <span className="text-sm font-bold text-primary-foreground">{getInitials(profile.name)}</span>
            ) : (
              <UserCircle className="w-5 h-5 text-primary-foreground" />
            )}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{profile?.name || "User"}</p>
              <p className={cn("text-xs truncate", role ? roleLabels[role]?.color : "text-sidebar-foreground/60")}>
                {role ? roleLabels[role]?.label : "👷 Staff"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-card flex items-center justify-center hover:bg-secondary transition-colors"
      >
        <ChevronLeft className={cn("w-4 h-4 text-muted-foreground transition-transform", collapsed && "rotate-180")} />
      </button>
    </aside>
  );
};
