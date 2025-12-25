import { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  PieChart,
  Filter,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const attendanceData = [
  { month: "Jul", present: 92, absent: 5, late: 3 },
  { month: "Aug", present: 94, absent: 4, late: 2 },
  { month: "Sep", present: 91, absent: 6, late: 3 },
  { month: "Oct", present: 95, absent: 3, late: 2 },
  { month: "Nov", present: 93, absent: 4, late: 3 },
  { month: "Dec", present: 89, absent: 7, late: 4 },
];

const leaveData = [
  { month: "Jul", vacation: 45, sick: 12, personal: 8 },
  { month: "Aug", vacation: 62, sick: 8, personal: 5 },
  { month: "Sep", vacation: 38, sick: 15, personal: 10 },
  { month: "Oct", vacation: 28, sick: 18, personal: 7 },
  { month: "Nov", vacation: 35, sick: 22, personal: 12 },
  { month: "Dec", vacation: 85, sick: 10, personal: 6 },
];

const departmentDistribution = [
  { name: "Engineering", value: 68, color: "hsl(var(--primary))" },
  { name: "Product", value: 24, color: "hsl(var(--accent))" },
  { name: "Design", value: 18, color: "hsl(var(--success))" },
  { name: "Marketing", value: 32, color: "hsl(var(--warning))" },
  { name: "Sales", value: 45, color: "hsl(var(--destructive))" },
  { name: "HR", value: 12, color: "hsl(220, 70%, 50%)" },
  { name: "Analytics", value: 15, color: "hsl(280, 70%, 50%)" },
  { name: "Operations", value: 34, color: "hsl(160, 70%, 40%)" },
];

const headcountTrend = [
  { month: "Jan", count: 210 },
  { month: "Feb", count: 215 },
  { month: "Mar", count: 218 },
  { month: "Apr", count: 225 },
  { month: "May", count: 230 },
  { month: "Jun", count: 235 },
  { month: "Jul", count: 238 },
  { month: "Aug", count: 240 },
  { month: "Sep", count: 242 },
  { month: "Oct", count: 245 },
  { month: "Nov", count: 246 },
  { month: "Dec", count: 248 },
];

const availableReports = [
  { id: 1, name: "Monthly Attendance Report", type: "attendance", format: "PDF", lastGenerated: "Dec 24, 2025" },
  { id: 2, name: "Leave Summary Q4 2025", type: "leave", format: "Excel", lastGenerated: "Dec 23, 2025" },
  { id: 3, name: "Headcount Analysis", type: "headcount", format: "PDF", lastGenerated: "Dec 20, 2025" },
  { id: 4, name: "Department Breakdown", type: "department", format: "Excel", lastGenerated: "Dec 18, 2025" },
  { id: 5, name: "Overtime Report", type: "attendance", format: "PDF", lastGenerated: "Dec 15, 2025" },
  { id: 6, name: "Turnover Analysis", type: "headcount", format: "PDF", lastGenerated: "Dec 10, 2025" },
];

const generateCSV = (data: Record<string, unknown>[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => row[h]).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generateTextReport = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Reports = () => {
  const [timePeriod, setTimePeriod] = useState("6months");

  const handleDownload = (reportName: string, format: string, type?: string) => {
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    
    if (format === "Excel" || format === "CSV") {
      let data: Record<string, unknown>[] = [];
      
      if (type === "attendance" || reportName.toLowerCase().includes("attendance")) {
        data = attendanceData.map((d) => ({
          Month: d.month,
          "Present %": d.present,
          "Absent %": d.absent,
          "Late %": d.late,
        }));
      } else if (type === "leave" || reportName.toLowerCase().includes("leave")) {
        data = leaveData.map((d) => ({
          Month: d.month,
          "Vacation Days": d.vacation,
          "Sick Days": d.sick,
          "Personal Days": d.personal,
        }));
      } else if (type === "department" || reportName.toLowerCase().includes("department")) {
        data = departmentDistribution.map((d) => ({
          Department: d.name,
          "Employee Count": d.value,
        }));
      } else if (type === "headcount" || reportName.toLowerCase().includes("headcount")) {
        data = headcountTrend.map((d) => ({
          Month: d.month,
          "Employee Count": d.count,
        }));
      }

      if (data.length > 0) {
        generateCSV(data, reportName.replace(/\s+/g, "_"));
        toast.success(`${reportName} downloaded successfully!`);
      }
    } else {
      // Generate text report for PDF format
      let content = `${reportName}\nGenerated: ${date}\n\n`;
      
      if (type === "attendance" || reportName.toLowerCase().includes("attendance")) {
        content += "ATTENDANCE REPORT\n";
        content += "=================\n\n";
        content += "Month\t\tPresent %\tAbsent %\tLate %\n";
        content += "-----\t\t---------\t--------\t------\n";
        attendanceData.forEach((d) => {
          content += `${d.month}\t\t${d.present}%\t\t${d.absent}%\t\t${d.late}%\n`;
        });
        content += "\n\nSummary:\n";
        content += `Average Attendance: 92.3%\n`;
        content += `Total Late Arrivals: 17\n`;
      } else if (type === "headcount" || reportName.toLowerCase().includes("headcount") || reportName.toLowerCase().includes("turnover")) {
        content += "HEADCOUNT ANALYSIS\n";
        content += "==================\n\n";
        content += "Month\t\tEmployee Count\n";
        content += "-----\t\t--------------\n";
        headcountTrend.forEach((d) => {
          content += `${d.month}\t\t${d.count}\n`;
        });
        content += "\n\nSummary:\n";
        content += `Starting Headcount (Jan): 210\n`;
        content += `Current Headcount (Dec): 248\n`;
        content += `Net Growth: +38 employees\n`;
        content += `Turnover Rate: 4.2%\n`;
      } else {
        content += "GENERAL REPORT\n";
        content += "==============\n\n";
        content += "Report data will be included here.\n";
      }

      generateTextReport(content, reportName.replace(/\s+/g, "_"));
      toast.success(`${reportName} downloaded successfully!`);
    }
  };

  const handleGenerateReport = (type: string) => {
    toast.success(`Generating ${type} report...`);
    
    setTimeout(() => {
      handleDownload(`${type.charAt(0).toUpperCase() + type.slice(1)} Report`, "CSV", type);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64 min-h-screen">
        <h1 className="sr-only">Reports & Analytics</h1>
        <Header />

        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Reports & Analytics</h2>
              <p className="text-muted-foreground">View analytics and generate reports</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="default" onClick={() => handleGenerateReport("custom")}>
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Attendance Rate</p>
                  <p className="text-2xl font-bold text-foreground mt-1">92.3%</p>
                </div>
                <div className="flex items-center gap-1 text-success text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+2.1%</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Leave Utilization</p>
                  <p className="text-2xl font-bold text-foreground mt-1">68%</p>
                </div>
                <div className="flex items-center gap-1 text-warning text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5.3%</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Turnover Rate</p>
                  <p className="text-2xl font-bold text-foreground mt-1">4.2%</p>
                </div>
                <div className="flex items-center gap-1 text-success text-sm">
                  <TrendingDown className="w-4 h-4" />
                  <span>-1.5%</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Work Hours</p>
                  <p className="text-2xl font-bold text-foreground mt-1">8.2h</p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>On target</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Analytics */}
            <Card className="shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-lg text-foreground">Attendance Analytics</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDownload("Attendance Report", "CSV", "attendance")}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="present" name="Present %" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" name="Absent %" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" name="Late %" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Leave Trends */}
            <Card className="shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-semibold text-lg text-foreground">Leave Trends</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDownload("Leave Report", "Excel", "leave")}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={leaveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="vacation"
                      name="Vacation"
                      stackId="1"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="sick"
                      name="Sick Leave"
                      stackId="1"
                      stroke="hsl(var(--warning))"
                      fill="hsl(var(--warning))"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="personal"
                      name="Personal"
                      stackId="1"
                      stroke="hsl(var(--accent))"
                      fill="hsl(var(--accent))"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department Distribution */}
            <Card className="shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-warning" />
                  <h3 className="font-display font-semibold text-lg text-foreground">By Department</h3>
                </div>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <RechartsPieChart>
                    <Pie
                      data={departmentDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {departmentDistribution.slice(0, 6).map((dept) => (
                    <div key={dept.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                      <span className="text-muted-foreground truncate">{dept.name}</span>
                      <span className="text-foreground font-medium ml-auto">{dept.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Headcount Trend */}
            <Card className="shadow-card overflow-hidden lg:col-span-2">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-success" />
                  <h3 className="font-display font-semibold text-lg text-foreground">Headcount Trend</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDownload("Headcount Report", "CSV", "headcount")}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={headcountTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[200, 260]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Employees"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Available Reports */}
          <Card className="shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-lg text-foreground">Available Reports</h3>
              </div>
              <Badge variant="secondary">{availableReports.length} reports</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Report Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Format</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Last Generated</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {availableReports.map((report) => (
                    <tr key={report.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <span className="font-medium text-foreground">{report.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="capitalize">
                          {report.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            report.format === "PDF" && "border-destructive/50 text-destructive",
                            report.format === "Excel" && "border-success/50 text-success"
                          )}
                        >
                          {report.format}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{report.lastGenerated}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(report.name, report.format, report.type)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGenerateReport(report.type)}
                          >
                            Regenerate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Reports;
