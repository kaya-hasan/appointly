import HomePage from "./pages/HomePage.jsx"
import MainLayout from "./layouts/MainLayout.jsx"
import CustomersPage from "./pages/CustomersPage.jsx"
import './App.css'
import AppointmentsPage from "./pages/AppointmentsPage.jsx"

function App() {

  return (
    <div>
      <MainLayout>

        <CustomersPage />
        <AppointmentsPage />
      </MainLayout>
    </div>
  )
}

export default App
