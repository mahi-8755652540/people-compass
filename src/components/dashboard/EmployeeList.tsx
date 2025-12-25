import { MoreHorizontal, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  status: "active" | "away" | "offline";
  avatar: string;
}

const employees: Employee[] = [
  { id: 1, name: "Michael Chen", role: "Senior Developer", department: "Engineering", status: "active", avatar: "MC" },
  { id: 2, name: "Emma Wilson", role: "Product Manager", department: "Product", status: "active", avatar: "EW" },
  { id: 3, name: "James Rodriguez", role: "UX Designer", department: "Design", status: "away", avatar: "JR" },
  { id: 4, name: "Sophia Turner", role: "HR Specialist", department: "Human Resources", status: "active", avatar: "ST" },
  { id: 5, name: "David Kim", role: "Data Analyst", department: "Analytics", status: "offline", avatar: "DK" },
];

const statusStyles = {
  active: "bg-success",
  away: "bg-warning",
  offline: "bg-muted-foreground",
};

export const EmployeeList = () => {
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground">Team Directory</h3>
          <p className="text-sm text-muted-foreground">248 employees across 12 departments</p>
        </div>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      
      <div className="divide-y divide-border">
        {employees.map((employee) => (
          <div 
            key={employee.id} 
            className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors group"
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {employee.avatar}
              </div>
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
    </div>
  );
};
