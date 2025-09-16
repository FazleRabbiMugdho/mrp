import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./state/UserProvider";

import Landing from "./Landing";   
import Home from "./home";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NewTransaction from "./pages/NewTransaction";
import MyTransactions from "./pages/MyTransactions";
import Settings from "./pages/Settings";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Example dashboards */}
          <Route path="/merchant-dashboard" element={<h1>Merchant Dashboard 🛒</h1>} />
          <Route path="/admin-dashboard" element={<h1>Administrator Dashboard 🛠️</h1>} />

          {/* Protected dashboard routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="new-transaction" element={<NewTransaction />} />
            <Route path="transactions" element={<MyTransactions />} /> {/* Fixed */}
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
