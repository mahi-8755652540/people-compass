import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  HardHat, 
  Plus, 
  Users, 
  Calendar, 
  TrendingUp, 
  IndianRupee, 
  MapPin,
  Phone,
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

interface Site {
  id: string;
  name: string;
  location: string;
  status: string;
}

interface Labourer {
  id: string;
  name: string;
  phone: string;
  aadhar_number: string;
  skill_type: string;
  daily_wage: number;
  site_id: string;
  status: string;
}

interface PaymentRequest {
  id: string;
  site_id: string;
  amount: number;
  description: string;
  status: string;
  request_date: string;
  sites?: { name: string };
}

const skillTypes = [
  { value: "mason", label: "Mason (Mistri)" },
  { value: "helper", label: "Helper" },
  { value: "carpenter", label: "Carpenter" },
  { value: "plumber", label: "Plumber" },
  { value: "electrician", label: "Electrician" },
  { value: "painter", label: "Painter" },
  { value: "welder", label: "Welder" },
  { value: "other", label: "Other" },
];

const LabourManagement = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [labourers, setLabourers] = useState<Labourer[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddLabourerOpen, setIsAddLabourerOpen] = useState(false);
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Form states
  const [newLabourer, setNewLabourer] = useState({
    name: "", phone: "", aadhar_number: "", skill_type: "helper", daily_wage: "", site_id: ""
  });
  const [newSite, setNewSite] = useState({ name: "", location: "" });
  const [newPayment, setNewPayment] = useState({ site_id: "", amount: "", description: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sitesRes, labourersRes, paymentsRes] = await Promise.all([
        supabase.from("sites").select("*").order("created_at", { ascending: false }),
        supabase.from("labourers").select("*").order("created_at", { ascending: false }),
        supabase.from("payment_requests").select("*, sites(name)").order("created_at", { ascending: false })
      ]);

      if (sitesRes.data) setSites(sitesRes.data);
      if (labourersRes.data) setLabourers(labourersRes.data);
      if (paymentsRes.data) setPaymentRequests(paymentsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleAddSite = async () => {
    if (!newSite.name) {
      toast({ title: "Error", description: "Site name is required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("sites").insert({
      name: newSite.name,
      location: newSite.location,
      contractor_id: user?.id
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Site added successfully" });
      setNewSite({ name: "", location: "" });
      setIsAddSiteOpen(false);
      fetchData();
    }
  };

  const handleAddLabourer = async () => {
    if (!newLabourer.name) {
      toast({ title: "Error", description: "Labourer name is required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("labourers").insert({
      name: newLabourer.name,
      phone: newLabourer.phone,
      aadhar_number: newLabourer.aadhar_number,
      skill_type: newLabourer.skill_type,
      daily_wage: newLabourer.daily_wage ? parseFloat(newLabourer.daily_wage) : null,
      site_id: newLabourer.site_id || null,
      contractor_id: user?.id
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Labourer added successfully" });
      setNewLabourer({ name: "", phone: "", aadhar_number: "", skill_type: "helper", daily_wage: "", site_id: "" });
      setIsAddLabourerOpen(false);
      fetchData();
    }
  };

  const handleAddPaymentRequest = async () => {
    if (!newPayment.site_id || !newPayment.amount) {
      toast({ title: "Error", description: "Site and amount are required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("payment_requests").insert({
      site_id: newPayment.site_id,
      amount: parseFloat(newPayment.amount),
      description: newPayment.description,
      contractor_id: user?.id
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Payment request submitted" });
      setNewPayment({ site_id: "", amount: "", description: "" });
      setIsAddPaymentOpen(false);
      fetchData();
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-warning/20 text-warning border-warning/30",
      approved: "bg-success/20 text-success border-success/30",
      rejected: "bg-destructive/20 text-destructive border-destructive/30",
      paid: "bg-primary/20 text-primary border-primary/30",
    };
    return <Badge variant="outline" className={styles[status] || ""}>{status}</Badge>;
  };

  const totalLabourers = labourers.length;
  const activeLabourers = labourers.filter(l => l.status === "active").length;
  const totalDailyWage = labourers.reduce((sum, l) => sum + (l.daily_wage || 0), 0);
  const pendingPayments = paymentRequests.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Labourers</p>
                    <p className="text-2xl font-bold">{totalLabourers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-success/10">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Workers</p>
                    <p className="text-2xl font-bold">{activeLabourers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-accent/10">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Sites</p>
                    <p className="text-2xl font-bold">{sites.filter(s => s.status === "active").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-warning/10">
                    <IndianRupee className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Payments</p>
                    <p className="text-2xl font-bold">₹{pendingPayments.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="labourers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="labourers">
                <HardHat className="h-4 w-4 mr-2" />
                Labourers
              </TabsTrigger>
              <TabsTrigger value="sites">
                <MapPin className="h-4 w-4 mr-2" />
                Sites
              </TabsTrigger>
              <TabsTrigger value="payments">
                <IndianRupee className="h-4 w-4 mr-2" />
                Payment Requests
              </TabsTrigger>
            </TabsList>

            {/* Labourers Tab */}
            <TabsContent value="labourers">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Labour List</CardTitle>
                    <CardDescription>Manage your labourers and workers</CardDescription>
                  </div>
                  <Dialog open={isAddLabourerOpen} onOpenChange={setIsAddLabourerOpen}>
                    <DialogTrigger asChild>
                      <Button><Plus className="h-4 w-4 mr-2" />Add Labourer</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Labourer</DialogTitle>
                        <DialogDescription>Enter labourer details</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Name *</Label>
                          <Input value={newLabourer.name} onChange={(e) => setNewLabourer({...newLabourer, name: e.target.value})} placeholder="Enter name" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Phone</Label>
                          <Input value={newLabourer.phone} onChange={(e) => setNewLabourer({...newLabourer, phone: e.target.value})} placeholder="Phone number" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Aadhar Number</Label>
                          <Input value={newLabourer.aadhar_number} onChange={(e) => setNewLabourer({...newLabourer, aadhar_number: e.target.value})} placeholder="Aadhar number" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Skill Type</Label>
                          <Select value={newLabourer.skill_type} onValueChange={(v) => setNewLabourer({...newLabourer, skill_type: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {skillTypes.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Daily Wage (₹)</Label>
                          <Input type="number" value={newLabourer.daily_wage} onChange={(e) => setNewLabourer({...newLabourer, daily_wage: e.target.value})} placeholder="Daily wage" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Assign to Site</Label>
                          <Select value={newLabourer.site_id} onValueChange={(v) => setNewLabourer({...newLabourer, site_id: v})}>
                            <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                            <SelectContent>
                              {sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddLabourerOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddLabourer}>Add Labourer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                  ) : labourers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <HardHat className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No labourers added yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Skill</TableHead>
                          <TableHead>Daily Wage</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {labourers.map((l) => (
                          <TableRow key={l.id}>
                            <TableCell className="font-medium">{l.name}</TableCell>
                            <TableCell>{l.phone || "-"}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{skillTypes.find(s => s.value === l.skill_type)?.label || l.skill_type}</Badge>
                            </TableCell>
                            <TableCell>₹{l.daily_wage?.toLocaleString() || "-"}</TableCell>
                            <TableCell>
                              <Badge variant={l.status === "active" ? "default" : "secondary"}>{l.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sites Tab */}
            <TabsContent value="sites">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sites / Projects</CardTitle>
                    <CardDescription>Manage your construction sites</CardDescription>
                  </div>
                  <Dialog open={isAddSiteOpen} onOpenChange={setIsAddSiteOpen}>
                    <DialogTrigger asChild>
                      <Button><Plus className="h-4 w-4 mr-2" />Add Site</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Site</DialogTitle>
                        <DialogDescription>Enter site details</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Site Name *</Label>
                          <Input value={newSite.name} onChange={(e) => setNewSite({...newSite, name: e.target.value})} placeholder="Enter site name" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Location</Label>
                          <Input value={newSite.location} onChange={(e) => setNewSite({...newSite, location: e.target.value})} placeholder="Site location" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddSiteOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddSite}>Add Site</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                  ) : sites.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No sites added yet</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {sites.map((site) => (
                        <Card key={site.id} className="border">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold">{site.name}</h3>
                              <Badge variant={site.status === "active" ? "default" : "secondary"}>{site.status}</Badge>
                            </div>
                            {site.location && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" />{site.location}
                              </p>
                            )}
                            <p className="text-sm mt-2">
                              {labourers.filter(l => l.site_id === site.id).length} labourers assigned
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Requests Tab */}
            <TabsContent value="payments">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Payment Requests</CardTitle>
                    <CardDescription>Request and track payments</CardDescription>
                  </div>
                  <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
                    <DialogTrigger asChild>
                      <Button><Plus className="h-4 w-4 mr-2" />New Request</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>New Payment Request</DialogTitle>
                        <DialogDescription>Submit a payment request</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Site *</Label>
                          <Select value={newPayment.site_id} onValueChange={(v) => setNewPayment({...newPayment, site_id: v})}>
                            <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                            <SelectContent>
                              {sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Amount (₹) *</Label>
                          <Input type="number" value={newPayment.amount} onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})} placeholder="Enter amount" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Description</Label>
                          <Textarea value={newPayment.description} onChange={(e) => setNewPayment({...newPayment, description: e.target.value})} placeholder="Payment description" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddPaymentOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddPaymentRequest}>Submit Request</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                  ) : paymentRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <IndianRupee className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No payment requests yet</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Site</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentRequests.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.sites?.name || "-"}</TableCell>
                            <TableCell>₹{p.amount.toLocaleString()}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{p.description || "-"}</TableCell>
                            <TableCell>{new Date(p.request_date).toLocaleDateString("en-IN")}</TableCell>
                            <TableCell>{getStatusBadge(p.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default LabourManagement;
