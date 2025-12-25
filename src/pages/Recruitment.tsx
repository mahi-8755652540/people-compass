import { useState } from "react";
import {
  Briefcase,
  Plus,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Mail,
  Phone,
  MoreHorizontal,
  Eye,
  UserPlus,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobOpening {
  id: number;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  applicants: number;
  posted: string;
  status: "open" | "closed" | "on-hold";
}

interface Candidate {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  position: string;
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
  appliedDate: string;
  rating: number;
}

interface Interview {
  id: number;
  candidate: string;
  avatar: string;
  position: string;
  date: string;
  time: string;
  type: "phone" | "video" | "onsite";
  interviewer: string;
}

const initialJobOpenings: JobOpening[] = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "San Francisco", type: "full-time", applicants: 24, posted: "Dec 10, 2025", status: "open" },
  { id: 2, title: "Product Manager", department: "Product", location: "New York", type: "full-time", applicants: 18, posted: "Dec 15, 2025", status: "open" },
  { id: 3, title: "UX Designer", department: "Design", location: "Remote", type: "remote", applicants: 32, posted: "Dec 5, 2025", status: "open" },
  { id: 4, title: "Data Analyst", department: "Analytics", location: "Seattle", type: "full-time", applicants: 15, posted: "Dec 18, 2025", status: "open" },
  { id: 5, title: "Marketing Specialist", department: "Marketing", location: "Los Angeles", type: "contract", applicants: 8, posted: "Dec 20, 2025", status: "on-hold" },
];

const initialCandidates: Candidate[] = [
  { id: 1, name: "Sarah Mitchell", avatar: "SM", email: "sarah.m@email.com", phone: "+1 555-0201", position: "Senior Frontend Developer", stage: "interview", appliedDate: "Dec 12, 2025", rating: 4 },
  { id: 2, name: "John Anderson", avatar: "JA", email: "john.a@email.com", phone: "+1 555-0202", position: "Product Manager", stage: "screening", appliedDate: "Dec 16, 2025", rating: 3 },
  { id: 3, name: "Emily Chen", avatar: "EC", email: "emily.c@email.com", phone: "+1 555-0203", position: "UX Designer", stage: "offer", appliedDate: "Dec 8, 2025", rating: 5 },
  { id: 4, name: "Michael Brown", avatar: "MB", email: "michael.b@email.com", phone: "+1 555-0204", position: "Senior Frontend Developer", stage: "applied", appliedDate: "Dec 22, 2025", rating: 0 },
  { id: 5, name: "Jessica Lee", avatar: "JL", email: "jessica.l@email.com", phone: "+1 555-0205", position: "Data Analyst", stage: "interview", appliedDate: "Dec 19, 2025", rating: 4 },
  { id: 6, name: "David Wilson", avatar: "DW", email: "david.w@email.com", phone: "+1 555-0206", position: "UX Designer", stage: "hired", appliedDate: "Nov 28, 2025", rating: 5 },
  { id: 7, name: "Amanda Garcia", avatar: "AG", email: "amanda.g@email.com", phone: "+1 555-0207", position: "Product Manager", stage: "rejected", appliedDate: "Dec 10, 2025", rating: 2 },
];

const initialInterviews: Interview[] = [
  { id: 1, candidate: "Sarah Mitchell", avatar: "SM", position: "Senior Frontend Developer", date: "Dec 26, 2025", time: "10:00 AM", type: "video", interviewer: "Michael Chen" },
  { id: 2, candidate: "Jessica Lee", avatar: "JL", position: "Data Analyst", date: "Dec 26, 2025", time: "2:00 PM", type: "onsite", interviewer: "David Kim" },
  { id: 3, candidate: "John Anderson", avatar: "JA", position: "Product Manager", date: "Dec 27, 2025", time: "11:00 AM", type: "phone", interviewer: "Emma Wilson" },
];

const stageColors = {
  applied: "bg-secondary text-secondary-foreground",
  screening: "bg-primary/10 text-primary",
  interview: "bg-warning/10 text-warning",
  offer: "bg-accent/10 text-accent",
  hired: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const typeColors = {
  "full-time": "bg-primary/10 text-primary",
  "part-time": "bg-accent/10 text-accent",
  contract: "bg-warning/10 text-warning",
  remote: "bg-success/10 text-success",
};

const interviewTypeIcons = {
  phone: Phone,
  video: Eye,
  onsite: Users,
};

const pipelineStages = ["applied", "screening", "interview", "offer", "hired"] as const;

const Recruitment = () => {
  const [jobOpenings] = useState<JobOpening[]>(initialJobOpenings);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [interviews] = useState<Interview[]>(initialInterviews);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const openJobs = jobOpenings.filter((j) => j.status === "open").length;
  const totalApplicants = jobOpenings.reduce((sum, j) => sum + j.applicants, 0);
  const inPipeline = candidates.filter((c) => !["hired", "rejected"].includes(c.stage)).length;

  const handleMoveStage = (candidateId: number, newStage: Candidate["stage"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
    const candidate = candidates.find((c) => c.id === candidateId);
    toast.success(`${candidate?.name} moved to ${newStage}`);
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setScheduleDialogOpen(true);
  };

  const handleConfirmSchedule = () => {
    if (selectedCandidate) {
      toast.success(`Interview scheduled for ${selectedCandidate.name}`);
      setScheduleDialogOpen(false);
      setSelectedCandidate(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64 min-h-screen">
        <h1 className="sr-only">Recruitment Management</h1>
        <Header />

        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Recruitment</h2>
              <p className="text-muted-foreground">Manage job postings and candidates</p>
            </div>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{openJobs}</p>
                  <p className="text-sm text-muted-foreground">Open Positions</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{totalApplicants}</p>
                  <p className="text-sm text-muted-foreground">Total Applicants</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{inPipeline}</p>
                  <p className="text-sm text-muted-foreground">In Pipeline</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {candidates.filter((c) => c.stage === "hired").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Hired This Month</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Job Openings */}
            <div className="lg:col-span-2">
              <Card className="shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <h3 className="font-display font-semibold text-lg text-foreground">Job Openings</h3>
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="divide-y divide-border">
                  {jobOpenings.slice(0, 4).map((job) => (
                    <div key={job.id} className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground">{job.title}</h4>
                            <Badge className={cn("text-xs", typeColors[job.type])} variant="secondary">
                              {job.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {job.applicants} applicants
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            job.status === "open" && "bg-success/10 text-success",
                            job.status === "closed" && "bg-destructive/10 text-destructive",
                            job.status === "on-hold" && "bg-warning/10 text-warning"
                          )}
                        >
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Upcoming Interviews */}
            <div>
              <Card className="shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <h3 className="font-display font-semibold text-lg text-foreground">Upcoming Interviews</h3>
                  <Badge variant="secondary">{interviews.length}</Badge>
                </div>
                <div className="divide-y divide-border">
                  {interviews.map((interview) => {
                    const TypeIcon = interviewTypeIcons[interview.type];
                    return (
                      <div key={interview.id} className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                            {interview.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{interview.candidate}</p>
                            <p className="text-sm text-muted-foreground truncate">{interview.position}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {interview.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {interview.time}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <TypeIcon className="w-3 h-3" />
                            {interview.type}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>

          {/* Candidate Pipeline */}
          <Card className="shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display font-semibold text-lg text-foreground">Candidate Pipeline</h3>
              <div className="flex items-center gap-2">
                {pipelineStages.map((stage) => (
                  <Badge key={stage} variant="outline" className="capitalize text-xs">
                    {stage}: {candidates.filter((c) => c.stage === stage).length}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {pipelineStages.map((stage) => (
                  <div key={stage} className="w-72 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground capitalize">{stage}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {candidates.filter((c) => c.stage === stage).length}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {candidates
                        .filter((c) => c.stage === stage)
                        .map((candidate) => (
                          <div
                            key={candidate.id}
                            className="bg-secondary/50 rounded-lg p-4 hover:bg-secondary/80 transition-colors group"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">
                                  {candidate.avatar}
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-foreground">{candidate.name}</p>
                                  <p className="text-xs text-muted-foreground">{candidate.position}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{candidate.email}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{candidate.appliedDate}</span>
                              <div className="flex gap-1">
                                {stage === "screening" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs"
                                    onClick={() => handleScheduleInterview(candidate)}
                                  >
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Schedule
                                  </Button>
                                )}
                                {stage !== "hired" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs text-success hover:text-success"
                                    onClick={() =>
                                      handleMoveStage(
                                        candidate.id,
                                        pipelineStages[pipelineStages.indexOf(stage) + 1] || "hired"
                                      )
                                    }
                                  >
                                    <ChevronRight className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      {candidates.filter((c) => c.stage === stage).length === 0 && (
                        <div className="text-center py-8 text-sm text-muted-foreground bg-secondary/30 rounded-lg">
                          No candidates
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Schedule Interview Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Schedule Interview</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {selectedCandidate.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedCandidate.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCandidate.position}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" defaultValue="2025-12-27" />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" defaultValue="10:00" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interview Type</Label>
                <Select defaultValue="video">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Interviewer</Label>
                <Select defaultValue="michael">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="michael">Michael Chen</SelectItem>
                    <SelectItem value="emma">Emma Wilson</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSchedule}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recruitment;
