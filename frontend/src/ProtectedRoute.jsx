import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./GlobalContext/Userprovider";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);


  if (loading) {
    return <div>Loading...</div>;
  }


  if (!user) {
    return <Navigate to="/login" replace />;
  }

 
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "user") {
      return <Navigate to="/userhome/home" replace />;
    }
    if (user.role === "admin") {
      return <Navigate to="/adminhome" replace />;
    }
    if (user.role === "trainer") {
      return <Navigate to="/trainerhome" replace />;
    }

    return <Navigate to="/" replace />;
  }


  return <Outlet />;
};

export default ProtectedRoute;