
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AgentAuthProvider } from "@/contexts/AgentAuthContext";
import { ThemeProvider } from "@/hooks/useTheme";
import ProtectedRoute from "@/components/ProtectedRoute";
import AgentProtectedRoute from "@/components/AgentProtectedRoute";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Agents from "@/pages/Agents";
import Conversations from "@/pages/Conversations";
import Transfers from "@/pages/Transfers";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import AgentLogin from "@/pages/AgentLogin";
import AgentDashboard from "@/pages/AgentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AgentAuthProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/agent-login" element={<AgentLogin />} />
                <Route path="/agent-dashboard" element={
                  <AgentProtectedRoute>
                    <AgentDashboard />
                  </AgentProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/agents" element={
                  <ProtectedRoute>
                    <Layout>
                      <Agents />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/conversations" element={
                  <ProtectedRoute>
                    <Layout>
                      <Conversations />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/transfers" element={
                  <ProtectedRoute>
                    <Layout>
                      <Transfers />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </AgentAuthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
