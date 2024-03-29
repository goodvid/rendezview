// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("token"); // Check for token or implement your authentication logic here

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
