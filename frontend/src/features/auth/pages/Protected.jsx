import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Protected = ({ children, sellerOnly = false }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const authChecked = useSelector((state) => state.auth.authChecked);

  if (!authChecked || loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (sellerOnly && user.role !== "seller") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;
