import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import NewTransaction from "../pages/NewTransaction";
import MyTransactions from "../pages/MyTransactions";
import Settings from "../pages/Settings";

const routes = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "new-transaction", element: <NewTransaction /> },
      { path: "transactions", element: <MyTransactions /> }, // corrected name
      { path: "settings", element: <Settings /> },
    ],
  },
];

export default routes;
