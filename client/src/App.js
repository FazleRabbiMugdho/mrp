import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./state/UserProvider";
import { ThemeProvider } from "./state/ThemeProvider";

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
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected dashboard routes */}
            <Route path="/" element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="new-transaction" element={<NewTransaction />} />
              <Route path="transactions" element={<MyTransactions />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
