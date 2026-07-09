import MainLayout from "./layouts/MainLayout.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import { useState } from "react";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("tr");

  return (
    <div>
      <MainLayout language={language} setLanguage={setLanguage}>
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/customers" element={<CustomersPage language={language} />} />
          <Route path="/appointments" element={<AppointmentsPage language={language} />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
