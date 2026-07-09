import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import MainLayout from "./layouts/MainLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import authService from "./services/authService";
import { AUTH_EXPIRED_EVENT, getStoredToken } from "./services/api";

function ProtectedApp({ language, setLanguage, onLogout }) {
  return (
    <MainLayout language={language} setLanguage={setLanguage} onLogout={onLogout}>
      <Routes>
        <Route path="/" element={<HomePage language={language} />} />
        <Route path="/customers" element={<CustomersPage language={language} />} />
        <Route path="/appointments" element={<AppointmentsPage language={language} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  const [language, setLanguage] = useState("tr");
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getStoredToken()));

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleAuthExpired = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route
          path="*"
          element={
            <LoginPage
              language={language}
              onAuthenticated={() => setIsAuthenticated(true)}
            />
          }
        />
      </Routes>
    );
  }

  return (
    <ProtectedApp
      language={language}
      setLanguage={setLanguage}
      onLogout={handleLogout}
    />
  );
}

export default App;
