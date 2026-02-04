import { useState } from "react";
import { Receipt, Plus, Calendar, IndianRupee, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  submittedBy: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  receiptUrl?: string;
}

const statusColors = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const Expenses = () => {
  const { isAdmin, isHR, profile } = useAuth();
  const [expenses] = useState<Expense[]>([
    {
      id: "1",
      title: "Client Meeting Travel",
      category: "Travel",
      amount: 2500,
      submittedBy: "Rahul Sharma",
      submittedDate: "2024-02-10",
      status: "pending",
    },
    {
      id: "2",
      title: "Office Supplies",
      category: "Office",
      amount: 1200,
      submittedBy: "Priya Singh",
      submittedDate: "2024-02-08",
      status: "approved",
    },
    {
      id: "3",
      title: "Team Lunch",
      category: "Food",
      amount: 3500,
      submittedBy: "Amit Kumar",
      submittedDate: "2024-02-05",
      status: "rejected",
    },
    {
      id: "4",
      title: "Software License",
      category: "Software",
      amount: 5000,
      submittedBy: "Neha Gupta",
      submittedDate: "2024-02-12",
      status: "pending",
    },
  ]);

  const canManage = isAdmin || isHR;

  const stats = {
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    pending: expenses.filter((e) => e.status === "pending").reduce((sum, e) => sum + e.amount, 0),
    approved: expenses.filter((e) => e.status === "approved").reduce((sum, e) => sum + e.amount, 0),
    rejected: expenses.filter((e) => e.status === "rejected").reduce((sum, e) => sum + e.amount, 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <Header />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Expense Management</h2>
              <p className="text-muted-foreground">Submit and track expense reimbursements</p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Submit Expense
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{stats.total.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{stats.pending.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{stats.approved.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </Card>
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{stats.rejected.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Expenses Table */}
          <Card className="shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-lg text-foreground">Recent Expenses</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  {canManage && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.title}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell>₹{expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{expense.submittedBy}</TableCell>
                    <TableCell>{new Date(expense.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[expense.status]}>{expense.status}</Badge>
                    </TableCell>
                    {canManage && (
                      <TableCell>
                        {expense.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-success">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive">
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Expenses;
