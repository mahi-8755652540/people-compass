import { MoreHorizontal, Mail, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEmployees } from "@/context/EmployeeContext";
import { Link } from "react-router-dom";

const statusStyles = {
  active: "bg-success",
  away: "bg-warning",
  offline: "bg-muted-foreground",
};

export const EmployeeList = () => {
  const { employees } = useEmployees();
  const displayedEmployees = employees.slice(0, 5);
  const uniqueDepartments = new Set(employees.map((e) => e.department)).size;

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">Team Directory</h3>
          <p className="text-sm text-muted-foreground">
            {employees.length} employee{employees.length !== 1 ? "s" : ""} across {uniqueDepartments || 0} department{uniqueDepartments !== 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/employees">View All</Link>
        </Button>
      </div>
      
      {displayedEmployees.length > 0 ? (
        <div className="divide-y divide-border">
          {displayedEmployees.map((employee) => (
            <div 
              key={employee.id} 
              className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors group"
            >
              <div className="relative">
                {employee.photo ? (
                  <img 
                    src={employee.photo} 
                    alt={employee.name}
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {employee.avatar}
                  </div>
                )}
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${statusStyles[employee.status]}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{employee.name}</p>
                <p className="text-sm text-muted-foreground truncate">{employee.role}</p>
              </div>
              
              <Badge variant="secondary" className="hidden sm:flex">
                {employee.department}
              </Badge>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No employees yet</p>
          <Button variant="link" size="sm" asChild className="mt-1">
            <Link to="/employees">Add your first employee</Link>
          </Button>
        </div>
      )}
    </div>
  );
};
