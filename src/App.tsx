
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RosePage from "./pages/RosePage";
import CounterPage from "./pages/CounterPage";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => {
  // State for duration to share between components
  const [duration, setDuration] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0
  });

  // State for couple names
  const [coupleNames, setCoupleNames] = useState<{ partner1: string; partner2: string } | null>(() => {
    const savedNames = localStorage.getItem('coupleNames');
    return savedNames ? JSON.parse(savedNames) : null;
  });

  // Fixed relationship start date: September 7, 2024
  const startDate = new Date(2024, 8, 7);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/rosa" 
              element={<RosePage duration={duration} />} 
            />
            <Route 
              path="/contador" 
              element={
                <CounterPage 
                  startDate={startDate} 
                  onTimeUpdate={setDuration} 
                  coupleNames={coupleNames} 
                />
              } 
            />
            <Route path="/sobre" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
