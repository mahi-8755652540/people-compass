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
  IndianRupee, 
  Download, 
  Search, 
  Users, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { useEmployees } from "@/context/EmployeeContext";
import { SalarySlipDialog } from "@/components/payroll/SalarySlipDialog";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const currentMonth = months[new Date().getMonth()];

const Payroll = () => {
  const { employees } = useEmployees();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [salarySlipOpen, setSalarySlipOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Parse salary string to number
  const parseSalary = (salaryStr: string | undefined): number => {
    if (!salaryStr) return 50000;
    const num = parseInt(salaryStr.replace(/[₹,\s]/g, ''));
    return isNaN(num) ? 50000 : num;
  };

  // Generate payroll data from employees
  const payrollData = employees.map((emp, index) => {
    const basicSalary = parseSalary(emp.salary);
    const hra = Math.round(basicSalary * 0.4);
    const conveyance = 1600;
    const medicalAllowance = 1250;
    const specialAllowance = Math.round(basicSalary * 0.15);
    
    const totalEarnings = basicSalary + hra + conveyance + medicalAllowance + specialAllowance;
    
    const pf = Math.round(basicSalary * 0.12);
    const esi = totalEarnings > 21000 ? 0 : Math.round(totalEarnings * 0.0075);
    const professionalTax = 200;
    const tds = totalEarnings > 50000 ? Math.round(totalEarnings * 0.1) : 0;
    
    const totalDeductions = pf + esi + professionalTax + tds;
    const netPay = totalEarnings - totalDeductions;

    return {
      id: emp.id,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      designation: emp.designation || emp.role,
      basicSalary,
      hra,
      conveyance,
      medicalAllowance,
      specialAllowance,
      totalEarnings,
      pf,
      esi,
      professionalTax,
      tds,
      otherDeductions: 0,
      totalDeductions,
      netPay,
      bankName: emp.bankDetails?.bankName,
      accountNumber: emp.bankDetails?.accountNumber,
      workingDays: 26,
      presentDays: 24 - (index % 3),
      leaveDays: index % 3,
      status: index % 4 === 0 ? "paid" : index % 4 === 1 ? "pending" : index % 4 === 2 ? "processing" : "paid",
    };
  });

  const filteredPayroll = payrollData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPayroll = payrollData.reduce((sum, item) => sum + item.netPay, 0);
  const paidCount = payrollData.filter(p => p.status === "paid").length;
  const pendingCount = payrollData.filter(p => p.status === "pending").length;
  const processingCount = payrollData.filter(p => p.status === "processing").length;

  const stats = [
    { label: "Total Payroll", value: `₹${totalPayroll.toLocaleString('en-IN')}`, icon: IndianRupee, color: "text-primary", bg: "bg-primary/10" },
    { label: "Employees Paid", value: paidCount.toString(), icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    { label: "Pending", value: pendingCount.toString(), icon: Clock, color: "text-warning", bg: "bg-warning/10" },
    { label: "Processing", value: processingCount.toString(), icon: AlertCircle, color: "text-accent", bg: "bg-accent/10" },
  ];

  const statusColors = {
    paid: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    processing: "bg-accent/10 text-accent border-accent/20",
  };

  const handleRunPayroll = () => {
    toast.success(`Payroll processing started for ${selectedMonth} ${selectedYear}`);
  };

  const handleDownloadReport = () => {
    toast.success("Payroll report download started");
  };

  const handleViewSalarySlip = (employee: any) => {
    setSelectedEmployee({
      employeeName: employee.name,
      employeeId: `EMP${String(employee.id).padStart(4, '0')}`,
      department: employee.department,
      designation: employee.designation,
      email: employee.email,
      phone: employee.phone,
      bankName: employee.bankName,
      accountNumber: employee.accountNumber,
      month: selectedMonth,
      year: selectedYear,
      basicSalary: employee.basicSalary,
      hra: employee.hra,
      conveyance: employee.conveyance,
      medicalAllowance: employee.medicalAllowance,
      specialAllowance: employee.specialAllowance,
      pf: employee.pf,
      esi: employee.esi,
      professionalTax: employee.professionalTax,
      tds: employee.tds,
      otherDeductions: employee.otherDeductions,
      workingDays: employee.workingDays,
      presentDays: employee.presentDays,
      leaveDays: employee.leaveDays,
    });
    setSalarySlipOpen(true);
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
                <IndianRupee className="w-4 h-4 mr-2" />
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
                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
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
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Payroll Details - {selectedMonth} {selectedYear}
                </CardTitle>
                <div className="flex gap-3 flex-wrap">
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
                    <SelectTrigger className="w-36">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
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
                    <TableHead className="text-right">Gross Salary</TableHead>
                    <TableHead className="text-right">Deductions</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Salary Slip</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayroll.length > 0 ? (
                    filteredPayroll.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.designation}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell className="text-right text-success font-medium">
                          ₹{item.totalEarnings.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right text-destructive">
                          ₹{item.totalDeductions.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{item.netPay.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={`capitalize ${statusColors[item.status as keyof typeof statusColors]}`}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewSalarySlip(item)}
                            className="gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-10 h-10 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No payroll records found</p>
                          <p className="text-sm text-muted-foreground">Add employees to generate payroll data</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Salary Slip Dialog */}
      <SalarySlipDialog
        open={salarySlipOpen}
        onOpenChange={setSalarySlipOpen}
        data={selectedEmployee}
      />
    </div>
  );
};

export default Payroll;
