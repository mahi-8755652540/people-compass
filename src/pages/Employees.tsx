import { useState } from "react";
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, MapPin, Download } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  status: "active" | "away" | "offline";
  avatar: string;
  joinDate: string;
  phone: string;
}

const employees: Employee[] = [
  { id: 1, name: "Michael Chen", email: "michael.chen@hrcore.com", role: "Senior Developer", department: "Engineering", location: "San Francisco", status: "active", avatar: "MC", joinDate: "Jan 15, 2022", phone: "+1 555-0101" },
  { id: 2, name: "Emma Wilson", email: "emma.wilson@hrcore.com", role: "Product Manager", department: "Product", location: "New York", status: "active", avatar: "EW", joinDate: "Mar 8, 2021", phone: "+1 555-0102" },
  { id: 3, name: "James Rodriguez", email: "james.rodriguez@hrcore.com", role: "UX Designer", department: "Design", location: "Austin", status: "away", avatar: "JR", joinDate: "Jun 22, 2023", phone: "+1 555-0103" },
  { id: 4, name: "Sophia Turner", email: "sophia.turner@hrcore.com", role: "HR Specialist", department: "Human Resources", location: "Chicago", status: "active", avatar: "ST", joinDate: "Sep 5, 2020", phone: "+1 555-0104" },
  { id: 5, name: "David Kim", email: "david.kim@hrcore.com", role: "Data Analyst", department: "Analytics", location: "Seattle", status: "offline", avatar: "DK", joinDate: "Nov 12, 2022", phone: "+1 555-0105" },
  { id: 6, name: "Olivia Martinez", email: "olivia.martinez@hrcore.com", role: "Marketing Lead", department: "Marketing", location: "Los Angeles", status: "active", avatar: "OM", joinDate: "Feb 28, 2023", phone: "+1 555-0106" },
  { id: 7, name: "William Brown", email: "william.brown@hrcore.com", role: "Sales Executive", department: "Sales", location: "Boston", status: "active", avatar: "WB", joinDate: "Apr 10, 2021", phone: "+1 555-0107" },
  { id: 8, name: "Ava Johnson", email: "ava.johnson@hrcore.com", role: "Frontend Developer", department: "Engineering", location: "Denver", status: "away", avatar: "AJ", joinDate: "Aug 15, 2022", phone: "+1 555-0108" },
  { id: 9, name: "Ethan Davis", email: "ethan.davis@hrcore.com", role: "Backend Developer", department: "Engineering", location: "Portland", status: "active", avatar: "ED", joinDate: "Oct 3, 2023", phone: "+1 555-0109" },
  { id: 10, name: "Isabella Garcia", email: "isabella.garcia@hrcore.com", role: "Content Writer", department: "Marketing", location: "Miami", status: "active", avatar: "IG", joinDate: "Dec 20, 2022", phone: "+1 555-0110" },
];

const statusStyles = {
  active: "bg-success",
  away: "bg-warning",
  offline: "bg-muted-foreground",
};

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(employees.map(e => e.department))];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-64 min-h-screen">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Employees</h1>
              <p className="text-muted-foreground">Manage your team members and their information</p>
            </div>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {employee.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${statusStyles[employee.status]}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{employee.name}</h3>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{employee.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Badge variant="secondary">{employee.department}</Badge>
                  <span className="text-xs text-muted-foreground">Joined {employee.joinDate}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No employees found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Employees;
