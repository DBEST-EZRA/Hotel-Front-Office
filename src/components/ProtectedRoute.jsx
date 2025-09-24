import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role?.toLowerCase())) {
    return <Navigate to="/users" replace />;
  }

  return children;
};

export default ProtectedRoute;
