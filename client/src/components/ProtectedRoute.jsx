import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === '/') {
    if (user.role === 'vendor') return <Navigate to="/vendor" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'vendor') return <Navigate to="/vendor" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
