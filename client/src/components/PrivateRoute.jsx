import { Navigate } from "react-router-dom";

const PrivateRoute = ({ user, children }) => {
  if (!user) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  // User is logged in, render the protected component
  return children;
};

export default PrivateRoute;
