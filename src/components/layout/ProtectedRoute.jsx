import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, status, user } = useAuth();

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5F0EB]">
        <div className="w-8 h-8 border-2 border-[#7B5328] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Role-based redirect: agent trying to access /dashboard → send to agent dashboard
  if (!requiredRole && (user?.role === 'agent' || user?.role === 'admin')) {
    return <Navigate to="/agent/dashboard" replace />;
  }

  // Non-agent trying to access agent-only route → send to user dashboard
  if (requiredRole === 'agent' && user?.role !== 'agent' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
