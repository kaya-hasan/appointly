import MainLayout from "./layouts/MainLayout.jsx";
import CustomersPage from "./pages/CustomersPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import "./App.css";

function App() {
  return (
    <div>
      <MainLayout>
        <CustomersPage />
        <AppointmentsPage />
      </MainLayout>
    </div>
  );
}

export default App;
