import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useEffect, useRef } from "react";
import { useAuth } from "../features/auth/hook/useAuth";

const App = () => {
  const { handleGetMe } = useAuth();
  const hasHydratedAuth = useRef(false);

  useEffect(() => {
    if (hasHydratedAuth.current) {
      return;
    }
    hasHydratedAuth.current = true;
    handleGetMe();
  }, [handleGetMe]);

  return <RouterProvider router={router} />;
};

export default App;
