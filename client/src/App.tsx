import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AIChatBot } from "@/components/AIChatBot";
import Home from "@/pages/Home";
import ProjectDetails from "@/pages/ProjectDetails";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/project/*" component={ProjectDetails} />
      <Route path="/project/:slug" component={ProjectDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
        <WhatsAppButton />
        <AIChatBot />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
