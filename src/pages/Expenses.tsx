import { useState, useEffect } from "react";
import { Receipt, Plus, Calendar, IndianRupee, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  description: string | null;
  submitted_by_name: string | null;
  submitted_date: string;
  status: "pending" | "approved" | "rejected";
}

const statusColors = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const categories = ["Travel", "Food", "Office", "Software", "Equipment", "Training", "Other"];

const Expenses = () => {
  const { isAdmin, isHR, profile, user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    category: "Other",
    amount: "",
    description: "",
  });

  const canManage = isAdmin || isHR;

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExpenses(data?.map(e => ({
        ...e,
        status: e.status as "pending" | "approved" | "rejected"
      })) || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: expenses.reduce((sum, e) => sum + Number(e.amount), 0),
    pending: expenses.filter((e) => e.status === "pending").reduce((sum, e) => sum + Number(e.amount), 0),
    approved: expenses.filter((e) => e.status === "approved").reduce((sum, e) => sum + Number(e.amount), 0),
    rejected: expenses.filter((e) => e.status === "rejected").reduce((sum, e) => sum + Number(e.amount), 0),
  };

  const handleSubmit = async () => {
    if (!newExpense.title.trim() || !newExpense.amount) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          title: newExpense.title.trim(),
          category: newExpense.category,
          amount: parseFloat(newExpense.amount),
          description: newExpense.description.trim() || null,
          submitted_by: user?.id,
          submitted_by_name: profile?.name || "Employee",
        })
        .select()
        .single();

      if (error) throw error;

      setExpenses([{
        ...data,
        status: data.status as "pending" | "approved" | "rejected"
      }, ...expenses]);
      toast.success("Expense submitted successfully!");
      setDialogOpen(false);
      setNewExpense({ title: "", category: "Other", amount: "", description: "" });
    } catch (error) {
      console.error("Error submitting expense:", error);
      toast.error("Failed to submit expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .update({ status: "approved", approved_by: user?.id, approved_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      setExpenses(expenses.map(e => e.id === id ? { ...e, status: "approved" as const } : e));
      toast.success("Expense approved");
    } catch (error) {
      console.error("Error approving expense:", error);
      toast.error("Failed to approve expense");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from("expenses")
        .update({ status: "rejected", approved_by: user?.id, approved_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      setExpenses(expenses.map(e => e.id === id ? { ...e, status: "rejected" as const } : e));
      toast.success("Expense rejected");
    } catch (error) {
      console.error("Error rejecting expense:", error);
      toast.error("Failed to reject expense");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-64 min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

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
            <Button onClick={() => setDialogOpen(true)}>
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
            {expenses.length > 0 ? (
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
                      <TableCell>₹{Number(expense.amount).toLocaleString()}</TableCell>
                      <TableCell>{expense.submitted_by_name || "Employee"}</TableCell>
                      <TableCell>{new Date(expense.submitted_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[expense.status]}>{expense.status}</Badge>
                      </TableCell>
                      {canManage && (
                        <TableCell>
                          {expense.status === "pending" && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-success" onClick={() => handleApprove(expense.id)}>
                                Approve
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleReject(expense.id)}>
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
            ) : (
              <div className="p-12 text-center">
                <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No expenses submitted yet</p>
                <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit First Expense
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>

      {/* Submit Expense Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="e.g., Client Meeting Travel"
                value={newExpense.title}
                onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount (₹) *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Additional details..."
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
