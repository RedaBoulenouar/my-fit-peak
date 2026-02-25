import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter , Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import WorkoutGenerator from "./pages/WorkoutGenerator";
import ProgressTracker from "./pages/ProgressTracker";
import MacroCalculator from "./pages/MacroCalculator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter >
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/workout" element={<WorkoutGenerator />} />
          <Route path="/progress" element={<ProgressTracker />} />
          <Route path="/macros" element={<MacroCalculator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
