import { useState } from "react";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
