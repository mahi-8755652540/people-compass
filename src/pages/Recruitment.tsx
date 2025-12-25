import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Plus,
  Users,
  Clock,
  CheckCircle,
  MapPin,
  Calendar,
  ChevronRight,
  Mail,
  Phone,
  MoreHorizontal,
  Eye,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

// Job form validation schema
const jobSchema = z.object({
  title: z.string().trim().min(2, "Job title is required").max(100),
  department: z.string().trim().min(1, "Department is required").max(50),
  location: z.string().trim().min(2, "Location is required").max(100),
  type: z.string().min(1, "Job type is required"),
  description: z.string().trim().max(2000).optional(),
});

type JobFormData = z.infer<typeof jobSchema>;

const departments = ["Engineering", "Product", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"];
const jobTypes = ["full-time", "part-time", "contract", "remote"];

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  applicants: number;
  posted: string;
  status: string;
}

interface Candidate {
  id: string;
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
  id: string;
  candidate: string;
  avatar: string;
  position: string;
  date: string;
  time: string;
  type: "phone" | "video" | "onsite";
  interviewer: string;
}

const stageColors = {
  applied: "bg-secondary text-secondary-foreground",
  screening: "bg-primary/10 text-primary",
  interview: "bg-warning/10 text-warning",
  offer: "bg-accent/10 text-accent",
  hired: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

const typeColors: Record<string, string> = {
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
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [addJobDialogOpen, setAddJobDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch job openings
      const { data: jobsData } = await supabase
        .from("job_openings")
        .select("*")
        .order("created_at", { ascending: false });

      if (jobsData) {
        setJobOpenings(jobsData.map(job => ({
          id: job.id,
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type || "full-time",
          applicants: job.applicants || 0,
          posted: job.posted ? new Date(job.posted).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
          status: job.status || "open"
        })));
      }

      // Fetch candidates
      const { data: candidatesData } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });

      if (candidatesData) {
        setCandidates(candidatesData.map(c => ({
          id: c.id,
          name: c.name,
          avatar: c.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
          email: c.email,
          phone: c.phone || "",
          position: c.position,
          stage: (c.stage || "applied") as Candidate["stage"],
          appliedDate: c.applied_date ? new Date(c.applied_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
          rating: c.rating || 0
        })));
      }

      // Fetch interviews
      const { data: interviewsData } = await supabase
        .from("interviews")
        .select("*, candidates(name, position)")
        .order("interview_date", { ascending: true });

      if (interviewsData) {
        setInterviews(interviewsData.map(i => ({
          id: i.id,
          candidate: (i.candidates as { name: string })?.name || "Unknown",
          avatar: ((i.candidates as { name: string })?.name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
          position: (i.candidates as { position: string })?.position || "N/A",
          date: i.interview_date ? new Date(i.interview_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
          time: i.interview_time || "N/A",
          type: (i.type || "video") as Interview["type"],
          interviewer: i.interviewer || "TBD"
        })));
      }
    } catch (error) {
      console.error("Error fetching recruitment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openJobs = jobOpenings.filter((j) => j.status === "open").length;
  const totalApplicants = jobOpenings.reduce((sum, j) => sum + j.applicants, 0);
  const inPipeline = candidates.filter((c) => !["hired", "rejected"].includes(c.stage)).length;

  const onSubmitJob = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      const { data: newJob, error } = await supabase
        .from("job_openings")
        .insert({
          title: data.title,
          department: data.department,
          location: data.location,
          type: data.type,
          description: data.description || null,
          status: "open",
          applicants: 0,
        })
        .select()
        .single();

      if (error) {
        toast.error("Failed to create job posting");
        console.error("Error creating job:", error);
        return;
      }

      if (newJob) {
        setJobOpenings((prev) => [
          {
            id: newJob.id,
            title: newJob.title,
            department: newJob.department,
            location: newJob.location,
            type: newJob.type || "full-time",
            applicants: 0,
            posted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status: "open",
          },
          ...prev,
        ]);
        toast.success(`Job "${data.title}" posted successfully!`);
        reset();
        setAddJobDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoveStage = async (candidateId: string, newStage: Candidate["stage"]) => {
    const { error } = await supabase
      .from("candidates")
      .update({ stage: newStage })
      .eq("id", candidateId);

    if (error) {
      toast.error("Failed to update candidate stage");
      return;
    }

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
            <Button variant="default" onClick={() => setAddJobDialogOpen(true)}>
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
                {jobOpenings.length > 0 ? (
                  <div className="divide-y divide-border">
                    {jobOpenings.slice(0, 4).map((job) => (
                      <div key={job.id} className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{job.title}</h4>
                              <Badge className={cn("text-xs", typeColors[job.type] || "bg-secondary")} variant="secondary">
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
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Briefcase className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No job openings yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Click "Post New Job" to create your first opening</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Upcoming Interviews */}
            <div>
              <Card className="shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <h3 className="font-display font-semibold text-lg text-foreground">Upcoming Interviews</h3>
                  <Badge variant="secondary">{interviews.length}</Badge>
                </div>
                {interviews.length > 0 ? (
                  <div className="divide-y divide-border">
                    {interviews.map((interview) => {
                      const TypeIcon = interviewTypeIcons[interview.type] || Eye;
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
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Calendar className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No interviews scheduled</p>
                  </div>
                )}
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
                <Input placeholder="Enter interviewer name" />
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

      {/* Add Job Dialog */}
      <Dialog open={addJobDialogOpen} onOpenChange={setAddJobDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Post New Job</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitJob)}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Frontend Developer"
                  {...register("title")}
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <Select onValueChange={(val) => setValue("department", val)}>
                    <SelectTrigger aria-invalid={!!errors.department}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-xs text-destructive">{errors.department.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Job Type *</Label>
                  <Select onValueChange={(val) => setValue("type", val)}>
                    <SelectTrigger aria-invalid={!!errors.type}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-xs text-destructive">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. Mumbai, Remote"
                  {...register("location")}
                  aria-invalid={!!errors.location}
                />
                {errors.location && (
                  <p className="text-xs text-destructive">{errors.location.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the role and responsibilities..."
                  rows={4}
                  {...register("description")}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setAddJobDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Job"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recruitment;
