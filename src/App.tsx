import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Employees from "./pages/Employees";
import LeaveManagement from "./pages/LeaveManagement";
import Attendance from "./pages/Attendance";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/leave" element={<LeaveManagement />} />
          <Route path="/attendance" element={<Attendance />} />

          <Route path="/recruitment" element={<ComingSoon title="Recruitment" />} />
          <Route path="/documents" element={<ComingSoon title="Documents" />} />
          <Route path="/reports" element={<ComingSoon title="Reports" />} />
          <Route path="/notifications" element={<ComingSoon title="Notifications" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


