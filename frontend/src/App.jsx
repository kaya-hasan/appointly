import MainLayout from "./layouts/MainLayout.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import "./App.css";

function App() {
  return (
    <div>
      <MainLayout>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Routes>
      </MainLayout>
    </div>
  );
}

export default App;
