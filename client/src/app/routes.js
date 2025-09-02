import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import NewTransaction from "../pages/NewTransaction";
import Settings from "../pages/Settings";

const routes = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "new-transaction", element: <NewTransaction /> },
      { path: "settings", element: <Settings /> },
    ],
  },
];

export default routes;