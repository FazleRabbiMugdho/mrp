import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";

const routes = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "settings", element: <Settings /> },
    ],
  },
];

export default routes;