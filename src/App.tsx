import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { EmployeeProvider } from "@/context/EmployeeContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Employees from "./pages/Employees";
import LeaveManagement from "./pages/LeaveManagement";
import Attendance from "./pages/Attendance";
import Recruitment from "./pages/Recruitment";
import Documents from "./pages/Documents";
import Reports from "./pages/Reports";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";
import Labour from "./pages/Labour";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <EmployeeProvider>
            <Toaster />
            <Sonner />
            <ErrorBoundary>
              <Routes>
                {/* Public routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected routes - All authenticated users */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                
                {/* Admin & HR only */}
                <Route path="/employees" element={
                  <ProtectedRoute allowedRoles={["admin", "hr"]}>
                    <Employees />
                  </ProtectedRoute>
                } />
                
                {/* Admin, HR & Staff */}
                <Route path="/leave" element={
                  <ProtectedRoute allowedRoles={["admin", "hr", "staff"]}>
                    <LeaveManagement />
                  </ProtectedRoute>
                } />
                
                {/* All authenticated users */}
                <Route path="/attendance" element={
                  <ProtectedRoute>
                    <Attendance />
                  </ProtectedRoute>
                } />
                
                {/* Admin & HR only */}
                <Route path="/recruitment" element={
                  <ProtectedRoute allowedRoles={["admin", "hr"]}>
                    <Recruitment />
                  </ProtectedRoute>
                } />
                
                {/* All authenticated users */}
                <Route path="/documents" element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                } />
                
                {/* Admin & HR only */}
                <Route path="/reports" element={
                  <ProtectedRoute allowedRoles={["admin", "hr"]}>
                    <Reports />
                  </ProtectedRoute>
                } />

                {/* Admin & Contractor */}
                <Route path="/labour" element={
                  <ProtectedRoute allowedRoles={["admin", "contractor"]}>
                    <Labour />
                  </ProtectedRoute>
                } />

                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <ComingSoon title="Notifications" />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ComingSoon title="Settings" />
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <ComingSoon title="Calendar" description="Schedule and manage team events, meetings, and activities." />
                  </ProtectedRoute>
                } />
                <Route path="/payroll" element={
                  <ProtectedRoute allowedRoles={["admin", "hr"]}>
                    <ComingSoon title="Payroll" description="Process monthly payroll and manage salary disbursements." />
                  </ProtectedRoute>
                } />
                <Route path="/performance" element={
                  <ProtectedRoute allowedRoles={["admin", "hr"]}>
                    <ComingSoon title="Performance" description="Review employee evaluations and performance metrics." />
                  </ProtectedRoute>
                } />
                <Route path="/recognitions" element={
                  <ProtectedRoute>
                    <ComingSoon title="Recognitions" description="Celebrate team wins and employee achievements." />
                  </ProtectedRoute>
                } />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </EmployeeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
