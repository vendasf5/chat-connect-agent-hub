
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/pages/Login';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
