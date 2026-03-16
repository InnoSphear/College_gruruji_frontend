import { Navigate } from 'react-router-dom';

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function ProtectedRoute({ roles = [], children }) {
  const token = localStorage.getItem('token');
  const user = readUser();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
