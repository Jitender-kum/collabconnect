import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

export function RequireAuth({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export function RequireRole({ role, children }) {
  const { token, role: myRole } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (myRole !== role) return <Navigate to="/dashboard" replace />;
  return children;
}
