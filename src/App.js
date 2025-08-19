import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import NewTranslation from "./pages/NewTranslation";
import MyProjects from "./pages/MyProjects";
import MyTranslations from "./pages/MyTranslations";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import UpdateProfile from "./pages/UpdateProfile";

import Home from "./home";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/dashboard/*"
          element={
            <Layout>
              <Routes>
                <Route path="" element={<Dashboard />} />
                <Route path="new-translation" element={<NewTranslation />} />
                <Route path="my-projects" element={<MyProjects />} />
                <Route path="my-translations" element={<MyTranslations />} />
                <Route path="billing" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
                <Route path="update-profile" element={<UpdateProfile />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
