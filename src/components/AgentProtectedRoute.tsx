
import { useAgentAuth } from '@/contexts/AgentAuthContext';
import { Navigate } from 'react-router-dom';

interface AgentProtectedRouteProps {
  children: React.ReactNode;
}

const AgentProtectedRoute = ({ children }: AgentProtectedRouteProps) => {
  const { agent, isLoading } = useAgentAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!agent) {
    return <Navigate to="/agent-login" replace />;
  }

  return <>{children}</>;
};

export default AgentProtectedRoute;
