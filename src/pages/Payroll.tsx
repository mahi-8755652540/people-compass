import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DollarSign, 
  Download, 
  Search, 
  TrendingUp, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { useEmployees } from "@/context/EmployeeContext";

const Payroll = () => {
  const { employees } = useEmployees();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("December 2025");

  const payrollData = employees.map((emp, index) => ({
    id: emp.id,
    name: emp.name,
    department: emp.department,
    basicSalary: emp.salary || "₹50,000",
    allowances: "₹10,000",
    deductions: "₹5,000",
    netPay: "₹55,000",
    status: index % 3 === 0 ? "paid" : index % 3 === 1 ? "pending" : "processing",
  }));

  const filteredPayroll = payrollData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Payroll", value: "₹15,50,000", icon: DollarSign, color: "text-primary" },
    { label: "Employees Paid", value: "42", icon: CheckCircle, color: "text-success" },
    { label: "Pending", value: "8", icon: Clock, color: "text-warning" },
    { label: "Processing", value: "5", icon: AlertCircle, color: "text-accent" },
  ];

  const statusColors = {
    paid: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    processing: "bg-accent/10 text-accent border-accent/20",
  };

  const handleRunPayroll = () => {
    toast.success("Payroll processing started for " + selectedMonth);
  };

  const handleDownloadReport = () => {
    toast.success("Payroll report downloaded");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <Header />
        <section className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">Payroll Management</h1>
              <p className="text-muted-foreground">Process and manage monthly salary disbursements</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleDownloadReport}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button onClick={handleRunPayroll}>
                <DollarSign className="w-4 h-4 mr-2" />
                Run Payroll
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-secondary/50 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payroll Table */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payroll Details - {selectedMonth}</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-48">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="December 2025">December 2025</SelectItem>
                      <SelectItem value="November 2025">November 2025</SelectItem>
                      <SelectItem value="October 2025">October 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayroll.length > 0 ? (
                    filteredPayroll.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>{item.basicSalary}</TableCell>
                        <TableCell className="text-success">{item.allowances}</TableCell>
                        <TableCell className="text-destructive">{item.deductions}</TableCell>
                        <TableCell className="font-semibold">{item.netPay}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`capitalize ${statusColors[item.status as keyof typeof statusColors]}`}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No payroll records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Payroll;
