import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import GetQuote from "@/pages/get-quote";
import Devices from "@/pages/devices";
import HowItWorksPage from "@/pages/how-it-works";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import AdminPage from "@/pages/admin";
import ThankYouPage from "@/pages/thank-you";
import { LiveSupportWidget } from "@/components/live-support/live-support-widget";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quote" component={GetQuote} />
      <Route path="/devices" component={Devices} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/thank-you/:id" component={ThankYouPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
          <LiveSupportWidget />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
