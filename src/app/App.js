import React from "react";
import { useRoutes, Navigate } from "react-router-dom";
import routes from "./routes";

export default function App() {
  const element = useRoutes([
    { path: "/", element: <Navigate to="/dashboard" replace /> },
    ...routes,
    { path: "*", element: <Navigate to="/dashboard" replace /> },
  ]);
  return element;
}
